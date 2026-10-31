import type { LanguageCourse, LanguageExercise, LanguageLesson } from './types'

function nonEmpty(s: unknown): s is string {
  return typeof s === 'string' && s.trim().length > 0
}

function validateExercise(ex: LanguageExercise, path: string, letterIds: Set<string>): string[] {
  const errors: string[] = []
  switch (ex.kind) {
    case 'alphabet_match':
      if (!nonEmpty(ex.prompt)) errors.push(`${path}: prompt required`)
      if (!ex.letterIds?.length) errors.push(`${path}: letterIds required`)
      for (const id of ex.letterIds ?? []) {
        if (!letterIds.has(id)) errors.push(`${path}: unknown letter id ${id}`)
      }
      break
    case 'mc':
      if (ex.question?.type !== 'mc') errors.push(`${path}: mc question required`)
      else if (
        !ex.question.choices?.length ||
        ex.question.answer < 0 ||
        ex.question.answer >= ex.question.choices.length
      ) {
        errors.push(`${path}: invalid MC choices/answer`)
      }
      break
    case 'parse':
      if (!nonEmpty(ex.prompt)) errors.push(`${path}: prompt required`)
      if (!nonEmpty(ex.form)) errors.push(`${path}: form required`)
      if (!ex.choices?.length || ex.answer < 0 || ex.answer >= ex.choices.length) {
        errors.push(`${path}: invalid choices/answer`)
      }
      if (!nonEmpty(ex.explanation)) errors.push(`${path}: explanation required`)
      break
    case 'translate':
      if (!nonEmpty(ex.prompt)) errors.push(`${path}: prompt required`)
      if (!nonEmpty(ex.original)) errors.push(`${path}: original required`)
      if (!ex.choices?.length || ex.answer < 0 || ex.answer >= ex.choices.length) {
        errors.push(`${path}: invalid choices/answer`)
      }
      if (!nonEmpty(ex.explanation)) errors.push(`${path}: explanation required`)
      break
    case 'passage_guide':
      if (!nonEmpty(ex.reference) || !nonEmpty(ex.originalSnippet)) {
        errors.push(`${path}: reference and originalSnippet required`)
      }
      if (!nonEmpty(ex.analysis) || !nonEmpty(ex.caution)) {
        errors.push(`${path}: analysis and caution required`)
      }
      break
    default:
      errors.push(`${path}: unknown exercise kind`)
  }
  return errors
}

function validateLesson(
  lesson: LanguageLesson,
  path: string,
  letterIds: Set<string>,
  vocabIds: Set<string>,
): string[] {
  const errors: string[] = []
  if (!nonEmpty(lesson.id)) errors.push(`${path}: id required`)
  if (!Number.isInteger(lesson.order) || lesson.order < 1) errors.push(`${path}: order required`)
  if (!nonEmpty(lesson.title)) errors.push(`${path}: title required`)
  if (!lesson.estimatedMinutes || lesson.estimatedMinutes < 1) {
    errors.push(`${path}: estimatedMinutes required`)
  }
  if (!lesson.objectives?.length) errors.push(`${path}: objectives required`)
  if (!lesson.content?.length) errors.push(`${path}: content required`)
  if (!lesson.exercises?.length) errors.push(`${path}: exercises required`)
  if (!lesson.reflectionPrompts?.length) errors.push(`${path}: reflectionPrompts required`)
  const hasCaution = lesson.content.some((b) => b.kind === 'caution')
  if (!hasCaution) {
    errors.push(`${path}: at least one caution block (method limits) required`)
  }
  lesson.exercises.forEach((ex, i) =>
    errors.push(...validateExercise(ex, `${path}.exercises[${i}]`, letterIds)),
  )
  for (const vid of lesson.introduceVocabIds ?? []) {
    if (!vocabIds.has(vid)) errors.push(`${path}: unknown vocab id ${vid}`)
  }
  return errors
}

export function validateLanguageCourse(course: LanguageCourse): string[] {
  const errors: string[] = []
  if (course.id !== 'greek' && course.id !== 'hebrew') errors.push('course.id must be greek|hebrew')
  if (!nonEmpty(course.title) || !nonEmpty(course.description)) {
    errors.push('title/description required')
  }
  if (!course.alphabet?.length) errors.push('alphabet required')
  if (!course.lessons?.length) errors.push('lessons required')
  if (course.scriptDirection !== 'ltr' && course.scriptDirection !== 'rtl') {
    errors.push('scriptDirection must be ltr|rtl')
  }
  if (!nonEmpty(course.pronunciationNote)) errors.push('pronunciationNote required')
  if (!nonEmpty(course.sourcesNote)) errors.push('sourcesNote required')

  const letterIds = new Set<string>()
  for (const letter of course.alphabet ?? []) {
    if (!nonEmpty(letter.id) || !nonEmpty(letter.glyph) || !nonEmpty(letter.name)) {
      errors.push(`alphabet letter incomplete: ${letter.id}`)
    }
    if (letterIds.has(letter.id)) errors.push(`duplicate letter id ${letter.id}`)
    letterIds.add(letter.id)
  }

  const vocabIds = new Set<string>()
  for (const v of course.vocabulary ?? []) {
    if (v.track !== course.id) errors.push(`vocab ${v.id} track mismatch`)
    if (!nonEmpty(v.lemma) || !nonEmpty(v.transliteration) || !nonEmpty(v.gloss)) {
      errors.push(`vocab ${v.id} incomplete`)
    }
    if (vocabIds.has(v.id)) errors.push(`duplicate vocab id ${v.id}`)
    vocabIds.add(v.id)
  }

  const lessonIds = new Set<string>()
  const orders = new Set<number>()
  for (const lesson of course.lessons ?? []) {
    if (lessonIds.has(lesson.id)) errors.push(`duplicate lesson id ${lesson.id}`)
    lessonIds.add(lesson.id)
    if (orders.has(lesson.order)) errors.push(`duplicate lesson order ${lesson.order}`)
    orders.add(lesson.order)
    errors.push(...validateLesson(lesson, `lessons[${lesson.id}]`, letterIds, vocabIds))
  }
  for (const lesson of course.lessons ?? []) {
    for (const ref of lesson.reviewFromLessonIds ?? []) {
      if (!lessonIds.has(ref)) {
        errors.push(`lessons[${lesson.id}]: unknown reviewFromLessonIds ${ref}`)
      }
    }
  }

  const sum = (course.lessons ?? []).reduce((n, l) => n + l.estimatedMinutes, 0)
  if (course.estimatedMinutes < sum) {
    errors.push(`estimatedMinutes (${course.estimatedMinutes}) < lesson sum (${sum})`)
  }

  return errors
}

export function assertValidLanguageCourse(course: LanguageCourse): void {
  const errors = validateLanguageCourse(course)
  if (errors.length) {
    throw new Error(`Invalid language course ${course.id}:\n${errors.join('\n')}`)
  }
}
