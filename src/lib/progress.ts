import type { TranslationId } from '../data/translations'
import { clearPassageCache } from './bibleApi'
import { enqueueProgressEvent } from './eventQueue'
import {
  dateKeyFromIso,
  gradeToRating,
  newFsrsSnapshot,
  reviewFsrsCard,
} from './fsrsEngine'
import {
  newProgressEventId,
  type ProgressEventType,
} from './progressEvents'
import { makeMemoryId as makeMemoryIdWithTranslation } from './memoryIds'
import { appendReviewHistory, migrateMemoryVerse } from './memoryMigrate'
import {
  buildMemoryQuestDeck as selectQuestDeck,
  cardIsDue,
  dueMemoryVerses as selectDue,
} from './memorySelect'
import { isTopicFullyComplete, migrateCurriculumProgress } from '../data/curriculum/access'
import { getCurriculumLesson, listCurriculumTopics } from '../data/curriculum'
import {
  getLanguageLesson,
  migrateLanguageProgress,
  trackProgressOf,
  type LanguageTrackId,
} from '../data/languages'
import { isLanguageScoreBetter, languageAchievementCandidates } from './languageProgress'
import { migrateCosmeticsState } from './cosmetics'
import { awardAchievementGems, awardGems } from './gems'
import { migrateNotificationPrefs } from './notifications'
import type {
  AchievementId,
  MemoryGrade,
  MemoryReviewSource,
  MemoryVerse,
  UserState,
} from './types'
import {
  ACHIEVEMENTS,
  CURRENT_MEMORY_TEXT_VERSION,
  XP,
  createInitialState,
  isMastered,
  levelFromXp,
  todayKey,
  weekKey,
  yesterdayKey,
} from './types'

export type { MemoryGrade }
export { makeMemoryIdWithTranslation as makeMemoryId }
export {
  cardIsDue,
  dueMemoryVerses,
  memoryDashboardStats,
  prioritizeForReview,
  selectQuizCard,
} from './memorySelect'

const STORAGE_KEY = 'abide-user-v1'

function queueClientEvent(
  type: ProgressEventType,
  payload: Record<string, unknown> = {},
): void {
  try {
    enqueueProgressEvent({
      id: newProgressEventId(),
      type,
      payload,
      clientCreatedAt: new Date().toISOString(),
    })
  } catch {
    // localStorage may be unavailable in tests / private mode
  }
}

/** Fill in fields added after a user's state was first saved (local or cloud). */
export function migrateUserState(
  raw: Partial<UserState> & { name: string; planId: string },
  now = new Date(),
): UserState {
  const base = createInitialState(raw.name, raw.planId)
  const memoryVerses = (raw.memoryVerses ?? []).map((v) => {
    const withTextVersion = {
      ...v,
      textVersion:
        v.textVersion ??
        (v.translationId && v.translationId !== 'esv'
          ? CURRENT_MEMORY_TEXT_VERSION
          : v.textVersion),
    }
    return migrateMemoryVerse(withTextVersion as Parameters<typeof migrateMemoryVerse>[0], now)
  })

  // Dedupe by id after translation-aware rewrite (keep farther-along card)
  const byId = new Map<string, MemoryVerse>()
  for (const v of memoryVerses) {
    const prev = byId.get(v.id)
    if (!prev) {
      byId.set(v.id, v)
      continue
    }
    const score = (x: MemoryVerse) =>
      (x.status === 'memorized' ? 1000 : 0) + x.fsrs.reps * 10 + x.fsrs.stability
    byId.set(v.id, score(v) >= score(prev) ? v : prev)
  }

  return {
    ...base,
    ...raw,
    translationId: raw.translationId ?? base.translationId,
    esvApiKey: raw.esvApiKey ?? '',
    memoryVerses: [...byId.values()],
    memoryReviewsToday: raw.memoryReviewsToday ?? 0,
    achievements: raw.achievements ?? [],
    completedDays: raw.completedDays ?? [],
    completedQuizzes: raw.completedQuizzes ?? [],
    customPlans: (raw.customPlans ?? []).map((p) => ({
      ...p,
      pace: p.pace ?? 'chapter',
      versesPerDay: p.versesPerDay,
    })),
    weekXp: raw.weekXp ?? 0,
    curriculum: migrateCurriculumProgress(
      (raw as Partial<UserState>).curriculum ?? undefined,
    ),
    languages: migrateLanguageProgress(
      (raw as Partial<UserState>).languages ?? undefined,
    ),
    notifications: migrateNotificationPrefs(
      (raw as Partial<UserState>).notifications ?? undefined,
    ),
    gems: Math.max(0, Math.floor(Number((raw as Partial<UserState>).gems) || 0)),
    todayGems: Math.max(0, Math.floor(Number((raw as Partial<UserState>).todayGems) || 0)),
    todayGemsDate: (raw as Partial<UserState>).todayGemsDate ?? todayKey(now),
    gemsEarnedTotal: Math.max(
      0,
      Math.floor(Number((raw as Partial<UserState>).gemsEarnedTotal) || 0),
    ),
    memoryQuestsCompleted: Math.max(
      0,
      Math.floor(Number((raw as Partial<UserState>).memoryQuestsCompleted) || 0),
    ),
    cosmetics: migrateCosmeticsState((raw as Partial<UserState>).cosmetics),
    gameStats: {
      completedGameIds: Array.isArray((raw as Partial<UserState>).gameStats?.completedGameIds)
        ? [
            ...new Set(
              ((raw as Partial<UserState>).gameStats?.completedGameIds ?? []).filter(
                (id): id is string => typeof id === 'string',
              ),
            ),
          ]
        : [],
      gamesPlayed: Math.max(
        0,
        Math.floor(Number((raw as Partial<UserState>).gameStats?.gamesPlayed) || 0),
      ),
      perfectGames: Math.max(
        0,
        Math.floor(Number((raw as Partial<UserState>).gameStats?.perfectGames) || 0),
      ),
      lastRewardDateByGame: {
        ...((raw as Partial<UserState>).gameStats?.lastRewardDateByGame ?? {}),
      },
    },
  }
}

