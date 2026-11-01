/**
 * Real PostgreSQL integration tests (Neon / Postgres via DATABASE_URL).
 *
 * Gated: set ABIDE_DB_INTEGRATION=1 and DATABASE_URL to a disposable test DB.
 * These are NOT mocked unit tests — skipped by default without env.
 *
 * Run:
 *   ABIDE_DB_INTEGRATION=1 DATABASE_URL=postgres://... npm test -- src/db/historyIntegrity.integration.test.ts
 */
import { afterAll, describe, expect, it } from 'vitest'
import { and, eq, sql } from 'drizzle-orm'
import {
  deterministicProgressEventId,
  readingSessionActivityKey,
  validateProgressEventBatch,
} from '@/lib/progressEvents'
import { commitProgressEvents } from '@/lib/serverProgress'

const run =
  process.env.ABIDE_DB_INTEGRATION === '1' && Boolean(process.env.DATABASE_URL)

describe('history integrity gate (unit meta)', () => {
  it('documents that integration suite is skipped without ABIDE_DB_INTEGRATION=1', () => {
    if (!run) {
      expect(process.env.ABIDE_DB_INTEGRATION).not.toBe('1')
    } else {
      expect(process.env.DATABASE_URL).toBeTruthy()
    }
  })
})

describe.runIf(run)('history integrity (real PostgreSQL)', () => {
  // Lazy imports so skipped runs never call neon() without a URL.
  let sqlRaw: ReturnType<typeof import('@neondatabase/serverless').neon>
  let db: ReturnType<typeof import('drizzle-orm/neon-http').drizzle>
  let progressEvents: typeof import('./schema').progressEvents
  let profiles: typeof import('./schema').profiles
  let ensureSchema: typeof import('./ensureSchema').ensureSchema
  const url = process.env.DATABASE_URL!
  const TEST_USER = `test-hist-integrity-${Date.now()}`

  afterAll(async () => {
    if (!db || !progressEvents || !profiles) return
    try {
      await db.delete(progressEvents).where(eq(progressEvents.userId, TEST_USER))
      await db.delete(profiles).where(eq(profiles.userId, TEST_USER))
    } catch {
      /* best-effort cleanup */
    }
  })

  async function ready() {
    if (db) return
    const { neon } = await import('@neondatabase/serverless')
    const { drizzle } = await import('drizzle-orm/neon-http')
    const schema = await import('./schema')
    const ens = await import('./ensureSchema')
    ensureSchema = ens.ensureSchema
    progressEvents = schema.progressEvents
    profiles = schema.profiles
    sqlRaw = neon(url)
    db = drizzle(sqlRaw, { schema })
    await ensureSchema(url)
  }

  it('ensureSchema is idempotent under concurrent calls', async () => {
    await ready()
    await Promise.all([ensureSchema(url), ensureSchema(url), ensureSchema(url)])
    const cols = await sqlRaw`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'progress_events' AND column_name = 'activity_key'
    `
    expect(cols.length).toBeGreaterThanOrEqual(1)
    const idx = await sqlRaw`
      SELECT indexname FROM pg_indexes
      WHERE tablename = 'progress_events'
        AND indexname = 'progress_events_user_activity_uidx'
    `
    expect(idx.length).toBeGreaterThanOrEqual(1)
  })

  it('enforces unique (user_id, activity_key) and treats concurrent duplicates as idempotent', async () => {
    await ready()
    const day = '2026-06-15'
    const activityKey = readingSessionActivityKey({
      bookId: 'john',
      chapter: 3,
      day,
      translationId: 'web',
    })!
    const clientCreatedAt = `${day}T12:00:00.000Z`
    const idA = deterministicProgressEventId(`${activityKey}:device-a`)
    const idB = deterministicProgressEventId(`${activityKey}:device-b`)
    const batchA = validateProgressEventBatch([
      {
        id: idA,
        type: 'reading_session',
        clientCreatedAt,
        payload: { bookId: 'john', chapter: 3, translationId: 'web' },
      },
    ])
    const batchB = validateProgressEventBatch([
      {
        id: idB,
        type: 'reading_session',
        clientCreatedAt,
        payload: { bookId: 'john', chapter: 3, translationId: 'web' },
      },
    ])
    expect(batchA.accepted[0]?.activityKey).toBe(activityKey)
    expect(batchB.accepted[0]?.activityKey).toBe(activityKey)

    const [r1, r2] = await Promise.all([
      commitProgressEvents(db, TEST_USER, batchA.accepted),
      commitProgressEvents(db, TEST_USER, batchB.accepted),
    ])
    const insertedTotal = r1.inserted.length + r2.inserted.length
    const dupTotal = r1.duplicates.length + r2.duplicates.length
    expect(insertedTotal).toBe(1)
    expect(dupTotal).toBe(1)

    const rows = await db
      .select()
      .from(progressEvents)
      .where(
        and(eq(progressEvents.userId, TEST_USER), eq(progressEvents.activityKey, activityKey)),
      )
    expect(rows).toHaveLength(1)
    expect(rows[0].awardedXp).toBe(0)
  })

  it('allows NULL activity_key legacy rows without unique collision', async () => {
    await ready()
    const id1 = deterministicProgressEventId(`legacy-null-a-${TEST_USER}`)
    const id2 = deterministicProgressEventId(`legacy-null-b-${TEST_USER}`)
    await db.insert(progressEvents).values({
      id: id1,
      userId: TEST_USER,
      type: 'memory_review',
      payload: { verseId: 'v1' },
      awardedXp: 0,
      activityKey: null,
      clientCreatedAt: new Date('2026-06-14T10:00:00.000Z'),
    })
    await db.insert(progressEvents).values({
      id: id2,
      userId: TEST_USER,
      type: 'memory_review',
      payload: { verseId: 'v2' },
      awardedXp: 0,
      activityKey: null,
      clientCreatedAt: new Date('2026-06-14T11:00:00.000Z'),
    })
    const count = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(progressEvents)
      .where(eq(progressEvents.userId, TEST_USER))
    expect(count[0].n).toBeGreaterThanOrEqual(2)
  })

  it('preserves separate reading sessions for different chapters', async () => {
    await ready()
    const day = '2026-06-16'
    const events = validateProgressEventBatch([
      {
        id: deterministicProgressEventId(`ch3-${TEST_USER}`),
        type: 'reading_session',
        clientCreatedAt: `${day}T10:00:00.000Z`,
        payload: { bookId: 'john', chapter: 3, translationId: 'web' },
      },
      {
        id: deterministicProgressEventId(`ch4-${TEST_USER}`),
        type: 'reading_session',
        clientCreatedAt: `${day}T11:00:00.000Z`,
        payload: { bookId: 'john', chapter: 4, translationId: 'web' },
      },
    ])
    const result = await commitProgressEvents(db, TEST_USER, events.accepted)
    expect(result.inserted).toHaveLength(2)
  })
})
