import {
  markActivityHistorySynced,
  mergeActivityHistory,
  type ActivityHistoryRecord,
} from './activityHistory'
import { dequeueProgressEvents, peekProgressEvents } from './eventQueue'
import { dequeueGemEvents, peekGemEvents } from './gemQueue'
import type { GemEventInput } from './gemEvents'
import type { ProgressEventInput } from './progressEvents'
import { prepareStateForCloud, withLocalEsvKey } from './privacy'
import type { UserState } from './types'

export async function fetchCloudProgress(): Promise<UserState | null> {
  const res = await fetch('/api/progress')
  if (res.status === 401 || res.status === 503) return null
  if (!res.ok) throw new Error('Could not load cloud progress')
  const data = (await res.json()) as { state: UserState | null }
  // Defensive: never treat an API payload as carrying a personal ESV key
  return data.state ? prepareStateForCloud(data.state) : null
}

/**
 * Saves progress (ESV key stripped). Returns server state with the caller's
 * local key reattached so UI state is not wiped.
 */
export async function saveCloudProgress(state: UserState): Promise<UserState | null> {
  const localKey = state.esvApiKey
  const res = await fetch('/api/progress', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: prepareStateForCloud(state) }),
  })
  if (res.status === 401 || res.status === 503) return null
  if (!res.ok) throw new Error('Could not save cloud progress')
  const data = (await res.json()) as { ok?: boolean; state?: UserState }
  const saved = data.state ? prepareStateForCloud(data.state) : prepareStateForCloud(state)
  return withLocalEsvKey(saved, localKey)
}

export type ProgressEventsSyncResult = {
  serverXp: number
  streak: number
  longestStreak: number
  lastReadDate: string | null
  streakFreezes?: number
  state: UserState | null
  inserted: { id: string; awardedXp: number; type: string }[]
  duplicates: string[]
  rejected: { id?: string; error: string }[]
}

/** Flush the offline progress-event queue to the server ledger. */
export async function syncProgressEvents(
  seedXp: number,
  events?: ProgressEventInput[],
): Promise<ProgressEventsSyncResult | null> {
  const batch = events ?? peekProgressEvents()
  const res = await fetch('/api/progress/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: batch, seedXp }),
  })
  if (res.status === 401 || res.status === 503) return null
  if (!res.ok) throw new Error('Could not sync progress events')
  const data = (await res.json()) as ProgressEventsSyncResult & {
    inserted?: { id: string }[]
    duplicates?: string[]
  }
  const done = [
    ...(data.inserted ?? []).map((e) => e.id),
    ...(data.duplicates ?? []),
  ]
  dequeueProgressEvents(done)
  const awardedById: Record<string, number> = {}
  for (const row of data.inserted ?? []) {
    if (typeof (row as { awardedXp?: number }).awardedXp === 'number') {
      awardedById[row.id] = (row as { awardedXp: number }).awardedXp
    }
  }
  markActivityHistorySynced(done, awardedById)
  return data
}

/** Pull private progress_events into the durable local activity history cache. */
export async function fetchActivityHistory(opts?: {
  limit?: number
  since?: string
}): Promise<ActivityHistoryRecord[] | null> {
  const params = new URLSearchParams()
  if (opts?.limit) params.set('limit', String(opts.limit))
  if (opts?.since) params.set('since', opts.since)
  const qs = params.toString()
  const res = await fetch(`/api/progress/history${qs ? `?${qs}` : ''}`)
  if (res.status === 401 || res.status === 503) return null
  if (!res.ok) throw new Error('Could not load activity history')
  const data = (await res.json()) as { events?: ActivityHistoryRecord[] }
  const events = Array.isArray(data.events) ? data.events : []
  mergeActivityHistory(events)
  return events
}

export type GemEventsSyncResult = {
  serverGems: number
  state: UserState | null
  inserted: { id: string; deltaGems: number; type: string }[]
  duplicates: string[]
  rejected: { id?: string; error: string }[]
  ownedItemIds: string[]
  streakFreezes?: number
  freezesGranted?: number
}

/** Flush the offline gem-event queue to the server ledger. */
export async function syncGemEvents(
  seedGems: number,
  events?: GemEventInput[],
): Promise<GemEventsSyncResult | null> {
  const batch = events ?? peekGemEvents()
  const res = await fetch('/api/gems/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: batch, seedGems }),
  })
  if (res.status === 401 || res.status === 503) return null
  if (!res.ok) throw new Error('Could not sync gem events')
  const data = (await res.json()) as GemEventsSyncResult
  const done = [
    ...(data.inserted ?? []).map((e) => e.id),
    ...(data.duplicates ?? []),
  ]
  dequeueGemEvents(done)
  return data
}

export type StreakFreezePurchaseResult =
  | {
      ok: true
      state: UserState | null
      serverGems: number
      streakFreezes: number
      spent: number
      duplicate?: boolean
    }
  | { ok: false; error: string; status?: number }

