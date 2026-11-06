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
  /**
   * Strong's number when verified (e.g. G2315 / H430).
   * Hear-it link-out uses Blue Letter Bible; omit or leave unverified numbers out of UI.
   */
  strongs?: string
  /** When false, hide Hear-it even if strongs is present (unverified entries). */
  strongsVerified?: boolean
}

/** Unverified Strong's from Update Pack Step 7 — do not show Hear-it for these. */
export const UNVERIFIED_STRONGS = new Set([
  'G26',
  'G4102',
  'H802',
  'H2617',
  'G907',
  'G1577',
  'G2435',
  'G5342',
  'G622',
])

/** Blue Letter Bible lexicon URL for a verified Strong's number (link-out only). */
export function blueLetterBibleLexiconUrl(strongs: string): string | null {
  const m = strongs.trim().toUpperCase().match(/^([GH])(\d+)$/)
  if (!m) return null
  const num = m[2]
  const prefix = m[1]
  if (UNVERIFIED_STRONGS.has(`${prefix}${num}`)) return null
  return `https://www.blueletterbible.org/lexicon/${prefix}${num}/`
}

/** Hear-it target for a vocab entry, or null when Strong's missing/unverified. */
export function hearItUrl(entry: LanguageVocabEntry): string | null {
  if (!entry.strongs) return null
  if (entry.strongsVerified === false) return null
  const key = entry.strongs.trim().toUpperCase()
  if (UNVERIFIED_STRONGS.has(key)) return null
  return blueLetterBibleLexiconUrl(entry.strongs)
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

export const LANGUAGE_CATALOG_VERSION = 2

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
