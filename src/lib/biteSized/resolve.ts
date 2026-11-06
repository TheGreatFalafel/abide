import type { CurriculumDifficulty } from '../../data/curriculum'
import { getCurriculumLesson } from '../../data/curriculum'
import { getLanguageLesson, type LanguageTrackId } from '../../data/languages'
import { compileCurriculumBiteLesson } from './compileCurriculum'
import { compileLanguageBiteLesson } from './compileLanguage'
import type { BiteLesson } from './types'

export type ResolveBiteOptions = {
  difficulty?: CurriculumDifficulty
  challengeUp?: boolean
}

export function resolveCurriculumBiteLesson(
  lessonId: string,
  options: ResolveBiteOptions = {},
): BiteLesson | null {
  const found = getCurriculumLesson(lessonId)
  if (!found) return null
  return compileCurriculumBiteLesson(found.topic, found.lesson, {
    difficulty: options.difficulty,
    challengeUp: options.challengeUp,
  })
}

export function resolveLanguageBiteLesson(
  track: LanguageTrackId,
  lessonId: string,
  options: ResolveBiteOptions = {},
): BiteLesson | null {
  const found = getLanguageLesson(lessonId)
  if (!found || found.course.id !== track) return null
  return compileLanguageBiteLesson(found.course, found.lesson, {
    difficulty: options.difficulty,
    challengeUp: options.challengeUp,
  })
}
