import type { TranslationId } from '../data/translations'
import { TRANSLATIONS } from '../data/translations'

const TRANSLATION_IDS = new Set(TRANSLATIONS.map((t) => t.id))

export function isTranslationId(value: string): value is TranslationId {
  return TRANSLATION_IDS.has(value as TranslationId)
}

/** Reference + translation identity for a memory card. */
export function makeMemoryId(
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  translationId: TranslationId,
): string {
  return `${bookId}-${chapter}-${verseStart}-${verseEnd}:${translationId}`
}

/** Legacy ids omitted the translation suffix. */
export function isLegacyMemoryId(id: string): boolean {
  return !id.includes(':')
}

export function parseMemoryId(id: string): {
  bookId: string
  chapter: number
  verseStart: number
  verseEnd: number
  translationId?: TranslationId
} | null {
  const [refPart, maybeTranslation] = id.split(':')
  const parts = refPart.split('-')
  if (parts.length < 4) return null
  const verseEnd = Number(parts[parts.length - 1])
  const verseStart = Number(parts[parts.length - 2])
  const chapter = Number(parts[parts.length - 3])
  const bookId = parts.slice(0, -3).join('-')
  if (![chapter, verseStart, verseEnd].every((n) => Number.isFinite(n))) return null
  const translationId =
    maybeTranslation && isTranslationId(maybeTranslation) ? maybeTranslation : undefined
  return { bookId, chapter, verseStart, verseEnd, translationId }
}

export function sameScriptureRef(
  a: { bookId: string; chapter: number; verseStart: number; verseEnd: number },
  b: { bookId: string; chapter: number; verseStart: number; verseEnd: number },
): boolean {
  return (
    a.bookId === b.bookId &&
    a.chapter === b.chapter &&
    a.verseStart === b.verseStart &&
    a.verseEnd === b.verseEnd
  )
}

/** Challenge shared refs are translation-agnostic — match bank cards by scripture + user translation. */
export function memoryIdForChallengeVerse(
  verse: { bookId: string; chapter: number; verseStart: number; verseEnd: number; id?: string },
  translationId: TranslationId,
): string {
  return makeMemoryId(verse.bookId, verse.chapter, verse.verseStart, verse.verseEnd, translationId)
}
