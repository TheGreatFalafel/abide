import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  FSRS_MODEL,
  FSRS_PACKAGE,
  FSRS_PACKAGE_VERSION,
  newFsrsSnapshot,
  retrievabilityOf,
  reviewFsrsCard,
} from './fsrsEngine'
import { makeMemoryId, parseMemoryId } from './memoryIds'
import { migrateMemoryVerse } from './memoryMigrate'
import {
  prioritizeForReview,
  selectQuizCard,
  memoryDashboardStats,
} from './memorySelect'
import {
  addMemoryVerse,
  completeMemoryQuest,
  migrateUserState,
  reviewMemoryVerse,
  scoreMemoryQuiz,
  scoreMemoryQuizChallenge,
} from './progress'
import { createInitialState, XP, type MemoryVerse } from './types'

const NOW = new Date('2026-06-15T15:00:00.000Z')

beforeEach(() => {
  vi.stubGlobal('localStorage', {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  })
})

function verse(partial: Partial<MemoryVerse> & Pick<MemoryVerse, 'id' | 'translationId'>): MemoryVerse {
  const { fsrs: fsrsOverride, ...rest } = partial
  const fsrs = fsrsOverride ?? newFsrsSnapshot(NOW)
  return {
    reference: 'John 3:16',
    text: 'For God so loved the world.',
    bookName: 'John',
    bookId: 'john',
    chapter: 3,
    verseStart: 16,
    verseEnd: 16,
    addedAt: '2026-06-01',
    nextReview: fsrs.due.slice(0, 10),
    intervalDays: Math.round(fsrs.scheduled_days),
    ease: 2.5,
    repetitions: fsrs.reps,
    lapses: fsrs.lapses,
    status: 'learning',
    translationConfident: true,
    reviewHistory: [],
    successfulReviews: 0,
    failedReviews: 0,
    scheduler: 'fsrs-6',
    ...rest,
    fsrs,
  }
}

describe('ts-fsrs package', () => {
  it('uses the maintained library', () => {
    expect(FSRS_PACKAGE).toBe('ts-fsrs')
    expect(FSRS_PACKAGE_VERSION).toBe('6.0.0')
    expect(FSRS_MODEL).toBe('FSRS-6')
  })

  it('schedules deterministically for controlled timestamps', () => {
    const a = reviewFsrsCard(newFsrsSnapshot(NOW), 'good', NOW).card
    const b = reviewFsrsCard(newFsrsSnapshot(NOW), 'good', NOW).card
    expect(a.due).toBe(b.due)
    expect(a.stability).toBe(b.stability)
    expect(a.difficulty).toBe(b.difficulty)
  })

  it('Again schedules sooner than Good/Easy', () => {
    const base = newFsrsSnapshot(NOW)
    const again = reviewFsrsCard(base, 'again', NOW).card
    const good = reviewFsrsCard(base, 'good', NOW).card
    const easy = reviewFsrsCard(base, 'easy', NOW).card
    expect(new Date(again.due).getTime()).toBeLessThanOrEqual(new Date(good.due).getTime())
    expect(new Date(good.due).getTime()).toBeLessThanOrEqual(new Date(easy.due).getTime())
  })

  it('tracks reps across ratings and advances due', () => {
    let card = newFsrsSnapshot(NOW)
    card = reviewFsrsCard(card, 'good', NOW).card
    expect(card.reps).toBe(1)
    const due1 = card.due
    // Stay in learning: another Good at the next step time
    card = reviewFsrsCard(card, 'good', new Date(card.due)).card
    expect(card.reps).toBe(2)
    expect(card.due).not.toBe(due1)
  })
})

