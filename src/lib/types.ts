import type { LanguageProgress } from '../data/languages/types'
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
  | 'memory_25'
  | 'memory_quest_3'
  | 'curriculum_first'
  | 'curriculum_topic'
  | 'greek_first'
  | 'hebrew_first'
  | 'greek_track'
  | 'hebrew_track'
  | 'gem_collector'
  | 'streak_14'
  | 'game_first'
  | 'game_trio'
  | 'game_perfect'

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
  {
    id: 'memory_25',
    title: 'Storehouse',
    description: 'Keep 25 verses in your memory bank.',
    icon: '📚',
  },
  {
    id: 'memory_quest_3',
    title: 'Quick Quests',
    description: 'Finish 3 Memory Quests (lifetime).',
    icon: '⏱',
  },
  {
    id: 'curriculum_first',
    title: 'Doctrine Beginnings',
    description: 'Complete your first theology lesson.',
    icon: '📖',
  },
  {
    id: 'curriculum_topic',
    title: 'Nature of Man',
    description: 'Finish every lesson in any theology topic (including The Nature of Man).',
    icon: '🧭',
  },
  {
    id: 'greek_first',
    title: 'First Greek',
    description: 'Complete your first Biblical Greek lesson.',
    icon: 'α',
  },
  {
    id: 'hebrew_first',
    title: 'First Hebrew',
    description: 'Complete your first Biblical Hebrew lesson.',
    icon: 'א',
  },
  {
    id: 'greek_track',
    title: 'Koine Reader',
    description: 'Finish the Biblical Greek course.',
    icon: 'Ω',
  },
  {
    id: 'hebrew_track',
    title: 'Hebrew Reader',
    description: 'Finish the Biblical Hebrew course.',
    icon: 'ת',
  },
  {
    id: 'gem_collector',
    title: 'Quiet Treasure',
    description: 'Earn 100 gems from faithful study.',
    icon: '💠',
  },
  {
    id: 'streak_14',
    title: 'Fortnight Faithful',
    description: 'Keep a 14-day streak.',
    icon: '📆',
  },
  {
    id: 'game_first',
    title: 'First Match',
    description: 'Finish any Bible game once.',
    icon: '🎯',
  },
  {
    id: 'game_trio',
    title: 'Three Courts',
    description: 'Complete three different Bible games.',
    icon: '🦁',
  },
  {
    id: 'game_perfect',
    title: 'Clean Sweep',
    description: 'Score 100% on a Bible game round.',
    icon: '✨',
  },
]

export type MemoryGrade = 'again' | 'hard' | 'good' | 'easy'

export type MemoryReviewSource = 'practice' | 'type' | 'blanks' | 'quest' | 'quiz' | 'mark'

export type MemoryReviewLogEntry = {
  /** FSRS Rating: 1 Again, 2 Hard, 3 Good, 4 Easy */
  rating: 1 | 2 | 3 | 4
  reviewedAt: string
  stateBefore: number
  scheduledDays: number
  source: MemoryReviewSource
  /** When false, this was extra practice and did not change the schedule. */
  appliedSchedule: boolean
}

export type FsrsCardState = {
  due: string
  stability: number
  difficulty: number
  scheduled_days: number
  learning_steps: number
  reps: number
  lapses: number
  state: number
  last_review: string | null
}

export type MemoryVerse = {
  id: string
  reference: string
  text: string
  /** Parser/content revision used when this saved text was fetched. */
  textVersion?: number
  bookName: string
  bookId: string
  chapter: number
  verseStart: number
  verseEnd: number
  translationId: TranslationId
  /**
   * False when legacy data had no reliable translation and the id was left unchanged.
   * New cards are always confident.
   */
  translationConfident?: boolean
  /**
   * True when this card’s text is not yet available in the user’s selected translation.
   * Existing text is retained; never silently substitute another translation.
   */
  translationStale?: boolean
  addedAt: string
  /** Calendar due date (YYYY-MM-DD) derived from FSRS `due` for UI. */
  nextReview: string
  /** Rounded FSRS scheduled_days — kept for blanks difficulty + legacy UI. */
  intervalDays: number
  /** Legacy ease mirror; scheduling uses `fsrs.difficulty`. */
  ease: number
  repetitions: number
  lapses: number
  /** learning = still acquiring; memorized = user-marked / graduated retention */
  status: 'learning' | 'memorized'
  topic?: string
  seriesId?: string
  seriesName?: string
  /** FSRS-6 card snapshot (ts-fsrs). */
  fsrs: FsrsCardState
  reviewHistory: MemoryReviewLogEntry[]
  successfulReviews: number
  failedReviews: number
  scheduler?: 'fsrs-6' | 'legacy'
  /** Date key of last schedule-applying review (duplicate prevention). */
  scheduledReviewDate?: string
}