export function loadState(): UserState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<UserState> & { name: string; planId: string }
    return normalizeDay(migrateUserState(parsed))
  } catch {
    return null
  }
}

export function saveState(state: UserState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY)
}

function normalizeDay(state: UserState): UserState {
  const today = todayKey()
  const wk = weekKey()
  let next = { ...state }

  if (next.todayXpDate !== today) {
    next = { ...next, todayXp: 0, todayXpDate: today, memoryReviewsToday: 0 }
  }
  if (next.todayGemsDate !== today) {
    next = { ...next, todayGems: 0, todayGemsDate: today }
  }
  if (next.weekKey !== wk) {
    next = { ...next, weekKey: wk, lessonsThisWeek: 0, weekXp: 0 }
  }

  if (
    next.lastReadDate &&
    next.lastReadDate !== today &&
    next.lastReadDate !== yesterdayKey() &&
    next.streak > 0
  ) {
    if (next.streakFreezes > 0) {
      next = {
        ...next,
        streakFreezes: next.streakFreezes - 1,
        lastReadDate: yesterdayKey(),
      }
    } else {
      next = { ...next, streak: 0 }
    }
  }

  return next
}

export function startJourney(name: string, planId: string): UserState {
  const state = createInitialState(name.trim() || 'Friend', planId)
  saveState(state)
  return state
}

export type LessonResult = {
  state: UserState
  earnedXp: number
  newAchievements: AchievementId[]
  leveledUp: boolean
  previousLevel: number
}

function unlock(
  state: UserState,
  ids: AchievementId[],
  planTotalDays: number,
): { state: UserState; newAchievements: AchievementId[] } {
  const newly: AchievementId[] = []
  const owned = new Set(state.achievements)

  const candidates: AchievementId[] = []
  if (state.completedDays.length >= 1) candidates.push('first_step')
  if (state.streak >= 3) candidates.push('streak_3')
  if (state.streak >= 7) candidates.push('streak_7')
  if (state.streak >= 14) candidates.push('streak_14')
  if (state.streak >= 30) candidates.push('streak_30')
  if (state.xp >= 500) candidates.push('xp_500')
  if (state.xp >= 2000) candidates.push('xp_2000')
  if (state.lessonsThisWeek >= 7) candidates.push('week_warrior')
  if (state.completedDays.length >= Math.ceil(planTotalDays / 2))
    candidates.push('halfway')
  if (state.completedDays.length >= planTotalDays) candidates.push('finisher')
  if (state.memoryReviewsToday >= 1 || state.memoryVerses.some((v) => v.repetitions > 0)) {
    candidates.push('memory_first')
  }
  if (state.memoryVerses.length >= 5) candidates.push('memory_5')
  if (state.memoryVerses.length >= 25) candidates.push('memory_25')
  if (state.memoryVerses.some(isMastered)) candidates.push('memory_master')
  if ((state.memoryQuestsCompleted ?? 0) >= 3) candidates.push('memory_quest_3')
  if ((state.curriculum?.completedLessonIds?.length ?? 0) >= 1) {
    candidates.push('curriculum_first')
  }
  // Any fully completed published topic unlocks curriculum_topic (Nature of Man still qualifies).
  if (
    listCurriculumTopics().some((topic) =>
      isTopicFullyComplete(topic, state.curriculum?.completedLessonIds ?? []),
    )
  ) {
    candidates.push('curriculum_topic')
  }
  candidates.push(...languageAchievementCandidates(state))
  if ((state.gemsEarnedTotal ?? 0) >= 100) candidates.push('gem_collector')
  if ((state.gameStats?.gamesPlayed ?? 0) >= 1) candidates.push('game_first')
  if ((state.gameStats?.completedGameIds?.length ?? 0) >= 3) candidates.push('game_trio')
  if ((state.gameStats?.perfectGames ?? 0) >= 1) candidates.push('game_perfect')
  candidates.push(...ids)

  for (const id of candidates) {
    if (!owned.has(id) && ACHIEVEMENTS.some((a) => a.id === id)) {
      owned.add(id)
      newly.push(id)
    }
  }

  let nextState: UserState = { ...state, achievements: [...owned] }
  if (newly.length) {
    nextState = awardAchievementGems(nextState, newly)
  }

  return {
    state: nextState,
    newAchievements: newly,
  }
}

function addXp(state: UserState, amount: number): UserState {
  const today = todayKey()
  const wk = weekKey()
  const sameWeek = state.weekKey === wk
  return {
    ...state,
    xp: state.xp + amount,
    todayXp: (state.todayXpDate === today ? state.todayXp : 0) + amount,
    todayXpDate: today,
    weekKey: wk,
    weekXp: (sameWeek ? state.weekXp : 0) + amount,
    lessonsThisWeek: sameWeek ? state.lessonsThisWeek : 0,
  }
}

export function updateSettings(
  state: UserState,
  patch: Partial<
    Pick<UserState, 'translationId' | 'esvApiKey' | 'planId' | 'dailyGoalXp' | 'notifications'>
  >,
): UserState {
  if (patch.translationId && patch.translationId !== state.translationId) {
    clearPassageCache()
  }
  const next = { ...state, ...patch }
  saveState(next)
  return next
}

