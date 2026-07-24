import { PLAN_QUIZZES } from './planQuizzes'
import type { CustomPlan } from '../lib/types'
import { buildGatewayStylePlans } from './gatewayPlans'
import { getSectionBreaks } from '../lib/sectionHeadings'
import { BOOKS, type BibleBook, type PassageRef } from './books'

export { BOOKS, type BibleBook, type PassageRef }

export type PlanDay = {
  day: number
  passages: PassageRef[]
  title: string
  kind: 'read' | 'quiz'
  sectionLabel?: string
  quizId?: string
  quizIndex?: number
}

export type ReadingPlan = {
  id: string
  name: string
  blurb: string
  days: number
  vibe: string
  generate: () => PlanDay[]
}

export function chaptersFrom(bookIds: string[]): PassageRef[] {
  const refs: PassageRef[] = []
  for (const id of bookIds) {
    const book = BOOKS.find((b) => b.id === id)
    if (!book) continue
    for (let c = 1; c <= book.chapters; c++) {
      refs.push({ bookId: book.id, bookName: book.name, chapter: c })
    }
  }
  return refs
}

/** Two readings per chapter — useful for longer chapters / slower pace. */
export function halfChaptersFrom(bookIds: string[]): PassageRef[] {
  return chaptersFrom(bookIds).flatMap((ref) => [
    { ...ref, part: 'a' as const },
    { ...ref, part: 'b' as const },
  ])
}

/** One reading unit per standard section heading (works for every translation). */
export function sectionsFrom(bookIds: string[]): PassageRef[] {
  const refs: PassageRef[] = []
  for (const id of bookIds) {
    const book = BOOKS.find((b) => b.id === id)
    if (!book) continue
    for (let c = 1; c <= book.chapters; c++) {
      const breaks = getSectionBreaks(book.name, c)
      for (let i = 0; i < breaks.length; i++) {
        const start = breaks[i].verseStart
        const end =
          i + 1 < breaks.length ? breaks[i + 1].verseStart - 1 : undefined
        refs.push({
          bookId: book.id,
          bookName: book.name,
          chapter: c,
          verseStart: start,
          verseEnd: end,
          heading: breaks[i].heading,
        })
      }
    }
  }
  return refs
}

export function unitsFromPlan(plan: Pick<CustomPlan, 'bookIds' | 'pace'>): PassageRef[] {
  if (plan.pace === 'section') return sectionsFrom(plan.bookIds)
  if (plan.pace === 'half') return halfChaptersFrom(plan.bookIds)
  return chaptersFrom(plan.bookIds)
}

function titleFor(slice: PassageRef[]): string {
  const first = slice[0]
  const last = slice[slice.length - 1]
  if (slice.length === 1) {
    if (first.heading) {
      return `${first.bookName} ${first.chapter} · ${first.heading}`
    }
    if (first.part === 'a') return `${first.bookName} ${first.chapter} (first half)`
    if (first.part === 'b') return `${first.bookName} ${first.chapter} (second half)`
    return `${first.bookName} ${first.chapter}`
  }
  if (first.bookName === last.bookName) {
    return `${first.bookName} ${first.chapter}–${last.chapter}`
  }
  return `${first.bookName} ${first.chapter} → ${last.bookName} ${last.chapter}`
}

/** Spread passages across N days as evenly as possible (reading days only). */
export function chunkPassages(passages: PassageRef[], days: number): PlanDay[] {
  const total = passages.length
  if (!total) return []
  const dayCount = Math.max(1, Math.min(days, total))
  const base = Math.floor(total / dayCount)
  const extra = total % dayCount
  const plan: PlanDay[] = []
  let idx = 0
  for (let i = 0; i < dayCount; i++) {
    const count = base + (i < extra ? 1 : 0)
    const slice = passages.slice(idx, idx + count)
    idx += count
    plan.push({
      day: i + 1,
      passages: slice,
      title: titleFor(slice),
      kind: 'read',
    })
  }
  return plan
}

export function generateCustomPlanDays(plan: CustomPlan): PlanDay[] {
  return chunkPassages(unitsFromPlan(plan), plan.days).map((d) => ({
    ...d,
    kind: 'read' as const,
  }))
}

/** After every N reading days, insert a quiz checkpoint node. */
function withPlanQuizzes(planId: string, readDays: PlanDay[]): PlanDay[] {
  const pack = PLAN_QUIZZES[planId]
  if (!pack) {
    return readDays.map((d, i) => ({ ...d, day: i + 1, kind: 'read' as const }))
  }

  const out: PlanDay[] = []
  let quizCount = 0
  let readsSinceQuiz = 0

  for (const day of readDays) {
    out.push({ ...day, kind: 'read' })
    readsSinceQuiz += 1
    if (readsSinceQuiz >= pack.every && quizCount < pack.quizzes.length) {
      const quiz = pack.quizzes[quizCount]
      out.push({
        day: 0,
        passages: [],
        title: quiz.title,
        kind: 'quiz',
        sectionLabel: `Section ${quizCount + 1}`,
        quizId: quiz.id,
        quizIndex: quizCount,
      })
      quizCount += 1
      readsSinceQuiz = 0
    }
  }

  return out.map((d, i) => ({ ...d, day: i + 1 }))
}

