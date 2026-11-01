import { describe, expect, it } from 'vitest'
import { mergeUserStates } from './mergeState'
import {
  INSIGHTS_MIN_SAMPLE,
  buildLearningInsights,
  inRangeDay,
  rangeWindow,
  sampledRate,
} from './learningInsights'
import { migrateUserState } from './progress'
import { createInitialState, type MemoryVerse, type UserState } from './types'

const NOW = new Date('2026-06-15T15:00:00.000Z')

function verse(partial: Partial<MemoryVerse> & Pick<MemoryVerse, 'id' | 'reference'>): MemoryVerse {
  return {
    text: 'In the beginning',
    bookName: 'Genesis',
    bookId: 'gen',
    chapter: 1,
    verseStart: 1,
    verseEnd: 1,
    translationId: 'web',
    addedAt: '2026-06-01',
    nextReview: '2026-06-16',
    intervalDays: 1,
    ease: 2.5,
    repetitions: 1,
    lapses: 0,
    status: 'learning',
    fsrs: {
      due: '2026-06-16T00:00:00.000Z',
      stability: 2,
      difficulty: 5,
      scheduled_days: 1,
      learning_steps: 0,
      reps: 1,
      lapses: 0,
      state: 2,
      last_review: '2026-06-14T12:00:00.000Z',
    },
    reviewHistory: [],
    successfulReviews: 0,
    failedReviews: 0,
    ...partial,
  }
}

describe('insights date ranges', () => {
  it('builds UTC day windows for 7d / 30d / all', () => {
    expect(rangeWindow('7d', NOW)).toEqual({
      startDay: '2026-06-09',
      endDay: '2026-06-15',
    })
    expect(rangeWindow('30d', NOW).startDay).toBe('2026-05-17')
    expect(rangeWindow('all', NOW).startDay).toBeNull()
  })

  it('inRangeDay respects inclusive bounds and all-time', () => {
    expect(inRangeDay('2026-06-09', '2026-06-09', '2026-06-15')).toBe(true)
    expect(inRangeDay('2026-06-08', '2026-06-09', '2026-06-15')).toBe(false)
    expect(inRangeDay('1999-01-01', null, '2026-06-15')).toBe(true)
    expect(inRangeDay(null, '2026-06-09', '2026-06-15')).toBe(false)
  })
})

describe('sampledRate', () => {
  it('withholds percentages below the minimum sample size', () => {
    expect(sampledRate(3, 4).rate).toBeNull()
    expect(sampledRate(4, INSIGHTS_MIN_SAMPLE).rate).toBe(80)
    expect(sampledRate(0, 0).rate).toBeNull()
  })
})

