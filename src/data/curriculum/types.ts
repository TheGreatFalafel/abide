import type { PassageRef } from '../books'
import type { CurriculumDifficulty, QuizQuestion } from '../planQuizzes'
import type { BiteExercise } from '../../lib/biteSized/types'

export type { CurriculumDifficulty }

/** Teachers / historians whose published frameworks organize or supplement topics. */
export type CurriculumTeacherId =
  | 'grudem'
  | 'sproul'
  | 'macarthur'
  | 'hoekema'
  | 'schaff'
  | 'needham'
  | 'gonzalez'
  | 'packer'
  | 'frame'

/** Learn catalog domain — theology, church history, or evangelism & apologetics. */
export type CurriculumDomain = 'theology' | 'church-history' | 'evangelism-apologetics'

/** Full authored lessons vs map/outline stubs awaiting Part-1 depth expansion. */
export type CurriculumContentStatus = 'full' | 'outline'

/** Content visibility relative to the learner's Learn difficulty. */
export type ContentLevel = 'all' | CurriculumDifficulty

/** Tiered objectives from the master curriculum schema; flat string[] remains supported. */
export type CurriculumObjectives =
  | string[]
  | {
      beginner: string[]
      intermediate: string[]
      advanced: string[]
    }

export type ChurchHistoryEra =
  | 'early'
  | 'medieval'
  | 'reformation'
  | 'post-reformation'
  | 'modern'

export type CurriculumSource = {
  teacherId: CurriculumTeacherId
  /** Public display name (or issuing body for some history stubs) */
  teacher: string
  /** Published work title (attribution only — never reproduce copyrighted chapters) */
  work: string
  role: 'organizational' | 'supplementary'
  /** Original summary of how this source shapes the topic — not a quotation */
  note: string
  /** Optional dating hint for historical works */
  approxDate?: string
  /** Copyright / public-domain status for any cited edition */
  rightsNote?: string
}

/**
 * Distinguishes biblical observation from theological teaching.
 * Used so users can see what the text says vs. how Reformed theology reads it.
 */
export type ContentDistinction = {
  kind: 'distinction'
  /** What the passage (or set of passages) explicitly states */
  biblical: string
  /** The Reformed interpretive teaching in this lesson */
  interpretation: string
  /** Fair note where traditions or teachers differ — optional */
  disagreement?: string
}

export type ContentTeaching = {
  kind: 'teaching'
  title?: string
  body: string
  /** Omit or `all` = always shown; higher tiers become Go Deeper for lower learners */
  level?: ContentLevel
}

export type ContentConcept = {
  kind: 'concept'
  term: string
  explanation: string
  level?: ContentLevel
}

export type ContentScriptureFocus = {
  kind: 'scripture_focus'
  passage: PassageRef
  /** How this passage relates to the lesson objective (interpretation, labeled as such) */
  note: string
}

export type ContentAttribution = {
  kind: 'attribution'
  teacherId: CurriculumTeacherId
  /** Short original paraphrase of the organizational/supplementary angle — not a quote */
  note: string
  work: string
}

/**
 * Primary historical document display — prefer verified public-domain excerpts.
 * If `excerpt` is omitted, show summary/significance only (no fabricated quotes).
 */
export type ContentPrimarySource = {
  kind: 'primary_source'
  authorOrBody: string
  work: string
  approxDate: string
  /** Historical setting for the document */
  context: string
  /** Verified public-domain excerpt only; omit when summarizing */
  excerpt?: string
  significance: string
  rightsNote: string
  /** Where a learner can find a reliable full text */
  reference?: string
}

export type ContentBlock =
  | ContentTeaching
  | ContentConcept
  | ContentDistinction
  | ContentScriptureFocus
  | ContentAttribution
  | ContentPrimarySource

/**
 * Structured further-study entry (Update Pack schema).
 * Show locator only when `verified` is true — never invent page/chapter numbers.
 */
