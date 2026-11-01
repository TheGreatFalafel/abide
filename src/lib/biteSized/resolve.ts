import { getCurriculumLesson } from '../../data/curriculum'
import { getLanguageLesson, type LanguageTrackId } from '../../data/languages'
import { compileCurriculumBiteLesson } from './compileCurriculum'
import { compileLanguageBiteLesson } from './compileLanguage'
import type { BiteLesson } from './types'

export function resolveCurriculumBiteLesson(lessonId: string): BiteLesson | null {
  const found = getCurriculumLesson(lessonId)
  if (!found) return null
  return compileCurriculumBiteLesson(found.topic, found.lesson)
}

export function resolveLanguageBiteLesson(
  track: LanguageTrackId,
  lessonId: string,
): BiteLesson | null {
  const found = getLanguageLesson(lessonId)
  if (!found || found.course.id !== track) return null
  return compileLanguageBiteLesson(found.course, found.lesson)
}