export function completeLesson(
  state: UserState,
  day: number,
  opts: { reflection: boolean; planTotalDays: number },
): LessonResult {
  const today = todayKey()
  const hour = new Date().getHours()
  const already = state.completedDays.includes(day)

  let streak = state.streak
  let lastReadDate = state.lastReadDate
  let streakFreezes = state.streakFreezes

  if (!already) {
    if (lastReadDate === today) {
      // already read something today
    } else if (lastReadDate === yesterdayKey() || lastReadDate === null) {
      streak = lastReadDate === null ? 1 : streak + 1
    } else if (streakFreezes > 0) {
      streakFreezes -= 1
      streak = streak + 1
    } else {
      streak = 1
    }
    lastReadDate = today
  }

  let earned = already ? Math.floor(XP.lesson / 2) : XP.lesson
  if (opts.reflection) earned += XP.reflection
  if (streak >= 2) earned += XP.streakBonus
  if (opts.reflection && !already) earned += XP.perfectDay

  const prevLevel = levelFromXp(state.xp).level
  const completedDays = already
    ? state.completedDays
    : [...state.completedDays, day].sort((a, b) => a - b)

  let next: UserState = {
    ...addXp(state, earned),
    completedDays,
    streak,
    longestStreak: Math.max(state.longestStreak, streak),
    lastReadDate,
    streakFreezes,
    lessonsThisWeek: already ? state.lessonsThisWeek : state.lessonsThisWeek + 1,
  }

  if (!already && completedDays.length % 7 === 0) {
    next = { ...next, streakFreezes: Math.min(2, next.streakFreezes + 1) }
  }

  const bonusIds: AchievementId[] = []
  if (opts.reflection && !already) bonusIds.push('perfect_day')
  if (hour < 8) bonusIds.push('early_bird')
  if (hour >= 21) bonusIds.push('night_owl')

  const unlocked = unlock(next, bonusIds, opts.planTotalDays)
  next = unlocked.state

  if (!already) {
    const gem = awardGems(next, 'gem_lesson', `lesson:${day}`, {
      day,
      alreadyCompleted: false,
    })
    next = gem.state
    if (next.todayXp >= next.dailyGoalXp && (state.todayXp < state.dailyGoalXp || state.todayXpDate !== today)) {
      const goal = awardGems(next, 'gem_daily_goal', `daily-goal:${today}`, {})
      next = goal.state
    }
  }

  saveState(next)

  queueClientEvent('lesson_complete', {
    day,
    alreadyCompleted: already,
    reflection: opts.reflection,
    streakBonus: streak >= 2,
    perfectDay: opts.reflection && !already,
  })

  return {
    state: next,
    earnedXp: earned,
    newAchievements: unlocked.newAchievements,
    leveledUp: levelFromXp(next.xp).level > prevLevel,
    previousLevel: prevLevel,
  }
}

function syncDerived(verse: MemoryVerse): MemoryVerse {
  return {
    ...verse,
    nextReview: dateKeyFromIso(verse.fsrs.due),
    intervalDays: Math.max(0, Math.round(verse.fsrs.scheduled_days)),
    repetitions: verse.fsrs.reps,
    lapses: verse.fsrs.lapses,
    scheduler: 'fsrs-6',
  }
}

function createMemoryCard(
  input: {
    reference: string
    text: string
    bookName: string
    bookId: string
    chapter: number
    verseStart: number
    verseEnd: number
    translationId: TranslationId
    topic?: string
    seriesId?: string
    seriesName?: string
    id?: string
    status?: MemoryVerse['status']
  },
  now = new Date(),
): MemoryVerse {
  const id =
    input.id ??
    makeMemoryIdWithTranslation(
      input.bookId,
      input.chapter,
      input.verseStart,
      input.verseEnd,
      input.translationId,
    )
  const fsrs = newFsrsSnapshot(now)
  return syncDerived({
    id,
    reference: input.reference,
    text: input.text,
    textVersion: CURRENT_MEMORY_TEXT_VERSION,
    bookName: input.bookName,
    bookId: input.bookId,
    chapter: input.chapter,
    verseStart: input.verseStart,
    verseEnd: input.verseEnd,
    translationId: input.translationId,
    translationConfident: true,
    addedAt: todayKey(now),
    nextReview: dateKeyFromIso(fsrs.due),
    intervalDays: 0,
    ease: 2.5,
    repetitions: 0,
    lapses: 0,
    status: input.status ?? 'learning',
    topic: input.topic,
    seriesId: input.seriesId,
    seriesName: input.seriesName,
    fsrs,
    reviewHistory: [],
    successfulReviews: 0,
    failedReviews: 0,
    scheduler: 'fsrs-6',
  })
}

