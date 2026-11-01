/**
 * Learning Insights — read-only metrics from authoritative UserState.
 * Never awards XP/gems/achievements or mutates FSRS schedules.
 */
import { getPlanById } from '../data/bible'
import {
  curriculumTopicsById,
  isTopicFullyComplete,
  listCurriculumTopics,
  nextLessonId,
  orderedLessons,
  topicCompletion,
} from '../data/curriculum'
import { migrateCurriculumProgress } from '../data/curriculum/access'
import {
  getLanguageCourse,
  listLanguageCourses,
  migrateLanguageProgress,
  orderedLanguageLessons,
  trackProgressOf,
  type LanguageTrackId,
} from '../data/languages'
import { GAME_REGISTRY } from '../games/registry'
import {
  listActivityHistory,
  type ActivityHistoryRecord,
} from './activityHistory'
import { retrievabilityOf } from './fsrsEngine'
import { dueLanguageVocab } from './languageProgress'
import { memoryDashboardStats } from './memorySelect'
import type { MemoryReviewLogEntry, MemoryVerse, UserState } from './types'
import { levelFromXp, todayKey } from './types'

export type InsightsRange = '7d' | '30d' | 'all'

export const INSIGHTS_RANGES: { id: InsightsRange; label: string }[] = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: 'all', label: 'All time' },
]

/** Minimum attempts before showing an accuracy percentage. */
export const INSIGHTS_MIN_SAMPLE = 5

export type DayCount = { day: string; count: number }

export type SampledRate = {
  correct: number
  total: number
  /** null when total < INSIGHTS_MIN_SAMPLE — do not invent a percentage. */
  rate: number | null
}

export type LanguageTrackInsights = {
  track: LanguageTrackId
  lessonsCompleted: number
  lessonsTotal: number
  quizAccuracy: SampledRate
  vocabIntroduced: number
  vocabDue: number
  alphabetMastered: boolean
}

export type LearningInsights = {
  range: InsightsRange
  rangeStartDay: string | null
  rangeEndDay: string
  generatedAt: string
  overall: {
    lifetimeXp: number
    level: number
    streak: number
    longestStreak: number
    lastReadDate: string | null
    readToday: boolean
    planCompletedDays: number
    planTotalDays: number
    planPct: number
    todayXp: number
    dailyGoalXp: number
    weekXp: number
    createdAt: string
  }
  activity: {
    memoryReviewsInRange: number
    memoryReviewsIncompleteHistory: boolean
    lessonsCompletedInRange: number
    versesAddedInRange: number
    readingSessionsInRange: number
    readingDaysInRange: number
    gamesPlayedInRange: number | null
    reviewsByDay: DayCount[]
    lessonsByDay: DayCount[]
    readingByDay: DayCount[]
    gamesByDay: DayCount[]
    gamesPlayedLifetime: number
    gamesUniqueLifetime: number
    gamesPerfectLifetime: number
    gamesNote: string
    /** True when trends used activity history recorded since tracking began. */
    usesActivityHistory: boolean
    historySinceNote: string
  }
  memory: {
    totalVerses: number
    memorizedFlagCount: number
    learningCount: number
    dueCount: number
    upcoming7Days: number
    reviewedToday: number
    reviewsInRange: number
    reviewAccuracy: SampledRate
    againRate: SampledRate
    avgStabilityMemorized: number | null
    avgStabilityLearning: number | null
    avgRetrievabilityMemorized: number | null
    disclaimer: string
  }
  theology: {
    topicsStarted: number
    topicsCompleted: number
    lessonsCompleted: number
    lessonsTotal: number
    quizAccuracy: SampledRate
    weakLessons: { id: string; title: string; correct: number; total: number; rate: number }[]
    strongLessons: { id: string; title: string; correct: number; total: number; rate: number }[]
    suggestedNext: { lessonId: string; title: string; topicTitle: string } | null
    disclaimer: string
  }
  languages: {
    greek: LanguageTrackInsights
    hebrew: LanguageTrackInsights
    disclaimer: string
  }
  games: {
    played: number
    uniqueCompleted: number
    perfect: number
    notYetTried: { id: string; title: string }[]
    disclaimer: string
  }
  limitations: string[]
}

