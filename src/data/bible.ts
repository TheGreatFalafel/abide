import { PLAN_QUIZZES } from './planQuizzes'

export type BibleBook = {
  id: string
  name: string
  chapters: number
  testament: 'OT' | 'NT'
}

export const BOOKS: BibleBook[] = [
  { id: 'genesis', name: 'Genesis', chapters: 50, testament: 'OT' },
  { id: 'exodus', name: 'Exodus', chapters: 40, testament: 'OT' },
  { id: 'leviticus', name: 'Leviticus', chapters: 27, testament: 'OT' },
  { id: 'numbers', name: 'Numbers', chapters: 36, testament: 'OT' },
  { id: 'deuteronomy', name: 'Deuteronomy', chapters: 34, testament: 'OT' },
  { id: 'joshua', name: 'Joshua', chapters: 24, testament: 'OT' },
  { id: 'judges', name: 'Judges', chapters: 21, testament: 'OT' },
  { id: 'ruth', name: 'Ruth', chapters: 4, testament: 'OT' },
  { id: '1samuel', name: '1 Samuel', chapters: 31, testament: 'OT' },
  { id: '2samuel', name: '2 Samuel', chapters: 24, testament: 'OT' },
  { id: '1kings', name: '1 Kings', chapters: 22, testament: 'OT' },
  { id: '2kings', name: '2 Kings', chapters: 25, testament: 'OT' },
  { id: '1chronicles', name: '1 Chronicles', chapters: 29, testament: 'OT' },
  { id: '2chronicles', name: '2 Chronicles', chapters: 36, testament: 'OT' },
  { id: 'ezra', name: 'Ezra', chapters: 10, testament: 'OT' },
  { id: 'nehemiah', name: 'Nehemiah', chapters: 13, testament: 'OT' },
  { id: 'esther', name: 'Esther', chapters: 10, testament: 'OT' },
  { id: 'job', name: 'Job', chapters: 42, testament: 'OT' },
  { id: 'psalms', name: 'Psalms', chapters: 150, testament: 'OT' },
  { id: 'proverbs', name: 'Proverbs', chapters: 31, testament: 'OT' },
  { id: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12, testament: 'OT' },
  { id: 'songofsolomon', name: 'Song of Solomon', chapters: 8, testament: 'OT' },
  { id: 'isaiah', name: 'Isaiah', chapters: 66, testament: 'OT' },
  { id: 'jeremiah', name: 'Jeremiah', chapters: 52, testament: 'OT' },
  { id: 'lamentations', name: 'Lamentations', chapters: 5, testament: 'OT' },
  { id: 'ezekiel', name: 'Ezekiel', chapters: 48, testament: 'OT' },
  { id: 'daniel', name: 'Daniel', chapters: 12, testament: 'OT' },
  { id: 'hosea', name: 'Hosea', chapters: 14, testament: 'OT' },
  { id: 'joel', name: 'Joel', chapters: 3, testament: 'OT' },
  { id: 'amos', name: 'Amos', chapters: 9, testament: 'OT' },
  { id: 'obadiah', name: 'Obadiah', chapters: 1, testament: 'OT' },
  { id: 'jonah', name: 'Jonah', chapters: 4, testament: 'OT' },
  { id: 'micah', name: 'Micah', chapters: 7, testament: 'OT' },
  { id: 'nahum', name: 'Nahum', chapters: 3, testament: 'OT' },
  { id: 'habakkuk', name: 'Habakkuk', chapters: 3, testament: 'OT' },
  { id: 'zephaniah', name: 'Zephaniah', chapters: 3, testament: 'OT' },
  { id: 'haggai', name: 'Haggai', chapters: 2, testament: 'OT' },
  { id: 'zechariah', name: 'Zechariah', chapters: 14, testament: 'OT' },
  { id: 'malachi', name: 'Malachi', chapters: 4, testament: 'OT' },
  { id: 'matthew', name: 'Matthew', chapters: 28, testament: 'NT' },
  { id: 'mark', name: 'Mark', chapters: 16, testament: 'NT' },
  { id: 'luke', name: 'Luke', chapters: 24, testament: 'NT' },
  { id: 'john', name: 'John', chapters: 21, testament: 'NT' },
  { id: 'acts', name: 'Acts', chapters: 28, testament: 'NT' },
  { id: 'romans', name: 'Romans', chapters: 16, testament: 'NT' },
  { id: '1corinthians', name: '1 Corinthians', chapters: 16, testament: 'NT' },
  { id: '2corinthians', name: '2 Corinthians', chapters: 13, testament: 'NT' },
  { id: 'galatians', name: 'Galatians', chapters: 6, testament: 'NT' },
  { id: 'ephesians', name: 'Ephesians', chapters: 6, testament: 'NT' },
  { id: 'philippians', name: 'Philippians', chapters: 4, testament: 'NT' },
  { id: 'colossians', name: 'Colossians', chapters: 4, testament: 'NT' },
  { id: '1thessalonians', name: '1 Thessalonians', chapters: 5, testament: 'NT' },
  { id: '2thessalonians', name: '2 Thessalonians', chapters: 3, testament: 'NT' },
  { id: '1timothy', name: '1 Timothy', chapters: 6, testament: 'NT' },
  { id: '2timothy', name: '2 Timothy', chapters: 4, testament: 'NT' },
  { id: 'titus', name: 'Titus', chapters: 3, testament: 'NT' },
  { id: 'philemon', name: 'Philemon', chapters: 1, testament: 'NT' },
  { id: 'hebrews', name: 'Hebrews', chapters: 13, testament: 'NT' },
  { id: 'james', name: 'James', chapters: 5, testament: 'NT' },
  { id: '1peter', name: '1 Peter', chapters: 5, testament: 'NT' },
  { id: '2peter', name: '2 Peter', chapters: 3, testament: 'NT' },
  { id: '1john', name: '1 John', chapters: 5, testament: 'NT' },
  { id: '2john', name: '2 John', chapters: 1, testament: 'NT' },
  { id: '3john', name: '3 John', chapters: 1, testament: 'NT' },
  { id: 'jude', name: 'Jude', chapters: 1, testament: 'NT' },
  { id: 'revelation', name: 'Revelation', chapters: 22, testament: 'NT' },
]

