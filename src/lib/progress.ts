import type { AchievementId, MemoryVerse, UserState } from './types'
import {
  ACHIEVEMENTS,
  XP,
  createInitialState,
  isMastered,
  levelFromXp,
  todayKey,
  weekKey,
  yesterdayKey,
} from './types'
import type { TranslationId } from '../data/translations'
import { clearPassageCache } from './bibleApi'

const STORAGE_KEY = 'abide-user-v1'

function migrate(raw: Partial<UserState> & { name: string; planId: string }): UserState {
  const base = createInitialState(raw.name, raw.planId)
  const memoryVerses = (raw.memoryVerses ?? []).map((v) => ({
    ...v,
    status:
      v.status ??
      (v.intervalDays >= 21 && v.repetitions >= 4
        ? ('memorized' as const)
        : ('learning' as const)),
  }))
  return {
    ...base,
    ...raw,
    translationId: raw.translationId ?? base.translationId,
    esvApiKey: raw.esvApiKey ?? '',
    memoryVerses,
    memoryReviewsToday: raw.memoryReviewsToday ?? 0,
    achievements: raw.achievements ?? [],
    completedDays: raw.completedDays ?? [],
    completedQuizzes: raw.completedQuizzes ?? [],
    customPlans: raw.customPlans ?? [],
  }
}

export function loadState(): UserState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<UserState> & { name: string; planId: string }
    return normalizeDay(migrate(parsed))
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
  if (next.weekKey !== wk) {
    next = { ...next, weekKey: wk, lessonsThisWeek: 0 }
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
  if (state.memoryVerses.some(isMastered)) candidates.push('memory_master')
  candidates.push(...ids)

  for (const id of candidates) {
    if (!owned.has(id) && ACHIEVEMENTS.some((a) => a.id === id)) {
      owned.add(id)
      newly.push(id)
    }
  }

  return {
    state: { ...state, achievements: [...owned] },
    newAchievements: newly,
  }
}

function addXp(state: UserState, amount: number): UserState {
  const today = todayKey()
  return {
    ...state,
    xp: state.xp + amount,
    todayXp: (state.todayXpDate === today ? state.todayXp : 0) + amount,
    todayXpDate: today,
  }
}

export function updateSettings(
  state: UserState,
  patch: Partial<Pick<UserState, 'translationId' | 'esvApiKey' | 'planId'>>,
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
  saveState(next)

  return {
    state: next,
    earnedXp: earned,
    newAchievements: unlocked.newAchievements,
    leveledUp: levelFromXp(next.xp).level > prevLevel,
    previousLevel: prevLevel,
  }
}

export function makeMemoryId(
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
): string {
  return `${bookId}-${chapter}-${verseStart}-${verseEnd}`
}