function dayKeyFromIso(iso: string): string | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return null
  return todayKey(new Date(t))
}

function addUtcDays(day: string, delta: number): string {
  const d = new Date(`${day}T00:00:00.000Z`)
  d.setUTCDate(d.getUTCDate() + delta)
  return todayKey(d)
}

export function rangeWindow(
  range: InsightsRange,
  now = new Date(),
): { startDay: string | null; endDay: string } {
  const endDay = todayKey(now)
  if (range === 'all') return { startDay: null, endDay }
  const days = range === '7d' ? 7 : 30
  return { startDay: addUtcDays(endDay, -(days - 1)), endDay }
}

export function inRangeDay(
  day: string | null,
  startDay: string | null,
  endDay: string,
): boolean {
  if (!day) return false
  if (startDay == null) return day <= endDay
  return day >= startDay && day <= endDay
}

export function sampledRate(correct: number, total: number): SampledRate {
  const c = Math.max(0, correct)
  const t = Math.max(0, total)
  return {
    correct: c,
    total: t,
    rate: t >= INSIGHTS_MIN_SAMPLE ? Math.round((c / t) * 100) : null,
  }
}

function bumpDay(map: Map<string, number>, day: string) {
  map.set(day, (map.get(day) ?? 0) + 1)
}

function mapToSeries(
  map: Map<string, number>,
  startDay: string | null,
  endDay: string,
): DayCount[] {
  if (startDay == null) {
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, count]) => ({ day, count }))
  }
  const out: DayCount[] = []
  let cur = startDay
  while (cur <= endDay) {
    out.push({ day: cur, count: map.get(cur) ?? 0 })
    cur = addUtcDays(cur, 1)
  }
  return out
}

function collectReviews(verses: MemoryVerse[]): {
  entries: { entry: MemoryReviewLogEntry; verse: MemoryVerse }[]
  truncated: boolean
} {
  const entries: { entry: MemoryReviewLogEntry; verse: MemoryVerse }[] = []
  let truncated = false
  for (const verse of verses) {
    const hist = verse.reviewHistory ?? []
    const lifetime = (verse.successfulReviews ?? 0) + (verse.failedReviews ?? 0)
    if (hist.length >= 40 || lifetime > hist.length) truncated = true
    for (const entry of hist) entries.push({ entry, verse })
  }
  return { entries, truncated }
}

function avg(nums: number[]): number | null {
  if (!nums.length) return null
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10
}

function languageTrackInsights(
  state: UserState,
  track: LanguageTrackId,
  now: Date,
): LanguageTrackInsights {
  const languages = migrateLanguageProgress(state.languages)
  const progress = trackProgressOf(languages, track)
  const course = getLanguageCourse(track)
  const lessonsTotal = course ? orderedLanguageLessons(course).length : 0
  let correct = 0
  let total = 0
  for (const score of Object.values(progress.lessonScores ?? {})) {
    correct += score.correct
    total += score.total
  }
  return {
    track,
    lessonsCompleted: progress.completedLessonIds.length,
    lessonsTotal,
    quizAccuracy: sampledRate(correct, total),
    vocabIntroduced: progress.vocabCards.length,
    vocabDue: dueLanguageVocab(state, track, now).length,
    alphabetMastered: progress.alphabetMastered === true,
  }
}

