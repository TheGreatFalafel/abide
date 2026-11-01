import { and, eq, sql } from 'drizzle-orm'
import type { getDb } from '@/db/client'
import { profiles, progressEvents } from '@/db/schema'
import { isUniqueViolation } from './dbErrors'
import {
  type ValidatedProgressEvent,
  validateProgressEventBatch,
} from './progressEvents'
import { prepareStateForCloud } from './privacy'
import {
  applyActivityDays,
  clampStreakFreezes,
  migrateStreakFreezes,
  type StreakFields,
} from './streak'
import type { UserState } from './types'
import { todayKey } from './types'

type Db = ReturnType<typeof getDb>

export async function sumAwardedXp(db: Db, userId: string): Promise<number> {
  const rows = await db
    .select({ total: sql<number>`coalesce(sum(${progressEvents.awardedXp}), 0)::int` })
    .from(progressEvents)
    .where(eq(progressEvents.userId, userId))
  return rows[0]?.total ?? 0
}

export async function hasLegacyImport(db: Db, userId: string): Promise<boolean> {
  const rows = await db
    .select({ id: progressEvents.id })
    .from(progressEvents)
    .where(and(eq(progressEvents.userId, userId), eq(progressEvents.type, 'legacy_import')))
    .limit(1)
  return Boolean(rows[0])
}

function streakFieldsFromProfile(
  prior:
    | {
        streak: number
        longestStreak: number
        lastReadDate: string | null
        stateJson: unknown
      }
    | undefined,
): StreakFields {
  const state = prior?.stateJson as UserState | null | undefined
  return {
    streak: prior?.streak ?? 0,
    longestStreak: prior?.longestStreak ?? 0,
    lastReadDate: prior?.lastReadDate ?? null,
    streakFreezes: migrateStreakFreezes(state?.streakFreezes, state ? 1 : 0),
  }
}

/**
 * Insert validated events (skipping duplicate ids). Returns newly inserted awards.
 * Updates profile XP to the ledger sum and applies streak/freeze math for new activity days.
 */
export async function commitProgressEvents(
  db: Db,
  userId: string,
  events: ValidatedProgressEvent[],
  opts?: { displayName?: string; activityDates?: string[] },
): Promise<{
  inserted: ValidatedProgressEvent[]
  duplicates: string[]
  serverXp: number
  streak: number
  longestStreak: number
  lastReadDate: string | null
  streakFreezes: number
}> {
  const inserted: ValidatedProgressEvent[] = []
  const duplicates: string[] = []

  for (const event of events) {
    try {
      await db.insert(progressEvents).values({
        id: event.id,
        userId,
        type: event.type,
        payload: event.payload ?? {},
        awardedXp: event.awardedXp,
        clientCreatedAt: new Date(event.clientCreatedAt),
      })
      inserted.push(event)
    } catch (err) {
      if (isUniqueViolation(err)) {
        duplicates.push(event.id)
        continue
      }
      throw err
    }
  }

  const serverXp = await sumAwardedXp(db, userId)

  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1)
  const prior = existing[0]
  let streakState = streakFieldsFromProfile(prior)

  const activityDates = (opts?.activityDates ?? [])
    .concat(
      inserted
        .filter((e) => e.type !== 'legacy_import')
        .map((e) => e.clientCreatedAt.slice(0, 10)),
    )
    .filter(Boolean)

  // Only newly inserted events move the streak — duplicates/retries are no-ops here.
  if (activityDates.length) {
    streakState = applyActivityDays(streakState, activityDates)
  }

  const { streak, longestStreak, lastReadDate, streakFreezes } = streakState
  const displayName = opts?.displayName || prior?.displayName || 'Friend'
  const stateJson = prior?.stateJson
    ? prepareStateForCloud({
        ...(prior.stateJson as UserState),
        xp: serverXp,
        streak,
        longestStreak,
        lastReadDate,
        streakFreezes: clampStreakFreezes(streakFreezes),
      })
    : null

  await db
    .insert(profiles)
    .values({
      userId,
      displayName,
      xp: serverXp,
      streak,
      longestStreak,
      lastReadDate,
      stateJson,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: {
        displayName,
        xp: serverXp,
        streak,
        longestStreak,
        lastReadDate,
        ...(stateJson ? { stateJson } : {}),
        updatedAt: new Date(),
      },
    })

  return {
    inserted,
    duplicates,
    serverXp,
    streak,
    longestStreak,
    lastReadDate,
    streakFreezes: clampStreakFreezes(streakFreezes),
  }
}

export function applyServerAuthority(
  state: UserState,
  authority: {
    xp: number
    streak: number
    longestStreak: number
    lastReadDate: string | null
    gems?: number
    streakFreezes?: number
  },
): UserState {
  return prepareStateForCloud({
    ...state,
    xp: authority.xp,
    streak: authority.streak,
    longestStreak: Math.max(state.longestStreak, authority.longestStreak),
    lastReadDate: authority.lastReadDate ?? state.lastReadDate,
    gems: authority.gems != null ? Math.max(0, authority.gems) : state.gems,
    streakFreezes:
      authority.streakFreezes != null
        ? clampStreakFreezes(authority.streakFreezes)
        : migrateStreakFreezes(state.streakFreezes),
  })
}

export async function ensureLegacyImport(
  db: Db,
  userId: string,
  seedXp: number,
): Promise<void> {
  if (await hasLegacyImport(db, userId)) return
  // Deterministic id — one seed per user even under concurrent sync
  const id = `legacy:${userId}`
  const batch = validateProgressEventBatch([
    {
      id,
      type: 'legacy_import',
      clientCreatedAt: new Date().toISOString(),
      payload: { seedXp: Math.max(0, Math.floor(seedXp)) },
    },
  ])
  if (!batch.accepted.length) return
  await commitProgressEvents(db, userId, batch.accepted)
}

export { todayKey }