export type PassageRef = {
  bookId: string
  bookName: string
  chapter: number
}

export type PlanDay = {
  day: number
  passages: PassageRef[]
  title: string
  kind: 'read' | 'quiz'
  sectionLabel?: string
  quizId?: string
  quizIndex?: number
}

export type ReadingPlan = {
  id: string
  name: string
  blurb: string
  days: number
  vibe: string
  generate: () => PlanDay[]
}

function chaptersFrom(bookIds: string[]): PassageRef[] {
  const refs: PassageRef[] = []
  for (const id of bookIds) {
    const book = BOOKS.find((b) => b.id === id)
    if (!book) continue
    for (let c = 1; c <= book.chapters; c++) {
      refs.push({ bookId: book.id, bookName: book.name, chapter: c })
    }
  }
  return refs
}

function titleFor(slice: PassageRef[]): string {
  const first = slice[0]
  const last = slice[slice.length - 1]
  if (slice.length === 1) return `${first.bookName} ${first.chapter}`
  if (first.bookName === last.bookName) {
    return `${first.bookName} ${first.chapter}–${last.chapter}`
  }
  return `${first.bookName} ${first.chapter} → ${last.bookName} ${last.chapter}`
}

/** Spread passages across N days as evenly as possible (reading days only). */
function chunkPassages(passages: PassageRef[], days: number): PlanDay[] {
  const total = passages.length
  if (!total) return []
  const dayCount = Math.min(days, total)
  const base = Math.floor(total / dayCount)
  const extra = total % dayCount
  const plan: PlanDay[] = []
  let idx = 0
  for (let i = 0; i < dayCount; i++) {
    const count = base + (i < extra ? 1 : 0)
    const slice = passages.slice(idx, idx + count)
    idx += count
    plan.push({
      day: i + 1,
      passages: slice,
      title: titleFor(slice),
      kind: 'read',
    })
  }
  return plan
}

