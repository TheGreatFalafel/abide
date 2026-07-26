import counts from './chapterVerseCounts.json'

/** Protestant canon: verses per chapter (KJV/ESV-compatible counts). */
export const CHAPTER_VERSE_COUNTS = counts as Record<string, number[]>

export function versesInChapter(bookId: string, chapter: number): number {
  const list = CHAPTER_VERSE_COUNTS[bookId]
  if (!list || chapter < 1 || chapter > list.length) return 0
  return list[chapter - 1]
}

export function totalVersesInBooks(bookIds: string[]): number {
  return bookIds.reduce((sum, id) => {
    const list = CHAPTER_VERSE_COUNTS[id] ?? []
    return sum + list.reduce((a, n) => a + n, 0)
  }, 0)
}
