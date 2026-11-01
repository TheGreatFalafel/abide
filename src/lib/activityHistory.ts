/**
 * Durable local cache of learning activity (same events as progress_events).
 * Separate from the upload queue so history survives after sync drain.
 * Never used for XP/gem authority — analytics only.
 */
import type { ProgressEventInput, ProgressEventType } from './progressEvents'

const HISTORY_KEY = 'abide-activity-history-v1'
/** Soft retention: newest N records kept on device. */
export const ACTIVITY_HISTORY_MAX = 2000

/** Fields that must never persist in analytics history. */
const STRIP_KEYS = new Set([
  'answer',
  'answers',
  'typed',
  'reflectionText',
  'reflectionBody',
  'selectedAnswer',
  'esvApiKey',
  'text',
  'verseText',
  'passageText',
  'explanation',
  'awardedXp',
  'xp',
  'deltaGems',
])

export type ActivityHistoryRecord = {
  id: string
  type: ProgressEventType
  payload: Record<string, unknown>
  clientCreatedAt: string
  /** Present after server sync when known; never trusted for awards. */
  awardedXp?: number
  /** True once acknowledged by server (inserted or duplicate). */
  synced?: boolean
}

function readRaw(): ActivityHistoryRecord[] {
  try {
    if (typeof localStorage === 'undefined') return []
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ActivityHistoryRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeRaw(records: ActivityHistoryRecord[]): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records.slice(-ACTIVITY_HISTORY_MAX)))
}

export function sanitizeActivityPayload(
  payload: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (!payload || typeof payload !== 'object') return {}
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(payload)) {
    if (STRIP_KEYS.has(k)) continue
    if (typeof v === 'string' && v.length > 200) continue
    out[k] = v
  }
  return out
}

/** Append or update by id (idempotent). */
export function recordActivityHistory(
  event: ProgressEventInput & { awardedXp?: number; synced?: boolean },
): void {
  const records = readRaw()
  const idx = records.findIndex((r) => r.id === event.id)
  const next: ActivityHistoryRecord = {
    id: event.id,
    type: event.type,
    payload: sanitizeActivityPayload(event.payload ?? {}),
    clientCreatedAt: event.clientCreatedAt,
    ...(event.awardedXp != null ? { awardedXp: event.awardedXp } : {}),
    ...(event.synced != null ? { synced: event.synced } : {}),
  }
  if (idx >= 0) {
    records[idx] = {
      ...records[idx],
      ...next,
      payload: { ...records[idx].payload, ...next.payload },
      synced: next.synced ?? records[idx].synced,
      awardedXp: next.awardedXp ?? records[idx].awardedXp,
    }
  } else {
    records.push(next)
  }
  writeRaw(records)
}

function readingDedupeKey(r: ActivityHistoryRecord): string | null {
  const key = typeof r.payload?.activityKey === 'string' ? r.payload.activityKey : ''
  if (key) return key
  if (r.type !== 'reading_session') return null
  const legacy = typeof r.payload?.activityDayKey === 'string' ? r.payload.activityDayKey : ''
  return legacy || null
}

/** Prefer synced + earlier clientCreatedAt when collapsing duplicates. */
function preferHistoryRecord(
  a: ActivityHistoryRecord,
  b: ActivityHistoryRecord,
): ActivityHistoryRecord {
  if (Boolean(a.synced) !== Boolean(b.synced)) return a.synced ? a : b
  return a.clientCreatedAt <= b.clientCreatedAt ? a : b
}

/**
 * Collapse cross-device reading_session duplicates that share activityKey
 * (or legacy activityDayKey) but have different UUIDs.
 */
export function collapseReadingSessionDuplicates(
  records: ActivityHistoryRecord[],
): ActivityHistoryRecord[] {
  const byKey = new Map<string, ActivityHistoryRecord>()
  const rest: ActivityHistoryRecord[] = []
  for (const r of records) {
    const k = readingDedupeKey(r)
    if (!k) {
      rest.push(r)
      continue
    }
    const prev = byKey.get(k)
    byKey.set(k, prev ? preferHistoryRecord(prev, r) : r)
  }
  return [...rest, ...byKey.values()]
}

/** Merge remote/server rows by id without dropping local-only events. */
export function mergeActivityHistory(incoming: ActivityHistoryRecord[]): ActivityHistoryRecord[] {
  const map = new Map<string, ActivityHistoryRecord>()
  for (const r of readRaw()) map.set(r.id, r)
  for (const raw of incoming) {
    if (!raw?.id || typeof raw.type !== 'string') continue
    const cleaned: ActivityHistoryRecord = {
      id: raw.id,
      type: raw.type as ProgressEventType,
      payload: sanitizeActivityPayload(raw.payload ?? {}),
      clientCreatedAt: raw.clientCreatedAt,
      awardedXp: raw.awardedXp,
      synced: raw.synced ?? true,
    }
    const prev = map.get(cleaned.id)
    map.set(cleaned.id, prev ? { ...prev, ...cleaned, synced: true } : cleaned)
  }
  const merged = collapseReadingSessionDuplicates([...map.values()]).sort((a, b) =>
    a.clientCreatedAt.localeCompare(b.clientCreatedAt),
  )
  writeRaw(merged)
  return merged
}

export function markActivityHistorySynced(
  ids: string[],
  awardedById?: Record<string, number>,
): void {
  if (!ids.length) return
  const set = new Set(ids)
  const records = readRaw().map((r) => {
    if (!set.has(r.id)) return r
    return {
      ...r,
      synced: true,
      awardedXp: awardedById?.[r.id] ?? r.awardedXp,
    }
  })
  writeRaw(records)
}

export function listActivityHistory(opts?: {
  types?: ProgressEventType[]
  sinceDay?: string | null
  untilDay?: string | null
  limit?: number
}): ActivityHistoryRecord[] {
  const typeSet = opts?.types ? new Set(opts.types) : null
  let rows = readRaw()
  if (typeSet) rows = rows.filter((r) => typeSet.has(r.type))
  if (opts?.sinceDay || opts?.untilDay) {
    rows = rows.filter((r) => {
      const day = r.clientCreatedAt.slice(0, 10)
      if (opts.sinceDay && day < opts.sinceDay) return false
      if (opts.untilDay && day > opts.untilDay) return false
      return true
    })
  }
  rows = [...rows].sort((a, b) => a.clientCreatedAt.localeCompare(b.clientCreatedAt))
  if (opts?.limit != null) rows = rows.slice(-opts.limit)
  return rows
}

export function clearActivityHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch {
    /* ignore */
  }
}

export function peekActivityHistory(): ActivityHistoryRecord[] {
  return readRaw()
}
