import { and, eq, gte, sql } from 'drizzle-orm'
import type { getDb } from '@/db/client'
import { challengeSubmissions, nudges } from '@/db/schema'

type Db = ReturnType<typeof getDb>

const NUDGE_LIMIT = 10
const NUDGE_WINDOW_MS = 60 * 60 * 1000
const CHALLENGE_SUBMIT_LIMIT = 60
const CHALLENGE_WINDOW_MS = 60 * 60 * 1000

export async function countRecentNudges(db: Db, fromUserId: string): Promise<number> {
  const since = new Date(Date.now() - NUDGE_WINDOW_MS)
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(nudges)
    .where(and(eq(nudges.fromUserId, fromUserId), gte(nudges.createdAt, since)))
  return rows[0]?.n ?? 0
}

export async function assertNudgeRateLimit(db: Db, fromUserId: string): Promise<string | null> {
  const n = await countRecentNudges(db, fromUserId)
  if (n >= NUDGE_LIMIT) {
    return `Too many encouragements — try again later (max ${NUDGE_LIMIT}/hour).`
  }
  return null
}

export async function countRecentChallengeSubmissions(
  db: Db,
  userId: string,
): Promise<number> {
  const since = new Date(Date.now() - CHALLENGE_WINDOW_MS)
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(challengeSubmissions)
    .where(
      and(eq(challengeSubmissions.userId, userId), gte(challengeSubmissions.createdAt, since)),
    )
  return rows[0]?.n ?? 0
}

export async function assertChallengeSubmitRateLimit(
  db: Db,
  userId: string,
): Promise<string | null> {
  const n = await countRecentChallengeSubmissions(db, userId)
  if (n >= CHALLENGE_SUBMIT_LIMIT) {
    return `Too many challenge answers — try again later (max ${CHALLENGE_SUBMIT_LIMIT}/hour).`
  }
  return null
}

export const RATE_LIMITS = {
  nudgesPerHour: NUDGE_LIMIT,
  challengeSubmitsPerHour: CHALLENGE_SUBMIT_LIMIT,
} as const