export function addMemoryVerse(
  state: UserState,
  verse: Omit<
    MemoryVerse,
    'id' | 'addedAt' | 'nextReview' | 'intervalDays' | 'ease' | 'repetitions' | 'lapses' | 'status'
  > & {
    id?: string
    status?: MemoryVerse['status']
  },
): { state: UserState; added: boolean } {
  const id =
    verse.id ??
    makeMemoryId(verse.bookId, verse.chapter, verse.verseStart, verse.verseEnd)
  if (state.memoryVerses.some((v) => v.id === id)) {
    return { state, added: false }
  }
  const today = todayKey()
  const entry: MemoryVerse = {
    id,
    reference: verse.reference,
    text: verse.text,
    bookName: verse.bookName,
    bookId: verse.bookId,
    chapter: verse.chapter,
    verseStart: verse.verseStart,
    verseEnd: verse.verseEnd,
    translationId: verse.translationId,
    addedAt: today,
    nextReview: today,
    intervalDays: 0,
    ease: 2.5,
    repetitions: 0,
    lapses: 0,
    status: 'learning',
    topic: verse.topic,
    seriesId: verse.seriesId,
    seriesName: verse.seriesName,
  }
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

export type MemoryGrade = 'again' | 'hard' | 'good' | 'easy'

function addDays(dateKey: string, days: number): string {
  const d = new Date(`${dateKey}T12:00:00`)
  d.setDate(d.getDate() + days)
  return todayKey(d)
}

function schedule(verse: MemoryVerse, grade: MemoryGrade): MemoryVerse {
  let { intervalDays, ease, repetitions, lapses, status } = verse
  if (grade === 'again') {
    repetitions = 0
    intervalDays = status === 'memorized' ? 1 : 0
    lapses += 1
    ease = Math.max(1.3, ease - 0.2)
  } else if (grade === 'hard') {
    repetitions += 1
    intervalDays = Math.max(1, Math.round(intervalDays * 1.2) || 1)
    ease = Math.max(1.3, ease - 0.15)
  } else if (grade === 'good') {
    repetitions += 1
    if (status === 'memorized') {
      intervalDays = intervalDays < 7 ? 7 : intervalDays < 14 ? 14 : intervalDays < 30 ? 30 : 60
    } else if (intervalDays === 0) intervalDays = 1
    else if (intervalDays === 1) intervalDays = 3
    else intervalDays = Math.round(intervalDays * ease)
  } else {
    repetitions += 1
    if (status === 'memorized') {
      intervalDays = Math.max(14, intervalDays * 2)
    } else if (intervalDays === 0) intervalDays = 2
    else intervalDays = Math.round(intervalDays * ease * 1.3)
    ease = Math.min(3.0, ease + 0.15)
  }

  // Auto-promote to memorized after strong learning streak
  if (status !== 'memorized' && intervalDays >= 21 && repetitions >= 4) {
    status = 'memorized'
    intervalDays = Math.max(intervalDays, 7)
  }

  return {
    ...verse,
    status,
    intervalDays,
    ease,
    repetitions,
    lapses,
    nextReview: addDays(todayKey(), Math.max(0, intervalDays)),
  }
}

export function markMemorized(state: UserState, verseId: string): UserState {
  const memoryVerses = state.memoryVerses.map((v) =>
    v.id === verseId
      ? {
          ...v,
          status: 'memorized' as const,
          intervalDays: Math.max(v.intervalDays, 7),
          nextReview: addDays(todayKey(), 7),
          repetitions: Math.max(v.repetitions, 4),
        }
      : v,
  )
  let next: UserState = { ...state, memoryVerses }
  const unlocked = unlock(next, ['memory_master'], 1)
  next = unlocked.state
  saveState(next)
  return next
}

export function dueMemoryVerses(state: UserState, filter?: 'learning' | 'memorized'): MemoryVerse[] {
  const today = todayKey()
  return state.memoryVerses
    .filter((v) => v.nextReview <= today)
    .filter((v) => (filter ? v.status === filter : true))
    .sort((a, b) => a.nextReview.localeCompare(b.nextReview))
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
  saveState(next)

  return {
    state: next,
    earnedXp: earned,
    newAchievements: unlocked.newAchievements,
    leveledUp: levelFromXp(next.xp).level > prevLevel,
    previousLevel: prevLevel,
  }
}

export function scoreMemoryQuiz(
  state: UserState,
  correct: boolean,
): LessonResult {
  const prevLevel = levelFromXp(state.xp).level
  const earned = correct ? XP.memoryQuiz : 2
  let next = {
    ...addXp(state, earned),
    memoryReviewsToday: state.memoryReviewsToday + 1,
  }
  const unlocked = unlock(next, correct ? ['memory_first'] : [], 1)
  next = unlocked.state
  saveState(next)
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
): LessonResult {
  const prevLevel = levelFromXp(state.xp).level
  const xpMap = {
    again: 0,
    hard: XP.memoryHard,
    good: XP.memoryGood,
    easy: XP.memoryEasy,
  } as const
  const earned = xpMap[grade]

  const memoryVerses = state.memoryVerses.map((v) =>
    v.id === verseId ? schedule(v, grade) : v,
  )

  let next: UserState = {
    ...addXp(state, earned),
    memoryVerses,
    memoryReviewsToday: state.memoryReviewsToday + 1,
  }

  const bonus: AchievementId[] = []
  if (next.memoryReviewsToday === 1) bonus.push('memory_first')
  if (memoryVerses.some(isMastered)) bonus.push('memory_master')

  const unlocked = unlock(next, bonus, 1)
  next = unlocked.state
  saveState(next)

  return {
    state: next,
    earnedXp: earned,
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
      v.id === verseId ? { ...v, text, reference, translationId } : v,
    ),
  }
  saveState(next)
  return next
}
