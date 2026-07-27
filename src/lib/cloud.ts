import type { UserState } from '../lib/types'

export async function fetchCloudProgress(): Promise<UserState | null> {
  const res = await fetch('/api/progress')
  if (res.status === 401 || res.status === 503) return null
  if (!res.ok) throw new Error('Could not load cloud progress')
  const data = (await res.json()) as { state: UserState | null }
  return data.state
}

/** Saves progress; returns the server-merged state (keeps account ESV key, etc.). */
export async function saveCloudProgress(state: UserState): Promise<UserState | null> {
  const res = await fetch('/api/progress', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  })
  if (res.status === 401 || res.status === 503) return null
  if (!res.ok) throw new Error('Could not save cloud progress')
  const data = (await res.json()) as { ok?: boolean; state?: UserState }
  return data.state ?? state
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
): Promise<{ ok?: boolean; challengeId?: string; score?: ChallengeScore; error?: string }> {
  const res = await fetch('/api/circle/challenge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json()) as {
    ok?: boolean
    challengeId?: string
    score?: ChallengeScore
    error?: string
  }
  if (!res.ok) return { error: data.error || 'Request failed' }
  return data
}