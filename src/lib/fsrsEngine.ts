/**
 * Production FSRS scheduling via the maintained `ts-fsrs` package (sync FSRS-6 API).
 * Fuzz disabled so reviews are deterministic under controlled timestamps.
 */
import {
  Rating,
  State,
  createEmptyCard,
  fsrs,
  type Card,
  type Grade,
} from 'ts-fsrs'
import type { MemoryGrade } from './types'

export type { MemoryGrade }

export { Rating, State }
export type { Card }

/** Shared scheduler — enable_fuzz: false for testable, stable intervals. */
export const fsrsScheduler = fsrs({
  request_retention: 0.9,
  maximum_interval: 365,
  enable_fuzz: false,
  enable_short_term: true,
})

export const FSRS_PACKAGE = 'ts-fsrs'
export const FSRS_PACKAGE_VERSION = '6.0.0'
export const FSRS_MODEL = 'FSRS-6' as const

export type FsrsCardSnapshot = {
  due: string
  stability: number
  difficulty: number
  scheduled_days: number
  learning_steps: number
  reps: number
  lapses: number
  state: number
  last_review: string | null
}

export function gradeToRating(grade: MemoryGrade): Grade {
  switch (grade) {
    case 'again':
      return Rating.Again
    case 'hard':
      return Rating.Hard
    case 'good':
      return Rating.Good
    case 'easy':
      return Rating.Easy
  }
}

export function ratingToGrade(rating: number): MemoryGrade {
  if (rating <= Rating.Again) return 'again'
  if (rating === Rating.Hard) return 'hard'
  if (rating === Rating.Easy) return 'easy'
  return 'good'
}

export function toFsrsCard(snap: FsrsCardSnapshot): Card {
  return {
    due: new Date(snap.due),
    stability: snap.stability,
    difficulty: snap.difficulty,
    scheduled_days: snap.scheduled_days,
    learning_steps: snap.learning_steps,
    reps: snap.reps,
    lapses: snap.lapses,
    state: snap.state as State,
    last_review: snap.last_review ? new Date(snap.last_review) : undefined,
  }
}

export function fromFsrsCard(card: Card): FsrsCardSnapshot {
  return {
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as number,
    last_review: card.last_review ? card.last_review.toISOString() : null,
  }
}

export function newFsrsSnapshot(now: Date): FsrsCardSnapshot {
  return fromFsrsCard(createEmptyCard(now))
}

export function reviewFsrsCard(
  snap: FsrsCardSnapshot,
  grade: MemoryGrade,
  now: Date,
): { card: FsrsCardSnapshot; rating: Grade } {
  const rating = gradeToRating(grade)
  const result = fsrsScheduler.next(toFsrsCard(snap), now, rating)
  return { card: fromFsrsCard(result.card), rating }
}

/** Predicted recall probability in [0, 1]. */
export function retrievabilityOf(snap: FsrsCardSnapshot, now: Date): number {
  if (snap.reps === 0 || snap.stability <= 0) return 0
  const value = fsrsScheduler.retrievability(toFsrsCard(snap), now)
  const n = typeof value === 'number' ? value : Number.parseFloat(String(value))
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0
}

export function dateKeyFromIso(iso: string): string {
  return iso.slice(0, 10)
}

export function isFsrsDue(snap: FsrsCardSnapshot, now: Date): boolean {
  return new Date(snap.due).getTime() <= now.getTime()
}

export function isLearningState(state: number): boolean {
  return state === State.New || state === State.Learning || state === State.Relearning
}
