import { auth, currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getDb, hasDatabase } from '@/db/client'
import { profiles } from '@/db/schema'
import { mergeUserStates } from '@/lib/mergeState'
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
  const rows = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
  if (!rows[0]) {
    return NextResponse.json({ profile: null, state: null })
  }
  return NextResponse.json({
    profile: {
      displayName: rows[0].displayName,
      streak: rows[0].streak,
      xp: rows[0].xp,
      lastReadDate: rows[0].lastReadDate,
      updatedAt: rows[0].updatedAt,
    },
    state: rows[0].stateJson as UserState | null,
  })
}

export async function PUT(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to sync progress.' }, { status: 401 })
  }
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }

  const body = (await req.json()) as { state: UserState }
  if (!body?.state) {
    return NextResponse.json({ error: 'Missing state' }, { status: 400 })
  }

  const incoming = body.state
  const user = await currentUser()
  const displayName =
    incoming.name ||
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    'Friend'

  const db = getDb()
  const existing = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
  const prior = existing[0]?.stateJson as UserState | null | undefined
  const merged = prior ? mergeUserStates(incoming, prior) : incoming

  await db
    .insert(profiles)
    .values({
      userId,
      displayName,
      streak: merged.streak ?? 0,
      longestStreak: merged.longestStreak ?? 0,
      xp: merged.xp ?? 0,
      lastReadDate: merged.lastReadDate,
      stateJson: merged,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: {
        displayName,
        streak: merged.streak ?? 0,
        longestStreak: merged.longestStreak ?? 0,
        xp: merged.xp ?? 0,
        lastReadDate: merged.lastReadDate,
        stateJson: merged,
        updatedAt: new Date(),
      },
    })

  return NextResponse.json({ ok: true, state: merged })
}
