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
  return data
}

export type GemEventsSyncResult = {
  serverGems: number
  state: UserState | null
  inserted: { id: string; deltaGems: number; type: string }[]
  duplicates: string[]
  rejected: { id?: string; error: string }[]
  ownedItemIds: string[]
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

export type CircleMember = {
  userId: string
  displayName: string | null
  streak: number | null
  xp: number | null
  lastReadDate: string | null
  weekXp?: number
  lessonsThisWeek?: number
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
  const data = (await res.json()) as {
    ok?: boolean
    challengeId?: string
    score?: ChallengeScore
    correct?: boolean
    duplicate?: boolean
    error?: string
  }
  if (!res.ok) return { error: data.error || 'Request failed' }
  return data
}
