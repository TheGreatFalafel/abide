import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mergeUserStates } from './mergeState'
import {
  applyFetchedMemoryTranslations,
  collapseMemoryBankByScripture,
  memoryNeedsTranslationSync,
  reconcileMemoryPair,
  standardizeMemoryTranslations,
} from './memoryTranslation'
import { addMemoryVerse, migrateUserState, refreshMemoryText, updateSettings } from './progress'
import { newFsrsSnapshot } from './fsrsEngine'
import { createInitialState, type MemoryVerse } from './types'

const NOW = new Date('2026-06-15T12:00:00.000Z')

function card(
  partial: Partial<MemoryVerse> &
    Pick<MemoryVerse, 'id' | 'translationId' | 'text' | 'reference'>,
): MemoryVerse {
  const fsrs = partial.fsrs ?? newFsrsSnapshot(NOW)
  return {
    bookName: 'John',
    bookId: 'john',
    chapter: 3,
    verseStart: 16,
    verseEnd: 16,
    addedAt: '2026-01-01',
    nextReview: fsrs.due.slice(0, 10),
    intervalDays: Math.round(fsrs.scheduled_days),
    ease: 2.5,
    repetitions: fsrs.reps,
    lapses: fsrs.lapses,
    status: 'learning',
    reviewHistory: [],
    successfulReviews: 0,
    failedReviews: 0,
    scheduler: 'fsrs-6',
    translationConfident: true,
    translationStale: false,
    ...partial,
    fsrs,
  }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  })
})

