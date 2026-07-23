import type { TranslationId } from '../data/translations'

export type AchievementId =
  | 'first_step'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'xp_500'
  | 'xp_2000'
  | 'week_warrior'
  | 'early_bird'
  | 'night_owl'
  | 'perfect_day'
  | 'halfway'
  | 'finisher'
  | 'memory_first'
  | 'memory_5'
  | 'memory_master'

export type Achievement = {
  id: AchievementId
  title: string
  description: string
  icon: string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'First Light',
    description: 'Complete your first reading.',
    icon: '✦',
  },
  {
    id: 'streak_3',
    title: 'Kindled',
    description: 'Keep a 3-day streak.',
    icon: '🔥',
  },
  {
    id: 'streak_7',
    title: 'Week of Abiding',
    description: 'Keep a 7-day streak.',
    icon: '🕯',
  },
  {
    id: 'streak_30',
    title: 'Deep Roots',
    description: 'Keep a 30-day streak.',
    icon: '🌳',
  },
  {
    id: 'xp_500',
    title: 'Gathering',
    description: 'Earn 500 XP.',
    icon: '✧',
  },
  {
    id: 'xp_2000',
    title: 'Wellspring',
    description: 'Earn 2,000 XP.',
    icon: '◎',
  },
  {
    id: 'week_warrior',
    title: 'Sevenfold',
    description: 'Finish 7 lessons in one week.',
    icon: '◆',
  },
  {
    id: 'early_bird',
    title: 'Dawn Reader',
    description: 'Complete a lesson before 8am.',
    icon: '☀',
  },
  {
    id: 'night_owl',
    title: 'Lamp & Oil',
    description: 'Complete a lesson after 9pm.',
    icon: '☾',
  },
  {
    id: 'perfect_day',
    title: 'Heart Check',
    description: 'Finish reading + reflection in one sitting.',
    icon: '♥',
  },
  {
    id: 'halfway',
    title: 'Midway',
    description: 'Reach the halfway point of your plan.',
    icon: '◇',
  },
  {
    id: 'finisher',
    title: 'Finished the Course',
    description: 'Complete an entire reading plan.',
    icon: '★',
  },
  {
    id: 'memory_first',
    title: 'Hidden in Heart',
    description: 'Complete your first memory review.',
    icon: '📜',
  },
  {
    id: 'memory_5',
    title: 'Treasure Store',
    description: 'Add 5 verses to your memory bank.',
    icon: '💎',
  },
  {
    id: 'memory_master',
    title: 'Word Dwelling',
    description: 'Mark a verse as memorized.',
    icon: '👑',
  },
]

export type MemoryVerse = {
  id: string
  reference: string
  text: string
  bookName: string
  bookId: string
  chapter: number
  verseStart: number
  verseEnd: number
  translationId: TranslationId
  addedAt: string
  nextReview: string
  intervalDays: number
  ease: number
  repetitions: number
  lapses: number
  /** learning = still acquiring; memorized = retention cycle */
  status: 'learning' | 'memorized'
  topic?: string
  seriesId?: string
  seriesName?: string
}

export type UserState = {
  name: string
  planId: string
  completedDays: number[]
  xp: number
  streak: number
  longestStreak: number
  lastReadDate: string | null
  streakFreezes: number
  achievements: AchievementId[]
  dailyGoalXp: number
  todayXp: number
  todayXpDate: string
  createdAt: string
  lessonsThisWeek: number
  weekKey: string
  translationId: TranslationId
  esvApiKey: string
  memoryVerses: MemoryVerse[]
  memoryReviewsToday: number
  completedQuizzes: string[]
}

export const XP = {
  lesson: 20,
  reflection: 10,
  streakBonus: 5,
  perfectDay: 15,
  memoryEasy: 8,
  memoryGood: 12,
  memoryHard: 6,
  sectionQuiz: 25,
  memoryQuiz: 10,
} as const

export function levelFromXp(xp: number): { level: number; into: number; need: number } {
  let level = 1
  let remaining = xp
  let need = 50
  while (remaining >= need) {
    remaining -= need
    level += 1
    need = Math.min(200, 50 + level * 10)
  }
  return { level, into: remaining, need }
}

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}

export function yesterdayKey(d = new Date()): string {
  const y = new Date(d)
  y.setDate(y.getDate() - 1)
  return todayKey(y)
}

export function weekKey(d = new Date()): string {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = tmp.getUTCDay() || 7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${tmp.getUTCFullYear()}-W${week}`
}

export function createInitialState(name: string, planId: string): UserState {
  const today = todayKey()
  return {
    name,
    planId,
    completedDays: [],
    xp: 0,
    streak: 0,
    longestStreak: 0,
    lastReadDate: null,
    streakFreezes: 1,
    achievements: [],
    dailyGoalXp: 30,
    todayXp: 0,
    todayXpDate: today,
    createdAt: today,
    lessonsThisWeek: 0,
    weekKey: weekKey(),
    translationId: 'web',
    esvApiKey: '',
    memoryVerses: [],
    memoryReviewsToday: 0,
    completedQuizzes: [],
  }
}

export function isMastered(verse: MemoryVerse): boolean {
  return verse.status === 'memorized' || (verse.intervalDays >= 21 && verse.repetitions >= 4)
}