function applyMemoryReview(
  verse: MemoryVerse,
  grade: MemoryGrade,
  opts: {
    now: Date
    applySchedule: boolean
    source: MemoryReviewSource
    today: string
  },
): { verse: MemoryVerse; appliedSchedule: boolean; duplicate: boolean } {
  const rating = gradeToRating(grade) as 1 | 2 | 3 | 4

  if (opts.applySchedule && verse.scheduledReviewDate === opts.today && verse.fsrs.last_review) {
    return {
      verse: syncDerived({
        ...verse,
        reviewHistory: appendReviewHistory(verse.reviewHistory, {
          rating,
          reviewedAt: opts.now.toISOString(),
          stateBefore: verse.fsrs.state,
          scheduledDays: verse.fsrs.scheduled_days,
          source: opts.source,
          appliedSchedule: false,
        }),
      }),
      appliedSchedule: false,
      duplicate: true,
    }
  }

  if (!opts.applySchedule) {
    return {
      verse: syncDerived({
        ...verse,
        reviewHistory: appendReviewHistory(verse.reviewHistory, {
          rating,
          reviewedAt: opts.now.toISOString(),
          stateBefore: verse.fsrs.state,
          scheduledDays: verse.fsrs.scheduled_days,
          source: opts.source,
          appliedSchedule: false,
        }),
      }),
      appliedSchedule: false,
      duplicate: false,
    }
  }

  const stateBefore = verse.fsrs.state
  const { card } = reviewFsrsCard(verse.fsrs, grade, opts.now)
  let status = verse.status
  if (status !== 'memorized' && card.state === 2 && card.stability >= 21 && card.reps >= 4) {
    status = 'memorized'
  }

  return {
    verse: syncDerived({
      ...verse,
      status,
      fsrs: card,
      successfulReviews:
        grade === 'again' ? verse.successfulReviews : verse.successfulReviews + 1,
      failedReviews: grade === 'again' ? verse.failedReviews + 1 : verse.failedReviews,
      scheduledReviewDate: opts.today,
      reviewHistory: appendReviewHistory(verse.reviewHistory, {
        rating,
        reviewedAt: opts.now.toISOString(),
        stateBefore,
        scheduledDays: card.scheduled_days,
        source: opts.source,
        appliedSchedule: true,
      }),
    }),
    appliedSchedule: true,
    duplicate: false,
  }
}

export function addMemoryVerse(
  state: UserState,
  verse: {
    reference: string
    text: string
    bookName: string
    bookId: string
    chapter: number
    verseStart: number
    verseEnd: number
    translationId: TranslationId
    topic?: string
    seriesId?: string
    seriesName?: string
    id?: string
    status?: MemoryVerse['status']
  },
  now = new Date(),
): { state: UserState; added: boolean } {
  const id =
    verse.id ??
    makeMemoryIdWithTranslation(
      verse.bookId,
      verse.chapter,
      verse.verseStart,
      verse.verseEnd,
      verse.translationId,
    )
  if (
    state.memoryVerses.some(
      (v) =>
        v.id === id ||
        (v.bookId === verse.bookId &&
          v.chapter === verse.chapter &&
          v.verseStart === verse.verseStart &&
          v.verseEnd === verse.verseEnd &&
          v.translationId === verse.translationId),
    )
  ) {
    return { state, added: false }
  }

  const entry = createMemoryCard({ ...verse, id }, now)
  let next: UserState = {
    ...state,
    memoryVerses: [...state.memoryVerses, entry],
  }
  const unlocked = unlock(next, [], 1)
  next = unlocked.state
  saveState(next)
  return { state: next, added: true }
}

export function removeMemoryVerse(state: UserState, id: string): UserState {
  const next = {
    ...state,
    memoryVerses: state.memoryVerses.filter((v) => v.id !== id),
  }
  saveState(next)
  return next
}

export function markMemorized(
  state: UserState,
  verseId: string,
  now = new Date(),
): UserState {
  const today = todayKey(now)
  const memoryVerses = state.memoryVerses.map((v) => {
    if (v.id !== verseId) return v
    if (v.fsrs.reps === 0) {
      const graded = applyMemoryReview(v, 'easy', {
        now,
        applySchedule: true,
        source: 'mark',
        today,
      })
      return { ...graded.verse, status: 'memorized' as const }
    }
    return syncDerived({ ...v, status: 'memorized' })
  })
  let next: UserState = { ...state, memoryVerses }
  const unlocked = unlock(next, ['memory_master'], 1)
  next = unlocked.state
  saveState(next)
  return next
}

export function memorizedVerses(state: UserState): MemoryVerse[] {
  return state.memoryVerses.filter((v) => v.status === 'memorized')
}

export function completeSectionQuiz(
  state: UserState,
  day: number,
  quizId: string,
  opts: { planTotalDays: number; correctMc: number; totalMc: number },
): LessonResult {
  const already = state.completedDays.includes(day)
  const prevLevel = levelFromXp(state.xp).level
  let earned = already ? 5 : XP.sectionQuiz
  if (opts.totalMc > 0) {
    earned += Math.round((opts.correctMc / opts.totalMc) * 15)
  }

  const today = todayKey()
  let streak = state.streak
  let lastReadDate = state.lastReadDate
  let streakFreezes = state.streakFreezes

  if (!already) {
    if (lastReadDate === today) {
      // same day
    } else if (lastReadDate === yesterdayKey() || lastReadDate === null) {
      streak = lastReadDate === null ? 1 : streak + 1
    } else if (streakFreezes > 0) {
      streakFreezes -= 1
      streak += 1
    } else {
      streak = 1
    }
    lastReadDate = today
  }

  const completedDays = already
    ? state.completedDays
    : [...state.completedDays, day].sort((a, b) => a - b)
  const completedQuizzes = state.completedQuizzes.includes(quizId)
    ? state.completedQuizzes
    : [...state.completedQuizzes, quizId]

  let next: UserState = {
    ...addXp(
      {
        ...state,
        streak,
        longestStreak: Math.max(state.longestStreak, streak),
        lastReadDate,
        streakFreezes,
        completedDays,
        completedQuizzes,
        lessonsThisWeek: already ? state.lessonsThisWeek : state.lessonsThisWeek + 1,
      },
      earned,
    ),
  }

  const unlocked = unlock(next, [], opts.planTotalDays)
  next = unlocked.state

  if (!already) {
    const gem = awardGems(next, 'gem_section_quiz', `quiz:${quizId}`, {
      quizId,
      alreadyCompleted: false,
    })
    next = gem.state
  }

  saveState(next)

  queueClientEvent('section_quiz', {
    day,
    quizId,
    alreadyCompleted: already,
    correctMc: opts.correctMc,
    totalMc: opts.totalMc,
  })

  return {
    state: next,
    earnedXp: earned,
    newAchievements: unlocked.newAchievements,
    leveledUp: levelFromXp(next.xp).level > prevLevel,
    previousLevel: prevLevel,
  }
}

