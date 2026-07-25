import type { PassageRef } from '../data/books'

export type Reflection = {
  prompt: string
  options: string[]
}

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(items: T[], rand: () => number): T {
  return items[Math.floor(rand() * items.length) % items.length]
}

function chapterLabel(ref: PassageRef): string {
  if (ref.heading) return `${ref.bookName} ${ref.chapter} (“${ref.heading}”)`
  return `${ref.bookName} ${ref.chapter}`
}

/** On multi-stream days, focus the heart check on one chapter (cycles with seed). */
function focusPassage(passages: PassageRef[], day: number, seed: number): PassageRef[] {
  if (passages.length <= 1) return passages
  const unique = new Map<string, PassageRef>()
  for (const p of passages) unique.set(`${p.bookId}:${p.chapter}`, p)
  const chapters = [...unique.values()]
  if (chapters.length <= 1) return chapters
  const rand = mulberry32(day * 10007 + seed * 9176 + chapters.length * 13)
  return [chapters[Math.floor(rand() * chapters.length) % chapters.length]]
}

function bookIds(passages: PassageRef[]): string[] {
  return [...new Set(passages.map((p) => p.bookId))]
}

type BankItem = {
  /** Match if any of these book ids appear (empty = always eligible) */
  books?: string[]
  /** Match testament */
  testament?: 'OT' | 'NT'
  prompt: (label: string) => string
  options: string[]
}

const BANK: BankItem[] = [
  {
    prompt: (label) => `In ${label}, what stood out to you most?`,
    options: [
      'A promise from God',
      'A warning or challenge',
      'Comfort for hard times',
      'A detail I had never noticed',
    ],
  },
  {
    prompt: (label) => `After reading ${label}, who is God revealing Himself to be?`,
    options: [
      'Faithful and near',
      'Holy and just',
      'Merciful and patient',
      'Wise and sovereign',
    ],
  },
  {
    prompt: (label) => `What response does ${label} invite from you today?`,
    options: [
      'Trust God with something specific',
      'Obey in a concrete step',
      'Give thanks or praise',
      'Pray for someone else',
    ],
  },
  {
    prompt: (label) => `If you retold ${label} in one sentence, what would you emphasize?`,
    options: [
      'God’s initiative and grace',
      'Human failure and need',
      'A call to follow or believe',
      'Hope that still stands',
    ],
  },
  {
    books: ['genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy'],
    prompt: (label) => `In ${label}, how do you see God’s covenant care?`,
    options: [
      'He keeps His promises',
      'He provides in need',
      'He confronts sin',
      'He makes a way forward',
    ],
  },
  {
    books: ['matthew', 'mark', 'luke', 'john'],
    prompt: (label) => `In ${label}, what about Jesus most draws your attention?`,
    options: [
      'His compassion',
      'His authority',
      'His teaching',
      'His mission to save',
    ],
  },
  {
    books: ['psalms'],
    prompt: (label) => `Praying with ${label}, what do you want to bring to God?`,
    options: [
      'Honest lament',
      'Grateful praise',
      'A request for help',
      'Quiet trust',
    ],
  },
  {
    books: ['proverbs', 'ecclesiastes', 'job'],
    prompt: (label) => `From ${label}, what wisdom do you want to practice?`,
    options: [
      'Watch my words',
      'Fear the Lord first',
      'Seek counsel',
      'Hold plans loosely',
    ],
  },
  {
    books: ['romans', 'galatians', 'ephesians', 'philippians', 'colossians', 'hebrews'],
    prompt: (label) => `How does ${label} reshape the gospel for you today?`,
    options: [
      'Saved by grace, not works',
      'United to Christ',
      'Called to holy living',
      'Hope secured in Him',
    ],
  },
  {
    books: ['acts'],
    prompt: (label) => `In ${label}, where do you see the Spirit advancing the mission?`,
    options: [
      'Bold witness',
      'Unexpected doors',
      'Care for the church',
      'Joy in hardship',
    ],
  },
  {
    testament: 'OT',
    prompt: (label) => `Looking at ${label}, what Old Testament theme feels alive for you?`,
    options: [
      'God’s faithfulness to His people',
      'Justice and mercy together',
      'Waiting on the Lord’s timing',
      'Worship in every season',
    ],
  },
  {
    testament: 'NT',
    prompt: (label) => `After ${label}, how will you walk as a disciple today?`,
    options: [
      'Love someone practically',
      'Speak truth with grace',
      'Abide in Christ’s words',
      'Serve without needing credit',
    ],
  },
]

const OT = new Set(
  [
    'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth',
    '1samuel', '2samuel', '1kings', '2kings', '1chronicles', '2chronicles', 'ezra', 'nehemiah',
    'esther', 'job', 'psalms', 'proverbs', 'ecclesiastes', 'songofsolomon', 'isaiah', 'jeremiah',
    'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah',
    'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi',
  ],
)

function eligible(passages: PassageRef[]): BankItem[] {
  const ids = bookIds(passages)
  const hasOt = ids.some((id) => OT.has(id))
  const hasNt = ids.some((id) => !OT.has(id))
  return BANK.filter((item) => {
    if (item.books?.length) return item.books.some((b) => ids.includes(b))
    if (item.testament === 'OT') return hasOt
    if (item.testament === 'NT') return hasNt
    return true
  })
}

/** Passage-aware heart check; focuses on one chapter and cycles with `seed`. */
export function reflectionForPassages(
  passages: PassageRef[],
  day: number,
  seed = 0,
): Reflection {
  const focused = focusPassage(passages, day, seed)
  const label = focused[0] ? chapterLabel(focused[0]) : 'today’s reading'
  const pool = eligible(focused.length ? focused : passages)
  const rand = mulberry32(day * 10007 + seed * 9176 + (focused[0]?.chapter ?? 0) * 13)
  const item = pick(pool, rand)
  return {
    prompt: item.prompt(label),
    options: item.options,
  }
}

/** @deprecated Prefer reflectionForPassages */
export function reflectionForDay(day: number) {
  return reflectionForPassages([], day, 0)
}
