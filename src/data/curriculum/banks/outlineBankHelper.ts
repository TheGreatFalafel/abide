import type { QuizQuestion } from '../../planQuizzes'

export function appendOutlineBank(
  lessonId: string,
  base: QuizQuestion[],
  bank: Record<string, QuizQuestion[]>,
): QuizQuestion[] {
  return [...base, ...(bank[lessonId] ?? [])]
}