export type CurriculumFurtherStudy = {
  author: string
  work: string
  /** Chapter, page, or message title — display only when verified */
  locator?: string
  verified: boolean
  /** Optional outbound URL (Grace to You, Ligonier, etc.) */
  url?: string
}

/** Link-out study video — never embed/host third-party media. */
export type CurriculumLessonVideo = {
  url: string
  attribution: string
  provider: 'grace-to-you' | 'ligonier' | 'other'
}

export type CurriculumLessonStatus = 'draft' | 'review' | 'published'

export type CurriculumLesson = {
  /** Stable id — never rename; add new lessons instead */
  id: string
  order: number
  title: string
  estimatedMinutes: number
  objectives: CurriculumObjectives
  primaryPassages: PassageRef[]
  supportingPassages: PassageRef[]
  /** Ordered instructional blocks */
  content: ContentBlock[]
  /** Comprehension / identification / theological MC + open questions */
  questions: QuizQuestion[]
  /**
   * Extra bite exercises (timeline order, matching figures/documents, etc.).
   * Compiled into practice steps alongside capped MC from the quiz bank.
   */
  interactiveExercises?: BiteExercise[]
  /** Free-response reflection prompts (completion-gated, not auto-graded) */
  reflectionPrompts: string[]
  /**
   * Legacy string lines or structured entries. Prefer structured where verified
   * locators matter; strings remain supported for passages and free-form notes.
   */
  furtherStudy?: Array<string | CurriculumFurtherStudy>
  /** Optional outbound teaching video (GTY preferred over Ligonier when both exist) */
  video?: CurriculumLessonVideo | CurriculumLessonVideo[]
  /** Optional per-lesson workflow status; topic contentStatus remains the catalog gate */
  status?: CurriculumLessonStatus
  /** Prior lesson ids whose review questions appear in this lesson's bank */
  reviewFromLessonIds?: string[]
}

export type CurriculumTopic = {
  id: string
  title: string
  description: string
  objectives: string[]
  estimatedMinutes: number
  /** Topic ids that should be completed first (empty for foundations) */
  prerequisites: string[]
  framework: 'reformed'
  /** Defaults to theology when omitted (legacy topics). */
  domain?: CurriculumDomain
  /** Church History era bucket (ignored for theology topics). */
  era?: ChurchHistoryEra
  /** Learner-facing era label, e.g. "Early Church (c. 30–500)" */
  eraLabel?: string
  /**
   * `full` = Part-1 depth; `outline` = map/stub teaching awaiting expansion.
   * Defaults to `full` when omitted.
   */
  contentStatus?: CurriculumContentStatus
  sources: CurriculumSource[]
  lessons: CurriculumLesson[]
  /** Bump when lesson ids or completion semantics change incompatibly */
  version: number
}

/** In-progress bite-sized session (cleared on complete). */
export type CurriculumLessonDraft = {
  lessonId: string
  subject: 'curriculum'
  stepIndex: number
  correct: number
  total: number
  updatedAt: string
}

/** Persisted on UserState — independent of reading-plan days and memory FSRS. */
export type CurriculumProgress = {
  /** Last known catalog version (content bumps do not wipe completions) */
  catalogVersion: number
  completedLessonIds: string[]
  lastLessonId: string | null
  /** Quiz scores keyed by lesson id */
  lessonScores: Record<
    string,
    { correctMc: number; totalMc: number; completedAt: string }
  >
  /** Partial bite-sized lesson resume */
  draft?: CurriculumLessonDraft | null
}

/** Bump when catalog membership or completion semantics change; completions are preserved. */
export const CURRICULUM_CATALOG_VERSION = 9

export function emptyCurriculumProgress(
  catalogVersion = CURRICULUM_CATALOG_VERSION,
): CurriculumProgress {
  return {
    catalogVersion,
    completedLessonIds: [],
    lastLessonId: null,
    lessonScores: {},
    draft: null,
  }
}