describe('buildLearningInsights', () => {
  it('handles empty / legacy users without fabricating activity', () => {
    const raw = createInitialState('N', 'year')
    const { guidedTour: _g, gameStats: _gs, ...rest } = raw
    const user = migrateUserState(rest as UserState)
    const insights = buildLearningInsights(user, '30d', NOW)
    expect(insights.activity.memoryReviewsInRange).toBe(0)
    expect(insights.activity.lessonsCompletedInRange).toBe(0)
    expect(insights.memory.totalVerses).toBe(0)
    expect(insights.memory.reviewAccuracy.rate).toBeNull()
    expect(insights.theology.quizAccuracy.rate).toBeNull()
    expect(insights.games.played).toBe(0)
    expect(insights.limitations.length).toBeGreaterThan(3)
    expect(insights.overall.planCompletedDays).toBe(0)
  })

  it('rolls memory reviews into the selected range and flags truncated history', () => {
    const user = createInitialState('A', 'year')
    user.memoryVerses = [
      verse({
        id: 'v1',
        reference: 'Gen 1:1',
        status: 'memorized',
        successfulReviews: 50,
        failedReviews: 5,
        reviewHistory: [
          {
            rating: 3,
            reviewedAt: '2026-06-14T10:00:00.000Z',
            stateBefore: 2,
            scheduledDays: 2,
            source: 'practice',
            appliedSchedule: true,
          },
          {
            rating: 1,
            reviewedAt: '2026-05-01T10:00:00.000Z',
            stateBefore: 2,
            scheduledDays: 1,
            source: 'practice',
            appliedSchedule: true,
          },
        ],
        fsrs: {
          due: '2026-06-10T00:00:00.000Z',
          stability: 12,
          difficulty: 4,
          scheduled_days: 10,
          learning_steps: 0,
          reps: 8,
          lapses: 1,
          state: 2,
          last_review: '2026-06-14T10:00:00.000Z',
        },
      }),
    ]
    const week = buildLearningInsights(user, '7d', NOW)
    expect(week.activity.memoryReviewsInRange).toBe(1)
    expect(week.memory.reviewAccuracy.total).toBe(1)
    expect(week.memory.reviewAccuracy.rate).toBeNull()
    expect(week.activity.memoryReviewsIncompleteHistory).toBe(true)
    expect(week.memory.memorizedFlagCount).toBe(1)
    expect(week.memory.dueCount).toBeGreaterThanOrEqual(1)

    const all = buildLearningInsights(user, 'all', NOW)
    expect(all.activity.memoryReviewsInRange).toBe(2)
  })

  it('computes theology progress and hides weak/strong without enough samples', () => {
    const user = createInitialState('A', 'year')
    user.curriculum = {
      catalogVersion: 1,
      completedLessonIds: ['nature-of-man-composition'],
      lastLessonId: 'nature-of-man-composition',
      lessonScores: {
        'nature-of-man-composition': {
          correctMc: 2,
          totalMc: 3,
          completedAt: '2026-06-14T12:00:00.000Z',
        },
        'fake-strong': {
          correctMc: 9,
          totalMc: 10,
          completedAt: '2026-06-10T12:00:00.000Z',
        },
      },
    }
    const insights = buildLearningInsights(user, '30d', NOW)
    expect(insights.theology.lessonsCompleted).toBe(1)
    expect(insights.activity.lessonsCompletedInRange).toBe(2)
    expect(insights.theology.weakLessons).toHaveLength(0)
    expect(insights.theology.strongLessons.some((l) => l.id === 'fake-strong')).toBe(true)
    expect(insights.theology.quizAccuracy.rate).toBe(
      Math.round((11 / 13) * 100),
    )
    expect(insights.theology.suggestedNext).toBeTruthy()
  })

  it('reports language tracks and lifetime game aggregates without inventing categories', () => {
    const user = createInitialState('A', 'year')
    user.languages = {
      ...user.languages,
      greek: {
        ...user.languages.greek,
        completedLessonIds: ['greek-alphabet'],
        lessonScores: {
          'greek-alphabet': {
            correct: 4,
            total: 5,
            completedAt: '2026-06-12T00:00:00.000Z',
          },
        },
        vocabCards: [
          {
            id: 'g1',
            track: 'greek',
            vocabId: 'v1',
            introducedAt: '2026-06-01',
            lastReviewedAt: null,
            fsrs: {
              due: '2026-06-10T00:00:00.000Z',
              stability: 1,
              difficulty: 5,
              scheduled_days: 1,
              learning_steps: 0,
              reps: 0,
              lapses: 0,
              state: 0,
              last_review: null,
            },
          },
        ],
      },
    }
    user.gameStats = {
      completedGameIds: ['bible-trivia'],
      gamesPlayed: 4,
      perfectGames: 1,
      lastRewardDateByGame: { 'bible-trivia': '2026-06-14' },
    }
    const insights = buildLearningInsights(user, '30d', NOW)
    expect(insights.languages.greek.lessonsCompleted).toBe(1)
    expect(insights.languages.greek.vocabIntroduced).toBe(1)
    expect(insights.languages.greek.vocabDue).toBeGreaterThanOrEqual(1)
    expect(insights.languages.greek.quizAccuracy.rate).toBe(80)
    expect(insights.games.played).toBe(4)
    expect(insights.games.uniqueCompleted).toBe(1)
    expect(insights.games.notYetTried.length).toBeGreaterThan(0)
    expect(insights.games.disclaimer.toLowerCase()).toMatch(/per-question|category/)
    expect(insights.activity.readingSessionsInRange).toBe(0)
    expect(insights.activity.historySinceNote.toLowerCase()).toMatch(/history/)
  })

  it('prefers activity history for dated trends without inventing older days', () => {
    const user = createInitialState('A', 'year')
    const history = [
      {
        id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        type: 'reading_session' as const,
        payload: { bookId: 'john', chapter: 3, activityDayKey: 'read:john:3:2026-06-14' },
        clientCreatedAt: '2026-06-14T12:00:00.000Z',
      },
      {
        id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        type: 'bible_game' as const,
        payload: { gameId: 'bible-trivia', correct: 4, total: 5, difficulty: 'beginner' },
        clientCreatedAt: '2026-06-14T13:00:00.000Z',
      },
      {
        id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        type: 'curriculum_lesson' as const,
        payload: {
          lessonId: 'nature-of-man-composition',
          alreadyCompleted: true,
          correctMc: 3,
          totalMc: 4,
          firstCompletion: false,
        },
        clientCreatedAt: '2026-06-15T09:00:00.000Z',
      },
    ]
    const insights = buildLearningInsights(user, '7d', NOW, history)
    expect(insights.activity.usesActivityHistory).toBe(true)
    expect(insights.activity.readingSessionsInRange).toBe(1)
    expect(insights.activity.gamesPlayedInRange).toBe(1)
    expect(insights.activity.lessonsCompletedInRange).toBe(1)
    expect(insights.activity.readingByDay.some((d) => d.day === '2026-06-14' && d.count === 1)).toBe(
      true,
    )
  })

  it('stays consistent after local/cloud merge', () => {
    const local = createInitialState('L', 'year')
    local.xp = 40
    local.completedDays = [1, 2]
    local.memoryVerses = [
      verse({
        id: 'a',
        reference: 'Jn 3:16',
        reviewHistory: [
          {
            rating: 4,
            reviewedAt: '2026-06-13T00:00:00.000Z',
            stateBefore: 2,
            scheduledDays: 3,
            source: 'practice',
            appliedSchedule: true,
          },
        ],
      }),
    ]
    const cloud = createInitialState('C', 'year')
    cloud.xp = 10
    cloud.completedDays = [1]
    cloud.gameStats = {
      completedGameIds: ['who-said-it'],
      gamesPlayed: 2,
      perfectGames: 0,
      lastRewardDateByGame: {},
    }
    const merged = mergeUserStates(local, cloud)
    const insights = buildLearningInsights(merged, '30d', NOW)
    expect(insights.overall.lifetimeXp).toBe(40)
    expect(insights.overall.planCompletedDays).toBe(2)
    expect(insights.activity.memoryReviewsInRange).toBe(1)
    expect(insights.games.played).toBe(2)
  })
})
