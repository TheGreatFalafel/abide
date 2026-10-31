import { BOOKS } from '../books'
import type {
  ContentBlock,
  CurriculumLesson,
  CurriculumSource,
  CurriculumTopic,
} from './types'

const BOOK_BY_ID = new Map(BOOKS.map((b) => [b.id, b]))

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

/** Scripture ref must use a known bookId and a chapter within that book. */
export function validatePassageRef(v: unknown, path: string): string[] {
  const errors: string[] = []
  if (!v || typeof v !== 'object') {
    errors.push(`${path}: invalid passage`)
    return errors
  }
  const p = v as Record<string, unknown>
  if (!isNonEmptyString(p.bookId)) errors.push(`${path}: bookId required`)
  if (!isNonEmptyString(p.bookName)) errors.push(`${path}: bookName required`)
  if (typeof p.chapter !== 'number' || !Number.isInteger(p.chapter) || p.chapter < 1) {
    errors.push(`${path}: chapter must be a positive integer`)
  }
  const book = typeof p.bookId === 'string' ? BOOK_BY_ID.get(p.bookId) : undefined
  if (isNonEmptyString(p.bookId) && !book) {
    errors.push(`${path}: unknown bookId "${p.bookId}"`)
  }
  if (book && typeof p.chapter === 'number' && p.chapter > book.chapters) {
    errors.push(`${path}: chapter ${p.chapter} exceeds ${book.name} (${book.chapters})`)
  }
  if (
    typeof p.verseStart === 'number' &&
    typeof p.verseEnd === 'number' &&
    p.verseEnd < p.verseStart
  ) {
    errors.push(`${path}: verseEnd before verseStart`)
  }
  return errors
}

function validateBlock(block: ContentBlock, path: string): string[] {
  const errors: string[] = []
  switch (block.kind) {
    case 'teaching':
      if (!isNonEmptyString(block.body)) errors.push(`${path}: teaching body required`)
      break
    case 'concept':
      if (!isNonEmptyString(block.term)) errors.push(`${path}: concept term required`)
      if (!isNonEmptyString(block.explanation)) errors.push(`${path}: concept explanation required`)
      break
    case 'distinction':
      if (!isNonEmptyString(block.biblical)) errors.push(`${path}: biblical field required`)
      if (!isNonEmptyString(block.interpretation))
        errors.push(`${path}: interpretation field required`)
      break
    case 'scripture_focus':
      errors.push(...validatePassageRef(block.passage, `${path}.passage`))
      if (!isNonEmptyString(block.note)) errors.push(`${path}: scripture_focus note required`)
      break
    case 'attribution':
      if (!isNonEmptyString(block.note)) errors.push(`${path}: attribution note required`)
      if (!isNonEmptyString(block.work)) errors.push(`${path}: attribution work required`)
      break
    default:
      errors.push(`${path}: unknown content block kind`)
  }
  return errors
}

function validateSource(s: CurriculumSource, path: string): string[] {
  const errors: string[] = []
  if (!isNonEmptyString(s.teacher)) errors.push(`${path}: teacher required`)
  if (!isNonEmptyString(s.work)) errors.push(`${path}: work required`)
  if (!isNonEmptyString(s.note)) errors.push(`${path}: note required`)
  if (s.role !== 'organizational' && s.role !== 'supplementary') {
    errors.push(`${path}: role must be organizational or supplementary`)
  }
  return errors
}

