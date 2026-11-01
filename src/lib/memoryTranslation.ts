import type { TranslationId } from '../data/translations'
import { makeMemoryId } from './memoryIds'
import {
  CURRENT_MEMORY_TEXT_VERSION,
  type MemoryReviewLogEntry,
  type MemoryVerse,
  type UserState,
} from './types'

export type MemoryTextFetchResult =
  | { sourceId: string; ok: true; text: string; reference: string }
  | { sourceId: string; ok: false; reason: string }

export type MemoryTranslationReport = {
  migrated: number
  merged: number
  failed: { id: string; reference: string; reason: string }[]
  unchanged: number
}

export type VerseTextFetcher = (
  verse: MemoryVerse,
  translationId: TranslationId,
) => Promise<{ text: string; reference: string }>

export function scriptureMemoryKey(v: {
  bookId: string
  chapter: number
  verseStart: number
  verseEnd: number
}): string {
  return `${v.bookId}:${v.chapter}:${v.verseStart}:${v.verseEnd}`
}

export function memoryProgressScore(v: MemoryVerse): number {
  return (
    (v.status === 'memorized' ? 1000 : 0) +
    (v.fsrs?.reps ?? v.repetitions ?? 0) * 10 +
    (v.fsrs?.stability ?? v.intervalDays ?? 0)
  )
}

function fsrsStrength(v: MemoryVerse): number {
  return (v.fsrs?.reps ?? v.repetitions ?? 0) * 10 + (v.fsrs?.stability ?? v.intervalDays ?? 0)
}

