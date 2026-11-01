import { createEmptyCard, State } from 'ts-fsrs'
import type { TranslationId } from '../data/translations'
import {
  dateKeyFromIso,
  fromFsrsCard,
  isLearningState,
  newFsrsSnapshot,
  type FsrsCardSnapshot,
} from './fsrsEngine'
import { isTranslationId, makeMemoryId, parseMemoryId } from './memoryIds'
import type { MemoryReviewLogEntry, MemoryVerse } from './types'

const MAX_HISTORY = 40

type LegacyLike = Partial<MemoryVerse> & {
  id: string
  reference: string
  text: string
  bookName: string
  bookId: string
  chapter: number
  verseStart: number
  verseEnd: number
}

/**
 * Convert a stored memory verse to FSRS + translation-aware identity.
 * Does not invent review ratings or last-review timestamps.
 */
export function migrateMemoryVerse(raw: LegacyLike, now = new Date()): MemoryVerse {
  const translationId = resolveTranslationId(raw)
  const id = resolveId(raw, translationId)

  const fsrs: FsrsCardSnapshot = raw.fsrs?.due
    ? normalizeFsrsSnapshot(raw.fsrs, raw, now)
    : seedFsrsFromLegacy(raw, now)

  const nextReview = dateKeyFromIso(fsrs.due)
  const intervalDays = Math.max(0, Math.round(fsrs.scheduled_days))

  let status: MemoryVerse['status'] = raw.status === 'memorized' ? 'memorized' : 'learning'
  if (
    status !== 'memorized' &&
    !isLearningState(fsrs.state) &&
    fsrs.stability >= 21 &&
    fsrs.reps >= 4
  ) {
    status = 'memorized'
  }

  const reviewHistory = Array.isArray(raw.reviewHistory)
    ? raw.reviewHistory.slice(-MAX_HISTORY)
    : []

  const resolvedTranslation =
    translationId ?? parseMemoryId(id)?.translationId ?? ('web' as TranslationId)

  return {
    id,
    reference: raw.reference,
    text: raw.text,
    textVersion: raw.textVersion,
    bookName: raw.bookName,
    bookId: raw.bookId,
    chapter: raw.chapter,
    verseStart: raw.verseStart,
    verseEnd: raw.verseEnd,
    translationId: resolvedTranslation,
    translationConfident: Boolean(translationId),
    addedAt: raw.addedAt ?? dateKeyFromIso(now.toISOString()),
    nextReview,
    intervalDays,
    ease: raw.ease ?? mapDifficultyToEase(fsrs.difficulty),
    repetitions: fsrs.reps,
    lapses: fsrs.lapses,
    status,
    topic: raw.topic,
    seriesId: raw.seriesId,
    seriesName: raw.seriesName,
    fsrs,
    reviewHistory,
    successfulReviews: raw.successfulReviews ?? countSuccesses(reviewHistory),
    failedReviews: raw.failedReviews ?? countFailures(reviewHistory),
    scheduler: 'fsrs-6',
    scheduledReviewDate: raw.scheduledReviewDate,
  }
}

function resolveTranslationId(raw: LegacyLike): TranslationId | undefined {
  if (raw.translationId && isTranslationId(String(raw.translationId))) {
    return raw.translationId
  }
  const parsed = parseMemoryId(raw.id)
  return parsed?.translationId
}

function resolveId(raw: LegacyLike, translationId: TranslationId | undefined): string {
  const parsed = parseMemoryId(raw.id)
  if (parsed?.translationId) {
    return makeMemoryId(
      parsed.bookId,
      parsed.chapter,
      parsed.verseStart,
      parsed.verseEnd,
      parsed.translationId,
    )
  }
  if (translationId) {
    return makeMemoryId(raw.bookId, raw.chapter, raw.verseStart, raw.verseEnd, translationId)
  }
  // Cannot confidently assign a translation — keep legacy id
  return raw.id
}

function normalizeFsrsSnapshot(
  snap: FsrsCardSnapshot,
  raw: LegacyLike,
  now: Date,
): FsrsCardSnapshot {
  const due = snap.due || now.toISOString()
  const reps = Number(snap.reps) || raw.repetitions || 0
  const scheduledDays = Number(snap.scheduled_days) || 0
  let lastReview = snap.last_review ?? null
  if (!lastReview && reps > 0) {
    const dueMs = new Date(due).getTime()
    lastReview = new Date(
      (Number.isFinite(dueMs) ? dueMs : now.getTime()) -
        Math.max(scheduledDays, 0.01) * 86_400_000,
    ).toISOString()
  }
  return {
    due,
    stability: Number(snap.stability) || 0,
    difficulty: Number(snap.difficulty) || 0,
    scheduled_days: scheduledDays,
    learning_steps: Number(snap.learning_steps) || 0,
    reps,
    lapses: Number(snap.lapses) || raw.lapses || 0,
    state: Number(snap.state) || State.New,
    last_review: lastReview,
  }
}

/**
 * Seed FSRS fields from legacy hybrid scheduler values.
 * Leaves last_review null and reviewHistory empty — no invented ratings.
 */
function seedFsrsFromLegacy(raw: LegacyLike, now: Date): FsrsCardSnapshot {
  const dueIso = raw.nextReview
    ? new Date(`${raw.nextReview}T12:00:00.000Z`).toISOString()
    : now.toISOString()
  const reps = raw.repetitions ?? 0
  const lapses = raw.lapses ?? 0
  const intervalDays = raw.intervalDays ?? 0

  if (reps <= 0 && intervalDays <= 0) {
    const fresh = newFsrsSnapshot(now)
    return { ...fresh, due: dueIso }
  }

  const stability = Math.max(0.1, intervalDays || 0.5)
  const difficulty = mapEaseToDifficulty(raw.ease ?? 2.5)
  const state =
    intervalDays <= 0
      ? State.Learning
      : raw.status === 'memorized' || intervalDays >= 7
        ? State.Review
        : State.Learning

  const dueDate = new Date(dueIso)
  const lastReview =
    reps > 0
      ? new Date(dueDate.getTime() - Math.max(intervalDays, 0.01) * 86_400_000)
      : undefined
  const card = createEmptyCard(dueDate)
  return fromFsrsCard({
    ...card,
    due: dueDate,
    stability,
    difficulty,
    scheduled_days: intervalDays,
    learning_steps: state === State.Learning ? 1 : 0,
    reps,
    lapses,
    state,
    last_review: lastReview,
  })
}

function mapEaseToDifficulty(ease: number): number {
  const clamped = Math.min(3, Math.max(1.3, ease))
  return Math.min(10, Math.max(1, 10 - ((clamped - 1.3) / 1.7) * 9))
}

function mapDifficultyToEase(difficulty: number): number {
  const d = Math.min(10, Math.max(1, difficulty || 5))
  return Math.round((1.3 + ((10 - d) / 9) * 1.7) * 100) / 100
}

function countSuccesses(history: MemoryReviewLogEntry[]): number {
  return history.filter((h) => h.rating >= 2).length
}

function countFailures(history: MemoryReviewLogEntry[]): number {
  return history.filter((h) => h.rating === 1).length
}

export function appendReviewHistory(
  history: MemoryReviewLogEntry[],
  entry: MemoryReviewLogEntry,
): MemoryReviewLogEntry[] {
  return [...history, entry].slice(-MAX_HISTORY)
}