/** Prefer a higher accuracy score; tie-break on more correct answers. */
export function isCurriculumScoreBetter(
  candidate: { correctMc: number; totalMc: number },
  previous: { correctMc: number; totalMc: number },
): boolean {
  const cTotal = Math.max(0, candidate.totalMc)
  const pTotal = Math.max(0, previous.totalMc)
  const cRatio = cTotal > 0 ? candidate.correctMc / cTotal : 0
  const pRatio = pTotal > 0 ? previous.correctMc / pTotal : 0
  if (cRatio !== pRatio) return cRatio > pRatio
  return candidate.correctMc > previous.correctMc
}

/**
 * Complete a theology curriculum lesson after quiz + reflection.
 * Opening or browsing alone does not award XP. Replays award 0 XP.
 * Does not touch completedDays or memory FSRS scheduling.
 */
export function completeCurriculumLesson(
  state: UserState,
  opts: {
    topicId: string
    lessonId: string
    correctMc: number
    totalMc: number
    reflectionDone: boolean
  },
): LessonResult {
  const empty = (): LessonResult => ({
    state,
    earnedXp: 0,
    newAchievements: [],
    leveledUp: false,
    previousLevel: levelFromXp(state.xp).level,
  })

  if (!opts.reflectionDone) return empty()
  if (opts.totalMc < 1) return empty()

  const catalog = getCurriculumLesson(opts.lessonId)
  if (!catalog || catalog.topic.id !== opts.topicId) {
    return empty()
  }

  const curriculum = migrateCurriculumProgress(state.curriculum)
  const already = curriculum.completedLessonIds.includes(opts.lessonId)
  const prevLevel = levelFromXp(state.xp).level

  let earned = 0
  if (!already) {
    earned = XP.curriculumLesson + XP.curriculumReflection
    if (opts.totalMc > 0) {
      earned += Math.round(
        (Math.min(opts.correctMc, opts.totalMc) / opts.totalMc) * XP.curriculumQuizBonus,
      )
    }
    earned = Math.min(earned, 40)
  }

  const completedAt = new Date().toISOString()
  const completedLessonIds = already
    ? curriculum.completedLessonIds
    : [...curriculum.completedLessonIds, opts.lessonId]

  const incomingScore = {
    correctMc: opts.correctMc,
    totalMc: opts.totalMc,
    completedAt,
  }
  const previousScore = curriculum.lessonScores[opts.lessonId]
  const keepPrevious =
    already &&
    previousScore &&
    !isCurriculumScoreBetter(incomingScore, previousScore)

  const nextCurriculum = {
    ...curriculum,
    completedLessonIds,
    lastLessonId: opts.lessonId,
    lessonScores: {
      ...curriculum.lessonScores,
      [opts.lessonId]: keepPrevious ? previousScore : incomingScore,
    },
  }

  let next: UserState = {
    ...(earned ? addXp(state, earned) : state),
    curriculum: nextCurriculum,
  }
  // Curriculum completion counts toward weekly activity without Path day coupling
  if (!already) {
    next = {
      ...next,
      lessonsThisWeek: next.lessonsThisWeek + 1,
    }
  }

  const unlocked = unlock(next, [], 0)
  next = unlocked.state

  if (!already) {
    const gem = awardGems(next, 'gem_curriculum', `curriculum:${opts.lessonId}`, {
      lessonId: opts.lessonId,
      topicId: opts.topicId,
      alreadyCompleted: false,
      reflection: true,
    })
    next = gem.state
  }

  saveState(next)

  if (!already) {
    queueClientEvent('curriculum_lesson', {
      topicId: opts.topicId,
      lessonId: opts.lessonId,
      alreadyCompleted: false,
      reflection: true,
      correctMc: opts.correctMc,
      totalMc: opts.totalMc,
    })
  }

  return {
    state: next,
    earnedXp: earned,
    newAchievements: unlocked.newAchievements,
    leveledUp: levelFromXp(next.xp).level > prevLevel,
    previousLevel: prevLevel,
  }
}

/** Mark a curriculum lesson as the resume point without awarding XP. */
export function touchCurriculumLesson(state: UserState, lessonId: string): UserState {
  const curriculum = migrateCurriculumProgress(state.curriculum)
  if (curriculum.lastLessonId === lessonId && state.curriculum) return state
  const next = {
    ...state,
    curriculum: { ...curriculum, lastLessonId: lessonId },
  }
  saveState(next)
  return next
}

function setLanguageTrack(
  state: UserState,
  track: LanguageTrackId,
  nextTrack: ReturnType<typeof trackProgressOf>,
): UserState {
  const languages = migrateLanguageProgress(state.languages)
  return {
    ...state,
    languages: {
      ...languages,
      [track]: nextTrack,
    },
  }
}

export function touchLanguageLesson(
  state: UserState,
  track: LanguageTrackId,
  lessonId: string,
): UserState {
  const languages = migrateLanguageProgress(state.languages)
  const cur = trackProgressOf(languages, track)
  if (cur.lastLessonId === lessonId) return state
  const next = setLanguageTrack(state, track, { ...cur, lastLessonId: lessonId })
  saveState(next)
  return next
}

