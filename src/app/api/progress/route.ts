import { auth, currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getDb, hasDatabase } from '@/db/client'
import { profiles } from '@/db/schema'
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

  const user = await currentUser()
  const displayName =
    body.state.name ||
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    'Friend'

  const db = getDb()
  await db
    .insert(profiles)
    .values({
      userId,
      displayName,
      streak: body.state.streak ?? 0,
      longestStreak: body.state.longestStreak ?? 0,
      xp: body.state.xp ?? 0,
      lastReadDate: body.state.lastReadDate,
      stateJson: body.state,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: {
        displayName,
        streak: body.state.streak ?? 0,
        longestStreak: body.state.longestStreak ?? 0,
        xp: body.state.xp ?? 0,
        lastReadDate: body.state.lastReadDate,
        stateJson: body.state,
        updatedAt: new Date(),
      },
    })

  return NextResponse.json({ ok: true })
}
