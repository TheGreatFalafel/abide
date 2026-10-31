import type { PassageRef } from '../../books'
import type { McQuestion, OpenQuestion } from '../../planQuizzes'

export function passage(
  bookId: string,
  bookName: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
): PassageRef {
  return { bookId, bookName, chapter, verseStart, verseEnd }
}

export function mc(
  id: string,
  prompt: string,
  choices: string[],
  answer: number,
  explanation?: string,
): McQuestion {
  return { id, type: 'mc', prompt, choices, answer, explanation }
}

export function open(id: string, prompt: string, reflection?: string): OpenQuestion {
  return { id, type: 'open', prompt, reflection }
}

export const SOURCE_GRUDEM_ORG = {
  teacherId: 'grudem' as const,
  teacher: 'Wayne Grudem',
  work: 'Systematic Theology',
  role: 'organizational' as const,
}

export const SOURCE_SPROUL_SUP = {
  teacherId: 'sproul' as const,
  teacher: 'R.C. Sproul',
  work: 'Published Ligonier teaching (selected themes)',
  role: 'supplementary' as const,
}

export const SOURCE_MACARTHUR_SUP = {
  teacherId: 'macarthur' as const,
  teacher: 'John MacArthur',
  work: 'Published biblical teaching (selected themes)',
  role: 'supplementary' as const,
}
