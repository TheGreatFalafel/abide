import { TMS_VERSES } from '../data/tms'
import type { TranslationId } from '../data/translations'
import { fetchVerseRange, passageToPlainText } from './bibleApi'
import { sameScriptureRef } from './memoryIds'
import type { MemoryVerse, UserState } from './types'

/**
 * Load a memory verse’s text in a specific translation (TMS-aware for extras).
 */
export async function fetchMemoryVerseText(
  verse: MemoryVerse,
  translationId: TranslationId,
  user: Pick<UserState, 'esvApiKey'>,
): Promise<{ text: string; reference: string }> {
  const seed = TMS_VERSES.find((candidate) => {
    const end = candidate.verseEnd ?? candidate.verseStart
    return sameScriptureRef(
      {
        bookId: candidate.bookId,
        chapter: candidate.chapter,
        verseStart: candidate.verseStart,
        verseEnd: end,
      },
      verse,
    )
  })

  if (seed?.extraVerses?.length) {
    const end = seed.verseEnd ?? seed.verseStart
    const primary = await fetchVerseRange(seed.bookName, seed.chapter, seed.verseStart, end, {
      translation: translationId,
      esvApiKey: user.esvApiKey,
    })
    const extras: string[] = []
    for (const n of seed.extraVerses) {
      const extra = await fetchVerseRange(seed.bookName, seed.chapter, n, n, {
        translation: translationId,
        esvApiKey: user.esvApiKey,
      })
      extras.push(passageToPlainText(extra))
    }
    return {
      text: `${passageToPlainText(primary)} ${extras.join(' ')}`.trim(),
      reference: verse.reference,
    }
  }

  const content = await fetchVerseRange(
    verse.bookName,
    verse.chapter,
    verse.verseStart,
    verse.verseEnd,
    { translation: translationId, esvApiKey: user.esvApiKey },
  )
  return { text: passageToPlainText(content), reference: content.reference || verse.reference }
}
