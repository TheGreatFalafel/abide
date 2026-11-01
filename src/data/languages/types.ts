import type { FsrsCardSnapshot } from '../../lib/fsrsEngine'
import type { QuizQuestion } from '../planQuizzes'

export type LanguageTrackId = 'greek' | 'hebrew'

export type LanguageLetter = {
  id: string
  /** Glyph as displayed (Greek letter or Hebrew consonant) */
  glyph: string
  /** Final form for Hebrew when distinct */
  finalGlyph?: string
  name: string
  transliteration: string
  /** Short pronunciation guidance; note convention where scholars differ */
  pronunciation: string
  /** Optional IPA-ish or English cue */
  soundCue?: string
}

export type LanguageVocabEntry = {
  id: string
  track: LanguageTrackId
  /** Dictionary form / lemma */
  lemma: string
  /** Common surface form if different */
  surface?: string
  transliteration: string
  gloss: string
  /** Possible senses — not automatic “this verse means…” */
  senseNote?: string
  /** Example reference only; user reads via Bible stack when online */
  exampleRef?: string
  /** Example phrase in original script (short, verified) */
  examplePhrase?: string
  exampleTranslation?: string
  tags?: string[]
}

/** Persisted FSRS card for language vocabulary — never mixed with memoryVerses. */
export type LanguageVocabCard = {
  id: string
  track: LanguageTrackId
  vocabId: string
  fsrs: FsrsCardSnapshot
  introducedAt: string
  lastReviewedAt: string | null
}

export type LanguageContentBlock =
  | { kind: 'teaching'; title?: string; body: string }
  | { kind: 'concept'; term: string; explanation: string }
  | { kind: 'caution'; body: string }
  | { kind: 'example'; original: string; transliteration?: string; gloss: string; note?: string }
  | { kind: 'rtl_note'; body: string }

export type LanguageExercise =
  | {
      kind: 'alphabet_match'
      prompt: string
      /** letter ids from the track alphabet */
      letterIds: string[]
    }
  | {
      kind: 'mc'
      question: QuizQuestion & { type: 'mc' }
    }
  | {
      kind: 'parse'
      prompt: string
      form: string
      transliteration?: string
      choices: string[]
      answer: number
      explanation: string
    }
  | {
      kind: 'translate'
      prompt: string
      original: string
      transliteration?: string
      choices: string[]
      answer: number
      explanation: string
    }
  | {
      kind: 'passage_guide'
      reference: string
      /** bookId/chapter/verses for optional fetch — optional */
      bookId?: string
      bookName?: string
      chapter?: number
      verseStart?: number
      verseEnd?: number
      originalSnippet: string
      transliteration: string
      gloss: string
      analysis: string
      /** Reminds learners not to treat morphology as a full sermon outline */
      caution: string
    }

export type LanguageLesson = {
  id: string
  order: number
  title: string
  estimatedMinutes: number
  objectives: string[]
  content: LanguageContentBlock[]
  exercises: LanguageExercise[]
  /** Vocab ids to introduce into the track FSRS deck on completion */
  introduceVocabIds?: string[]
  reflectionPrompts: string[]
  reviewFromLessonIds?: string[]
}

export type LanguageCourse = {
  id: LanguageTrackId
  title: string
  description: string
  objectives: string[]
  estimatedMinutes: number
  scriptDirection: 'ltr' | 'rtl'
  pronunciationNote: string
  sourcesNote: string
  alphabet: LanguageLetter[]
  vocabulary: LanguageVocabEntry[]
  lessons: LanguageLesson[]
  version: number
}

/** In-progress bite-sized language session (cleared on complete). */
export type LanguageLessonDraft = {
  lessonId: string
  subject: 'language'
  track?: LanguageTrackId
  stepIndex: number
  correct: number
  total: number
  updatedAt: string
}

export type LanguageTrackProgress = {
  completedLessonIds: string[]
  lastLessonId: string | null
  lessonScores: Record<string, { correct: number; total: number; completedAt: string }>
  vocabCards: LanguageVocabCard[]
  /** Alphabet recognition drills finished (once) */
  alphabetMastered: boolean
  /** Partial bite-sized lesson resume */
  draft?: LanguageLessonDraft | null
}

export type LanguageProgress = {
  catalogVersion: number
  greek: LanguageTrackProgress
  hebrew: LanguageTrackProgress
}

export const LANGUAGE_CATALOG_VERSION = 1

export function emptyTrackProgress(): LanguageTrackProgress {
  return {
    completedLessonIds: [],
    lastLessonId: null,
    lessonScores: {},
    vocabCards: [],
    alphabetMastered: false,
    draft: null,
  }
}

export function emptyLanguageProgress(
  catalogVersion = LANGUAGE_CATALOG_VERSION,
): LanguageProgress {
  return {
    catalogVersion,
    greek: emptyTrackProgress(),
    hebrew: emptyTrackProgress(),
  }
}
