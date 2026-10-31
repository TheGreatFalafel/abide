/** Minimal shape — matches loaded PassageContent without requiring full bibleApi fields. */
type PassageLike = {
  verses: Array<{ number: number; text: string }>
}

/**
 * Primary passages must all be present with verse text before quiz unlock.
 * Cached offline passages that already loaded count as ready.
 */
export function curriculumPrimaryPassagesReady(
  primaryCount: number,
  passages: Array<PassageLike | null | undefined>,
  loading: boolean,
): boolean {
  if (loading || primaryCount < 1) return false
  return passages
    .slice(0, primaryCount)
    .every((p) => p != null && Array.isArray(p.verses) && p.verses.length > 0)
}
