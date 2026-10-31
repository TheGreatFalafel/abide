import type { GemEventInput } from './gemEvents'

const QUEUE_KEY = 'abide-gem-events-v1'

function readRaw(): GemEventInput[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as GemEventInput[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeRaw(events: GemEventInput[]): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(events.slice(-500)))
}

export function enqueueGemEvent(event: GemEventInput): void {
  const q = readRaw()
  if (q.some((e) => e.id === event.id)) return
  q.push(event)
  writeRaw(q)
}

export function peekGemEvents(): GemEventInput[] {
  return readRaw()
}

export function dequeueGemEvents(ids: string[]): void {
  if (!ids.length) return
  const drop = new Set(ids)
  writeRaw(readRaw().filter((e) => !drop.has(e.id)))
}

export function clearGemEventQueue(): void {
  localStorage.removeItem(QUEUE_KEY)
}