function suggestTheologyNext(
  curriculum: ReturnType<typeof migrateCurriculumProgress>,
): LearningInsights['theology']['suggestedNext'] {
  const topics = listCurriculumTopics()
  const byId = curriculumTopicsById()

  const topicUnlocked = (topic: (typeof topics)[0]) =>
    topic.prerequisites.length === 0 ||
    topic.prerequisites.every((pre) => {
      const preTopic = byId.get(pre)
      return preTopic ? isTopicFullyComplete(preTopic, curriculum.completedLessonIds) : false
    })

  // Prefer in-progress topics
  for (const topic of topics) {
    if (!topicUnlocked(topic)) continue
    const { done, total } = topicCompletion(topic, curriculum)
    if (done > 0 && done < total) {
      const next = nextLessonId(topic, curriculum)
      const lesson = next ? orderedLessons(topic).find((l) => l.id === next) : null
      if (next && lesson) {
        return { lessonId: next, title: lesson.title, topicTitle: topic.title }
      }
    }
  }
  // Else first unlocked incomplete
  for (const topic of topics) {
    if (!topicUnlocked(topic)) continue
    const next = nextLessonId(topic, curriculum)
    const lesson = next ? orderedLessons(topic).find((l) => l.id === next) : null
    if (next && lesson) {
      return { lessonId: next, title: lesson.title, topicTitle: topic.title }
    }
  }
  return null
}

function gradeToRating(grade: unknown): 1 | 2 | 3 | 4 | null {
  if (grade === 'again') return 1
  if (grade === 'hard') return 2
  if (grade === 'good') return 3
  if (grade === 'easy') return 4
  return null
}

/**
 * Pure snapshot + range rollups. Safe to call from UI; never mutates user state.
 * When `history` is omitted, loads the durable local activity cache (if any).
 */
