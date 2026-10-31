import {
  getLanguageCourse,
  isLanguageTrackComplete,
  migrateLanguageProgress,
  trackProgressOf,
  type LanguageTrackId,
  type LanguageVocabCard,
} from '../data/languages'
import { isFsrsDue } from './fsrsEngine'
import type { AchievementId, UserState } from './types'

export function dueLanguageVocab(
  state: UserState,
  track: LanguageTrackId,
  now = new Date(),
): LanguageVocabCard[] {
  const languages = migrateLanguageProgress(state.languages)
  return trackProgressOf(languages, track).vocabCards.filter((c) => isFsrsDue(c.fsrs, now))
}

export function languageAchievementCandidates(state: UserState): AchievementId[] {
  const languages = migrateLanguageProgress(state.languages)
  const out: AchievementId[] = []
  if (languages.greek.completedLessonIds.length >= 1) out.push('greek_first')
  if (languages.hebrew.completedLessonIds.length >= 1) out.push('hebrew_first')
  const greek = getLanguageCourse('greek')
  const hebrew = getLanguageCourse('hebrew')
  if (greek && isLanguageTrackComplete(greek, languages.greek)) out.push('greek_track')
  if (hebrew && isLanguageTrackComplete(hebrew, languages.hebrew)) out.push('hebrew_track')
  return out
}

export function isLanguageScoreBetter(
  candidate: { correct: number; total: number },
  previous: { correct: number; total: number },
): boolean {
  const cTotal = Math.max(0, candidate.total)
  const pTotal = Math.max(0, previous.total)
  const cRatio = cTotal > 0 ? candidate.correct / cTotal : 0
  const pRatio = pTotal > 0 ? previous.correct / pTotal : 0
  if (cRatio !== pRatio) return cRatio > pRatio
  return candidate.correct > previous.correct
}