export type CustomPlan = {
  id: string
  name: string
  bookIds: string[]
  days: number
  /** chapter | section | half | verses (N verses per reading unit). */
  pace: 'chapter' | 'section' | 'half' | 'verses'
  /** Used when pace is "verses" — how many verses make one reading unit. */
  versesPerDay?: number
  createdAt: string
}

/** Local/cloud progress for theology curriculum (separate from Path days & FSRS). */
export type CurriculumProgressState = {
  catalogVersion: number
  completedLessonIds: string[]
  lastLessonId: string | null
  lessonScores: Record<
    string,
    { correctMc: number; totalMc: number; completedAt: string }
  >
  /** Partial bite-sized lesson resume; cleared on complete. */
  draft?: {
    lessonId: string
    subject: 'curriculum'
    stepIndex: number
    correct: number
    total: number
    updatedAt: string
  } | null
}

/** Opt-in local reminder prefs — never requested on first launch. */
export type NotificationPrefsState = {
  enabled: boolean
  readingReminder: boolean
  memoryReminder: boolean
  goalReminder: boolean
  reminderHour: number
  permissionAsked: boolean
}

/** Ari guided tour — completed after Skip or Finish; replay from Settings. */
export type GuidedTourPrefsState = {
  completed: boolean
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
  /** XP earned in the current ISO week — fuels Circle weekly league. */
  weekXp: number
  weekKey: string
  translationId: TranslationId
  esvApiKey: string
  memoryVerses: MemoryVerse[]
  memoryReviewsToday: number
  completedQuizzes: string[]
  customPlans: CustomPlan[]
  /** Theology curriculum progress — never mixed into completedDays. */
  curriculum: CurriculumProgressState
  /**
   * Biblical Greek / Hebrew course progress + language vocab FSRS decks.
   * Never mixed with theology curriculum or Scripture memoryVerses.
   */
  languages: LanguageProgress
  /** Local reminder preferences (device permission is separate). */
  notifications: NotificationPrefsState
  /**
   * Ari’s first-use guided tour. Merge uses OR-completed so a finished tour
   * never reopens after cloud sync. Replay is session-only from Settings.
   */
  guidedTour: GuidedTourPrefsState
  /**
   * Gem balance — local optimistic; cloud/server ledger is authoritative when signed in.
   * Never trust a client-submitted gems field on the server.
   */
  gems: number
  /** Gems earned today (local daily-cap tracking). */
  todayGems: number
  todayGemsDate: string
  /** Lifetime gems earned (for achievements; not reduced by spending). */
  gemsEarnedTotal: number
  /** Lifetime Memory Quests finished (achievement tracking). */
  memoryQuestsCompleted: number
  cosmetics: {
    ownedIds: string[]
    equipped: {
      base: string
      color: string
      accessory: string | null
      frame: string
    }
    /** Free human appearance — migrated when missing. */
    appearance?: {
      skin: string
      hair: string
      hairColor: string
      face: string
      clothes: string
    }
  }
  /** Bible Game Center progress (rewards keyed separately via event activity keys). */
  gameStats: {
    completedGameIds: string[]
    gamesPlayed: number
    perfectGames: number
    /** gameId → YYYY-MM-DD of last rewarded completion */
    lastRewardDateByGame: Record<string, string>
  }
}

export const DAILY_GOAL_OPTIONS = [
  { id: 'easy', xp: 20, label: 'Easy', blurb: '~1 lesson' },
  { id: 'regular', xp: 30, label: 'Regular', blurb: 'Lesson + heart check' },
  { id: 'serious', xp: 50, label: 'Serious', blurb: 'Lesson + memory' },
] as const