export function buildLearningInsights(
  user: UserState,
  range: InsightsRange = '30d',
  now = new Date(),
  history?: ActivityHistoryRecord[] | null,
): LearningInsights {
  const { startDay, endDay } = rangeWindow(range, now)
  const plan = getPlanById(user.planId, user.customPlans)
  const planTotalDays = plan?.days ?? 0
  const planCompletedDays = user.completedDays?.length ?? 0
  const today = todayKey(now)
  const memStats = memoryDashboardStats(user, now)
  const { entries: allReviews, truncated } = collectReviews(user.memoryVerses ?? [])

  let historyRows: ActivityHistoryRecord[] = []
  try {
    historyRows =
      history ??
      listActivityHistory({
        sinceDay: startDay,
        untilDay: endDay,
      })
  } catch {
    historyRows = history ?? []
  }
  const historyInRange = historyRows.filter((r) =>
    inRangeDay(dayKeyFromIso(r.clientCreatedAt), startDay, endDay),
  )
  const usesActivityHistory = historyInRange.length > 0

  const reviewsInWindow = allReviews.filter((r) =>
    inRangeDay(dayKeyFromIso(r.entry.reviewedAt), startDay, endDay),
  )

  // Prefer durable activity history for review counts when present
  const historyReviews = historyInRange.filter((r) => r.type === 'memory_review')
  const reviewSource = historyReviews.length
    ? historyReviews.map((r) => ({
        rating: gradeToRating(r.payload.grade) ?? 3,
        applied: r.payload.applySchedule !== false,
        day: dayKeyFromIso(r.clientCreatedAt),
      }))
    : reviewsInWindow.map((r) => ({
        rating: r.entry.rating,
        applied: r.entry.appliedSchedule !== false,
        day: dayKeyFromIso(r.entry.reviewedAt),
      }))

  const scheduled = reviewSource.filter((r) => r.applied)
  const accuracyPool = scheduled.length ? scheduled : reviewSource
  const passed = accuracyPool.filter((r) => r.rating >= 3).length
  const again = accuracyPool.filter((r) => r.rating === 1).length

  const reviewDays = new Map<string, number>()
  for (const r of reviewSource) {
    if (r.day) bumpDay(reviewDays, r.day)
  }

  const curriculum = migrateCurriculumProgress(user.curriculum)
  const topics = listCurriculumTopics()
  const lessonDays = new Map<string, number>()
  const historyLessons = historyInRange.filter(
    (r) => r.type === 'curriculum_lesson' || r.type === 'language_lesson',
  )
  let lessonsInRange = 0
  if (historyLessons.length) {
    lessonsInRange = historyLessons.length
    for (const r of historyLessons) {
      const day = dayKeyFromIso(r.clientCreatedAt)
      if (day) bumpDay(lessonDays, day)
    }
  } else {
    for (const score of Object.values(curriculum.lessonScores ?? {})) {
      const day = dayKeyFromIso(score.completedAt)
      if (inRangeDay(day, startDay, endDay)) {
        lessonsInRange += 1
        if (day) bumpDay(lessonDays, day)
      }
    }
    const languages = migrateLanguageProgress(user.languages)
    for (const course of listLanguageCourses()) {
      const track = trackProgressOf(languages, course.id)
      for (const score of Object.values(track.lessonScores ?? {})) {
        const day = dayKeyFromIso(score.completedAt)
        if (inRangeDay(day, startDay, endDay)) {
          lessonsInRange += 1
          if (day) bumpDay(lessonDays, day)
        }
      }
    }
  }

  const readingEvents = historyInRange.filter((r) => r.type === 'reading_session')
  const readingDays = new Map<string, number>()
  for (const r of readingEvents) {
    const day = dayKeyFromIso(r.clientCreatedAt)
    if (day) bumpDay(readingDays, day)
  }

  const gameEvents = historyInRange.filter((r) => r.type === 'bible_game')
  const gamesByDayMap = new Map<string, number>()
  for (const r of gameEvents) {
    const day = dayKeyFromIso(r.clientCreatedAt)
    if (day) bumpDay(gamesByDayMap, day)
  }

  const versesAddedInRange = (user.memoryVerses ?? []).filter((v) =>
    inRangeDay(dayKeyFromIso(v.addedAt), startDay, endDay),
  ).length

  const memorized = (user.memoryVerses ?? []).filter((v) => v.status === 'memorized')
  const learning = (user.memoryVerses ?? []).filter((v) => v.status !== 'memorized')
  const stabMem = avg(memorized.map((v) => v.fsrs?.stability ?? 0).filter((n) => n > 0))
  const stabLearn = avg(learning.map((v) => v.fsrs?.stability ?? 0).filter((n) => n > 0))
  const retMem = avg(
    memorized.map((v) => retrievabilityOf(v.fsrs, now)).filter((n) => Number.isFinite(n)),
  )

  let theoCorrect = 0
  let theoTotal = 0
  const lessonScores: {
    id: string
    title: string
    correct: number
    total: number
    rate: number
  }[] = []
  for (const [lessonId, score] of Object.entries(curriculum.lessonScores ?? {})) {
    theoCorrect += score.correctMc
    theoTotal += score.totalMc
    let title = lessonId
    for (const t of topics) {
      const lesson = t.lessons.find((l) => l.id === lessonId)
      if (lesson) {
        title = lesson.title
        break
      }
    }
    if (score.totalMc >= INSIGHTS_MIN_SAMPLE) {
      lessonScores.push({
        id: lessonId,
        title,
        correct: score.correctMc,
        total: score.totalMc,
        rate: Math.round((score.correctMc / score.totalMc) * 100),
      })
    }
  }
  const weakLessons = [...lessonScores]
    .filter((l) => l.rate < 70)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 5)
  const strongLessons = [...lessonScores]
    .filter((l) => l.rate >= 85)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5)

  let topicsStarted = 0
  let topicsCompleted = 0
  let lessonsTotal = 0
  for (const topic of topics) {
    lessonsTotal += topic.lessons.length
    const { done } = topicCompletion(topic, curriculum)
    if (done > 0) topicsStarted += 1
    if (isTopicFullyComplete(topic, curriculum.completedLessonIds)) topicsCompleted += 1
  }

  const gamesPlayed = user.gameStats?.gamesPlayed ?? 0
  const unique = user.gameStats?.completedGameIds ?? []
  const notYetTried = GAME_REGISTRY.filter((g) => !unique.includes(g.meta.id)).map((g) => ({
    id: g.meta.id,
    title: g.meta.title,
  }))

  return {
    range,
    rangeStartDay: startDay,
    rangeEndDay: endDay,
    generatedAt: now.toISOString(),
    overall: {
      lifetimeXp: user.xp,
      level: levelFromXp(user.xp).level,
      streak: user.streak,
      longestStreak: user.longestStreak,
      lastReadDate: user.lastReadDate,
      readToday: user.lastReadDate === today,
      planCompletedDays,
      planTotalDays,
      planPct: planTotalDays ? Math.round((planCompletedDays / planTotalDays) * 100) : 0,
      todayXp: user.todayXpDate === today ? user.todayXp : 0,
      dailyGoalXp: user.dailyGoalXp,
      weekXp: user.weekXp ?? 0,
      createdAt: user.createdAt,
    },
    activity: {
      memoryReviewsInRange: reviewSource.length,
      memoryReviewsIncompleteHistory: truncated && !historyReviews.length,
      lessonsCompletedInRange: lessonsInRange,
      versesAddedInRange,
      readingSessionsInRange: readingEvents.length,
      readingDaysInRange: readingDays.size,
      gamesPlayedInRange: usesActivityHistory ? gameEvents.length : null,
      reviewsByDay: mapToSeries(reviewDays, startDay, endDay),
      lessonsByDay: mapToSeries(lessonDays, startDay, endDay),
      readingByDay: mapToSeries(readingDays, startDay, endDay),
      gamesByDay: mapToSeries(gamesByDayMap, startDay, endDay),
      gamesPlayedLifetime: gamesPlayed,
      gamesUniqueLifetime: unique.length,
      gamesPerfectLifetime: user.gameStats?.perfectGames ?? 0,
      gamesNote: usesActivityHistory
        ? 'Game sessions in range come from activity history since tracking began; lifetime totals remain separate.'
        : 'Game activity is lifetime only until new sessions are recorded in activity history.',
      usesActivityHistory,
      historySinceNote:
        'Dated trends marked from activity history begin when this tracking shipped — older aggregates are not invented.',
    },
    memory: {
      totalVerses: user.memoryVerses?.length ?? 0,
      memorizedFlagCount: memStats.memorizedCount,
      learningCount: learning.length,
      dueCount: memStats.dueCount,
      upcoming7Days: memStats.upcoming7Days,
      reviewedToday: memStats.reviewedToday,
      reviewsInRange: reviewSource.length,
      reviewAccuracy: sampledRate(passed, accuracyPool.length),
      againRate: sampledRate(again, accuracyPool.length),
      avgStabilityMemorized: stabMem,
      avgStabilityLearning: stabLearn,
      avgRetrievabilityMemorized: retMem == null ? null : Math.round(retMem * 100) / 100,
      disclaimer:
        '“Memorized” is a status flag — not a claim of permanent retention. Stability and retrievability come from FSRS.',
    },
    theology: {
      topicsStarted,
      topicsCompleted,
      lessonsCompleted: curriculum.completedLessonIds.length,
      lessonsTotal,
      quizAccuracy: sampledRate(theoCorrect, theoTotal),
      weakLessons,
      strongLessons,
      suggestedNext: suggestTheologyNext(curriculum),
      disclaimer:
        'Lesson completion records progress, not mastery. Quiz % uses best kept attempt per lesson.',
    },
    languages: {
      greek: languageTrackInsights(user, 'greek', now),
      hebrew: languageTrackInsights(user, 'hebrew', now),
      disclaimer:
        'Language lesson completion is not mastery. Vocab due counts use current FSRS schedules only.',
    },
    games: {
      played: gamesPlayed,
      uniqueCompleted: unique.length,
      perfect: user.gameStats?.perfectGames ?? 0,
      notYetTried,
      disclaimer:
        'Per-question and category performance are not stored — Insights cannot invent knowledge gaps from games.',
    },
    limitations: [
      'Activity history accumulates going forward; pre-existing days are not backfilled.',
      'Daily XP and “reviews today” counters still reset — use activity history for dated trends.',
      'Plan completedDays remain plan indices; reading_session events power the reading calendar.',
      'Per-verse FSRS reviewHistory is still capped at 40; the activity ledger is the durable log.',
      'UserState lessonScores still keep best scores; history now retains each curriculum/language attempt.',
      'Bible games do not store per-question answers — only session aggregates and difficulty.',
    ],
  }
}