function validateLesson(lesson: CurriculumLesson, path: string): string[] {
  const errors: string[] = []
  if (!isNonEmptyString(lesson.id)) errors.push(`${path}: id required`)
  if (!Number.isInteger(lesson.order) || lesson.order < 1) {
    errors.push(`${path}: order must be a positive integer`)
  }
  if (!isNonEmptyString(lesson.title)) errors.push(`${path}: title required`)
  if (!lesson.estimatedMinutes || lesson.estimatedMinutes < 1) {
    errors.push(`${path}: estimatedMinutes required`)
  }
  if (!lesson.objectives?.length) errors.push(`${path}: at least one objective`)
  if (!lesson.primaryPassages?.length) errors.push(`${path}: primaryPassages required`)
  for (let i = 0; i < (lesson.primaryPassages?.length ?? 0); i++) {
    errors.push(
      ...validatePassageRef(lesson.primaryPassages[i], `${path}.primaryPassages[${i}]`),
    )
  }
  for (let i = 0; i < (lesson.supportingPassages?.length ?? 0); i++) {
    errors.push(
      ...validatePassageRef(lesson.supportingPassages[i], `${path}.supportingPassages[${i}]`),
    )
  }
  if (!lesson.content?.length) errors.push(`${path}: content required`)
  lesson.content?.forEach((b, i) => errors.push(...validateBlock(b, `${path}.content[${i}]`)))
  const hasDistinction = lesson.content?.some((b) => b.kind === 'distinction')
  if (!hasDistinction) {
    errors.push(`${path}: at least one distinction block (biblical vs interpretation) required`)
  }
  if (!lesson.questions?.length) errors.push(`${path}: questions required`)
  const mc = lesson.questions?.filter((q) => q.type === 'mc') ?? []
  if (mc.length < 1) errors.push(`${path}: at least one multiple-choice question`)
  if (!lesson.reflectionPrompts?.length) {
    errors.push(`${path}: reflectionPrompts required`)
  }
  for (const q of lesson.questions ?? []) {
    if (!isNonEmptyString(q.id) || !isNonEmptyString(q.prompt)) {
      errors.push(`${path}: question missing id/prompt`)
    }
    if (q.type === 'mc') {
      if (!q.choices?.length || q.answer < 0 || q.answer >= q.choices.length) {
        errors.push(`${path}: MC question ${q.id} has invalid choices/answer`)
      }
    }
  }
  return errors
}

/** Validate a topic graph node. Returns human-readable errors (empty = ok). */
export function validateCurriculumTopic(topic: CurriculumTopic): string[] {
  const errors: string[] = []
  if (!isNonEmptyString(topic.id)) errors.push('topic.id required')
  if (!isNonEmptyString(topic.title)) errors.push('topic.title required')
  if (!isNonEmptyString(topic.description)) errors.push('topic.description required')
  if (topic.framework !== 'reformed') errors.push('topic.framework must be reformed')
  if (!topic.objectives?.length) errors.push('topic.objectives required')
  if (!topic.estimatedMinutes || topic.estimatedMinutes < 1) {
    errors.push('topic.estimatedMinutes required')
  }
  if (!topic.sources?.length) errors.push('topic.sources required')
  topic.sources?.forEach((s, i) => errors.push(...validateSource(s, `sources[${i}]`)))
  if (!topic.lessons?.length) errors.push('topic.lessons required')

  const ids = new Set<string>()
  const orders = new Set<number>()
  for (const lesson of topic.lessons ?? []) {
    if (ids.has(lesson.id)) errors.push(`duplicate lesson id: ${lesson.id}`)
    ids.add(lesson.id)
    if (orders.has(lesson.order)) errors.push(`duplicate lesson order: ${lesson.order}`)
    orders.add(lesson.order)
    errors.push(...validateLesson(lesson, `lessons[${lesson.id}]`))
  }

  for (const lesson of topic.lessons ?? []) {
    for (const ref of lesson.reviewFromLessonIds ?? []) {
      if (!ids.has(ref)) {
        errors.push(`lessons[${lesson.id}]: reviewFromLessonIds unknown id ${ref}`)
      }
    }
  }

  const sorted = [...(topic.lessons ?? [])].sort((a, b) => a.order - b.order)
  const sumMinutes = sorted.reduce((n, l) => n + l.estimatedMinutes, 0)
  if (topic.estimatedMinutes < sumMinutes) {
    errors.push(
      `topic.estimatedMinutes (${topic.estimatedMinutes}) should cover lesson sum (${sumMinutes})`,
    )
  }

  return errors
}

export function assertValidTopic(topic: CurriculumTopic): void {
  const errors = validateCurriculumTopic(topic)
  if (errors.length) {
    throw new Error(`Invalid curriculum topic ${topic.id}:\n${errors.join('\n')}`)
  }
}