export const XP = {
  lesson: 20,
  reflection: 10,
  streakBonus: 5,
  perfectDay: 15,
  /** Easy pays less than Good so “easy farming” is not optimal. */
  memoryEasy: 5,
  memoryGood: 8,
  memoryHard: 4,
  sectionQuiz: 25,
  memoryQuiz: 2,
  /** Wrong quiz answers no longer grant XP (streak may still update). */
  memoryQuizWrong: 0,
  /** Per-correct-answer reward inside a short memory quest. */
  memoryQuestCorrect: 2,
  /** Flat bonus for finishing a 2-min memory quest */
  memoryQuest: 5,
  /** Extra practice on non-due cards (no schedule change). */
  memoryExtraPractice: 0,
  /** Theology curriculum: awarded only after quiz + reflection, not on open. */
  curriculumLesson: 20,
  curriculumReflection: 8,
  /** Max bonus from MC accuracy on a curriculum lesson. */
  curriculumQuizBonus: 10,
  /** Bible game completion base XP (accuracy bonus layered in computeEventXp). */
  bibleGame: 12,
  bibleGameAccuracy: 8,
  /** Original-language lesson (quiz + reflection). */
  languageLesson: 18,
  languageLessonQuizBonus: 8,
  /** Scheduled language-vocab FSRS review (separate from Scripture memory). */
  languageVocabReview: 2,
} as const

/** Increment when saved memory text needs to be re-fetched after a parser fix. */
export const CURRENT_MEMORY_TEXT_VERSION = 1

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

/** Visible titles unlocked by level — shown on Home and in Circle. */
const LEVEL_TITLES: { min: number; title: string }[] = [
  { min: 1, title: 'Seeker' },
  { min: 2, title: 'Listener' },
  { min: 3, title: 'Disciple' },
  { min: 5, title: 'Sojourner' },
  { min: 7, title: 'Watchman' },
  { min: 10, title: 'Scribe' },
  { min: 12, title: 'Beacon' },
  { min: 15, title: 'Elder Path' },
  { min: 20, title: 'Torchbearer' },
  { min: 25, title: 'Abiding One' },
  { min: 30, title: 'Pillar' },
  { min: 40, title: 'Wellspring' },
  { min: 50, title: 'Ancient Paths' },
]

export function titleForLevel(level: number): string {
  let title = LEVEL_TITLES[0].title
  for (const row of LEVEL_TITLES) {
    if (level >= row.min) title = row.title
  }
  return title
}

export function titleForXp(xp: number): string {
  return titleForLevel(levelFromXp(xp).level)
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
    weekXp: 0,
    weekKey: weekKey(),
    translationId: 'web',
    esvApiKey: '',
    memoryVerses: [],
    memoryReviewsToday: 0,
    completedQuizzes: [],
    customPlans: [],
    curriculum: {
      catalogVersion: 1,
      completedLessonIds: [],
      lastLessonId: null,
      lessonScores: {},
    },
    languages: {
      catalogVersion: 1,
      greek: {
        completedLessonIds: [],
        lastLessonId: null,
        lessonScores: {},
        vocabCards: [],
        alphabetMastered: false,
      },
      hebrew: {
        completedLessonIds: [],
        lastLessonId: null,
        lessonScores: {},
        vocabCards: [],
        alphabetMastered: false,
      },
    },
    notifications: {
      enabled: false,
      readingReminder: true,
      memoryReminder: true,
      goalReminder: true,
      reminderHour: 8,
      permissionAsked: false,
    },
    guidedTour: {
      completed: false,
    },
    gems: 0,
    todayGems: 0,
    todayGemsDate: today,
    gemsEarnedTotal: 0,
    memoryQuestsCompleted: 0,
    cosmetics: {
      ownedIds: ['base-seeker', 'color-deep', 'frame-simple'],
      equipped: {
        base: 'base-seeker',
        color: 'color-deep',
        accessory: null,
        frame: 'frame-simple',
      },
      appearance: {
        skin: 'medium',
        hair: 'wavy',
        hairColor: 'brown',
        face: 'warm',
        clothes: 'tee',
      },
    },
    gameStats: {
      completedGameIds: [],
      gamesPlayed: 0,
      perfectGames: 0,
      lastRewardDateByGame: {},
    },
  }
}

export function isMastered(verse: MemoryVerse): boolean {
  if (verse.status === 'memorized') return true
  const fsrs = verse.fsrs
  if (!fsrs) return verse.intervalDays >= 21 && verse.repetitions >= 4
  return fsrs.state === 2 && fsrs.stability >= 21 && fsrs.reps >= 4
}