/**
 * Complete a Biblical Greek/Hebrew lesson after exercises + reflection.
 * Introduces vocab into that track's FSRS deck — never touches memoryVerses.
 */
export function completeLanguageLesson(
  state: UserState,
  opts: {
    track: LanguageTrackId
    lessonId: string
    correct: number
    total: number
    reflectionDone: boolean
  },
): LessonResult {
  const empty = (): LessonResult => ({
    state,
    earnedXp: 0,
    newAchievements: [],
    leveledUp: false,
    previousLevel: levelFromXp(state.xp).level,
  })

  if (!opts.reflectionDone || opts.total < 1) return empty()

  const found = getLanguageLesson(opts.lessonId)
  if (!found || found.course.id !== opts.track) return empty()

  const languages = migrateLanguageProgress(state.languages)
  const track = trackProgressOf(languages, opts.track)
  const already = track.completedLessonIds.includes(opts.lessonId)
  const prevLevel = levelFromXp(state.xp).level

  let earned = 0
  if (!already) {
    earned =
      XP.languageLesson +
      Math.round((Math.min(opts.correct, opts.total) / opts.total) * XP.languageLessonQuizBonus)
    earned = Math.min(earned, 30)
  }

  const completedAt = new Date().toISOString()
  const incoming = { correct: opts.correct, total: opts.total, completedAt }
  const previous = track.lessonScores[opts.lessonId]
  const keepPrevious = already && previous && !isLanguageScoreBetter(incoming, previous)

  const now = new Date()
  let vocabCards = [...track.vocabCards]
  for (const vocabId of found.lesson.introduceVocabIds ?? []) {
    if (vocabCards.some((c) => c.vocabId === vocabId)) continue
    if (!found.course.vocabulary.some((v) => v.id === vocabId)) continue
    vocabCards.push({
      id: `${opts.track}:${vocabId}`,
      track: opts.track,
      vocabId,
      fsrs: newFsrsSnapshot(now),
      introducedAt: completedAt,
      lastReviewedAt: null,
    })
  }

  const nextTrack = {
    ...track,
    completedLessonIds: already
      ? track.completedLessonIds
      : [...track.completedLessonIds, opts.lessonId],
    lastLessonId: opts.lessonId,
    lessonScores: {
      ...track.lessonScores,
      [opts.lessonId]: keepPrevious ? previous! : incoming,
    },
    vocabCards,
    alphabetMastered:
      track.alphabetMastered ||
      opts.lessonId === 'greek-alphabet' ||
      opts.lessonId === 'hebrew-consonants',
  }

  let next: UserState = setLanguageTrack(
    earned ? addXp(state, earned) : state,
    opts.track,
    nextTrack,
  )
  if (!already) {
    next = { ...next, lessonsThisWeek: next.lessonsThisWeek + 1 }
  }

  const unlocked = unlock(next, [], 0)
  next = unlocked.state

  if (!already) {
    const gem = awardGems(next, 'gem_language_lesson', `lang:${opts.track}:${opts.lessonId}`, {
      track: opts.track,
      lessonId: opts.lessonId,
      alreadyCompleted: false,
      reflection: true,
    })
    next = gem.state
  }

  saveState(next)

  if (!already) {
    queueClientEvent('language_lesson', {
      track: opts.track,
      lessonId: opts.lessonId,
      alreadyCompleted: false,
      reflection: true,
      correct: opts.correct,
      total: opts.total,
    })
  }

  return {
    state: next,
    earnedXp: earned,
    newAchievements: unlocked.newAchievements,
    leveledUp: levelFromXp(next.xp).level > prevLevel,
    previousLevel: prevLevel,
  }
}

/** FSRS review for language vocab — separate decks from Scripture memory. */
export function reviewLanguageVocab(
  state: UserState,
  opts: {
    track: LanguageTrackId
    cardId: string
    grade: MemoryGrade
  },
): LessonResult {
  const languages = migrateLanguageProgress(state.languages)
  const track = trackProgressOf(languages, opts.track)
  const idx = track.vocabCards.findIndex((c) => c.id === opts.cardId)
  const prevLevel = levelFromXp(state.xp).level
  if (idx < 0) {
    return {
      state,
      earnedXp: 0,
      newAchievements: [],
      leveledUp: false,
      previousLevel: prevLevel,
    }
  }

  const now = new Date()
  const card = track.vocabCards[idx]
  const { card: fsrs } = reviewFsrsCard(card.fsrs, opts.grade, now)
  const vocabCards = [...track.vocabCards]
  vocabCards[idx] = { ...card, fsrs, lastReviewedAt: now.toISOString() }

  const earned = opts.grade === 'again' ? 0 : XP.languageVocabReview
  let next = setLanguageTrack(earned ? addXp(state, earned) : state, opts.track, {
    ...track,
    vocabCards,
  })
  const unlocked = unlock(next, [], 0)
  next = unlocked.state

  if (earned > 0) {
    const day = now.toISOString().slice(0, 10)
    const gem = awardGems(next, 'gem_language_vocab', `langvocab:${opts.cardId}:${day}`, {
      track: opts.track,
      cardId: opts.cardId,
      grade: opts.grade,
      applySchedule: true,
    })
    next = gem.state
  }

  saveState(next)
  queueClientEvent('language_vocab_review', {
    track: opts.track,
    cardId: opts.cardId,
    grade: opts.grade,
    applySchedule: true,
  })

  return {
    state: next,
    earnedXp: earned,
    newAchievements: unlocked.newAchievements,
    leveledUp: levelFromXp(next.xp).level > prevLevel,
    previousLevel: prevLevel,
  }
}

