import type {
  LanguageCourse,
  LanguageLesson,
  LanguageProgress,
  LanguageTrackId,
  LanguageTrackProgress,
  LanguageVocabCard,
} from './types'
import { LANGUAGE_CATALOG_VERSION, emptyLanguageProgress, emptyTrackProgress } from './types'

export function orderedLanguageLessons(course: LanguageCourse): LanguageLesson[] {
  return [...course.lessons].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
}

export function isLanguageLessonUnlocked(
  course: LanguageCourse,
  lessonId: string,
  track: LanguageTrackProgress,
): boolean {
  const lessons = orderedLanguageLessons(course)
  const idx = lessons.findIndex((l) => l.id === lessonId)
  if (idx < 0) return false
  if (track.completedLessonIds.includes(lessonId)) return true
  for (let i = 0; i < idx; i++) {
    if (!track.completedLessonIds.includes(lessons[i].id)) return false
  }
  return true
}

export function nextLanguageLessonId(
  course: LanguageCourse,
  track: LanguageTrackProgress,
): string | null {
  for (const lesson of orderedLanguageLessons(course)) {
    if (!track.completedLessonIds.includes(lesson.id)) return lesson.id
  }
  return null
}

export function resumeLanguageLessonId(
  course: LanguageCourse,
  track: LanguageTrackProgress,
): string | null {
  if (!course.lessons.length) return null
  if (
    track.lastLessonId &&
    course.lessons.some((l) => l.id === track.lastLessonId) &&
    isLanguageLessonUnlocked(course, track.lastLessonId, track)
  ) {
    if (track.completedLessonIds.includes(track.lastLessonId)) {
      return nextLanguageLessonId(course, track) ?? track.lastLessonId
    }
    return track.lastLessonId
  }
  return nextLanguageLessonId(course, track) ?? orderedLanguageLessons(course)[0]?.id ?? null
}

export function languageTrackCompletion(
  course: LanguageCourse,
  track: LanguageTrackProgress,
): { done: number; total: number; pct: number } {
  const total = course.lessons.length
  const done = course.lessons.filter((l) => track.completedLessonIds.includes(l.id)).length
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 }
}

export function isLanguageTrackComplete(
  course: LanguageCourse,
  track: LanguageTrackProgress,
): boolean {
  return (
    course.lessons.length > 0 &&
    course.lessons.every((l) => track.completedLessonIds.includes(l.id))
  )
}

function migrateTrack(raw: Partial<LanguageTrackProgress> | null | undefined): LanguageTrackProgress {
  const base = emptyTrackProgress()
  if (!raw || typeof raw !== 'object') return base
  const completed = Array.isArray(raw.completedLessonIds)
    ? [...new Set(raw.completedLessonIds.filter((id) => typeof id === 'string'))]
    : []
  const lessonScores =
    raw.lessonScores && typeof raw.lessonScores === 'object' ? { ...raw.lessonScores } : {}
  const vocabCards = Array.isArray(raw.vocabCards)
    ? raw.vocabCards.filter(
        (c): c is LanguageVocabCard =>
          !!c &&
          typeof c === 'object' &&
          typeof c.id === 'string' &&
          typeof c.vocabId === 'string' &&
          !!c.fsrs,
      )
    : []
  return {
    completedLessonIds: completed,
    lastLessonId: typeof raw.lastLessonId === 'string' ? raw.lastLessonId : null,
    lessonScores,
    vocabCards,
    alphabetMastered: Boolean(raw.alphabetMastered),
  }
}

export function migrateLanguageProgress(
  raw: Partial<LanguageProgress> | null | undefined,
): LanguageProgress {
  const base = emptyLanguageProgress(LANGUAGE_CATALOG_VERSION)
  if (!raw || typeof raw !== 'object') return base
  return {
    catalogVersion: LANGUAGE_CATALOG_VERSION,
    greek: migrateTrack(raw.greek),
    hebrew: migrateTrack(raw.hebrew),
  }
}

function mergeVocabCards(a: LanguageVocabCard[], b: LanguageVocabCard[]): LanguageVocabCard[] {
  const map = new Map<string, LanguageVocabCard>()
  for (const card of [...b, ...a]) {
    const prev = map.get(card.id)
    if (!prev) {
      map.set(card.id, card)
      continue
    }
    const aReps = card.fsrs?.reps ?? 0
    const bReps = prev.fsrs?.reps ?? 0
    map.set(card.id, aReps >= bReps ? card : prev)
  }
  return [...map.values()]
}

function mergeTrack(a: LanguageTrackProgress, b: LanguageTrackProgress): LanguageTrackProgress {
  const completedLessonIds = [...new Set([...a.completedLessonIds, ...b.completedLessonIds])]
  const lessonScores = { ...b.lessonScores, ...a.lessonScores }
  for (const id of Object.keys(b.lessonScores)) {
    const left = a.lessonScores[id]
    const right = b.lessonScores[id]
    if (!left) lessonScores[id] = right
    else if (!right) lessonScores[id] = left
    else {
      const leftRatio = left.total > 0 ? left.correct / left.total : 0
      const rightRatio = right.total > 0 ? right.correct / right.total : 0
      if (leftRatio > rightRatio) lessonScores[id] = left
      else if (rightRatio > leftRatio) lessonScores[id] = right
      else {
        lessonScores[id] =
          (left.completedAt || '') >= (right.completedAt || '') ? left : right
      }
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
    completedLessonIds,
    lastLessonId,
    lessonScores,
    vocabCards: mergeVocabCards(a.vocabCards, b.vocabCards),
    alphabetMastered: a.alphabetMastered || b.alphabetMastered,
  }
}

export function mergeLanguageProgress(a: LanguageProgress, b: LanguageProgress): LanguageProgress {
  return {
    catalogVersion: Math.max(a.catalogVersion, b.catalogVersion, LANGUAGE_CATALOG_VERSION),
    greek: mergeTrack(a.greek, b.greek),
    hebrew: mergeTrack(a.hebrew, b.hebrew),
  }
}

export function trackProgressOf(
  progress: LanguageProgress,
  track: LanguageTrackId,
): LanguageTrackProgress {
  return track === 'greek' ? progress.greek : progress.hebrew
}
