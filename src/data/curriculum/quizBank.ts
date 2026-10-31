import type { QuizQuestion } from '../planQuizzes'
import type { CurriculumLesson, CurriculumTopic } from './types'
import { orderedLessons } from './access'

/**
 * Build the quiz for a lesson: native questions first, then unique questions
 * pulled from `reviewFromLessonIds` (stable ids — duplicates skipped).
 */
export function assembleCurriculumQuestions(
  topic: CurriculumTopic,
  lesson: CurriculumLesson,
): QuizQuestion[] {
  const byLessonId = new Map(orderedLessons(topic).map((l) => [l.id, l]))
  const seen = new Set<string>()
  const out: QuizQuestion[] = []

  function pushAll(questions: QuizQuestion[]) {
    for (const q of questions) {
      if (!q?.id || seen.has(q.id)) continue
      seen.add(q.id)
      out.push(q)
    }
  }

  pushAll(lesson.questions ?? [])

  for (const priorId of lesson.reviewFromLessonIds ?? []) {
    const prior = byLessonId.get(priorId)
    if (!prior) continue
    pushAll(prior.questions ?? [])
  }

  return out
}