function bumpStreakForMemoryActivity(state: UserState, now: Date): UserState {
  const today = todayKey(now)
  let streak = state.streak
  let streakFreezes = state.streakFreezes
  let lastReadDate = state.lastReadDate
  if (lastReadDate === today) return state
  if (lastReadDate === yesterdayKey(now) || lastReadDate === null) {
    streak = lastReadDate === null ? 1 : streak + 1
  } else if (streakFreezes > 0) {
    streakFreezes -= 1
    streak += 1
  } else {
    streak = 1
  }
  return {
    ...state,
    streak,
    longestStreak: Math.max(state.longestStreak, streak),
    lastReadDate: today,
    streakFreezes,
  }
}

/**
 * Local memory quiz — updates FSRS for the answered card.
 * Prefer this over challenge scoring when the activity is first-party.
 */
export function scoreMemoryQuiz(
  state: UserState,
  correct: boolean,
  opts?: { verseId?: string; now?: Date; updateSchedule?: boolean },
): LessonResult {
  const now = opts?.now ?? new Date()
  const prevLevel = levelFromXp(state.xp).level
  const updateSchedule = opts?.updateSchedule !== false && Boolean(opts?.verseId)
  const earned = correct ? XP.memoryQuiz : XP.memoryQuizWrong

  let next = bumpStreakForMemoryActivity(addXp(state, earned), now)

  if (updateSchedule && opts?.verseId) {
    const verse = next.memoryVerses.find((v) => v.id === opts.verseId)
    if (verse) {
      const applied = applyMemoryReview(verse, correct ? 'good' : 'again', {
        now,
        applySchedule: true,
        source: 'quiz',
        today: todayKey(now),
      })
      next = {
        ...next,
        memoryVerses: next.memoryVerses.map((v) =>
          v.id === opts.verseId ? applied.verse : v,
        ),
      }
    }
  }

  next = {
    ...next,
    memoryReviewsToday: next.memoryReviewsToday + 1,
  }

  const unlocked = unlock(next, correct ? ['memory_first'] : [], 1)
  next = unlocked.state
  saveState(next)

  if (opts?.updateSchedule !== false) {
    queueClientEvent('memory_quiz', { correct, verseId: opts?.verseId })
  }

  return {
    state: next,
    earnedXp: earned,
    newAchievements: unlocked.newAchievements,
    leveledUp: levelFromXp(next.xp).level > prevLevel,
    previousLevel: prevLevel,
  }
}

/** Circle challenges: local XP only — server grades + awards via challenge submit. */
export function scoreMemoryQuizChallenge(
  state: UserState,
  correct: boolean,
  now = new Date(),
): LessonResult {
  return scoreMemoryQuiz(state, correct, { now, updateSchedule: false })
}

export function buildMemoryQuestDeck(state: UserState, count = 5, now = new Date()): MemoryVerse[] {
  return selectQuestDeck(state, count, now)
}

export function completeMemoryQuest(
  state: UserState,
  opts: {
    rounds: { verseId: string; correct: boolean }[]
    now?: Date
  },
): LessonResult {
  const now = opts.now ?? new Date()
  const today = todayKey(now)
  const prevLevel = levelFromXp(state.xp).level
  let next = { ...state }
  let earned = 0
  const scheduledIds = new Set<string>()

  for (const round of opts.rounds) {
    const verse = next.memoryVerses.find((v) => v.id === round.verseId)
    if (!verse) continue
    const applySchedule = !scheduledIds.has(round.verseId)
    if (applySchedule) scheduledIds.add(round.verseId)
    const applied = applyMemoryReview(verse, round.correct ? 'good' : 'again', {
      now,
      applySchedule,
      source: 'quest',
      today,
    })
    const xpGain =
      round.correct && applied.appliedSchedule && !applied.duplicate
        ? XP.memoryQuestCorrect
        : 0
    earned += xpGain
    next = {
      ...addXp(next, xpGain),
      memoryVerses: next.memoryVerses.map((v) =>
        v.id === round.verseId ? applied.verse : v,
      ),
      memoryReviewsToday: next.memoryReviewsToday + (applied.duplicate ? 0 : 1),
    }
  }

  if (opts.rounds.length > 0) {
    earned += XP.memoryQuest
    next = bumpStreakForMemoryActivity(addXp(next, XP.memoryQuest), now)
  }

  const bonus: AchievementId[] = []
  if (opts.rounds.some((r) => r.correct)) bonus.push('memory_first')
  if (next.memoryVerses.some(isMastered)) bonus.push('memory_master')
  if (next.streak >= 3) bonus.push('streak_3')
  if (next.streak >= 7) bonus.push('streak_7')

  next = {
    ...next,
    memoryQuestsCompleted: (next.memoryQuestsCompleted ?? 0) + (opts.rounds.length > 0 ? 1 : 0),
  }

  const unlocked = unlock(next, bonus, 1)
  next = unlocked.state

  if (opts.rounds.length > 0) {
    const gem = awardGems(next, 'gem_memory_quest', `quest:${today}`, {
      finished: true,
    })
    next = gem.state
  }

  saveState(next)

  const correctCount = opts.rounds.filter((r) => r.correct).length
  queueClientEvent('memory_quest', {
    correctCount: Math.min(correctCount, scheduledIds.size),
    finished: opts.rounds.length > 0,
    roundCount: opts.rounds.length,
  })

  return {
    state: next,
    earnedXp: earned,
    newAchievements: unlocked.newAchievements,
    leveledUp: levelFromXp(next.xp).level > prevLevel,
    previousLevel: prevLevel,
  }
}

