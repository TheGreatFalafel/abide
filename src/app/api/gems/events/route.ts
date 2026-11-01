import { auth, currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getReadyDb, hasDatabase } from '@/db/client'
import { profiles } from '@/db/schema'
import { isSchemaDriftError, schemaDriftMessage } from '@/lib/dbErrors'
import { validateGemEventBatch } from '@/lib/gemEvents'
import {
  applyServerGemAuthority,
  commitGemEvents,
  ensureLegacyGemImport,
  sumGemBalance,
} from '@/lib/serverGems'
import { prepareStateForCloud } from '@/lib/privacy'
import type { UserState } from '@/lib/types'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to sync gems.' }, { status: 401 })
  }
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }
  try {
    const db = await getReadyDb()
    const gems = await sumGemBalance(db, userId)
    return NextResponse.json({ serverGems: gems })
  } catch (err) {
    if (isSchemaDriftError(err)) {
      return NextResponse.json({ error: schemaDriftMessage() }, { status: 503 })
    }
    throw err
  }
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to sync gems.' }, { status: 401 })
  }
  if (!hasDatabase()) {
    return NextResponse.json({ error: 'DATABASE_URL not configured.' }, { status: 503 })
  }

  let body: { events?: unknown[]; seedGems?: number }
  try {
    body = (await req.json()) as { events?: unknown[]; seedGems?: number }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    const db = await getReadyDb()
    const user = await currentUser()
    const displayName =
      user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || 'Friend'

    const existing = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
    const seed = Math.max(
      0,
      Math.floor(Number(body.seedGems) || 0),
      existing[0]?.gems ?? 0,
    )
    await ensureLegacyGemImport(db, userId, seed)

    const { accepted, rejected } = validateGemEventBatch(body.events ?? [])
    const filtered = accepted.filter((e) => e.type !== 'legacy_gem_import')
    const result = await commitGemEvents(db, userId, filtered, { displayName })

    const profile = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
    let state: UserState | null = null
    if (profile[0]?.stateJson) {
      state = applyServerGemAuthority(
        prepareStateForCloud(profile[0].stateJson as UserState),
        {
          gems: result.serverGems,
          cosmeticsOwned: result.ownedItemIds,
          streakFreezes: result.streakFreezes,
        },
      )
    }

    return NextResponse.json({
      ok: true,
      inserted: result.inserted.map((e) => ({
        id: e.id,
        deltaGems: e.deltaGems,
        type: e.type,
      })),
      duplicates: result.duplicates,
      rejected: [...rejected, ...result.rejected],
      serverGems: result.serverGems,
      ownedItemIds: result.ownedItemIds,
      streakFreezes: result.streakFreezes,
      freezesGranted: result.freezesGranted,
      state,
    })
  } catch (err) {
    if (isSchemaDriftError(err)) {
      return NextResponse.json({ error: schemaDriftMessage() }, { status: 503 })
    }
    throw err
  }
}
