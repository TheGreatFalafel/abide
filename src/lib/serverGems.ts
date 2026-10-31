import { and, eq, gte, sql } from 'drizzle-orm'
import type { getDb } from '@/db/client'
import { gemEvents, profiles } from '@/db/schema'
import { getCosmetic } from '@/data/cosmetics/catalog'
import { grantCosmetic, migrateCosmeticsState } from './cosmetics'
import { isUniqueViolation } from './dbErrors'
import {
  GEM_DAILY_EARN_CAP,
  type ValidatedGemEvent,
  validateGemEventBatch,
} from './gemEvents'
import { prepareStateForCloud } from './privacy'
import type { UserState } from './types'
import { todayKey } from './types'

type Db = ReturnType<typeof getDb>

export async function sumGemBalance(db: Db, userId: string): Promise<number> {
  const rows = await db
    .select({ total: sql<number>`coalesce(sum(${gemEvents.deltaGems}), 0)::int` })
    .from(gemEvents)
    .where(eq(gemEvents.userId, userId))
  return rows[0]?.total ?? 0
}

export async function sumGemsEarnedToday(db: Db, userId: string, day = todayKey()): Promise<number> {
  const start = new Date(`${day}T00:00:00.000Z`)
  const rows = await db
    .select({
      total: sql<number>`coalesce(sum(case when ${gemEvents.deltaGems} > 0 then ${gemEvents.deltaGems} else 0 end), 0)::int`,
    })
    .from(gemEvents)
    .where(and(eq(gemEvents.userId, userId), gte(gemEvents.serverReceivedAt, start)))
  return rows[0]?.total ?? 0
}

export async function hasGemActivityKey(
  db: Db,
  userId: string,
  activityKey: string,
): Promise<boolean> {
  const rows = await db
    .select({ id: gemEvents.id })
    .from(gemEvents)
    .where(and(eq(gemEvents.userId, userId), eq(gemEvents.activityKey, activityKey)))
    .limit(1)
  return Boolean(rows[0])
}

export async function ensureLegacyGemImport(db: Db, userId: string, seedGems: number): Promise<void> {
  const key = 'legacy_gem_import'
  if (await hasGemActivityKey(db, userId, key)) return
  const batch = validateGemEventBatch([
    {
      id: `legacy-gem:${userId}`,
      type: 'legacy_gem_import',
      clientCreatedAt: new Date().toISOString(),
      payload: { seedGems: Math.max(0, Math.floor(seedGems)), activityKey: key },
    },
  ])
  if (!batch.accepted.length) return
  await commitGemEvents(db, userId, batch.accepted)
}

export async function commitGemEvents(
  db: Db,
  userId: string,
  events: ValidatedGemEvent[],
  opts?: { displayName?: string },
): Promise<{
  inserted: ValidatedGemEvent[]
  duplicates: string[]
  rejected: { id?: string; error: string }[]
  serverGems: number
  ownedItemIds: string[]
}> {
  const inserted: ValidatedGemEvent[] = []
  const duplicates: string[] = []
  const rejected: { id?: string; error: string }[] = []
  let earnedToday = await sumGemsEarnedToday(db, userId)
  let balance = await sumGemBalance(db, userId)
  const ownedGranted: string[] = []

  for (const event of events) {
    const exists = await db
      .select({ id: gemEvents.id })
      .from(gemEvents)
      .where(eq(gemEvents.id, event.id))
      .limit(1)
    if (exists[0]) {
      duplicates.push(event.id)
      continue
    }
    if (await hasGemActivityKey(db, userId, event.activityKey)) {
      duplicates.push(event.id)
      continue
    }

    let delta = event.deltaGems

    if (delta > 0) {
      const room = Math.max(0, GEM_DAILY_EARN_CAP - earnedToday)
      if (room <= 0) {
        rejected.push({ id: event.id, error: 'Daily gem earn cap reached' })
        continue
      }
      delta = Math.min(delta, room)
    }

    if (event.type === 'shop_purchase') {
      const itemId = typeof event.payload?.itemId === 'string' ? event.payload.itemId : ''
      const item = getCosmetic(itemId)
      if (!item || item.price <= 0) {
        rejected.push({ id: event.id, error: 'Unknown shop item' })
        continue
      }
      if (balance < item.price) {
        rejected.push({ id: event.id, error: 'Insufficient gems' })
        continue
      }
      delta = -item.price
      ownedGranted.push(itemId)
    }

    if (balance + delta < 0) {
      rejected.push({ id: event.id, error: 'Insufficient gems' })
      continue
    }

    try {
      await db.insert(gemEvents).values({
        id: event.id,
        userId,
        type: event.type,
        payload: event.payload ?? {},
        deltaGems: delta,
        activityKey: event.activityKey,
        clientCreatedAt: new Date(event.clientCreatedAt),
      })
    } catch (err) {
      if (isUniqueViolation(err)) {
        duplicates.push(event.id)
        continue
      }
      throw err
    }

    balance += delta
    if (delta > 0) earnedToday += delta
    inserted.push({ ...event, deltaGems: delta })
  }

  const serverGems = await sumGemBalance(db, userId)

  const existing = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
  let stateJson = existing[0]?.stateJson as UserState | null | undefined
  if (stateJson && ownedGranted.length) {
    let cosmetics = migrateCosmeticsState(stateJson.cosmetics)
    for (const id of ownedGranted) cosmetics = grantCosmetic(cosmetics, id)
    stateJson = prepareStateForCloud({
      ...stateJson,
      gems: serverGems,
      cosmetics,
    })
  } else if (stateJson) {
    stateJson = prepareStateForCloud({ ...stateJson, gems: serverGems })
  }

  if (existing[0]) {
    await db
      .update(profiles)
      .set({
        gems: serverGems,
        stateJson: stateJson ?? existing[0].stateJson,
        updatedAt: new Date(),
        ...(opts?.displayName ? { displayName: opts.displayName } : {}),
      })
      .where(eq(profiles.userId, userId))
  } else {
    await db.insert(profiles).values({
      userId,
      displayName: opts?.displayName ?? 'Friend',
      gems: serverGems,
      stateJson: stateJson ?? null,
    })
  }

  return { inserted, duplicates, rejected, serverGems, ownedItemIds: ownedGranted }
}

export function applyServerGemAuthority(
  state: UserState,
  authority: { gems: number; cosmeticsOwned?: string[] },
): UserState {
  let cosmetics = migrateCosmeticsState(state.cosmetics)
  for (const id of authority.cosmeticsOwned ?? []) {
    cosmetics = grantCosmetic(cosmetics, id)
  }
  return {
    ...state,
    gems: Math.max(0, authority.gems),
    cosmetics,
  }
}
