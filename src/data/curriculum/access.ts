import type { CurriculumProgress, CurriculumLesson, CurriculumTopic } from './types'
import { CURRICULUM_CATALOG_VERSION, emptyCurriculumProgress } from './types'

/** Ordered lessons for a topic (stable by `order`, then id). */
export function orderedLessons(topic: CurriculumTopic): CurriculumLesson[] {
  return [...topic.lessons].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
}

export function isTopicUnlocked(
  topic: CurriculumTopic,
  progress: CurriculumProgress,
  topicsById: Map<string, CurriculumTopic>,
): boolean {
  if (!topic.prerequisites.length) return true
  return topic.prerequisites.every((preId) => {
    const pre = topicsById.get(preId)
    if (!pre) return false
    const ids = new Set(orderedLessons(pre).map((l) => l.id))
    return [...ids].every((id) => progress.completedLessonIds.includes(id))
  })
}

/** Next incomplete lesson in order, or null if topic finished. */
export function nextLessonId(
  topic: CurriculumTopic,
  progress: CurriculumProgress,
): string | null {
  for (const lesson of orderedLessons(topic)) {
    if (!progress.completedLessonIds.includes(lesson.id)) return lesson.id
  }
  return null
}

export function isLessonUnlocked(
  topic: CurriculumTopic,
  lessonId: string,
  progress: CurriculumProgress,
): boolean {
  const lessons = orderedLessons(topic)
  const idx = lessons.findIndex((l) => l.id === lessonId)
  if (idx < 0) return false
  // Completed lessons remain open for review
  if (progress.completedLessonIds.includes(lessonId)) return true
  // Must complete prior lessons in order
  for (let i = 0; i < idx; i++) {
    if (!progress.completedLessonIds.includes(lessons[i].id)) return false
  }
  return true
}

export function topicCompletion(
  topic: CurriculumTopic,
  progress: CurriculumProgress,
): { done: number; total: number; pct: number } {
  const total = topic.lessons.length
  const done = topic.lessons.filter((l) =>
    progress.completedLessonIds.includes(l.id),
  ).length
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 }
}

/** True when every lesson id in the topic appears in the completion list. */
export function isTopicFullyComplete(
  topic: CurriculumTopic,
  completedLessonIds: string[],
): boolean {
  const ids = topic.lessons.map((l) => l.id)
  return ids.length > 0 && ids.every((id) => completedLessonIds.includes(id))
}

/** Resume target: last lesson if still valid, else next incomplete, else first. */
export function resumeLessonId(
  topic: CurriculumTopic,
  progress: CurriculumProgress,
): string | null {
  if (!topic.lessons.length) return null
  if (
    progress.lastLessonId &&
    topic.lessons.some((l) => l.id === progress.lastLessonId) &&
    isLessonUnlocked(topic, progress.lastLessonId, progress)
  ) {
    // If last was completed, prefer next incomplete
    if (progress.completedLessonIds.includes(progress.lastLessonId)) {
      return nextLessonId(topic, progress) ?? progress.lastLessonId
    }
    return progress.lastLessonId
  }
  return nextLessonId(topic, progress) ?? orderedLessons(topic)[0]?.id ?? null
}

/** Migrate / normalize stored progress when catalog version changes. */
export function migrateCurriculumProgress(
  raw: Partial<CurriculumProgress> | null | undefined,
): CurriculumProgress {
  const base = emptyCurriculumProgress(CURRICULUM_CATALOG_VERSION)
  if (!raw || typeof raw !== 'object') return base
  const completed = Array.isArray(raw.completedLessonIds)
    ? [...new Set(raw.completedLessonIds.filter((id) => typeof id === 'string'))]
    : []
  const lessonScores =
    raw.lessonScores && typeof raw.lessonScores === 'object' ? { ...raw.lessonScores } : {}
  return {
    catalogVersion: CURRICULUM_CATALOG_VERSION,
    completedLessonIds: completed,
    lastLessonId: typeof raw.lastLessonId === 'string' ? raw.lastLessonId : null,
    lessonScores,
  }
}

export function mergeCurriculumProgress(
  a: CurriculumProgress,
  b: CurriculumProgress,
): CurriculumProgress {
  const completedLessonIds = [
    ...new Set([...a.completedLessonIds, ...b.completedLessonIds]),
  ]
  const lessonScores = { ...b.lessonScores, ...a.lessonScores }
  for (const id of Object.keys(b.lessonScores)) {
    const left = a.lessonScores[id]
    const right = b.lessonScores[id]
    if (!left) lessonScores[id] = right
    else if (!right) lessonScores[id] = left
    else {
      lessonScores[id] =
        (left.completedAt || '') >= (right.completedAt || '') ? left : right
    }
  }
  const lastLessonId = (() => {
    if (!a.lastLessonId) return b.lastLessonId
    if (!b.lastLessonId) return a.lastLessonId
    const aAt = a.lessonScores[a.lastLessonId]?.completedAt ?? ''
    const bAt = b.lessonScores[b.lastLessonId]?.completedAt ?? ''
    if (aAt || bAt) return aAt >= bAt ? a.lastLessonId : b.lastLessonId
    return a.lastLessonId
  })()
  return {
    catalogVersion: Math.max(a.catalogVersion, b.catalogVersion, CURRICULUM_CATALOG_VERSION),
    completedLessonIds,
    lastLessonId,
    lessonScores,
  }
}
