import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDb, hasDatabase } from '@/db/client'
import { validateProgressEventBatch } from '@/lib/progressEvents'
import {
  applyServerAuthority,
  commitProgressEvents,
  ensureLegacyImport,
  sumAwardedXp,
} from '@/lib/serverProgress'
import { prepareStateForCloud } from '@/lib/privacy'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { UserState } from '@/lib/types'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to sync progress.' }, { status: 401 })
  }
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }

  const db = getDb()
  const xp = await sumAwardedXp(db, userId)
  const rows = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
  return NextResponse.json({
    serverXp: xp,
    streak: rows[0]?.streak ?? 0,
    longestStreak: rows[0]?.longestStreak ?? 0,
    lastReadDate: rows[0]?.lastReadDate ?? null,
  })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to sync progress.' }, { status: 401 })
  }
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }

  let body: { events?: unknown[]; seedXp?: number }
  try {
    body = (await req.json()) as { events?: unknown[]; seedXp?: number }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const db = getDb()
  const user = await currentUser()
  const displayName =
    user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || 'Friend'

  const existing = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
  const seed = Math.max(
    0,
    Math.floor(Number(body.seedXp) || 0),
    existing[0]?.xp ?? 0,
  )
  await ensureLegacyImport(db, userId, seed)

  const { accepted, rejected } = validateProgressEventBatch(body.events ?? [])
  // Never accept client legacy_import — server seeds once
  const filtered = accepted.filter((e) => e.type !== 'legacy_import')
  const result = await commitProgressEvents(db, userId, filtered, { displayName })

  const profile = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
  let state: UserState | null = null
  if (profile[0]?.stateJson) {
    state = applyServerAuthority(prepareStateForCloud(profile[0].stateJson as UserState), {
      xp: result.serverXp,
      streak: result.streak,
      longestStreak: result.longestStreak,
      lastReadDate: result.lastReadDate,
    })
  }

  return NextResponse.json({
    ok: true,
    inserted: result.inserted.map((e) => ({ id: e.id, awardedXp: e.awardedXp, type: e.type })),
    duplicates: result.duplicates,
    rejected,
    serverXp: result.serverXp,
    streak: result.streak,
    longestStreak: result.longestStreak,
    lastReadDate: result.lastReadDate,
    state,
  })
}
