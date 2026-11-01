import { auth, currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getReadyDb, hasDatabase } from '@/db/client'
import { isSchemaDriftError, schemaDriftMessage } from '@/lib/dbErrors'
import { profiles } from '@/db/schema'
import { mergeUserStates } from '@/lib/mergeState'
import { prepareStateForCloud } from '@/lib/privacy'
import {
  applyServerAuthority,
  ensureLegacyImport,
  sumAwardedXp,
} from '@/lib/serverProgress'
import { ensureLegacyGemImport, sumGemBalance } from '@/lib/serverGems'
import { mergeStreakFields, migrateStreakFreezes } from '@/lib/streak'
import type { UserState } from '@/lib/types'

function asUserState(value: unknown): UserState | null {
  if (!value || typeof value !== 'object') return null
  return prepareStateForCloud(value as UserState)
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to sync progress.' }, { status: 401 })
  }
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }

  try {
    const db = await getReadyDb()
    const rows = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
    if (!rows[0]) {
      return NextResponse.json({ profile: null, state: null })
    }

    const serverXp = await sumAwardedXp(db, userId)
    const serverGems = await sumGemBalance(db, userId)
    const xp = Math.max(serverXp, rows[0].xp)
    const gems = Math.max(serverGems, rows[0].gems ?? 0)
    const priorState = asUserState(rows[0].stateJson)
    const streakFreezes = migrateStreakFreezes(priorState?.streakFreezes)
    const state = priorState
      ? applyServerAuthority(priorState, {
          xp,
          streak: rows[0].streak,
          longestStreak: rows[0].longestStreak,
          lastReadDate: rows[0].lastReadDate,
          gems,
          streakFreezes,
        })
      : null

    return NextResponse.json({
      profile: {
        displayName: rows[0].displayName,
        streak: rows[0].streak,
        xp,
        gems,
        lastReadDate: rows[0].lastReadDate,
        streakFreezes,
        updatedAt: rows[0].updatedAt,
      },
      state,
    })
  } catch (err) {
    if (isSchemaDriftError(err)) {
      return NextResponse.json({ error: schemaDriftMessage() }, { status: 503 })
    }
    throw err
  }
}

/**
 * Syncs content state (readings, memory bank, etc.).
 * XP / streak columns are NOT taken from the client — they come from progress_events.
 */
export async function PUT(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to sync progress.' }, { status: 401 })
  }
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }

  let body: { state: UserState }
  try {
    body = (await req.json()) as { state: UserState }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body?.state) {
    return NextResponse.json({ error: 'Missing state' }, { status: 400 })
  }

  const incoming = prepareStateForCloud(body.state)
  const user = await currentUser()
  const displayName =
    incoming.name ||
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    'Friend'

  try {
    const db = await getReadyDb()
    const existing = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
    const prior = asUserState(existing[0]?.stateJson)

    // Seed ledger once from the richer of client/profile XP so we never wipe history
    await ensureLegacyImport(
      db,
      userId,
      Math.max(incoming.xp ?? 0, existing[0]?.xp ?? 0),
    )
    await ensureLegacyGemImport(
      db,
      userId,
      Math.max(incoming.gems ?? 0, existing[0]?.gems ?? 0),
    )

    const serverXp = await sumAwardedXp(db, userId)
    const serverGems = await sumGemBalance(db, userId)

    // Content merge first, then reconcile streak/freeze tuples against denormalized
    // profile columns. mergeStreakFields prefers newer lastReadDate and never
    // Math.max-resurrects a consumed freeze (important for passive normalizeDay bridges).
    const contentMerged = prepareStateForCloud(
      prior ? mergeUserStates(incoming, prior) : incoming,
    )

    const streaked = mergeStreakFields(
      {
        streak: contentMerged.streak,
        longestStreak: contentMerged.longestStreak,
        lastReadDate: contentMerged.lastReadDate,
        streakFreezes: migrateStreakFreezes(contentMerged.streakFreezes),
      },
      {
        streak: existing[0]?.streak ?? 0,
        longestStreak: existing[0]?.longestStreak ?? 0,
        lastReadDate: existing[0]?.lastReadDate ?? null,
        streakFreezes: migrateStreakFreezes(prior?.streakFreezes, 0),
      },
    )
    const { streak, longestStreak, lastReadDate, streakFreezes } = streaked

    const merged = applyServerAuthority(contentMerged, {
      xp: serverXp,
      streak,
      longestStreak,
      lastReadDate,
      gems: serverGems,
      streakFreezes,
    })

    await db
      .insert(profiles)
      .values({
        userId,
        displayName,
        streak,
        longestStreak,
        xp: serverXp,
        gems: serverGems,
        lastReadDate,
        stateJson: merged,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          displayName,
          // Keep server streak/gem authority; freezes stay in reconciled state_json
          streak,
          longestStreak,
          xp: serverXp,
          gems: serverGems,
          lastReadDate,
          stateJson: merged,
          updatedAt: new Date(),
        },
      })

    return NextResponse.json({ ok: true, state: merged })
  } catch (err) {
    if (isSchemaDriftError(err)) {
      return NextResponse.json({ error: schemaDriftMessage() }, { status: 503 })
    }
    throw err
  }
}
