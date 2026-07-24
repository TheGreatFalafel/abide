import sectionHeadingsRaw from '../data/sectionHeadings.json'

/** bookName → chapter → verseStart → heading */
type HeadingTree = Record<string, Record<string, Record<string, string>>>

const HEADINGS = sectionHeadingsRaw as HeadingTree

export type SectionBreak = {
  verseStart: number
  heading: string
}

/** Standard section breaks for a chapter (shared across translations). */
export function getSectionBreaks(bookName: string, chapter: number): SectionBreak[] {
  const chapterMap = HEADINGS[bookName]?.[String(chapter)]
  if (!chapterMap) return [{ verseStart: 1, heading: `${bookName} ${chapter}` }]
  return Object.entries(chapterMap)
    .map(([verse, heading]) => ({
      verseStart: Number(verse),
      heading,
    }))
    .sort((a, b) => a.verseStart - b.verseStart)
}

export function applySectionHeadings(
  bookName: string,
  chapter: number,
  verses: { number: number; text: string; heading?: string }[],
): { number: number; text: string; heading?: string }[] {
  const breaks = getSectionBreaks(bookName, chapter)
  if (!breaks.length) return verses
  return verses.map((v) => {
    const match = breaks.find((b) => b.verseStart === v.number)
    if (match) return { ...v, heading: match.heading }
    return { ...v, heading: undefined }
  })
}
