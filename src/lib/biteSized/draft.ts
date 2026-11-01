import type { LanguageTrackId } from '../../data/languages'
import type { UserState } from '../types'
import type { BiteLessonDraft, BiteSubject } from './types'

export function todayIso(): string {
  return new Date().toISOString()
}

export function readCurriculumDraft(user: UserState, lessonId: string): BiteLessonDraft | null {
  const draft = user.curriculum?.draft
  if (!draft || draft.subject !== 'curriculum' || draft.lessonId !== lessonId) return null
  return draft
}

export function readLanguageDraft(
  user: UserState,
  track: LanguageTrackId,
  lessonId: string,
): BiteLessonDraft | null {
  const draft = user.languages?.[track]?.draft
  if (!draft || draft.subject !== 'language' || draft.lessonId !== lessonId) return null
  return draft
}

export function withCurriculumDraft(
  user: UserState,
  draft: BiteLessonDraft | null,
): UserState {
  const normalized =
    draft && draft.subject === 'curriculum'
      ? {
          lessonId: draft.lessonId,
          subject: 'curriculum' as const,
          stepIndex: draft.stepIndex,
          correct: draft.correct,
          total: draft.total,
          updatedAt: draft.updatedAt,
        }
      : null
  return {
    ...user,
    curriculum: {
      ...user.curriculum,
      draft: normalized,
    },
  }
}

export function withLanguageDraft(
  user: UserState,
  track: LanguageTrackId,
  draft: BiteLessonDraft | null,
): UserState {
  const normalized =
    draft && draft.subject === 'language'
      ? {
          lessonId: draft.lessonId,
          subject: 'language' as const,
          track: draft.track ?? track,
          stepIndex: draft.stepIndex,
          correct: draft.correct,
          total: draft.total,
          updatedAt: draft.updatedAt,
        }
      : null
  return {
    ...user,
    languages: {
      ...user.languages,
      [track]: {
        ...user.languages[track],
        draft: normalized,
      },
    },
  }
}

export function makeDraft(input: {
  lessonId: string
  subject: BiteSubject
  track?: LanguageTrackId
  stepIndex: number
  correct: number
  total: number
}): BiteLessonDraft {
  return {
    ...input,
    updatedAt: todayIso(),
  }
}

export function migrateBiteDraft(raw: unknown): BiteLessonDraft | null {
  if (!raw || typeof raw !== 'object') return null
  const d = raw as Partial<BiteLessonDraft>
  if (typeof d.lessonId !== 'string') return null
  if (d.subject !== 'curriculum' && d.subject !== 'language') return null
  return {
    lessonId: d.lessonId,
    subject: d.subject,
    track: d.track === 'greek' || d.track === 'hebrew' ? d.track : undefined,
    stepIndex: typeof d.stepIndex === 'number' && d.stepIndex >= 0 ? Math.floor(d.stepIndex) : 0,
    correct: typeof d.correct === 'number' && d.correct >= 0 ? Math.floor(d.correct) : 0,
    total: typeof d.total === 'number' && d.total >= 0 ? Math.floor(d.total) : 0,
    updatedAt: typeof d.updatedAt === 'string' ? d.updatedAt : todayIso(),
  }
}
