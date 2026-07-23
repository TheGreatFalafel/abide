export type MemoryVerseSeed = {
  bookName: string
  bookId: string
  chapter: number
  verseStart: number
  verseEnd?: number
  label: string
}

/** Classic memory pack — text is fetched in the user’s chosen translation. */
export const MEMORY_STARTERS: MemoryVerseSeed[] = [
  {
    bookName: 'John',
    bookId: 'john',
    chapter: 3,
    verseStart: 16,
    label: 'God so loved',
  },
  {
    bookName: 'Philippians',
    bookId: 'philippians',
    chapter: 4,
    verseStart: 6,
    verseEnd: 7,
    label: 'Do not be anxious',
  },
  {
    bookName: 'Romans',
    bookId: 'romans',
    chapter: 8,
    verseStart: 28,
    label: 'All things work together',
  },
  {
    bookName: 'Joshua',
    bookId: 'joshua',
    chapter: 1,
    verseStart: 9,
    label: 'Be strong and courageous',
  },
  {
    bookName: 'Psalms',
    bookId: 'psalms',
    chapter: 23,
    verseStart: 1,
    verseEnd: 3,
    label: 'The Lord is my shepherd',
  },
  {
    bookName: 'Isaiah',
    bookId: 'isaiah',
    chapter: 40,
    verseStart: 31,
    label: 'Those who wait for the Lord',
  },
  {
    bookName: 'Matthew',
    bookId: 'matthew',
    chapter: 6,
    verseStart: 33,
    label: 'Seek first the kingdom',
  },
  {
    bookName: '2 Timothy',
    bookId: '2timothy',
    chapter: 3,
    verseStart: 16,
    verseEnd: 17,
    label: 'All Scripture is breathed out',
  },
  {
    bookName: 'Proverbs',
    bookId: 'proverbs',
    chapter: 3,
    verseStart: 5,
    verseEnd: 6,
    label: 'Trust in the Lord',
  },
  {
    bookName: 'Hebrews',
    bookId: 'hebrews',
    chapter: 4,
    verseStart: 12,
    label: 'Living and active',
  },
]