/**
 * Classic dual-stream year plan: OT + NT each day.
 * ~3–4 chapters/day total across 365 days.
 */
function bibleInAYear(): PlanDay[] {
  const ot = chaptersFrom(BOOKS.filter((b) => b.testament === 'OT').map((b) => b.id))
  const nt = chaptersFrom(BOOKS.filter((b) => b.testament === 'NT').map((b) => b.id))
  const days = 365
  const plan: PlanDay[] = []

  for (let i = 0; i < days; i++) {
    const otStart = Math.floor((i * ot.length) / days)
    const otEnd = Math.floor(((i + 1) * ot.length) / days)
    const ntStart = Math.floor((i * nt.length) / days)
    const ntEnd = Math.floor(((i + 1) * nt.length) / days)
    const passages = [...ot.slice(otStart, otEnd), ...nt.slice(ntStart, ntEnd)]
    if (!passages.length) continue
    plan.push({
      day: plan.length + 1,
      passages,
      title: titleFor(passages),
      kind: 'read',
    })
  }
  return withPlanQuizzes('year', plan)
}

export const PLANS: ReadingPlan[] = [
  {
    id: 'year',
    name: 'Bible in a Year',
    blurb: 'Old & New Testament each day — the whole Bible in 365 days.',
    days: 365,
    vibe: 'Full journey',
    generate: bibleInAYear,
  },
  {
    id: 'gospels',
    name: 'Gospel Path',
    blurb: 'Walk with Jesus through Matthew, Mark, Luke & John.',
    days: 89,
    vibe: 'Gentle & focused',
    generate: () =>
      withPlanQuizzes(
        'gospels',
        chunkPassages(chaptersFrom(['matthew', 'mark', 'luke', 'john']), 89),
      ),
  },
  {
    id: 'psalms30',
    name: 'Psalms Pulse',
    blurb: 'Five psalms a day — prayer, praise, and honesty.',
    days: 30,
    vibe: 'Daily breath',
    generate: () =>
      withPlanQuizzes('psalms30', chunkPassages(chaptersFrom(['psalms']), 30)),
  },
  {
    id: 'nt90',
    name: 'New Testament Trail',
    blurb: 'The whole NT in about three months — one steady pace.',
    days: 90,
    vibe: 'Strong habit',
    generate: () =>
      withPlanQuizzes(
        'nt90',
        chunkPassages(
          chaptersFrom(BOOKS.filter((b) => b.testament === 'NT').map((b) => b.id)),
          90,
        ),
      ),
  },
  {
    id: 'proverbs31',
    name: 'Wisdom Month',
    blurb: 'One chapter of Proverbs each day for 31 days.',
    days: 31,
    vibe: 'Quick win',
    generate: () =>
      withPlanQuizzes('proverbs31', chunkPassages(chaptersFrom(['proverbs']), 31)),
  },
  ...buildGatewayStylePlans({ chaptersFrom, chunkPassages }),
]

export function getPlanById(
  id: string,
  customPlans: CustomPlan[] = [],
): ReadingPlan {
  const builtIn = PLANS.find((p) => p.id === id)
  if (builtIn) return builtIn

  const custom = customPlans.find((p) => p.id === id)
  if (custom) {
    const pace = custom.pace ?? 'chapter'
    const paceLabel =
      pace === 'section' ? 'section' : pace === 'half' ? 'half-chapter' : 'chapter'
    return {
      id: custom.id,
      name: custom.name,
      blurb: `Custom · ${custom.bookIds.length} book(s) · ${paceLabel} pace · ${custom.days} days.`,
      days: custom.days,
      vibe: 'Custom',
      generate: () => generateCustomPlanDays({ ...custom, pace }),
    }
  }

  return PLANS[0]
}

export function apiQuery(ref: PassageRef): string {
  return `${ref.bookName} ${ref.chapter}`
}

export function nextChapterRef(ref: PassageRef): PassageRef | null {
  const idx = BOOKS.findIndex((b) => b.id === ref.bookId)
  if (idx < 0) return null
  const book = BOOKS[idx]
  if (ref.chapter < book.chapters) {
    return { bookId: book.id, bookName: book.name, chapter: ref.chapter + 1 }
  }
  if (idx < BOOKS.length - 1) {
    const next = BOOKS[idx + 1]
    return { bookId: next.id, bookName: next.name, chapter: 1 }
  }
  return null
}

export function verseQuery(
  bookName: string,
  chapter: number,
  verseStart: number,
  verseEnd?: number,
): string {
  if (!verseEnd || verseEnd === verseStart) {
    return `${bookName} ${chapter}:${verseStart}`
  }
  return `${bookName} ${chapter}:${verseStart}-${verseEnd}`
}