export function reviewMemoryVerse(
  state: UserState,
  verseId: string,
  grade: MemoryGrade,
  opts?: {
    now?: Date
    applySchedule?: boolean
    source?: MemoryReviewSource
  },
): LessonResult {
  const now = opts?.now ?? new Date()
  const today = todayKey(now)
  const prevLevel = levelFromXp(state.xp).level
  const verse = state.memoryVerses.find((v) => v.id === verseId)
  if (!verse) {
    return {
      state,
      earnedXp: 0,
      newAchievements: [],
      leveledUp: false,
      previousLevel: prevLevel,
    }
  }

  const applySchedule = opts?.applySchedule ?? cardIsDue(verse, now)
  const source = opts?.source ?? 'practice'
  const applied = applyMemoryReview(verse, grade, {
    now,
    applySchedule,
    source,
    today,
  })

  const xpMap = {
    again: 0,
    hard: XP.memoryHard,
    good: XP.memoryGood,
    easy: XP.memoryEasy,
  } as const

  let earned = 0
  if (!applied.duplicate) {
    earned = applied.appliedSchedule ? xpMap[grade] : XP.memoryExtraPractice
  }

  let next: UserState = {
    ...addXp(state, earned),
    memoryVerses: state.memoryVerses.map((v) => (v.id === verseId ? applied.verse : v)),
    memoryReviewsToday: state.memoryReviewsToday + (applied.duplicate ? 0 : 1),
  }

  const bonus: AchievementId[] = []
  if (next.memoryReviewsToday === 1) bonus.push('memory_first')
  if (next.memoryVerses.some(isMastered)) bonus.push('memory_master')

  const unlocked = unlock(next, bonus, 1)
  next = unlocked.state

  if (applied.appliedSchedule && !applied.duplicate && grade !== 'again') {
    const gem = awardGems(next, 'gem_memory_review', `review:${verseId}:${today}`, {
      verseId,
      grade,
      applySchedule: true,
    })
    next = gem.state
  }

  saveState(next)

  queueClientEvent('memory_review', {
    verseId,
    grade,
    applySchedule: applied.appliedSchedule && !applied.duplicate,
    source,
  })

  return {
    state: next,
    earnedXp: earned,
    newAchievements: unlocked.newAchievements,
    leveledUp: levelFromXp(next.xp).level > prevLevel,
    previousLevel: prevLevel,
  }
}

/**
 * Complete a Bible Game Center session.
 * Rewards once per gameId per calendar day; replays still update stats but award 0.
 * Does not touch FSRS scheduling.
 */
export function completeBibleGame(
  state: UserState,
  opts: {
    gameId: string
    difficulty: string
    correct: number
    total: number
    sessionKey: string
  },
): LessonResult & { gemsAwarded: number; rewarded: boolean } {
  const today = todayKey()
  const prevLevel = levelFromXp(state.xp).level
  const stats = state.gameStats ?? {
    completedGameIds: [],
    gamesPlayed: 0,
    perfectGames: 0,
    lastRewardDateByGame: {},
  }
  const alreadyRewarded = stats.lastRewardDateByGame[opts.gameId] === today
  const total = Math.max(1, opts.total)
  const correct = Math.max(0, Math.min(total, opts.correct))
  const perfect = correct === total

  let earned = 0
  if (!alreadyRewarded) {
    earned = XP.bibleGame + Math.round((correct / total) * XP.bibleGameAccuracy)
    earned = Math.min(earned, 20)
  }

  let next: UserState = {
    ...(earned ? addXp(state, earned) : state),
    gameStats: {
      completedGameIds: stats.completedGameIds.includes(opts.gameId)
        ? stats.completedGameIds
        : [...stats.completedGameIds, opts.gameId],
      gamesPlayed: stats.gamesPlayed + 1,
      perfectGames: stats.perfectGames + (perfect ? 1 : 0),
      lastRewardDateByGame: alreadyRewarded
        ? stats.lastRewardDateByGame
        : { ...stats.lastRewardDateByGame, [opts.gameId]: today },
    },
  }

  let gemsAwarded = 0
  if (!alreadyRewarded) {
    const gem = awardGems(next, 'gem_bible_game', `game:${opts.gameId}:${today}`, {
      gameId: opts.gameId,
      alreadyRewarded: false,
      sessionKey: opts.sessionKey,
    })
    next = gem.state
    gemsAwarded = gem.awarded
  }

  const unlocked = unlock(next, [], 1)
  next = unlocked.state
  saveState(next)

  queueClientEvent('bible_game', {
    gameId: opts.gameId,
    difficulty: opts.difficulty,
    correct,
    total,
    sessionKey: opts.sessionKey,
    alreadyRewarded,
  })

  return {
    state: next,
    earnedXp: earned,
    gemsAwarded,
    rewarded: !alreadyRewarded,
    newAchievements: unlocked.newAchievements,
    leveledUp: levelFromXp(next.xp).level > prevLevel,
    previousLevel: prevLevel,
  }
}

export function refreshMemoryText(
  state: UserState,
  verseId: string,
  text: string,
  reference: string,
  translationId: TranslationId,
): UserState {
  const next = {
    ...state,
    memoryVerses: state.memoryVerses.map((v) =>
      v.id === verseId
        ? {
            ...v,
            text,
            reference,
            translationId,
            textVersion: CURRENT_MEMORY_TEXT_VERSION,
          }
        : v,
    ),
  }
  saveState(next)
  return next
}
