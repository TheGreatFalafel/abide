import { auth, currentUser } from '@clerk/nextjs/server'
import { and, desc, eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getDb, hasDatabase } from '@/db/client'
import {
  circleMembers,
  memoryChallengeScores,
  memoryChallenges,
  profiles,
} from '@/db/schema'

export type ChallengeVerse = {
  id: string
  reference: string
  bookId: string
  bookName: string
  chapter: number
  verseStart: number
  verseEnd: number
}

async function ensureTables() {
  const db = getDb()
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS memory_challenges (
      id text PRIMARY KEY,
      circle_id text NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
      created_by text NOT NULL,
      name text NOT NULL,
      source text NOT NULL DEFAULT 'custom',
      verses_json jsonb NOT NULL DEFAULT '[]'::jsonb,
      starts_at timestamptz NOT NULL DEFAULT now(),
      ends_at timestamptz NOT NULL,
      status text NOT NULL DEFAULT 'active',
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS memory_challenge_scores (
      challenge_id text NOT NULL REFERENCES memory_challenges(id) ON DELETE CASCADE,
      user_id text NOT NULL,
      score integer NOT NULL DEFAULT 0,
      correct integer NOT NULL DEFAULT 0,
      attempts integer NOT NULL DEFAULT 0,
      updated_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (challenge_id, user_id)
    )
  `)
}

async function requireMembership(userId: string) {
  const db = getDb()
  const rows = await db
    .select()
    .from(circleMembers)
    .where(eq(circleMembers.userId, userId))
    .limit(1)
  return rows[0] ?? null
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }

  try {
    await ensureTables()
  } catch {
    return NextResponse.json({ error: 'Could not prepare challenge tables.' }, { status: 500 })
  }

  const membership = await requireMembership(userId)
  if (!membership) {
    return NextResponse.json({ challenges: [] })
  }

  const db = getDb()
  const challenges = await db
    .select()
    .from(memoryChallenges)
    .where(eq(memoryChallenges.circleId, membership.circleId))
    .orderBy(desc(memoryChallenges.createdAt))
    .limit(20)

  const now = Date.now()
  const enriched = []
  for (const ch of challenges) {
    let status = ch.status
    if (status === 'active' && new Date(ch.endsAt).getTime() < now) {
      status = 'ended'
      await db
        .update(memoryChallenges)
        .set({ status: 'ended' })
        .where(eq(memoryChallenges.id, ch.id))
    }

    const scores = await db
      .select({
        userId: memoryChallengeScores.userId,
        score: memoryChallengeScores.score,
        correct: memoryChallengeScores.correct,
        attempts: memoryChallengeScores.attempts,
        updatedAt: memoryChallengeScores.updatedAt,
        displayName: profiles.displayName,
      })
      .from(memoryChallengeScores)
      .leftJoin(profiles, eq(profiles.userId, memoryChallengeScores.userId))
      .where(eq(memoryChallengeScores.challengeId, ch.id))
      .orderBy(desc(memoryChallengeScores.score), desc(memoryChallengeScores.correct))

    enriched.push({
      id: ch.id,
      circleId: ch.circleId,
      createdBy: ch.createdBy,
      name: ch.name,
      source: ch.source,
      verses: (ch.versesJson as ChallengeVerse[]) || [],
      startsAt: ch.startsAt,
      endsAt: ch.endsAt,
      status,
      createdAt: ch.createdAt,
      scores,
    })
  }

  return NextResponse.json({ challenges: enriched })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }

  try {
    await ensureTables()
  } catch {
    return NextResponse.json({ error: 'Could not prepare challenge tables.' }, { status: 500 })
  }

  const body = (await req.json()) as {
    action: 'create' | 'submit' | 'end'
    name?: string
    source?: string
    verses?: ChallengeVerse[]
    days?: number
    challengeId?: string
    correct?: boolean
  }

  const membership = await requireMembership(userId)
  if (!membership) {
    return NextResponse.json({ error: 'Join a circle first.' }, { status: 400 })
  }

  const db = getDb()
  const user = await currentUser()
  const displayName =
    user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || 'Friend'

  await db
    .insert(profiles)
    .values({ userId, displayName, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: { displayName, updatedAt: new Date() },
    })

  if (body.action === 'create') {
    const verses = Array.isArray(body.verses) ? body.verses : []
    if (verses.length < 2) {
      return NextResponse.json(
        { error: 'Pick at least 2 verses for a competition.' },
        { status: 400 },
      )
    }
    if (verses.length > 40) {
      return NextResponse.json({ error: 'Max 40 verses per challenge.' }, { status: 400 })
    }

    const days = Math.min(30, Math.max(1, body.days ?? 7))
    const endsAt = new Date()
    endsAt.setDate(endsAt.getDate() + days)

    const id = crypto.randomUUID()
    await db.insert(memoryChallenges).values({
      id,
      circleId: membership.circleId,
      createdBy: userId,
      name: body.name?.trim() || 'Memory quiz challenge',
      source: body.source?.trim() || 'custom',
      versesJson: verses,
      endsAt,
      status: 'active',
    })

    // Seed creator on the board at 0
    await db.insert(memoryChallengeScores).values({
      challengeId: id,
      userId,
      score: 0,
      correct: 0,
      attempts: 0,
    })

    return NextResponse.json({ ok: true, challengeId: id })
  }

  if (body.action === 'submit') {
    if (!body.challengeId) {
      return NextResponse.json({ error: 'challengeId required' }, { status: 400 })
    }

    const chRows = await db
      .select()
      .from(memoryChallenges)
      .where(
        and(
          eq(memoryChallenges.id, body.challengeId),
          eq(memoryChallenges.circleId, membership.circleId),
        ),
      )
      .limit(1)

    const ch = chRows[0]
    if (!ch) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })

    if (ch.status !== 'active' || new Date(ch.endsAt).getTime() < Date.now()) {
      if (ch.status === 'active') {
        await db
          .update(memoryChallenges)
          .set({ status: 'ended' })
          .where(eq(memoryChallenges.id, ch.id))
      }
      return NextResponse.json({ error: 'This challenge has ended.' }, { status: 400 })
    }

    const correct = Boolean(body.correct)
    const scoreDelta = correct ? 10 : 0

    const existing = await db
      .select()
      .from(memoryChallengeScores)
      .where(
        and(
          eq(memoryChallengeScores.challengeId, body.challengeId),
          eq(memoryChallengeScores.userId, userId),
        ),
      )
      .limit(1)

    if (existing[0]) {
      await db
        .update(memoryChallengeScores)
        .set({
          score: existing[0].score + scoreDelta,
          correct: existing[0].correct + (correct ? 1 : 0),
          attempts: existing[0].attempts + 1,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(memoryChallengeScores.challengeId, body.challengeId),
            eq(memoryChallengeScores.userId, userId),
          ),
        )
    } else {
      await db.insert(memoryChallengeScores).values({
        challengeId: body.challengeId,
        userId,
        score: scoreDelta,
        correct: correct ? 1 : 0,
        attempts: 1,
      })
    }

    const mine = await db
      .select()
      .from(memoryChallengeScores)
      .where(
        and(
          eq(memoryChallengeScores.challengeId, body.challengeId),
          eq(memoryChallengeScores.userId, userId),
        ),
      )
      .limit(1)

    return NextResponse.json({ ok: true, score: mine[0] ?? null })
  }

  if (body.action === 'end') {
    if (!body.challengeId) {
      return NextResponse.json({ error: 'challengeId required' }, { status: 400 })
    }
    const chRows = await db
      .select()
      .from(memoryChallenges)
      .where(
        and(
          eq(memoryChallenges.id, body.challengeId),
          eq(memoryChallenges.circleId, membership.circleId),
        ),
      )
      .limit(1)
    const ch = chRows[0]
    if (!ch) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    if (ch.createdBy !== userId) {
      return NextResponse.json({ error: 'Only the creator can end it early.' }, { status: 403 })
    }
    await db
      .update(memoryChallenges)
      .set({ status: 'ended' })
      .where(eq(memoryChallenges.id, ch.id))
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