function mergeReviewHistories(
  a: MemoryReviewLogEntry[] = [],
  b: MemoryReviewLogEntry[] = [],
): MemoryReviewLogEntry[] {
  const seen = new Set<string>()
  const out: MemoryReviewLogEntry[] = []
  for (const entry of [...a, ...b]) {
    const key = `${entry.reviewedAt}|${entry.rating}|${entry.source ?? ''}|${entry.appliedSchedule ? 1 : 0}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(entry)
  }
  return out
    .sort((x, y) => x.reviewedAt.localeCompare(y.reviewedAt))
    .slice(-40)
}

/** Combine two cards for the same scripture; keep stronger FSRS progress. */
export function reconcileMemoryPair(a: MemoryVerse, b: MemoryVerse): MemoryVerse {
  // Prefer scheduling state from the stronger FSRS card; OR memorized status from either.
  const primary = fsrsStrength(a) >= fsrsStrength(b) ? a : b
  const secondary = primary === a ? b : a
  const status: MemoryVerse['status'] =
    a.status === 'memorized' || b.status === 'memorized' ? 'memorized' : primary.status
  return {
    ...primary,
    status,
    reviewHistory: mergeReviewHistories(a.reviewHistory, b.reviewHistory),
    successfulReviews: Math.max(a.successfulReviews ?? 0, b.successfulReviews ?? 0),
    failedReviews: Math.max(a.failedReviews ?? 0, b.failedReviews ?? 0),
    topic: primary.topic ?? secondary.topic,
    seriesId: primary.seriesId ?? secondary.seriesId,
    seriesName: primary.seriesName ?? secondary.seriesName,
    addedAt:
      primary.addedAt && secondary.addedAt
        ? primary.addedAt <= secondary.addedAt
          ? primary.addedAt
          : secondary.addedAt
        : primary.addedAt || secondary.addedAt,
    scheduledReviewDate: primary.scheduledReviewDate ?? secondary.scheduledReviewDate,
  }
}

/**
 * Collapse duplicate scripture refs into one card.
 * Prefers text/id for `preferredTranslation` when that variant exists;
 * otherwise keeps the strongest-progress card's text and marks stale if needed.
 */
export function collapseMemoryBankByScripture(
  verses: MemoryVerse[],
  preferredTranslation?: TranslationId,
): MemoryVerse[] {
  const groups = new Map<string, MemoryVerse[]>()
  for (const v of verses) {
    const key = scriptureMemoryKey(v)
    const list = groups.get(key) ?? []
    list.push(v)
    groups.set(key, list)
  }

  const out: MemoryVerse[] = []
  for (const group of groups.values()) {
    let merged = group[0]
    for (let i = 1; i < group.length; i++) {
      merged = reconcileMemoryPair(merged, group[i])
    }

    if (preferredTranslation) {
      const preferredVariant = group.find((v) => v.translationId === preferredTranslation)
      const targetId = makeMemoryId(
        merged.bookId,
        merged.chapter,
        merged.verseStart,
        merged.verseEnd,
        preferredTranslation,
      )
      if (preferredVariant) {
        merged = {
          ...merged,
          id: targetId,
          translationId: preferredTranslation,
          text: preferredVariant.text,
          reference: preferredVariant.reference,
          textVersion: preferredVariant.textVersion ?? merged.textVersion,
          translationConfident: true,
          translationStale: false,
        }
      } else if (merged.translationId !== preferredTranslation) {
        merged = {
          ...merged,
          translationStale: true,
        }
      } else {
        merged = {
          ...merged,
          id: targetId,
          translationConfident: true,
          translationStale: false,
        }
      }
    }

    out.push(merged)
  }
  return out
}

export function memoryNeedsTranslationSync(
  state: Pick<UserState, 'translationId' | 'memoryVerses'>,
): boolean {
  const target = state.translationId
  return state.memoryVerses.some(
    (v) =>
      v.translationId !== target ||
      v.translationStale === true ||
      !v.id.endsWith(`:${target}`),
  )
}

/**
 * Apply fetched target-translation texts. Idempotent.
 * Failed fetches keep existing text and set `translationStale` — never substitute another translation.
 */
export function applyFetchedMemoryTranslations(
  state: UserState,
  target: TranslationId,
  results: MemoryTextFetchResult[],
): { state: UserState; report: MemoryTranslationReport } {
  const report: MemoryTranslationReport = {
    migrated: 0,
    merged: 0,
    failed: [],
    unchanged: 0,
  }

  const originalsById = new Map(state.memoryVerses.map((v) => [v.id, v]))
  const resultByScripture = new Map<
    string,
    { source: MemoryVerse; result: MemoryTextFetchResult }
  >()

  for (const result of results) {
    const source = originalsById.get(result.sourceId)
    if (!source) continue
    resultByScripture.set(scriptureMemoryKey(source), { source, result })
  }

  // Group existing bank by scripture (pre-collapse duplicates with progress merge).
  const groups = new Map<string, MemoryVerse[]>()
  for (const v of state.memoryVerses) {
    const key = scriptureMemoryKey(v)
    const list = groups.get(key) ?? []
    list.push(v)
    groups.set(key, list)
  }

  const nextVerses: MemoryVerse[] = []

  for (const [key, group] of groups) {
    let merged = group[0]
    for (let i = 1; i < group.length; i++) {
      merged = reconcileMemoryPair(merged, group[i])
      report.merged += 1
    }

    const targetId = makeMemoryId(
      merged.bookId,
      merged.chapter,
      merged.verseStart,
      merged.verseEnd,
      target,
    )
    const fetch = resultByScripture.get(key)
    const preferredAlready = group.find((v) => v.translationId === target)

    if (fetch?.result.ok) {
      const alreadyGood =
        merged.id === targetId &&
        merged.translationId === target &&
        merged.text === fetch.result.text &&
        !merged.translationStale

      nextVerses.push({
        ...merged,
        id: targetId,
        translationId: target,
        text: fetch.result.text,
        reference: fetch.result.reference,
        textVersion: CURRENT_MEMORY_TEXT_VERSION,
        translationConfident: true,
        translationStale: false,
      })
      if (alreadyGood) report.unchanged += 1
      else report.migrated += 1
      continue
    }

    if (fetch && !fetch.result.ok) {
      report.failed.push({
        id: fetch.source.id,
        reference: fetch.source.reference,
        reason: fetch.result.reason,
      })
      nextVerses.push({
        ...merged,
        // Prefer keeping preferred translation text if present; otherwise keep strongest card text.
        ...(preferredAlready
          ? {
              id: targetId,
              translationId: target,
              text: preferredAlready.text,
              reference: preferredAlready.reference,
              textVersion: preferredAlready.textVersion,
              translationConfident: true,
              translationStale: false,
            }
          : {
              translationStale: true,
            }),
      })
      continue
    }

    // No fetch attempt this pass.
    if (merged.translationId === target && merged.id === targetId && !merged.translationStale) {
      report.unchanged += 1
      nextVerses.push({
        ...merged,
        translationConfident: true,
        translationStale: false,
      })
    } else if (preferredAlready) {
      nextVerses.push({
        ...merged,
        id: targetId,
        translationId: target,
        text: preferredAlready.text,
        reference: preferredAlready.reference,
        textVersion: preferredAlready.textVersion ?? merged.textVersion,
        translationConfident: true,
        translationStale: false,
      })
      report.migrated += 1
    } else {
      nextVerses.push({
        ...merged,
        translationStale: true,
      })
    }
  }

  return {
    state: {
      ...state,
      translationId: target,
      memoryVerses: nextVerses,
    },
    report,
  }
}

/** Fetch + apply standardization for every card that needs it. */
export async function standardizeMemoryTranslations(
  state: UserState,
  fetchText: VerseTextFetcher,
  opts?: { target?: TranslationId },
): Promise<{ state: UserState; report: MemoryTranslationReport }> {
  const target = opts?.target ?? state.translationId
  const withTarget = { ...state, translationId: target }

  const needs = withTarget.memoryVerses.filter(
    (v) =>
      v.translationId !== target ||
      v.translationStale === true ||
      !v.id.endsWith(`:${target}`),
  )

  if (!needs.length) {
    const { state: collapsed, report } = applyFetchedMemoryTranslations(withTarget, target, [])
    return { state: collapsed, report }
  }

  // One fetch per scripture (avoid duplicate network work for mixed-translation pairs).
  const seen = new Set<string>()
  const toFetch: MemoryVerse[] = []
  for (const verse of needs) {
    const key = scriptureMemoryKey(verse)
    if (seen.has(key)) continue
    seen.add(key)
    toFetch.push(verse)
  }

  const results: MemoryTextFetchResult[] = []
  for (const verse of toFetch) {
    try {
      const { text, reference } = await fetchText(verse, target)
      if (!text?.trim()) {
        results.push({
          sourceId: verse.id,
          ok: false,
          reason: 'Empty text returned for selected translation',
        })
        continue
      }
      results.push({ sourceId: verse.id, ok: true, text, reference })
    } catch (err) {
      results.push({
        sourceId: verse.id,
        ok: false,
        reason: err instanceof Error ? err.message : 'Could not load translation text',
      })
    }
  }

  return applyFetchedMemoryTranslations(withTarget, target, results)
}
