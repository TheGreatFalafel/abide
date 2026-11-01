import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  clearActivityHistory,
  collapseReadingSessionDuplicates,
  mergeActivityHistory,
  peekActivityHistory,
  recordActivityHistory,
} from './activityHistory'
import { clearProgressEventQueue, enqueueProgressEvent, peekProgressEvents } from './eventQueue'
import {
  deterministicProgressEventId,
  readingSessionActivityKey,
  resolveProgressActivityKey,
  validateProgressEvent,
  validateProgressEventBatch,
} from './progressEvents'

const UUID_RE_TEST =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const NOW = new Date('2026-06-15T12:00:00.000Z')

beforeEach(() => {
  clearActivityHistory()
  clearProgressEventQueue()
})

afterEach(() => {
  clearActivityHistory()
  clearProgressEventQueue()
})

describe('readingSessionActivityKey (unit)', () => {
  it('is stable across devices for same book/chapter/day/translation', () => {
    const a = readingSessionActivityKey({
      bookId: 'John',
      chapter: 3,
      day: '2026-06-15',
      translationId: 'WEB',
    })
    const b = readingSessionActivityKey({
      bookId: 'john',
      chapter: 3,
      day: '2026-06-15',
      translationId: 'web',
    })
    expect(a).toBe('read:john:3:2026-06-15:web')
    expect(a).toBe(b)
  })

  it('keeps different translations and days distinct', () => {
    const web = readingSessionActivityKey({
      bookId: 'john',
      chapter: 3,
      day: '2026-06-15',
      translationId: 'web',
    })
    const esv = readingSessionActivityKey({
      bookId: 'john',
      chapter: 3,
      day: '2026-06-15',
      translationId: 'esv',
    })
    const nextDay = readingSessionActivityKey({
      bookId: 'john',
      chapter: 3,
      day: '2026-06-16',
      translationId: 'web',
    })
    expect(web).not.toBe(esv)
    expect(web).not.toBe(nextDay)
  })

  it('produces a UUID-shaped deterministic event id', () => {
    const key = readingSessionActivityKey({
      bookId: 'john',
      chapter: 3,
      day: '2026-06-15',
      translationId: 'web',
    })!
    const id = deterministicProgressEventId(key)
    expect(id).toMatch(UUID_RE_TEST)
    expect(deterministicProgressEventId(key)).toBe(id)
  })
})

describe('server validation activityKey (unit)', () => {
  it('derives activityKey from payload + clientCreatedAt, ignoring client claim', () => {
    const result = validateProgressEvent(
      {
        id: deterministicProgressEventId('seed'),
        type: 'reading_session',
        clientCreatedAt: NOW.toISOString(),
        payload: {
          bookId: 'john',
          chapter: 3,
          translationId: 'web',
          activityKey: 'read:forged:key',
        },
      },
      NOW,
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.event.activityKey).toBe('read:john:3:2026-06-15:web')
    expect(result.event.awardedXp).toBe(0)
  })

  it('rejects reading_session without book/chapter', () => {
    const result = validateProgressEvent(
      {
        id: '11111111-1111-4111-8111-111111111111',
        type: 'reading_session',
        clientCreatedAt: NOW.toISOString(),
        payload: {},
      },
      NOW,
    )
    expect(result.ok).toBe(false)
  })

  it('rejects duplicate activity keys within a batch', () => {
    const payload = { bookId: 'john', chapter: 3, translationId: 'web' }
    const a = {
      id: '11111111-1111-4111-8111-111111111111',
      type: 'reading_session',
      clientCreatedAt: NOW.toISOString(),
      payload,
    }
    const b = {
      id: '22222222-2222-4222-8222-222222222222',
      type: 'reading_session',
      clientCreatedAt: NOW.toISOString(),
      payload,
    }
    const { accepted, rejected } = validateProgressEventBatch([a, b], NOW)
    expect(accepted).toHaveLength(1)
    expect(rejected.some((r) => /activity key/i.test(r.error))).toBe(true)
  })

  it('leaves non-reading events with null activityKey', () => {
    expect(
      resolveProgressActivityKey(
        'memory_review',
        { verseId: 'v1', grade: 'good', applySchedule: true },
        NOW.toISOString(),
      ),
    ).toBeNull()
  })
})

describe('cross-device local merge (unit)', () => {
  it('collapses two UUIDs that share activityKey', () => {
    recordActivityHistory({
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      type: 'reading_session',
      payload: {
        bookId: 'john',
        chapter: 3,
        activityKey: 'read:john:3:2026-06-15:web',
      },
      clientCreatedAt: '2026-06-15T10:00:00.000Z',
    })
    mergeActivityHistory([
      {
        id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        type: 'reading_session',
        payload: {
          bookId: 'john',
          chapter: 3,
          activityKey: 'read:john:3:2026-06-15:web',
        },
        clientCreatedAt: '2026-06-15T11:00:00.000Z',
        synced: true,
      },
    ])
    const rows = peekActivityHistory().filter((r) => r.type === 'reading_session')
    expect(rows).toHaveLength(1)
    expect(rows[0].synced).toBe(true)
  })

  it('preserves different chapters and translations', () => {
    const rows = collapseReadingSessionDuplicates([
      {
        id: 'a',
        type: 'reading_session',
        payload: { activityKey: 'read:john:3:2026-06-15:web' },
        clientCreatedAt: '2026-06-15T10:00:00.000Z',
      },
      {
        id: 'b',
        type: 'reading_session',
        payload: { activityKey: 'read:john:4:2026-06-15:web' },
        clientCreatedAt: '2026-06-15T11:00:00.000Z',
      },
      {
        id: 'c',
        type: 'reading_session',
        payload: { activityKey: 'read:john:3:2026-06-15:esv' },
        clientCreatedAt: '2026-06-15T12:00:00.000Z',
      },
    ])
    expect(rows).toHaveLength(3)
  })

  it('does not enqueue duplicate reading activityKey in the upload queue', () => {
    const key = 'read:john:3:2026-06-15:web'
    enqueueProgressEvent({
      id: '11111111-1111-4111-8111-111111111111',
      type: 'reading_session',
      clientCreatedAt: NOW.toISOString(),
      payload: { activityKey: key, bookId: 'john', chapter: 3 },
    })
    enqueueProgressEvent({
      id: '22222222-2222-4222-8222-222222222222',
      type: 'reading_session',
      clientCreatedAt: NOW.toISOString(),
      payload: { activityKey: key, bookId: 'john', chapter: 3 },
    })
    expect(peekProgressEvents()).toHaveLength(1)
  })
})
