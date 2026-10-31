import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearProgressEventQueue,
  dequeueProgressEvents,
  enqueueProgressEvent,
  peekProgressEvents,
} from './eventQueue'

beforeEach(() => {
  const store = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v)
    },
    removeItem: (k: string) => {
      store.delete(k)
    },
  })
  clearProgressEventQueue()
})

describe('offline progress event queue', () => {
  it('queues events and dequeues after sync', () => {
    enqueueProgressEvent({
      id: '44444444-4444-4444-8444-444444444444',
      type: 'lesson_complete',
      clientCreatedAt: new Date().toISOString(),
      payload: { reflection: true },
    })
    enqueueProgressEvent({
      id: '44444444-4444-4444-8444-444444444444',
      type: 'lesson_complete',
      clientCreatedAt: new Date().toISOString(),
      payload: { reflection: true },
    })
    expect(peekProgressEvents()).toHaveLength(1)
    dequeueProgressEvents(['44444444-4444-4444-8444-444444444444'])
    expect(peekProgressEvents()).toHaveLength(0)
  })
})
