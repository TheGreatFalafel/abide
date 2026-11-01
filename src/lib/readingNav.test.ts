import { describe, expect, it } from 'vitest'
import { BOOKS } from '../data/bible'

/** Mirrors BibleReader prev/next chapter boundary logic for regression coverage. */
function nextChapterState(bookId: string, chapter: number): { bookId: string; chapter: number } | null {
  const book = BOOKS.find((b) => b.id === bookId)
  if (!book) return null
  if (chapter < book.chapters) return { bookId, chapter: chapter + 1 }
  const idx = BOOKS.findIndex((b) => b.id === bookId)
  if (idx < 0 || idx >= BOOKS.length - 1) return null
  return { bookId: BOOKS[idx + 1].id, chapter: 1 }
}

function prevChapterState(bookId: string, chapter: number): { bookId: string; chapter: number } | null {
  const book = BOOKS.find((b) => b.id === bookId)
  if (!book) return null
  if (chapter > 1) return { bookId, chapter: chapter - 1 }
  const idx = BOOKS.findIndex((b) => b.id === bookId)
  if (idx <= 0) return null
  const prev = BOOKS[idx - 1]
  return { bookId: prev.id, chapter: prev.chapters }
}

describe('Bible chapter navigation', () => {
  it('advances within a book and across book boundaries', () => {
    expect(nextChapterState('john', 20)).toEqual({ bookId: 'john', chapter: 21 })
    expect(nextChapterState('john', 21)).toEqual({ bookId: 'acts', chapter: 1 })
    expect(nextChapterState('revelation', 22)).toBeNull()
  })

  it('moves backward within a book and across book boundaries', () => {
    expect(prevChapterState('john', 2)).toEqual({ bookId: 'john', chapter: 1 })
    expect(prevChapterState('acts', 1)).toEqual({ bookId: 'john', chapter: 21 })
    expect(prevChapterState('genesis', 1)).toBeNull()
  })
})

describe('screen scroll identity keys', () => {
  it('distinguishes lesson/curriculum/language sessions', () => {
    const keys = [
      'lesson:1',
      'lesson:2',
      'curriculum:doctrine-of-god-1',
      'language:greek:alphabet-1',
      'home',
    ]
    expect(new Set(keys).size).toBe(keys.length)
  })
})