describe('translation-specific identity', () => {
  it('includes translation in memory ids', () => {
    expect(makeMemoryId('john', 3, 16, 16, 'esv')).toBe('john-3-16-16:esv')
    expect(makeMemoryId('john', 3, 16, 16, 'web')).toBe('john-3-16-16:web')
    expect(parseMemoryId('john-3-16-16:esv')?.translationId).toBe('esv')
  })

  it('stores one card per scripture under the global translation', () => {
    let state = createInitialState('Ada', 'gospels')
    state = { ...state, translationId: 'esv' }
    const esv = addMemoryVerse(
      state,
      {
        reference: 'John 3:16',
        text: 'ESV text',
        bookName: 'John',
        bookId: 'john',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        translationId: 'esv',
      },
      NOW,
    )
    state = esv.state
    expect(esv.added).toBe(true)
    expect(state.memoryVerses[0].id).toBe('john-3-16-16:esv')
    state = { ...state, translationId: 'web' }
    const web = addMemoryVerse(
      state,
      {
        reference: 'John 3:16',
        text: 'WEB text',
        bookName: 'John',
        bookId: 'john',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        translationId: 'web',
      },
      NOW,
    )
    expect(web.added).toBe(false)
    expect(web.state.memoryVerses).toHaveLength(1)
  })
})

describe('legacy migration', () => {
  it('rewrites legacy ids when translation is known and seeds FSRS without inventing history', () => {
    const migrated = migrateMemoryVerse(
      {
        id: 'john-3-16-16',
        reference: 'John 3:16',
        text: 'For God so loved the world.',
        bookName: 'John',
        bookId: 'john',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        translationId: 'web',
        addedAt: '2026-01-01',
        nextReview: '2026-06-20',
        intervalDays: 14,
        ease: 2.5,
        repetitions: 5,
        lapses: 1,
        status: 'learning',
      },
      NOW,
    )
    expect(migrated.id).toBe('john-3-16-16:web')
    expect(migrated.fsrs.reps).toBe(5)
    expect(migrated.fsrs.lapses).toBe(1)
    // Seeded last_review so ts-fsrs.retrievability won't throw (no invented rating history).
    expect(migrated.fsrs.last_review).toBeTruthy()
    expect(migrated.reviewHistory).toEqual([])
    expect(migrated.scheduler).toBe('fsrs-6')
  })

  it('does not crash Memory ranking for legacy cards missing last_review', () => {
    const migrated = migrateMemoryVerse(
      {
        id: 'john-3-16',
        reference: 'John 3:16',
        text: 'For God so loved the world...',
        bookName: 'John',
        bookId: 'john',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        addedAt: '2024-01-01',
        nextReview: '2024-01-01',
        intervalDays: 1,
        ease: 2.5,
        repetitions: 3,
        lapses: 0,
        status: 'learning',
      },
      NOW,
    )
    expect(() =>
      memoryDashboardStats({ memoryVerses: [migrated], memoryReviewsToday: 0 }, NOW),
    ).not.toThrow()
    // Even a pre-fix snapshot with null last_review must be safe for ranking.
    const broken = {
      ...migrated,
      fsrs: { ...migrated.fsrs, last_review: null },
    }
    expect(() =>
      memoryDashboardStats({ memoryVerses: [broken], memoryReviewsToday: 0 }, NOW),
    ).not.toThrow()
  })

  it('keeps legacy id when translation cannot be determined', () => {
    const migrated = migrateMemoryVerse(
      {
        id: 'romans-8-28-28',
        reference: 'Romans 8:28',
        text: 'And we know…',
        bookName: 'Romans',
        bookId: 'romans',
        chapter: 8,
        verseStart: 28,
        verseEnd: 28,
        addedAt: '2026-01-01',
        nextReview: '2026-06-15',
        intervalDays: 0,
        ease: 2.5,
        repetitions: 0,
        lapses: 0,
        status: 'learning',
      } as MemoryVerse,
      NOW,
    )
    expect(migrated.id).toBe('romans-8-28-28')
    expect(migrated.translationConfident).toBe(false)
  })

  it('migrateUserState upgrades an entire bank', () => {
    const raw = {
      name: 'Ada',
      planId: 'year',
      memoryVerses: [
        {
          id: 'psalm-23-1-1',
          reference: 'Psalm 23:1',
          text: 'The Lord is my shepherd.',
          bookName: 'Psalms',
          bookId: 'psalms',
          chapter: 23,
          verseStart: 1,
          verseEnd: 1,
          translationId: 'kjv' as const,
          addedAt: '2026-01-01',
          nextReview: '2026-06-15',
          intervalDays: 3,
          ease: 2.5,
          repetitions: 2,
          lapses: 0,
          status: 'learning' as const,
        },
      ],
    }
    const next = migrateUserState(raw as Parameters<typeof migrateUserState>[0], NOW)
    expect(next.memoryVerses[0].id).toBe('psalms-23-1-1:kjv')
    expect(next.memoryVerses[0].fsrs).toBeTruthy()
  })
})