describe('memory translation standardization', () => {
  it('creates new verses under the global translation even if another id is requested', () => {
    let state = createInitialState('Ada', 'gospels')
    state = { ...state, translationId: 'kjv' }
    const { state: next, added } = addMemoryVerse(
      state,
      {
        reference: 'John 3:16',
        text: 'For God so loved…',
        bookName: 'John',
        bookId: 'john',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        translationId: 'web',
        id: 'john-3-16-16:web',
      },
      NOW,
    )
    expect(added).toBe(true)
    expect(next.memoryVerses).toHaveLength(1)
    expect(next.memoryVerses[0].id).toBe('john-3-16-16:kjv')
    expect(next.memoryVerses[0].translationId).toBe('kjv')
  })

  it('rejects a second card for the same scripture under another translation', () => {
    let state = createInitialState('Ada', 'gospels')
    state = addMemoryVerse(
      state,
      {
        reference: 'John 3:16',
        text: 'WEB',
        bookName: 'John',
        bookId: 'john',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        translationId: 'web',
      },
      NOW,
    ).state
    state = { ...state, translationId: 'kjv' }
    const again = addMemoryVerse(
      state,
      {
        reference: 'John 3:16',
        text: 'KJV',
        bookName: 'John',
        bookId: 'john',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        translationId: 'kjv',
      },
      NOW,
    )
    expect(again.added).toBe(false)
    expect(again.state.memoryVerses).toHaveLength(1)
  })

  it('migrates existing cards when global translation changes and preserves FSRS', () => {
    const esv = card({
      id: 'john-3-16-16:esv',
      translationId: 'esv',
      text: 'ESV text',
      reference: 'John 3:16',
      fsrs: {
        ...newFsrsSnapshot(NOW),
        reps: 7,
        lapses: 2,
        stability: 18,
        difficulty: 4.5,
        due: '2026-07-01T12:00:00.000Z',
        scheduled_days: 12,
        state: 2,
        last_review: '2026-06-10T12:00:00.000Z',
      },
      reviewHistory: [
        {
          reviewedAt: '2026-06-10T12:00:00.000Z',
          rating: 3,
          stateBefore: 2,
          scheduledDays: 10,
          appliedSchedule: true,
          source: 'practice',
        },
      ],
      successfulReviews: 6,
      status: 'learning',
    })
    const state = {
      ...createInitialState('Ada', 'gospels'),
      translationId: 'web' as const,
      memoryVerses: [esv],
    }
    const { state: next, report } = applyFetchedMemoryTranslations(state, 'web', [
      { sourceId: esv.id, ok: true, text: 'WEB text', reference: 'John 3:16' },
    ])
    expect(report.migrated).toBe(1)
    expect(next.memoryVerses).toHaveLength(1)
    const v = next.memoryVerses[0]
    expect(v.id).toBe('john-3-16-16:web')
    expect(v.translationId).toBe('web')
    expect(v.text).toBe('WEB text')
    expect(v.fsrs.reps).toBe(7)
    expect(v.fsrs.lapses).toBe(2)
    expect(v.fsrs.stability).toBe(18)
    expect(v.fsrs.due).toBe('2026-07-01T12:00:00.000Z')
    expect(v.reviewHistory).toHaveLength(1)
    expect(v.translationStale).toBe(false)
  })

  it('merges progress when target translation card already exists', () => {
    const esv = card({
      id: 'john-3-16-16:esv',
      translationId: 'esv',
      text: 'ESV',
      reference: 'John 3:16',
      status: 'memorized',
      fsrs: { ...newFsrsSnapshot(NOW), reps: 3, stability: 5 },
      successfulReviews: 3,
    })
    const web = card({
      id: 'john-3-16-16:web',
      translationId: 'web',
      text: 'WEB old',
      reference: 'John 3:16',
      fsrs: { ...newFsrsSnapshot(NOW), reps: 10, stability: 40, lapses: 1 },
      successfulReviews: 9,
      reviewHistory: [
        {
          reviewedAt: '2026-05-01T12:00:00.000Z',
          rating: 4,
          stateBefore: 2,
          scheduledDays: 20,
          appliedSchedule: true,
          source: 'practice',
        },
      ],
    })
    const state = {
      ...createInitialState('Ada', 'gospels'),
      translationId: 'web' as const,
      memoryVerses: [esv, web],
    }
    const { state: next, report } = applyFetchedMemoryTranslations(state, 'web', [
      { sourceId: esv.id, ok: true, text: 'WEB fresh', reference: 'John 3:16' },
    ])
    expect(next.memoryVerses).toHaveLength(1)
    expect(report.merged).toBeGreaterThanOrEqual(1)
    const v = next.memoryVerses[0]
    expect(v.id).toBe('john-3-16-16:web')
    expect(v.text).toBe('WEB fresh')
    expect(v.status).toBe('memorized')
    expect(v.fsrs.reps).toBe(10)
    expect(v.successfulReviews).toBe(9)
  })

  it('keeps prior text and marks stale when fetch fails', () => {
    const esv = card({
      id: 'john-3-16-16:esv',
      translationId: 'esv',
      text: 'Keep me',
      reference: 'John 3:16',
    })
    const state = {
      ...createInitialState('Ada', 'gospels'),
      translationId: 'web' as const,
      memoryVerses: [esv],
    }
    const { state: next, report } = applyFetchedMemoryTranslations(state, 'web', [
      { sourceId: esv.id, ok: false, reason: 'ESV key required' },
    ])
    expect(report.failed).toHaveLength(1)
    expect(next.memoryVerses[0].text).toBe('Keep me')
    expect(next.memoryVerses[0].translationId).toBe('esv')
    expect(next.memoryVerses[0].translationStale).toBe(true)
  })

  it('standardizeMemoryTranslations is idempotent after a successful pass', async () => {
    const esv = card({
      id: 'john-3-16-16:esv',
      translationId: 'esv',
      text: 'ESV',
      reference: 'John 3:16',
    })
    let state = {
      ...createInitialState('Ada', 'gospels'),
      translationId: 'kjv' as const,
      memoryVerses: [esv],
    }
    const fetch = vi.fn(async () => ({ text: 'KJV text', reference: 'John 3:16' }))
    const first = await standardizeMemoryTranslations(state, fetch, { target: 'kjv' })
    expect(first.report.migrated).toBe(1)
    expect(fetch).toHaveBeenCalledTimes(1)
    const synced = first.state
    expect(memoryNeedsTranslationSync(synced)).toBe(false)
    const second = await standardizeMemoryTranslations(synced, fetch, { target: 'kjv' })
    expect(second.report.migrated).toBe(0)
    expect(second.state.memoryVerses).toHaveLength(1)
    expect(second.state.memoryVerses[0].id).toBe('john-3-16-16:kjv')
  })

  it('refreshMemoryText re-keys identity instead of leaving mixed ids', () => {
    const esv = card({
      id: 'john-3-16-16:esv',
      translationId: 'esv',
      text: 'ESV',
      reference: 'John 3:16',
      fsrs: { ...newFsrsSnapshot(NOW), reps: 4, stability: 8 },
    })
    const state = {
      ...createInitialState('Ada', 'gospels'),
      translationId: 'web' as const,
      memoryVerses: [esv],
    }
    const next = refreshMemoryText(state, esv.id, 'WEB', 'John 3:16', 'web')
    expect(next.memoryVerses).toHaveLength(1)
    expect(next.memoryVerses[0].id).toBe('john-3-16-16:web')
    expect(next.memoryVerses[0].fsrs.reps).toBe(4)
    expect(next.memoryVerses.find((v) => v.id === esv.id)).toBeUndefined()
  })

  it('cloud merge does not resurrect obsolete translation cards', () => {
    const local = {
      ...createInitialState('Ada', 'gospels'),
      translationId: 'web' as const,
      memoryVerses: [
        card({
          id: 'john-3-16-16:web',
          translationId: 'web',
          text: 'WEB',
          reference: 'John 3:16',
          fsrs: { ...newFsrsSnapshot(NOW), reps: 5, stability: 12 },
        }),
      ],
    }
    const cloud = {
      ...createInitialState('Ada', 'gospels'),
      translationId: 'esv' as const,
      memoryVerses: [
        card({
          id: 'john-3-16-16:esv',
          translationId: 'esv',
          text: 'ESV',
          reference: 'John 3:16',
          fsrs: { ...newFsrsSnapshot(NOW), reps: 2, stability: 3 },
        }),
      ],
    }
    const merged = mergeUserStates(local, cloud)
    expect(merged.translationId).toBe('web')
    expect(merged.memoryVerses).toHaveLength(1)
    expect(merged.memoryVerses[0].id).toBe('john-3-16-16:web')
    expect(merged.memoryVerses[0].fsrs.reps).toBe(5)
  })

  it('updateSettings alone does not wipe cards; migrateUserState collapses mixed banks', () => {
    const mixed = migrateUserState({
      name: 'Ada',
      planId: 'year',
      translationId: 'web',
      memoryVerses: [
        card({
          id: 'john-3-16-16:esv',
          translationId: 'esv',
          text: 'ESV',
          reference: 'John 3:16',
        }),
        card({
          id: 'john-3-16-16:web',
          translationId: 'web',
          text: 'WEB',
          reference: 'John 3:16',
          fsrs: { ...newFsrsSnapshot(NOW), reps: 2 },
        }),
      ],
    } as Parameters<typeof migrateUserState>[0])
    expect(mixed.memoryVerses).toHaveLength(1)
    expect(mixed.memoryVerses[0].translationId).toBe('web')

    const afterSettings = updateSettings(mixed, { translationId: 'kjv' })
    expect(afterSettings.memoryVerses).toHaveLength(1)
    expect(memoryNeedsTranslationSync(afterSettings)).toBe(true)
  })

  it('reconcileMemoryPair keeps stronger FSRS and ORs memorized status', () => {
    const a = card({
      id: 'a:web',
      translationId: 'web',
      text: 'a',
      reference: 'John 3:16',
      status: 'memorized',
      fsrs: { ...newFsrsSnapshot(NOW), reps: 2, stability: 2 },
    })
    const b = card({
      id: 'b:web',
      translationId: 'web',
      text: 'b',
      reference: 'John 3:16',
      fsrs: { ...newFsrsSnapshot(NOW), reps: 9, stability: 30 },
    })
    const merged = reconcileMemoryPair(a, b)
    expect(merged.status).toBe('memorized')
    expect(merged.fsrs.reps).toBe(9)
    expect(collapseMemoryBankByScripture([a, b], 'web')).toHaveLength(1)
  })
})
