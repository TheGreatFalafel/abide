import type { PassageRef } from '../../books'
import type { CurriculumDifficulty, McQuestion, OpenQuestion } from '../../planQuizzes'
import type { CurriculumFurtherStudy, CurriculumLessonVideo } from '../types'

export function passage(
  bookId: string,
  bookName: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
): PassageRef {
  return { bookId, bookName, chapter, verseStart, verseEnd }
}

export function mc(
  id: string,
  prompt: string,
  choices: string[],
  answer: number,
  explanation?: string,
  difficulty?: CurriculumDifficulty,
): McQuestion {
  return { id, type: 'mc', prompt, choices, answer, explanation, difficulty }
}

export function open(id: string, prompt: string, reflection?: string): OpenQuestion {
  return { id, type: 'open', prompt, reflection }
}

/** Structured further-study helper — locator shown only when verified. */
export function study(
  author: string,
  work: string,
  opts?: { locator?: string; verified?: boolean; url?: string },
): CurriculumFurtherStudy {
  return {
    author,
    work,
    locator: opts?.locator,
    verified: opts?.verified ?? false,
    url: opts?.url,
  }
}

/** Display label for StudyResourceList / further-study UI. */
export function formatFurtherStudyItem(item: string | CurriculumFurtherStudy): string {
  if (typeof item === 'string') return item
  const base = `${item.author}, ${item.work}`
  const withLocator =
    item.verified && item.locator?.trim() ? `${base} (${item.locator.trim()})` : base
  return item.url ? `${withLocator} — ${item.url}` : withLocator
}

export function formatFurtherStudyList(
  items: Array<string | CurriculumFurtherStudy> | undefined,
): string[] {
  return (items ?? []).map(formatFurtherStudyItem)
}

export function gtyVideo(url: string, attribution = '© Grace to You'): CurriculumLessonVideo {
  return { url, attribution, provider: 'grace-to-you' }
}

export function ligonierVideo(url: string, attribution = '© Ligonier Ministries'): CurriculumLessonVideo {
  return { url, attribution, provider: 'ligonier' }
}

export const SOURCE_GRUDEM_ORG = {
  teacherId: 'grudem' as const,
  teacher: 'Wayne Grudem',
  work: 'Systematic Theology',
  role: 'organizational' as const,
}

export const SOURCE_SPROUL_SUP = {
  teacherId: 'sproul' as const,
  teacher: 'R.C. Sproul',
  work: 'Published Ligonier teaching (selected themes)',
  role: 'supplementary' as const,
}

export const SOURCE_MACARTHUR_SUP = {
  teacherId: 'macarthur' as const,
  teacher: 'John MacArthur',
  work: 'Published biblical teaching (selected themes)',
  role: 'supplementary' as const,
}