/** After every N reading days, insert a quiz checkpoint node. */
function withPlanQuizzes(planId: string, readDays: PlanDay[]): PlanDay[] {
  const pack = PLAN_QUIZZES[planId]
  if (!pack) {
    return readDays.map((d, i) => ({ ...d, day: i + 1, kind: 'read' as const }))
  }

  const out: PlanDay[] = []
  let quizCount = 0
  let readsSinceQuiz = 0

  for (const day of readDays) {
    out.push({ ...day, kind: 'read' })
    readsSinceQuiz += 1
    if (readsSinceQuiz >= pack.every && quizCount < pack.quizzes.length) {
      const quiz = pack.quizzes[quizCount]
      out.push({
        day: 0,
        passages: [],
        title: quiz.title,
        kind: 'quiz',
        sectionLabel: `Section ${quizCount + 1}`,
        quizId: quiz.id,
        quizIndex: quizCount,
      })
      quizCount += 1
      readsSinceQuiz = 0
    }
  }

  return out.map((d, i) => ({ ...d, day: i + 1 }))
}

/**
 * Classic dual-stream year plan: OT + NT each day.
 * ~3–4 chapters/day total across 365 days.
 */
function bibleInAYear(): PlanDay[] {
  const ot = chaptersFrom(BOOKS.filter((b) => b.testament === 'OT').map((b) => b.id))
  const nt = chaptersFrom(BOOKS.filter((b) => b.testament === 'NT').map((b) => b.id))
  const days = 365
  const plan: PlanDay[] = []

  for (let i = 0; i < days; i++) {
    const otStart = Math.floor((i * ot.length) / days)
    const otEnd = Math.floor(((i + 1) * ot.length) / days)
    const ntStart = Math.floor((i * nt.length) / days)
    const ntEnd = Math.floor(((i + 1) * nt.length) / days)
    const passages = [...ot.slice(otStart, otEnd), ...nt.slice(ntStart, ntEnd)]
    if (!passages.length) continue
    plan.push({
      day: plan.length + 1,
      passages,
      title: titleFor(passages),
      kind: 'read',
    })
  }
  return withPlanQuizzes('year', plan)
}

export const PLANS: ReadingPlan[] = [
  {
    id: 'year',
    name: 'Bible in a Year',
    blurb: 'Old & New Testament each day — the whole Bible in 365 days.',
    days: 365,
    vibe: 'Full journey',
    generate: bibleInAYear,
  },
  {
    id: 'gospels',
    name: 'Gospel Path',
    blurb: 'Walk with Jesus through Matthew, Mark, Luke & John.',
    days: 89,
    vibe: 'Gentle & focused',
    generate: () =>
      withPlanQuizzes(
        'gospels',
        chunkPassages(chaptersFrom(['matthew', 'mark', 'luke', 'john']), 89),
      ),
  },
  {
    id: 'psalms30',
    name: 'Psalms Pulse',
    blurb: 'Five psalms a day — prayer, praise, and honesty.',
    days: 30,
    vibe: 'Daily breath',
    generate: () =>
      withPlanQuizzes('psalms30', chunkPassages(chaptersFrom(['psalms']), 30)),
  },
  {
    id: 'nt90',
    name: 'New Testament Trail',
    blurb: 'The whole NT in about three months — one steady pace.',
    days: 90,
    vibe: 'Strong habit',
    generate: () =>
      withPlanQuizzes(
        'nt90',
        chunkPassages(
          chaptersFrom(BOOKS.filter((b) => b.testament === 'NT').map((b) => b.id)),
          90,
        ),
      ),
  },
  {
    id: 'proverbs31',
    name: 'Wisdom Month',
    blurb: 'One chapter of Proverbs each day for 31 days.',
    days: 31,
    vibe: 'Quick win',
    generate: () =>
      withPlanQuizzes('proverbs31', chunkPassages(chaptersFrom(['proverbs']), 31)),
  },
]

export function getPlanById(id: string): ReadingPlan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0]
}

export function apiQuery(ref: PassageRef): string {
  return `${ref.bookName} ${ref.chapter}`
}

export function verseQuery(
  bookName: string,
  chapter: number,
  verseStart: number,
  verseEnd?: number,
): string {
  if (!verseEnd || verseEnd === verseStart) {
    return `${bookName} ${chapter}:${verseStart}`
  }
  return `${bookName} ${chapter}:${verseStart}-${verseEnd}`
}