describe('fair review selection', () => {
  it('prioritizes overdue cards ahead of not-due cards', () => {
    const overdue = verse({
      id: 'a:web',
      translationId: 'web',
      fsrs: {
        ...newFsrsSnapshot(new Date('2026-06-01T12:00:00Z')),
        due: '2026-06-01T12:00:00.000Z',
        reps: 2,
        stability: 5,
        difficulty: 5,
        state: 2,
        scheduled_days: 5,
        learning_steps: 0,
        last_review: '2026-05-25T12:00:00.000Z',
      },
    })
    const later = verse({
      id: 'b:web',
      translationId: 'web',
      reference: 'John 1:1',
      fsrs: {
        ...newFsrsSnapshot(new Date('2026-06-20T12:00:00Z')),
        due: '2026-06-20T12:00:00.000Z',
        reps: 2,
        stability: 5,
        difficulty: 5,
        state: 2,
        scheduled_days: 5,
        learning_steps: 0,
        last_review: '2026-06-10T12:00:00.000Z',
      },
    })
    const ranked = prioritizeForReview([later, overdue], NOW)
    expect(ranked.map((v) => v.id)).toEqual(['a:web'])
  })

  it('prefers lower retrievability among due cards', () => {
    const weak = verse({
      id: 'weak:web',
      translationId: 'web',
      fsrs: {
        due: '2026-06-10T12:00:00.000Z',
        stability: 1,
        difficulty: 8,
        scheduled_days: 1,
        learning_steps: 0,
        reps: 3,
        lapses: 2,
        state: 2,
        last_review: '2026-06-01T12:00:00.000Z',
      },
    })
    const strong = verse({
      id: 'strong:web',
      translationId: 'web',
      reference: 'John 1:1',
      fsrs: {
        due: '2026-06-10T12:00:00.000Z',
        stability: 40,
        difficulty: 3,
        scheduled_days: 30,
        learning_steps: 0,
        reps: 8,
        lapses: 0,
        state: 2,
        last_review: '2026-06-14T12:00:00.000Z',
      },
    })
    expect(retrievabilityOf(weak.fsrs, NOW)).toBeLessThan(retrievabilityOf(strong.fsrs, NOW))
    const ranked = prioritizeForReview([strong, weak], NOW)
    expect(ranked[0].id).toBe('weak:web')
  })

  it('selectQuizCard avoids recently quizzed ids when possible', () => {
    const bank = [0, 1, 2].map((i) =>
      verse({
        id: `v${i}:web`,
        translationId: 'web',
        status: 'memorized',
        reference: `John ${i + 1}:1`,
        fsrs: {
          due: '2026-06-14T12:00:00.000Z',
          stability: 2 + i,
          difficulty: 5,
          scheduled_days: 2,
          learning_steps: 0,
          reps: 4,
          lapses: 0,
          state: 2,
          last_review: '2026-06-01T12:00:00.000Z',
        },
      }),
    )
    const state = { ...createInitialState('Ada', 'gospels'), memoryVerses: bank }
    const pick = selectQuizCard(state, NOW, ['v0:web'])
    expect(pick?.id).not.toBe('v0:web')
  })
})

