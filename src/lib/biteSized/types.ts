import type { PassageRef } from '../../data/books'
import type { LanguageTrackId } from '../../data/languages'
import type { QuizQuestion } from '../../data/planQuizzes'

/** Instructional sequence for bite-sized lessons (not every lesson uses every kind). */
export type BiteStepKind =
  | 'intro'
  | 'teach'
  | 'scripture'
  | 'practice'
  | 'application'
  | 'deeper'
  | 'review'

export type BiteMcExercise = {
  kind: 'mc'
  prompt: string
  choices: string[]
  answer: number
  explanation: string
}

export type BiteMatchExercise = {
  kind: 'match'
  prompt: string
  /** Display target (glyph, word, etc.) */
  target: string
  choices: string[]
  answer: number
  explanation: string
}

export type BiteTrueFalseExercise = {
  kind: 'true_false'
  prompt: string
  answer: boolean
  explanation: string
}

export type BiteOrderExercise = {
  kind: 'order'
  prompt: string
  items: string[]
  /** Correct index order */
  answerOrder: number[]
  explanation: string
}

export type BitePassageGuideExercise = {
  kind: 'passage_guide'
  prompt: string
  reference: string
  original: string
  transliteration?: string
  gloss: string
  analysis: string
  caution: string
  rtl?: boolean
}

/** Quality of a learner reply in a conversation scenario (not “aggressiveness”). */
export type BiteConversationQuality =
  | 'helpful'
  | 'incomplete'
  | 'inaccurate'
  | 'hostile'

export type BiteConversationChoice = {
  text: string
  quality: BiteConversationQuality
  explanation: string
}

export type BiteConversationStep = {
  /** What the other person says or asks */
  partnerLine: string
  choices: BiteConversationChoice[]
}

/**
 * Multi-step conversation practice — choose respectful, truthful replies.
 * Scored correct only when every chosen reply is `helpful`.
 */
export type BiteConversationExercise = {
  kind: 'conversation'
  prompt: string
  scenario: string
  partnerName: string
  steps: BiteConversationStep[]
}

export type BiteExercise =
  | BiteMcExercise
  | BiteMatchExercise
  | BiteTrueFalseExercise
  | BiteOrderExercise
  | BitePassageGuideExercise
  | BiteConversationExercise

export type BiteStep = {
  id: string
  kind: BiteStepKind
  title: string
  /** Short learner-facing body (markdown-ish plain text) */
  body?: string
  /** Concept term callout */
  term?: string
  /** Scripture to load for this step */
  passage?: PassageRef
  /** Interpretation note attached to scripture */
  scriptureNote?: string
  /** Distinction panels */
  biblical?: string
  interpretation?: string
  disagreement?: string
  /** Language example */
  original?: string
  transliteration?: string
  gloss?: string
  rtl?: boolean
  /** Expandable deeper-study bullets */
  deeperItems?: string[]
  /** Practice payload */
  exercise?: BiteExercise
  /** Open reflection / application (min length enforced in UI) */
  prompt?: string
  /** Review checklist */
  reviewItems?: string[]
  /** Primary historical document panel */
  primarySource?: {
    authorOrBody: string
    work: string
    approxDate: string
    context: string
    excerpt?: string
    significance: string
    rightsNote: string
    reference?: string
  }
  /** Optional distinction panel labels (history vs theology) */
  distinctionLabels?: {
    biblical: string
    interpretation: string
    disagreement?: string
  }
}

export type BiteSubject = 'curriculum' | 'language'

export type BiteLesson = {
  subject: BiteSubject
  lessonId: string
  track?: LanguageTrackId
  topicId?: string
  /** theology (default) or church-history — drives Learn branding */
  domain?: 'theology' | 'church-history' | 'evangelism-apologetics'
  title: string
  estimatedMinutes: number
  objectives: string[]
  steps: BiteStep[]
  /** Primary passages for prefetch (curriculum) */
  prefetchPassages?: PassageRef[]
}

/** In-progress session draft — cleared on complete or when switching lessons. */
export type BiteLessonDraft = {
  lessonId: string
  subject: BiteSubject
  track?: LanguageTrackId
  stepIndex: number
  correct: number
  total: number
  updatedAt: string
}

export function quizQuestionToMc(q: QuizQuestion & { type: 'mc' }): BiteMcExercise {
  return {
    kind: 'mc',
    prompt: q.prompt,
    choices: q.choices,
    answer: q.answer,
    explanation: q.explanation?.trim() || 'Review the teaching in this lesson and try again.',
  }
}
