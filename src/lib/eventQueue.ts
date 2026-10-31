import type { ProgressEventInput } from './progressEvents'

const QUEUE_KEY = 'abide-progress-events-v1'

function readRaw(): ProgressEventInput[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ProgressEventInput[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeRaw(events: ProgressEventInput[]): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(events.slice(-500)))
}

export function enqueueProgressEvent(event: ProgressEventInput): void {
  const q = readRaw()
  if (q.some((e) => e.id === event.id)) return
  q.push(event)
  writeRaw(q)
}

export function peekProgressEvents(): ProgressEventInput[] {
  return readRaw()
}

export function dequeueProgressEvents(ids: string[]): void {
  if (!ids.length) return
  const drop = new Set(ids)
  writeRaw(readRaw().filter((e) => !drop.has(e.id)))
}

export function clearProgressEventQueue(): void {
  localStorage.removeItem(QUEUE_KEY)
}
