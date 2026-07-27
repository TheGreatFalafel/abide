import { auth, currentUser } from '@clerk/nextjs/server'
import { and, desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getDb, hasDatabase } from '@/db/client'
import { circleMembers, circles, nudges, profiles } from '@/db/schema'

function code() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)]
  return out
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }

  const db = getDb()
  const membership = await db
    .select()
    .from(circleMembers)
    .where(eq(circleMembers.userId, userId))
    .limit(1)

  if (!membership[0]) {
    return NextResponse.json({ circle: null, members: [], nudges: [] })
  }

  const circleId = membership[0].circleId
  const circleRows = await db.select().from(circles).where(eq(circles.id, circleId)).limit(1)
  const memberRows = await db
    .select({
      userId: circleMembers.userId,
      joinedAt: circleMembers.joinedAt,
      displayName: profiles.displayName,
      streak: profiles.streak,
      xp: profiles.xp,
      lastReadDate: profiles.lastReadDate,
      stateJson: profiles.stateJson,
    })
    .from(circleMembers)
    .leftJoin(profiles, eq(profiles.userId, circleMembers.userId))
    .where(eq(circleMembers.circleId, circleId))

  const currentWeek = (() => {
    const d = new Date()
    const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    const day = tmp.getUTCDay() || 7
    tmp.setUTCDate(tmp.getUTCDate() + 4 - day)
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
    const week = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
    return `${tmp.getUTCFullYear()}-W${week}`
  })()

  const members = memberRows.map((m) => {
    const state = m.stateJson as {
      weekXp?: number
      weekKey?: string
      lessonsThisWeek?: number
    } | null
    const weekXp =
      state?.weekKey === currentWeek ? Math.max(0, state.weekXp ?? 0) : 0
    return {
      userId: m.userId,
      joinedAt: m.joinedAt,
      displayName: m.displayName,
      streak: m.streak,
      xp: m.xp,
      lastReadDate: m.lastReadDate,
      weekXp,
      lessonsThisWeek: state?.weekKey === currentWeek ? state.lessonsThisWeek ?? 0 : 0,
    }
  })

  const nudgeRows = await db
    .select()
    .from(nudges)
    .where(and(eq(nudges.circleId, circleId), eq(nudges.toUserId, userId)))
    .orderBy(desc(nudges.createdAt))
    .limit(20)

  return NextResponse.json({
    circle: circleRows[0] ?? null,
    members,
    nudges: nudgeRows,
    weekKey: currentWeek,
  })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }

  const body = (await req.json()) as {
    action: 'create' | 'join' | 'nudge' | 'leave'
    name?: string
    inviteCode?: string
    toUserId?: string
    message?: string
  }

  const db = getDb()
  const user = await currentUser()
  const displayName =
    user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || 'Friend'

  // Ensure profile row exists for leaderboard fields
  await db
    .insert(profiles)
    .values({ userId, displayName, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: { displayName, updatedAt: new Date() },
    })

  if (body.action === 'create') {
    const existing = await db
      .select()
      .from(circleMembers)
      .where(eq(circleMembers.userId, userId))
      .limit(1)
    if (existing[0]) {
      return NextResponse.json({ error: 'Already in a circle. Leave first.' }, { status: 400 })
    }

    const id = crypto.randomUUID()
    const inviteCode = code()
    await db.insert(circles).values({
      id,
      name: body.name?.trim() || 'Abide Circle',
      inviteCode,
      createdBy: userId,
    })
    await db.insert(circleMembers).values({ circleId: id, userId })
    return NextResponse.json({ ok: true, inviteCode, circleId: id })
  }

  if (body.action === 'join') {
    const invite = (body.inviteCode || '').trim().toUpperCase()
    if (!invite) return NextResponse.json({ error: 'Invite code required' }, { status: 400 })

    const existing = await db
      .select()
      .from(circleMembers)
      .where(eq(circleMembers.userId, userId))
      .limit(1)
    if (existing[0]) {
      return NextResponse.json({ error: 'Already in a circle. Leave first.' }, { status: 400 })
    }

    const found = await db.select().from(circles).where(eq(circles.inviteCode, invite)).limit(1)
    if (!found[0]) return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 })

    const count = await db
      .select()
      .from(circleMembers)
      .where(eq(circleMembers.circleId, found[0].id))
    if (count.length >= 8) {
      return NextResponse.json({ error: 'Circle is full (max 8).' }, { status: 400 })
    }

    await db.insert(circleMembers).values({ circleId: found[0].id, userId })
    return NextResponse.json({ ok: true, circleId: found[0].id })
  }

  if (body.action === 'nudge') {
    const membership = await db
      .select()
      .from(circleMembers)
      .where(eq(circleMembers.userId, userId))
      .limit(1)
    if (!membership[0] || !body.toUserId) {
      return NextResponse.json({ error: 'Cannot nudge' }, { status: 400 })
    }
    await db.insert(nudges).values({
      id: crypto.randomUUID(),
      circleId: membership[0].circleId,
      fromUserId: userId,
      toUserId: body.toUserId,
      message: body.message?.trim() || 'Keep the streak going — praying for you!',
    })
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'leave') {
    await db.delete(circleMembers).where(eq(circleMembers.userId, userId))
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
