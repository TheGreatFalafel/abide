import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addMemoryVerse,
  dueMemoryVerses,
  makeMemoryId,
  reviewMemoryVerse,
} from './progress'
import { createInitialState, todayKey } from './types'

const NOW = new Date(`${todayKey()}T15:00:00.000Z`)

beforeEach(() => {
  vi.stubGlobal('localStorage', {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  })
})

describe('memory bank', () => {
  it('makeMemoryId includes translation', () => {
    expect(makeMemoryId('john', 3, 16, 16, 'web')).toBe('john-3-16-16:web')
  })

  it('adds a verse once and lists it as due today', () => {
    const state = createInitialState('Mem', 'gospels')
    const { state: next, added } = addMemoryVerse(
      state,
      {
        reference: 'John 3:16',
        text: 'For God so loved the world.',
        bookName: 'John',
        bookId: 'john',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        translationId: 'web',
      },
      NOW,
    )
    expect(added).toBe(true)
    expect(next.memoryVerses).toHaveLength(1)
    expect(dueMemoryVerses(next, undefined, NOW).map((v) => v.id)).toContain(
      'john-3-16-16:web',
    )

    const again = addMemoryVerse(
      next,
      {
        reference: 'John 3:16',
        text: 'For God so loved the world.',
        bookName: 'John',
        bookId: 'john',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        translationId: 'web',
      },
      NOW,
    )
    expect(again.added).toBe(false)
    expect(again.state.memoryVerses).toHaveLength(1)
  })

  it('good review advances FSRS and clears due for later', () => {
    let state = createInitialState('Mem', 'gospels')
    state = addMemoryVerse(
      state,
      {
        reference: 'John 3:16',
        text: 'For God so loved the world.',
        bookName: 'John',
        bookId: 'john',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        translationId: 'web',
      },
      NOW,
    ).state
    const id = state.memoryVerses[0].id
    const result = reviewMemoryVerse(state, id, 'good', {
      now: NOW,
      applySchedule: true,
      source: 'practice',
    })
    const card = result.state.memoryVerses[0]
    expect(card.fsrs.reps).toBe(1)
    expect(dueMemoryVerses(result.state, undefined, NOW)).toHaveLength(0)
  })

  it('again review records a failure without inventing history', () => {
    let state = createInitialState('Mem', 'gospels')
    state = addMemoryVerse(
      state,
      {
        reference: 'John 3:16',
        text: 'For God so loved the world.',
        bookName: 'John',
        bookId: 'john',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        translationId: 'web',
      },
      NOW,
    ).state
    const id = state.memoryVerses[0].id
    const result = reviewMemoryVerse(state, id, 'again', {
      now: NOW,
      applySchedule: true,
    })
    expect(result.state.memoryVerses[0].failedReviews).toBe(1)
    expect(result.state.memoryVerses[0].reviewHistory[0].rating).toBe(1)
    expect(result.state.memoryVerses[0].reviewHistory[0].appliedSchedule).toBe(true)
  })
})