/**
 * Online-only streak freeze purchase. Does not enqueue offline gem events and
 * never applies an unverified local spend/grant — server ledger is authoritative.
 */
export async function purchaseStreakFreezeOnline(
  seedGems: number,
  event: GemEventInput,
): Promise<StreakFreezePurchaseResult> {
  const res = await fetch('/api/gems/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: [event], seedGems }),
  })
  if (res.status === 401) {
    return { ok: false, error: 'Sign in to buy streak freezes.', status: 401 }
  }
  if (res.status === 503) {
    return {
      ok: false,
      error: 'Cloud sync is unavailable. Try again when you are online.',
      status: 503,
    }
  }
  if (!res.ok) {
    return { ok: false, error: 'Purchase failed. Please try again.', status: res.status }
  }

  const data = (await res.json()) as GemEventsSyncResult
  const rejected = data.rejected?.[0]
  if (rejected) {
    return { ok: false, error: rejected.error || 'Purchase rejected.' }
  }

  const inserted = data.inserted?.some((e) => e.id === event.id)
  const duplicate = data.duplicates?.includes(event.id) ?? false
  if (!inserted && !duplicate) {
    return { ok: false, error: 'Purchase was not confirmed by the server.' }
  }

  const spent =
    data.inserted?.find((e) => e.id === event.id)?.deltaGems != null
      ? Math.abs(data.inserted.find((e) => e.id === event.id)!.deltaGems)
      : 0

  return {
    ok: true,
    state: data.state,
    serverGems: data.serverGems,
    streakFreezes:
      data.streakFreezes ??
      data.state?.streakFreezes ??
      0,
    spent: inserted ? spent : 0,
    duplicate,
  }
}

export type CircleMember = {
  userId: string
  displayName: string | null
  streak: number | null
  xp: number | null
  lastReadDate: string | null
  weekXp?: number
  lessonsThisWeek?: number
  /** Public avatar snapshot (appearance + equipped ids only). */
  avatar?: import('./cosmetics').PublicAvatar
}

export type CirclePayload = {
  circle: { id: string; name: string; inviteCode: string } | null
  members: CircleMember[]
  nudges: { id: string; fromUserId: string; message: string; createdAt: string }[]
  weekKey?: string
}

export async function fetchCircle(): Promise<CirclePayload | null> {
  const res = await fetch('/api/circle')
  if (res.status === 401 || res.status === 503) return null
  if (!res.ok) throw new Error('Could not load circle')
  return (await res.json()) as CirclePayload
}

export async function circleAction(
  action: 'create' | 'join' | 'nudge' | 'leave',
  extra: Record<string, string> = {},
): Promise<{ ok?: boolean; inviteCode?: string; error?: string }> {
  const res = await fetch('/api/circle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...extra }),
  })
  const data = (await res.json()) as { ok?: boolean; inviteCode?: string; error?: string }
  if (!res.ok) return { error: data.error || 'Request failed' }
  return data
}

export type ChallengeVerse = {
  id: string
  reference: string
  bookId: string
  bookName: string
  chapter: number
  verseStart: number
  verseEnd: number
}

export type ChallengeScore = {
  userId: string
  score: number
  correct: number
  attempts: number
  updatedAt: string
  displayName: string | null
  avatar?: import('./cosmetics').PublicAvatar
}

export type MemoryChallenge = {
  id: string
  circleId: string
  createdBy: string
  name: string
  source: string
  verses: ChallengeVerse[]
  startsAt: string
  endsAt: string
  status: string
  createdAt: string
  scores: ChallengeScore[]
}

export async function fetchChallenges(): Promise<MemoryChallenge[]> {
  const res = await fetch('/api/circle/challenge')
  if (res.status === 401 || res.status === 503) return []
  if (!res.ok) throw new Error('Could not load challenges')
  const data = (await res.json()) as { challenges: MemoryChallenge[] }
  return data.challenges ?? []
}

export async function challengeAction(
  body: Record<string, unknown>,
  opts?: { esvApiKey?: string },
): Promise<{
  ok?: boolean
  challengeId?: string
  score?: ChallengeScore
  correct?: boolean
  duplicate?: boolean
  error?: string
}> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const key = opts?.esvApiKey?.trim()
  if (key) headers['X-ESV-API-Key'] = key
  const res = await fetch('/api/circle/challenge', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  let data: {
    ok?: boolean
    challengeId?: string
    score?: ChallengeScore
    correct?: boolean
    duplicate?: boolean
    error?: string
  }
  try {
    data = (await res.json()) as typeof data
  } catch {
    return {
      error: res.ok
        ? 'Challenge server returned an invalid response'
        : `Challenge request failed (${res.status})`,
    }
  }
  if (!res.ok) return { error: data.error || 'Request failed' }
  return data
}
