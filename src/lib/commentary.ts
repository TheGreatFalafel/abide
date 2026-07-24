/** USFM-ish book IDs used by bible.helloao.org commentaries */
export const BOOK_OSIS: Record<string, string> = {
  genesis: 'GEN',
  exodus: 'EXO',
  leviticus: 'LEV',
  numbers: 'NUM',
  deuteronomy: 'DEU',
  joshua: 'JOS',
  judges: 'JDG',
  ruth: 'RUT',
  '1samuel': '1SA',
  '2samuel': '2SA',
  '1kings': '1KI',
  '2kings': '2KI',
  '1chronicles': '1CH',
  '2chronicles': '2CH',
  ezra: 'EZR',
  nehemiah: 'NEH',
  esther: 'EST',
  job: 'JOB',
  psalms: 'PSA',
  proverbs: 'PRO',
  ecclesiastes: 'ECC',
  songofsolomon: 'SNG',
  isaiah: 'ISA',
  jeremiah: 'JER',
  lamentations: 'LAM',
  ezekiel: 'EZK',
  daniel: 'DAN',
  hosea: 'HOS',
  joel: 'JOL',
  amos: 'AMO',
  obadiah: 'OBA',
  jonah: 'JON',
  micah: 'MIC',
  nahum: 'NAM',
  habakkuk: 'HAB',
  zephaniah: 'ZEP',
  haggai: 'HAG',
  zechariah: 'ZEC',
  malachi: 'MAL',
  matthew: 'MAT',
  mark: 'MRK',
  luke: 'LUK',
  john: 'JHN',
  acts: 'ACT',
  romans: 'ROM',
  '1corinthians': '1CO',
  '2corinthians': '2CO',
  galatians: 'GAL',
  ephesians: 'EPH',
  philippians: 'PHP',
  colossians: 'COL',
  '1thessalonians': '1TH',
  '2thessalonians': '2TH',
  '1timothy': '1TI',
  '2timothy': '2TI',
  titus: 'TIT',
  philemon: 'PHM',
  hebrews: 'HEB',
  james: 'JAS',
  '1peter': '1PE',
  '2peter': '2PE',
  '1john': '1JN',
  '2john': '2JN',
  '3john': '3JN',
  jude: 'JUD',
  revelation: 'REV',
}

export type CommentaryId = 'matthew-henry' | 'tyndale'

export const COMMENTARIES: {
  id: CommentaryId
  name: string
  short: string
  note: string
  license: string
}[] = [
  {
    id: 'matthew-henry',
    name: 'Matthew Henry',
    short: 'Matthew Henry',
    note: 'Classic Reformed pastoral commentary on nearly the whole Bible.',
    license: 'Public domain',
  },
  {
    id: 'tyndale',
    name: 'Tyndale Open Study Notes',
    short: 'Tyndale Notes',
    note: 'Modern study notes — clear and accessible.',
    license: 'CC BY-SA 4.0',
  },
]

type CommentaryEntry = {
  verse: number
  text: string
}

type ChapterCache = {
  entries: CommentaryEntry[]
  introduction?: string
  name: string
}

const cache = new Map<string, ChapterCache>()

function flattenContent(content: unknown): string {
  if (typeof content === 'string') return content.trim()
  if (Array.isArray(content)) {
    return content.map(flattenContent).filter(Boolean).join('\n\n')
  }
  if (content && typeof content === 'object') {
    const obj = content as { text?: string; content?: unknown }
    if (typeof obj.text === 'string') return obj.text.trim()
    if (obj.content !== undefined) return flattenContent(obj.content)
  }
  return ''
}

export async function fetchChapterCommentary(
  commentaryId: CommentaryId,
  bookId: string,
  chapter: number,
): Promise<ChapterCache> {
  const osis = BOOK_OSIS[bookId]
  if (!osis) throw new Error('Commentary is not available for this book.')
  const key = `${commentaryId}:${osis}:${chapter}`
  const hit = cache.get(key)
  if (hit) return hit

  const res = await fetch(
    `https://bible.helloao.org/api/c/${commentaryId}/${osis}/${chapter}.json`,
  )
  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? 'No commentary for this chapter.'
        : `Could not load commentary (${res.status})`,
    )
  }
  const data = (await res.json()) as {
    commentary?: { name?: string }
    chapter?: {
      introduction?: string
      content?: { type?: string; number?: number; content?: unknown }[]
    }
  }

  const entries: CommentaryEntry[] = []
  for (const item of data.chapter?.content ?? []) {
    if (item.type !== 'verse' || typeof item.number !== 'number') continue
    const text = flattenContent(item.content)
    if (text) entries.push({ verse: item.number, text })
  }
  entries.sort((a, b) => a.verse - b.verse)

  const parsed: ChapterCache = {
    entries,
    introduction: data.chapter?.introduction
      ? flattenContent(data.chapter.introduction)
      : undefined,
    name: data.commentary?.name || commentaryId,
  }
  cache.set(key, parsed)
  return parsed
}

/** Pick the commentary block that covers this verse (MH often groups ranges). */
export function commentaryForVerse(
  chapter: ChapterCache,
  verse: number,
): { text: string; fromVerse: number } | null {
  let best: CommentaryEntry | null = null
  for (const entry of chapter.entries) {
    if (entry.verse <= verse) best = entry
    else break
  }
  if (best) return { text: best.text, fromVerse: best.verse }
  if (chapter.introduction) {
    return { text: chapter.introduction, fromVerse: 0 }
  }
  return null
}
