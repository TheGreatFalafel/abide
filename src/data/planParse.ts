import { BOOKS, type PassageRef } from './books'

const BOOK_ALIASES: { name: string; book: (typeof BOOKS)[number] }[] = BOOKS.flatMap(
  (b) => {
    const aliases = [b.name]
    if (b.name === 'Psalms') aliases.push('Psalm')
    if (b.name === 'Song of Solomon') {
      aliases.push('Song of Songs', 'Canticles', 'Song of Solomon')
    }
    return aliases.map((name) => ({ name, book: b }))
  },
).sort((a, b) => b.name.length - a.name.length)

function findBook(label: string) {
  const hit = BOOK_ALIASES.find((a) =>
    label.toLowerCase().startsWith(a.name.toLowerCase() + ' '),
  )
  if (!hit) return null
  return {
    book: hit.book,
    rest: label.slice(hit.name.length).trim(),
  }
}

function chapterRefs(
  book: (typeof BOOKS)[number],
  start: number,
  end: number,
  verseStart?: number,
  verseEnd?: number,
): PassageRef[] {
  const refs: PassageRef[] = []
  const lo = Math.max(1, start)
  const hi = Math.min(end, book.chapters)
  for (let c = lo; c <= hi; c++) {
    const ref: PassageRef = {
      bookId: book.id,
      bookName: book.name,
      chapter: c,
    }
    if (c === lo && verseStart != null) ref.verseStart = verseStart
    if (c === hi && verseEnd != null) ref.verseEnd = verseEnd
    refs.push(ref)
  }
  return refs
}

/**
 * Parse labels like:
 * - Genesis 1
 * - Genesis 1-3
 * - Psalm 1:1-6
 * - Genesis 1:1-2:25
 * - Matthew 1:1-2:12
 */
export function parsePassageLabel(label: string): PassageRef[] {
  const cleaned = label.replace(/\s+/g, ' ').trim()
  const found = findBook(cleaned)
  if (!found) return []
  const { book, rest } = found

  // Book 1:2-3:4  (cross-chapter verse range)
  let m = rest.match(/^(\d+):(\d+)-(\d+):(\d+)$/)
  if (m) {
    return chapterRefs(book, Number(m[1]), Number(m[3]), Number(m[2]), Number(m[4]))
  }

  // Book 1:2-10  (same chapter verse range)
  m = rest.match(/^(\d+):(\d+)-(\d+)$/)
  if (m) {
    return [
      {
        bookId: book.id,
        bookName: book.name,
        chapter: Number(m[1]),
        verseStart: Number(m[2]),
        verseEnd: Number(m[3]),
      },
    ]
  }

  // Book 1:2  (single verse)
  m = rest.match(/^(\d+):(\d+)$/)
  if (m) {
    const v = Number(m[2])
    return [
      {
        bookId: book.id,
        bookName: book.name,
        chapter: Number(m[1]),
        verseStart: v,
        verseEnd: v,
      },
    ]
  }

  // Book 1-3  (chapter range)
  m = rest.match(/^(\d+)-(\d+)$/)
  if (m) {
    return chapterRefs(book, Number(m[1]), Number(m[2]))
  }

  // Book 1
  m = rest.match(/^(\d+)$/)
  if (m) {
    return chapterRefs(book, Number(m[1]), Number(m[1]))
  }

  return []
}

export function daysFromData2(data2: string[][]) {
  return data2.map((dayRefs, i) => {
    const passages = dayRefs.flatMap(parsePassageLabel)
    return {
      day: i + 1,
      passages,
      title: dayRefs.join(' · '),
      kind: 'read' as const,
    }
  })
}
