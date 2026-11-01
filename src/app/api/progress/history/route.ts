import { auth } from '@clerk/nextjs/server'
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getReadyDb, hasDatabase } from '@/db/client'
import { progressEvents } from '@/db/schema'
import { isSchemaDriftError, schemaDriftMessage } from '@/lib/dbErrors'
import { isProgressEventType } from '@/lib/progressEvents'
import { sanitizeActivityPayload } from '@/lib/activityHistory'

/**
 * Private learning activity history for the authenticated user.
 * Never includes other users' events. XP amounts are informational only.
 */
export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to view learning history.' }, { status: 401 })
  }
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }

  const url = new URL(req.url)
  const limit = Math.min(200, Math.max(1, Math.floor(Number(url.searchParams.get('limit')) || 100)))
  const before = url.searchParams.get('before')
  const since = url.searchParams.get('since')
  const typeFilter = url.searchParams.get('type')

  try {
    const db = await getReadyDb()
    const conditions = [eq(progressEvents.userId, userId)]

    if (typeFilter && isProgressEventType(typeFilter)) {
      conditions.push(eq(progressEvents.type, typeFilter))
    }
    if (since) {
      const sinceDate = Date.parse(since)
      if (Number.isFinite(sinceDate)) {
        conditions.push(gte(progressEvents.clientCreatedAt, new Date(sinceDate)))
      }
    }
    if (before) {
      const beforeDate = Date.parse(before)
      if (Number.isFinite(beforeDate)) {
        conditions.push(lte(progressEvents.clientCreatedAt, new Date(beforeDate)))
      }
    }

    const rows = await db
      .select({
        id: progressEvents.id,
        type: progressEvents.type,
        payload: progressEvents.payload,
        awardedXp: progressEvents.awardedXp,
        clientCreatedAt: progressEvents.clientCreatedAt,
        serverReceivedAt: progressEvents.serverReceivedAt,
      })
      .from(progressEvents)
      .where(and(...conditions))
      .orderBy(desc(progressEvents.clientCreatedAt))
      .limit(limit)

    const events = rows.map((r) => ({
      id: r.id,
      type: r.type,
      payload: sanitizeActivityPayload(
        (r.payload && typeof r.payload === 'object' ? r.payload : {}) as Record<string, unknown>,
      ),
      awardedXp: r.awardedXp,
      clientCreatedAt: r.clientCreatedAt.toISOString(),
      serverReceivedAt: r.serverReceivedAt.toISOString(),
      synced: true,
    }))

    return NextResponse.json({
      ok: true,
      events,
      count: events.length,
      // Help clients know this is private, never for Circle/public APIs
      scope: 'private',
    })
  } catch (err) {
    if (isSchemaDriftError(err)) {
      return NextResponse.json({ error: schemaDriftMessage() }, { status: 503 })
    }
    throw err
  }
}

/** Lightweight count for diagnostics — still private to the caller. */
export async function HEAD() {
  const { userId } = await auth()
  if (!userId) return new NextResponse(null, { status: 401 })
  if (!hasDatabase()) return new NextResponse(null, { status: 503 })
  try {
    const db = await getReadyDb()
    const rows = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(progressEvents)
      .where(eq(progressEvents.userId, userId))
    return new NextResponse(null, {
      status: 200,
      headers: { 'X-Activity-Count': String(rows[0]?.n ?? 0) },
    })
  } catch {
    return new NextResponse(null, { status: 503 })
  }
}
