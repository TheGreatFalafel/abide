import { auth, currentUser } from '@clerk/nextjs/server'
import { and, desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getReadyDb, hasDatabase } from '@/db/client'
import { isSchemaDriftError, schemaDriftMessage } from '@/lib/dbErrors'
import {
  challengeSubmissions,
  circleMembers,
  memoryChallengeScores,
  memoryChallenges,
  profiles,
} from '@/db/schema'
import { assertChallengeSubmitRateLimit } from '@/lib/rateLimit'
import {
  fetchScripturePlainText,
  gradeSelectedText,
  type ServerTranslationId,
} from '@/lib/serverScripture'
import { newProgressEventId } from '@/lib/progressEvents'
import { commitProgressEvents, validateAndBuildChallengeXpEvent } from '@/lib/challengeProgress'
import { publicAvatarFromStateJson } from '@/lib/publicAvatar'

export type ChallengeVerse = {
  id: string
  reference: string
  bookId: string
  bookName: string
  chapter: number
  verseStart: number
  verseEnd: number
}

async function requireMembership(userId: string) {
  const db = await getReadyDb()
  const rows = await db
    .select()
    .from(circleMembers)
    .where(eq(circleMembers.userId, userId))
    .limit(1)
  return rows[0] ?? null
}

function schemaErrorResponse(err: unknown) {
  if (isSchemaDriftError(err)) {
    return NextResponse.json({ error: schemaDriftMessage() }, { status: 503 })
  }
  return null
}

function isTranslationId(v: unknown): v is ServerTranslationId {
  return v === 'web' || v === 'kjv' || v === 'esv'
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }

  try {
    const membership = await requireMembership(userId)
    if (!membership) {
      return NextResponse.json({ challenges: [] })
    }

    const db = await getReadyDb()
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
          stateJson: profiles.stateJson,
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
        scores: scores.map(({ stateJson, ...rest }) => ({
          ...rest,
          avatar: publicAvatarFromStateJson(stateJson),
        })),
      })
    }

    return NextResponse.json({ challenges: enriched })
  } catch (err) {
    const mapped = schemaErrorResponse(err)
    if (mapped) return mapped
    throw err
  }
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }

  let body: {
    action: 'create' | 'submit' | 'end'
    name?: string
    source?: string
    verses?: ChallengeVerse[]
    days?: number
    challengeId?: string
    /** @deprecated Ignored — server grades answers. */
    correct?: boolean
    submissionId?: string
    verseId?: string
    selectedText?: string
    translationId?: string
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    const membership = await requireMembership(userId)
    if (!membership) {
      return NextResponse.json({ error: 'Join a circle first.' }, { status: 400 })
    }

    const db = await getReadyDb()
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
      for (const v of verses) {
        if (!v?.id || !v.bookId || !v.bookName || !v.chapter || !v.verseStart) {
          return NextResponse.json({ error: 'Invalid verse payload' }, { status: 400 })
        }
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
      if (!body.challengeId || !body.verseId || typeof body.selectedText !== 'string') {
        return NextResponse.json(
          { error: 'challengeId, verseId, and selectedText are required' },
          { status: 400 },
        )
      }
      if (!isTranslationId(body.translationId)) {
        return NextResponse.json(
          { error: 'translationId must be web, kjv, or esv' },
          { status: 400 },
        )
      }

      const submissionId =
        typeof body.submissionId === 'string' && body.submissionId.trim()
          ? body.submissionId.trim()
          : newProgressEventId()

      const rateError = await assertChallengeSubmitRateLimit(db, userId)
      if (rateError) {
        return NextResponse.json({ error: rateError }, { status: 429 })
      }

      const priorSub = await db
        .select()
        .from(challengeSubmissions)
        .where(
          and(
            eq(challengeSubmissions.id, submissionId),
            eq(challengeSubmissions.userId, userId),
          ),
        )
        .limit(1)
      if (priorSub[0]) {
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
        return NextResponse.json({
          ok: true,
          duplicate: true,
          correct: priorSub[0].correct,
          score: mine[0] ?? null,
        })
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

      const verses = (ch.versesJson as ChallengeVerse[]) || []
      const verse = verses.find((v) => v.id === body.verseId)
      if (!verse) {
        return NextResponse.json({ error: 'Verse is not part of this challenge' }, { status: 400 })
      }

      const esvKey =
        body.translationId === 'esv'
          ? (req.headers.get('x-esv-api-key') || '').trim()
          : undefined
      if (body.translationId === 'esv' && !esvKey) {
        return NextResponse.json(
          { error: 'ESV answers require X-ESV-API-Key for this request only' },
          { status: 400 },
        )
      }

      let expected: string
      try {
        expected = await fetchScripturePlainText({
          bookName: verse.bookName,
          chapter: verse.chapter,
          verseStart: verse.verseStart,
          verseEnd: verse.verseEnd,
          translationId: body.translationId,
          esvApiKey: esvKey,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not verify answer'
        return NextResponse.json(
          { error: message.replace(/Token\s+\S+/gi, 'Token [redacted]') },
          { status: 502 },
        )
      }

      const correct = gradeSelectedText(body.selectedText, expected)
      const scoreDelta = correct ? 10 : 0

      await db.insert(challengeSubmissions).values({
        id: submissionId,
        challengeId: body.challengeId,
        userId,
        verseId: body.verseId,
        translationId: body.translationId,
        correct,
      })

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

      if (correct) {
        const xpEvent = validateAndBuildChallengeXpEvent(submissionId)
        if (xpEvent) {
          await commitProgressEvents(db, userId, [xpEvent], { displayName })
        }
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

      return NextResponse.json({
        ok: true,
        correct,
        score: mine[0] ?? null,
      })
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
  } catch (err) {
    const mapped = schemaErrorResponse(err)
    if (mapped) return mapped
    throw err
  }
}