describe('activity integration', () => {
  it('scheduled practice updates FSRS and awards XP', () => {
    let state = createInitialState('Ada', 'gospels')
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
    expect(result.earnedXp).toBe(XP.memoryGood)
    expect(result.state.memoryVerses[0].fsrs.reps).toBe(1)
    expect(result.state.memoryVerses[0].reviewHistory).toHaveLength(1)
    expect(result.state.memoryVerses[0].reviewHistory[0].appliedSchedule).toBe(true)
  })

  it('extra practice does not advance the schedule', () => {
    let state = createInitialState('Ada', 'gospels')
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
    const before = state.memoryVerses[0].fsrs.due
    const id = state.memoryVerses[0].id
    const result = reviewMemoryVerse(state, id, 'easy', {
      now: NOW,
      applySchedule: false,
      source: 'practice',
    })
    expect(result.earnedXp).toBe(XP.memoryExtraPractice)
    expect(result.state.memoryVerses[0].fsrs.due).toBe(before)
    expect(result.state.memoryVerses[0].fsrs.reps).toBe(0)
  })

  it('duplicate scheduled review same day does not double-apply FSRS', () => {
    let state = createInitialState('Ada', 'gospels')
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
    const first = reviewMemoryVerse(state, id, 'good', {
      now: NOW,
      applySchedule: true,
      source: 'practice',
    })
    const dueAfterFirst = first.state.memoryVerses[0].fsrs.due
    const second = reviewMemoryVerse(first.state, id, 'easy', {
      now: NOW,
      applySchedule: true,
      source: 'practice',
    })
    expect(second.state.memoryVerses[0].fsrs.due).toBe(dueAfterFirst)
    expect(second.earnedXp).toBe(0)
  })

  it('memory quiz updates schedule; challenge scoring does not', () => {
    let state = createInitialState('Ada', 'gospels')
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
    const quiz = scoreMemoryQuiz(state, true, { verseId: id, now: NOW, updateSchedule: true })
    expect(quiz.state.memoryVerses[0].fsrs.reps).toBe(1)
    expect(quiz.earnedXp).toBe(XP.memoryQuiz)

    const challenge = scoreMemoryQuizChallenge(state, true, NOW)
    expect(challenge.state.memoryVerses[0].fsrs.reps).toBe(0)
    expect(challenge.earnedXp).toBe(XP.memoryQuiz)
  })

  it('memory quest applies one schedule update per verse', () => {
    let state = createInitialState('Ada', 'gospels')
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
    const result = completeMemoryQuest(state, {
      now: NOW,
      rounds: [
        { verseId: id, correct: true },
        { verseId: id, correct: true },
      ],
    })
    expect(result.state.memoryVerses[0].fsrs.reps).toBe(1)
    expect(result.earnedXp).toBe(XP.memoryQuestCorrect + XP.memoryQuest)
    expect(result.state.streak).toBe(1)
  })

  it('wrong quiz answers grant no XP', () => {
    const state = createInitialState('Ada', 'gospels')
    const result = scoreMemoryQuiz(state, false, { now: NOW, updateSchedule: false })
    expect(result.earnedXp).toBe(0)
  })
})

describe('dashboard stats', () => {
  it('reports due, new, and reviewed counts', () => {
    const state = {
      ...createInitialState('Ada', 'gospels'),
      memoryReviewsToday: 2,
      memoryVerses: [
        verse({
          id: 'n:web',
          translationId: 'web',
          fsrs: newFsrsSnapshot(NOW),
        }),
      ],
    }
    const stats = memoryDashboardStats(state, NOW)
    expect(stats.newCount).toBe(1)
    expect(stats.reviewedToday).toBe(2)
    expect(stats.dueCount).toBeGreaterThanOrEqual(1)
  })
})
