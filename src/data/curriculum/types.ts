import type { PassageRef } from '../books'
import type { QuizQuestion } from '../planQuizzes'
import type { BiteExercise } from '../../lib/biteSized/types'

/** Teachers / historians whose published frameworks organize or supplement topics. */
export type CurriculumTeacherId =
  | 'grudem'
  | 'sproul'
  | 'macarthur'
  | 'schaff'
  | 'needham'
  | 'gonzalez'
  | 'packer'
  | 'frame'

/** Learn catalog domain — theology, church history, or evangelism & apologetics. */
export type CurriculumDomain = 'theology' | 'church-history' | 'evangelism-apologetics'

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
}

export type ContentConcept = {
  kind: 'concept'
  term: string
  explanation: string
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

export type CurriculumLesson = {
  /** Stable id — never rename; add new lessons instead */
  id: string
  order: number
  title: string
  estimatedMinutes: number
  objectives: string[]
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
  furtherStudy?: string[]
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
export const CURRICULUM_CATALOG_VERSION = 6

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
