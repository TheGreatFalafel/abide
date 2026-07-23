/**
 * Verse *references* from The Navigators’ Topical Memory System (TMS).
 * Scripture text is fetched live in the user’s chosen translation.
 * TMS © The Navigators — pack structure used with attribution.
 * https://www.navigators.org/resource/topical-memory-system/
 */

export type TmsVerse = {
  bookName: string
  bookId: string
  chapter: number
  verseStart: number
  verseEnd?: number
  /** Non-contiguous extras (e.g. Psalm 119:9,11) */
  extraVerses?: number[]
  topic: string
  seriesId: 'A' | 'B' | 'C' | 'D' | 'E'
  seriesName: string
}

export const TMS_SERIES: { id: TmsVerse['seriesId']; name: string }[] = [
  { id: 'A', name: 'Live the New Life' },
  { id: 'B', name: 'Proclaim Christ' },
  { id: 'C', name: "Rely on God's Resources" },
  { id: 'D', name: "Be Christ's Disciple" },
  { id: 'E', name: 'Grow in Christlikeness' },
]

function v(
  seriesId: TmsVerse['seriesId'],
  seriesName: string,
  topic: string,
  bookName: string,
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd?: number,
  extraVerses?: number[],
): TmsVerse {
  return {
    seriesId,
    seriesName,
    topic,
    bookName,
    bookId,
    chapter,
    verseStart,
    verseEnd,
    extraVerses,
  }
}

