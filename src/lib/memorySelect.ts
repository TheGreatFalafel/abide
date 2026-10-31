import {
  isFsrsDue,
  isLearningState,
  retrievabilityOf,
  type FsrsCardSnapshot,
} from './fsrsEngine'
import type { MemoryVerse } from './types'

export type MemoryDashboardStats = {
  dueCount: number
  newCount: number
  learningCount: number
  memorizedCount: number
  reviewedToday: number
  upcoming7Days: number
  dueQueue: MemoryVerse[]
}

function snap(v: MemoryVerse): FsrsCardSnapshot {
  return v.fsrs
}

/** Priority: overdue → low retrievability → neglected → due soon. */
export function prioritizeForReview(
  verses: MemoryVerse[],
  now: Date,
  opts?: { includeNotDue?: boolean; limit?: number },
): MemoryVerse[] {
  const scored = verses
    .filter((v) => v.text?.trim())
    .map((v) => {
      const fsrs = snap(v)
      const dueAt = new Date(fsrs.due).getTime()
      const overdueMs = Math.max(0, now.getTime() - dueAt)
      const overdueDays = overdueMs / 86_400_000
      const isDue = dueAt <= now.getTime()
      const R = retrievabilityOf(fsrs, now)
      const last = fsrs.last_review ? new Date(fsrs.last_review).getTime() : null
      const neglectDays = last == null ? 365 : (now.getTime() - last) / 86_400_000
      const dueSoonDays = !isDue ? (dueAt - now.getTime()) / 86_400_000 : 0

      // Higher score = review sooner
      let score = 0
      if (isDue) {
        score += 1_000_000 + overdueDays * 10_000
        score += (1 - R) * 5_000
        score += Math.min(neglectDays, 120) * 10
      } else if (opts?.includeNotDue) {
        // Prefer cards due soon when filling a sparse queue
        score += Math.max(0, 100 - dueSoonDays * 10)
        score += (1 - R) * 20
      } else {
        return null
      }

      return { v, score, isDue }
    })
    .filter((x): x is { v: MemoryVerse; score: number; isDue: boolean } => x != null)
    .sort((a, b) => b.score - a.score)

  const out = scored.map((s) => s.v)
  return opts?.limit != null ? out.slice(0, opts.limit) : out
}

export function dueMemoryVerses(
  state: { memoryVerses: MemoryVerse[] },
  filter?: 'learning' | 'memorized',
  now = new Date(),
): MemoryVerse[] {
  const due = prioritizeForReview(state.memoryVerses, now)
  if (!filter) return due
  return due.filter((v) =>
    filter === 'memorized' ? v.status === 'memorized' : v.status !== 'memorized',
  )
}

export function selectQuizCard(
  state: { memoryVerses: MemoryVerse[] },
  now = new Date(),
  excludeIds: string[] = [],
): MemoryVerse | null {
  const pool = state.memoryVerses.filter(
    (v) => v.status === 'memorized' && v.text?.trim() && !excludeIds.includes(v.id),
  )
  if (!pool.length) return null
  const ranked = prioritizeForReview(pool, now, { includeNotDue: true })
  return ranked[0] ?? null
}

export function buildMemoryQuestDeck(
  state: { memoryVerses: MemoryVerse[] },
  count = 5,
  now = new Date(),
): MemoryVerse[] {
  const due = prioritizeForReview(state.memoryVerses, now)
  if (due.length >= count) return due.slice(0, count)
  const fill = prioritizeForReview(state.memoryVerses, now, { includeNotDue: true })
  const seen = new Set<string>()
  const out: MemoryVerse[] = []
  for (const v of [...due, ...fill]) {
    if (seen.has(v.id) || !v.text?.trim()) continue
    seen.add(v.id)
    out.push(v)
    if (out.length >= count) break
  }
  return out
}

export function memoryDashboardStats(
  state: { memoryVerses: MemoryVerse[]; memoryReviewsToday: number },
  now = new Date(),
): MemoryDashboardStats {
  const verses = state.memoryVerses
  const dueQueue = prioritizeForReview(verses, now)
  const newCount = verses.filter((v) => snap(v).state === 0 || snap(v).reps === 0).length
  const learningCount = verses.filter(
    (v) => v.status !== 'memorized' && isLearningState(snap(v).state),
  ).length
  const memorizedCount = verses.filter((v) => v.status === 'memorized').length

  const weekAhead = new Date(now.getTime() + 7 * 86_400_000)
  const upcoming7Days = verses.filter((v) => {
    const due = new Date(snap(v).due)
    return due > now && due <= weekAhead
  }).length

  return {
    dueCount: dueQueue.length,
    newCount,
    learningCount,
    memorizedCount,
    reviewedToday: state.memoryReviewsToday,
    upcoming7Days,
    dueQueue,
  }
}

export function wasScheduledToday(verse: MemoryVerse, todayKey: string): boolean {
  return (verse.scheduledReviewDate === todayKey)
}

export function cardIsDue(verse: MemoryVerse, now = new Date()): boolean {
  return isFsrsDue(snap(verse), now)
}
