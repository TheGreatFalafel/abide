import { GREEK_COURSE } from './greek/course'
import { HEBREW_COURSE } from './hebrew/course'
import { assertValidLanguageCourse } from './validate'
import type { LanguageCourse, LanguageLesson, LanguageTrackId } from './types'
import { LANGUAGE_CATALOG_VERSION } from './types'

export * from './types'
export * from './access'
export { validateLanguageCourse, assertValidLanguageCourse } from './validate'

export const LANGUAGE_COURSES: LanguageCourse[] = [GREEK_COURSE, HEBREW_COURSE]

const byId = new Map<LanguageTrackId, LanguageCourse>()
const lessonToTrack = new Map<string, LanguageTrackId>()

for (const course of LANGUAGE_COURSES) {
  assertValidLanguageCourse(course)
  byId.set(course.id, course)
  for (const lesson of course.lessons) {
    if (lessonToTrack.has(lesson.id)) {
      throw new Error(`Duplicate language lesson id: ${lesson.id}`)
    }
    lessonToTrack.set(lesson.id, course.id)
  }
}

export function getLanguageCatalogVersion(): number {
  return LANGUAGE_CATALOG_VERSION
}

export function listLanguageCourses(): LanguageCourse[] {
  return LANGUAGE_COURSES
}

export function getLanguageCourse(id: LanguageTrackId): LanguageCourse | undefined {
  return byId.get(id)
}

export function getLanguageLesson(
  lessonId: string,
): { course: LanguageCourse; lesson: LanguageLesson } | undefined {
  const track = lessonToTrack.get(lessonId)
  if (!track) return undefined
  const course = byId.get(track)
  if (!course) return undefined
  const lesson = course.lessons.find((l) => l.id === lessonId)
  if (!lesson) return undefined
  return { course, lesson }
}

export function isLanguageTrackId(value: string): value is LanguageTrackId {
  return value === 'greek' || value === 'hebrew'
}
