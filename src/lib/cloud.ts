import type { UserState } from '../lib/types'

export async function fetchCloudProgress(): Promise<UserState | null> {
  const res = await fetch('/api/progress')
  if (res.status === 401 || res.status === 503) return null
  if (!res.ok) throw new Error('Could not load cloud progress')
  const data = (await res.json()) as { state: UserState | null }
  return data.state
}

export async function saveCloudProgress(state: UserState): Promise<boolean> {
  const res = await fetch('/api/progress', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  })
  if (res.status === 401 || res.status === 503) return false
  if (!res.ok) throw new Error('Could not save cloud progress')
  return true
}

export type CircleMember = {
  userId: string
  displayName: string | null
  streak: number | null
  xp: number | null
  lastReadDate: string | null
}

export type CirclePayload = {
  circle: { id: string; name: string; inviteCode: string } | null
  members: CircleMember[]
  nudges: { id: string; fromUserId: string; message: string; createdAt: string }[]
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