export const TMS_VERSES: TmsVerse[] = [
  // Series A — Live the New Life
  v('A', 'Live the New Life', 'Christ the Center', '2 Corinthians', '2corinthians', 5, 17),
  v('A', 'Live the New Life', 'Christ the Center', 'Galatians', 'galatians', 2, 20),
  v('A', 'Live the New Life', 'Obedience to Christ', 'Romans', 'romans', 12, 1),
  v('A', 'Live the New Life', 'Obedience to Christ', 'John', 'john', 14, 21),
  v('A', 'Live the New Life', 'The Word', '2 Timothy', '2timothy', 3, 16),
  v('A', 'Live the New Life', 'The Word', 'Joshua', 'joshua', 1, 8),
  v('A', 'Live the New Life', 'Prayer', 'John', 'john', 15, 7),
  v('A', 'Live the New Life', 'Prayer', 'Philippians', 'philippians', 4, 6, 7),
  v('A', 'Live the New Life', 'Fellowship', 'Matthew', 'matthew', 18, 20),
  v('A', 'Live the New Life', 'Fellowship', 'Hebrews', 'hebrews', 10, 24, 25),
  v('A', 'Live the New Life', 'Witnessing', 'Matthew', 'matthew', 4, 19),
  v('A', 'Live the New Life', 'Witnessing', 'Romans', 'romans', 1, 16),

  // Series B — Proclaim Christ
  v('B', 'Proclaim Christ', 'All Have Sinned', 'Romans', 'romans', 3, 23),
  v('B', 'Proclaim Christ', 'All Have Sinned', 'Isaiah', 'isaiah', 53, 6),
  v('B', 'Proclaim Christ', "Sin's Penalty", 'Romans', 'romans', 6, 23),
  v('B', 'Proclaim Christ', "Sin's Penalty", 'Hebrews', 'hebrews', 9, 27),
  v('B', 'Proclaim Christ', 'Christ Paid the Penalty', 'Romans', 'romans', 5, 8),
  v('B', 'Proclaim Christ', 'Christ Paid the Penalty', '1 Peter', '1peter', 3, 18),
  v('B', 'Proclaim Christ', 'Salvation Not by Works', 'Ephesians', 'ephesians', 2, 8, 9),
  v('B', 'Proclaim Christ', 'Salvation Not by Works', 'Titus', 'titus', 3, 5),
  v('B', 'Proclaim Christ', 'Must Receive Christ', 'John', 'john', 1, 12),
  v('B', 'Proclaim Christ', 'Must Receive Christ', 'Revelation', 'revelation', 3, 20),
  v('B', 'Proclaim Christ', 'Assurance of Salvation', '1 John', '1john', 5, 13),
  v('B', 'Proclaim Christ', 'Assurance of Salvation', 'John', 'john', 5, 24),

  // Series C — Rely on God's Resources
  v('C', "Rely on God's Resources", 'His Spirit', '1 Corinthians', '1corinthians', 3, 16),
  v('C', "Rely on God's Resources", 'His Spirit', '1 Corinthians', '1corinthians', 2, 12),
  v('C', "Rely on God's Resources", 'His Strength', 'Isaiah', 'isaiah', 41, 10),
  v('C', "Rely on God's Resources", 'His Strength', 'Philippians', 'philippians', 4, 13),
  v('C', "Rely on God's Resources", 'His Faithfulness', 'Lamentations', 'lamentations', 3, 22, 23),
  v('C', "Rely on God's Resources", 'His Faithfulness', 'Numbers', 'numbers', 23, 19),
  v('C', "Rely on God's Resources", 'His Peace', 'Isaiah', 'isaiah', 26, 3),
  v('C', "Rely on God's Resources", 'His Peace', '1 Peter', '1peter', 5, 7),
  v('C', "Rely on God's Resources", 'His Provision', 'Romans', 'romans', 8, 32),
  v('C', "Rely on God's Resources", 'His Provision', 'Philippians', 'philippians', 4, 19),
  v('C', "Rely on God's Resources", 'His Help in Temptation', 'Hebrews', 'hebrews', 2, 18),
  v('C', "Rely on God's Resources", 'His Help in Temptation', 'Psalms', 'psalms', 119, 9, undefined, [11]),

  // Series D — Be Christ's Disciple
  v('D', "Be Christ's Disciple", 'Put Christ First', 'Matthew', 'matthew', 6, 33),
  v('D', "Be Christ's Disciple", 'Put Christ First', 'Luke', 'luke', 9, 23),
  v('D', "Be Christ's Disciple", 'Separate from the World', '1 John', '1john', 2, 15, 16),
  v('D', "Be Christ's Disciple", 'Separate from the World', 'Romans', 'romans', 12, 2),
  v('D', "Be Christ's Disciple", 'Be Steadfast', '1 Corinthians', '1corinthians', 15, 58),
  v('D', "Be Christ's Disciple", 'Be Steadfast', 'Hebrews', 'hebrews', 12, 3),
  v('D', "Be Christ's Disciple", 'Serve Others', 'Mark', 'mark', 10, 45),
  v('D', "Be Christ's Disciple", 'Serve Others', '2 Corinthians', '2corinthians', 4, 5),
  v('D', "Be Christ's Disciple", 'Give Generously', 'Proverbs', 'proverbs', 3, 9, 10),
  v('D', "Be Christ's Disciple", 'Give Generously', '2 Corinthians', '2corinthians', 9, 6, 7),
  v('D', "Be Christ's Disciple", 'Develop World Vision', 'Acts', 'acts', 1, 8),
  v('D', "Be Christ's Disciple", 'Develop World Vision', 'Matthew', 'matthew', 28, 19, 20),

  // Series E — Grow in Christlikeness
  v('E', 'Grow in Christlikeness', 'Love', 'John', 'john', 13, 34, 35),
  v('E', 'Grow in Christlikeness', 'Love', '1 John', '1john', 3, 18),
  v('E', 'Grow in Christlikeness', 'Humility', 'Philippians', 'philippians', 2, 3, 4),
  v('E', 'Grow in Christlikeness', 'Humility', '1 Peter', '1peter', 5, 5, 6),
  v('E', 'Grow in Christlikeness', 'Purity', 'Ephesians', 'ephesians', 5, 3),
  v('E', 'Grow in Christlikeness', 'Purity', '1 Peter', '1peter', 2, 11),
  v('E', 'Grow in Christlikeness', 'Honesty', 'Leviticus', 'leviticus', 19, 11),
  v('E', 'Grow in Christlikeness', 'Honesty', 'Acts', 'acts', 24, 16),
  v('E', 'Grow in Christlikeness', 'Faith', 'Hebrews', 'hebrews', 11, 6),
  v('E', 'Grow in Christlikeness', 'Faith', 'Romans', 'romans', 4, 20, 21),
  v('E', 'Grow in Christlikeness', 'Good Works', 'Galatians', 'galatians', 6, 9, 10),
  v('E', 'Grow in Christlikeness', 'Good Works', 'Matthew', 'matthew', 5, 16),
]

export function tmsRefLabel(v: TmsVerse): string {
  if (v.extraVerses?.length) {
    return `${v.bookName} ${v.chapter}:${v.verseStart},${v.extraVerses.join(',')}`
  }
  if (v.verseEnd && v.verseEnd !== v.verseStart) {
    return `${v.bookName} ${v.chapter}:${v.verseStart}-${v.verseEnd}`
  }
  return `${v.bookName} ${v.chapter}:${v.verseStart}`
}
