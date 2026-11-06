import type { GameDifficulty } from '../../games/types'

export type BookChallengeItem = {
  id: string
  prompt: string
  choices: string[]
  answer: number
  explanation: string
  difficulty: GameDifficulty
  kind: 'fact' | 'order' | 'genre' | 'author' | 'group'
}

/** Update Pack Part 7.3 */
export const BOOK_CHALLENGE_BANK: BookChallengeItem[] = [
  { id: 'bob-1', kind: 'fact', prompt: 'What is the first book of the Bible?', choices: ['Genesis', 'Matthew', 'Psalms', 'Revelation'], answer: 0, explanation: 'Genesis opens the canon.', difficulty: 'beginner' },
  { id: 'bob-2', kind: 'fact', prompt: 'What is the last book of the Bible?', choices: ['Malachi', 'Acts', 'Jude', 'Revelation'], answer: 3, explanation: 'Revelation closes the canon.', difficulty: 'beginner' },
  { id: 'bob-3', kind: 'fact', prompt: 'How many Old Testament books are in the Protestant canon?', choices: ['27', '39', '46', '66'], answer: 1, explanation: 'Protestants count 39 OT books.', difficulty: 'beginner' },
  { id: 'bob-4', kind: 'fact', prompt: 'How many New Testament books are there?', choices: ['27', '39', '12', '4'], answer: 0, explanation: 'Twenty-seven NT books.', difficulty: 'beginner' },
  { id: 'bob-5', kind: 'order', prompt: 'Which is the correct Pentateuch order?', choices: ['Genesis, Exodus, Leviticus, Numbers, Deuteronomy', 'Genesis, Leviticus, Exodus, Numbers, Deuteronomy', 'Exodus, Genesis, Leviticus, Numbers, Deuteronomy', 'Genesis, Exodus, Numbers, Leviticus, Deuteronomy'], answer: 0, explanation: 'Law books follow that sequence.', difficulty: 'beginner' },
  { id: 'bob-6', kind: 'fact', prompt: 'Which book is a collection of songs and prayers?', choices: ['Proverbs', 'Psalms', 'Acts', 'Jude'], answer: 1, explanation: 'Psalms is Israel’s songbook.', difficulty: 'beginner' },
  { id: 'bob-7', kind: 'fact', prompt: 'Which four books are the Gospels?', choices: ['Matthew, Mark, Luke, John', 'Acts, Romans, Hebrews, Revelation', 'Genesis–Numbers', 'James, Peter, Jude, John'], answer: 0, explanation: 'Four canonical Gospels.', difficulty: 'beginner' },
  { id: 'bob-8', kind: 'fact', prompt: 'Which book is a collection of wise sayings?', choices: ['Psalms', 'Proverbs', 'Revelation', 'Acts'], answer: 1, explanation: 'Proverbs teaches wisdom.', difficulty: 'beginner' },
  { id: 'bob-9', kind: 'genre', prompt: 'Sort Ruth into which genre?', choices: ['History', 'Major prophet', 'Epistle', 'Apocalypse'], answer: 0, explanation: 'Ruth is OT historical narrative.', difficulty: 'intermediate' },
  { id: 'bob-10', kind: 'genre', prompt: 'Sort Job into which genre?', choices: ['History', 'Wisdom and poetry', 'Minor prophet', 'Gospel'], answer: 1, explanation: 'Job is wisdom/poetry.', difficulty: 'intermediate' },
  { id: 'bob-11', kind: 'genre', prompt: 'Sort Isaiah into which genre?', choices: ['Minor prophet', 'Major prophet', 'Epistle', 'Law'], answer: 1, explanation: 'Isaiah is a Major Prophet.', difficulty: 'intermediate' },
  { id: 'bob-12', kind: 'genre', prompt: 'Sort Jonah into which genre?', choices: ['Major prophet', 'Minor prophet', 'Gospel', 'Wisdom'], answer: 1, explanation: 'Jonah is among the Twelve.', difficulty: 'intermediate' },
  { id: 'bob-13', kind: 'genre', prompt: 'Sort Romans into which genre?', choices: ['Gospel', 'History', 'Epistle', 'Law'], answer: 2, explanation: 'Romans is a Pauline epistle.', difficulty: 'intermediate' },
  { id: 'bob-14', kind: 'author', prompt: 'Who traditionally wrote the Pentateuch?', choices: ['David', 'Moses', 'Ezra only', 'Paul'], answer: 1, explanation: 'Mosaic authorship is the traditional view.', difficulty: 'intermediate' },
  { id: 'bob-15', kind: 'author', prompt: 'Who wrote Luke and Acts?', choices: ['Luke', 'Peter', 'James', 'Matthew'], answer: 0, explanation: 'Luke-Acts share authorship.', difficulty: 'intermediate' },
  { id: 'bob-16', kind: 'order', prompt: 'Which NT order is correct?', choices: ['Acts, Romans, 1 Corinthians, Galatians', 'Romans, Acts, Galatians, 1 Corinthians', 'Galatians, Acts, Romans, 1 Corinthians', '1 Corinthians, Acts, Romans, Galatians'], answer: 0, explanation: 'Acts then major Paulines in common Protestant order.', difficulty: 'intermediate' },
  { id: 'bob-17', kind: 'author', prompt: 'Which apostle wrote the fourth Gospel?', choices: ['Matthew', 'Mark', 'Luke', 'John'], answer: 3, explanation: 'John is the traditional author.', difficulty: 'intermediate' },
  { id: 'bob-18', kind: 'author', prompt: 'Who wrote Hebrews?', choices: ['Paul, named in the text', 'The author is not named; scholars differ', 'Peter only', 'Barnabas, named in the text'], answer: 1, explanation: 'Hebrews is anonymous in the text.', difficulty: 'advanced' },
  { id: 'bob-19', kind: 'fact', prompt: 'Which three Gospels are the synoptics?', choices: ['Matthew, Mark, Luke', 'Matthew, Luke, John', 'Mark, Luke, John', 'Only John'], answer: 0, explanation: 'Synoptics share much structure and content.', difficulty: 'advanced' },
  { id: 'bob-20', kind: 'group', prompt: 'Which books are the General Epistles?', choices: ['James; 1–2 Peter; 1–3 John; Jude', 'Romans–Philemon only', 'Matthew–John', 'Genesis–Deuteronomy'], answer: 0, explanation: 'Catholic/General Epistles set.', difficulty: 'advanced' },
  { id: 'bob-21', kind: 'group', prompt: 'Which are the Prison Epistles?', choices: ['Ephesians, Philippians, Colossians, Philemon', '1–2 Timothy, Titus', 'James, Jude', 'Hebrews only'], answer: 0, explanation: 'Written during Paul’s imprisonment.', difficulty: 'advanced' },
  { id: 'bob-22', kind: 'group', prompt: 'Which are the Pastoral Epistles?', choices: ['1–2 Timothy, Titus', 'Romans, Galatians', '1–2 Peter', 'Jude, Revelation'], answer: 0, explanation: 'Letters to Timothy and Titus.', difficulty: 'advanced' },
  { id: 'bob-23', kind: 'fact', prompt: 'How many Major Prophets and Minor Prophets (Protestant count)?', choices: ['5 and 12', '12 and 5', '4 and 12', '5 and 5'], answer: 0, explanation: 'Isaiah–Daniel (5); Hosea–Malachi (12).', difficulty: 'advanced' },
  { id: 'bob-24', kind: 'fact', prompt: 'Which book does not mention God by name?', choices: ['Esther', 'Ruth', 'Jonah', 'Daniel'], answer: 0, explanation: 'Esther never uses the divine name.', difficulty: 'advanced' },
  { id: 'bob-25', kind: 'fact', prompt: 'Which book records the Jerusalem Council?', choices: ['Acts', 'Romans', 'Hebrews', 'Revelation'], answer: 0, explanation: 'Acts 15 narrates the council.', difficulty: 'advanced' },
]

export function bookChallengeForDifficulty(
  difficulty: GameDifficulty,
  count = 5,
): BookChallengeItem[] {
  const pool = BOOK_CHALLENGE_BANK.filter((q) => q.difficulty === difficulty)
  const copy = [...pool]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, Math.min(count, copy.length))
}
