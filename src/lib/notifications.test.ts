import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  DEFAULT_NOTIFICATION_PREFS,
  buildDailyReminder,
  migrateNotificationPrefs,
  shouldShowReminderToday,
  markReminderShown,
} from './notifications'
import { createInitialState, todayKey, yesterdayKey } from './types'
import { newFsrsSnapshot } from './fsrsEngine'

beforeEach(() => {
  const store: Record<string, string> = {}
  vi.stubGlobal('localStorage', {
    setItem: (k: string, v: string) => {
      store[k] = v
    },
    getItem: (k: string) => store[k] ?? null,
    removeItem: (k: string) => {
      delete store[k]
    },
  })
  vi.stubGlobal('Notification', {
    permission: 'granted',
  })
})

describe('notification prefs', () => {
  it('defaults to disabled (no first-launch prompt)', () => {
    expect(DEFAULT_NOTIFICATION_PREFS.enabled).toBe(false)
    expect(migrateNotificationPrefs(undefined).enabled).toBe(false)
  })

  it('clamps reminder hour', () => {
    expect(migrateNotificationPrefs({ reminderHour: 99 }).reminderHour).toBe(23)
    expect(migrateNotificationPrefs({ reminderHour: -2 }).reminderHour).toBe(0)
  })

  it('buildDailyReminder returns null when disabled', () => {
    const state = createInitialState('T', 'year')
    expect(buildDailyReminder(state)).toBeNull()
  })

  it('suggests reading reminder when not read today', () => {
    const now = new Date()
    const state = createInitialState('T', 'year')
    state.notifications = {
      ...DEFAULT_NOTIFICATION_PREFS,
      enabled: true,
      reminderHour: now.getHours(),
      memoryReminder: false,
      goalReminder: false,
      readingReminder: true,
    }
    state.lastReadDate = yesterdayKey(now)
    const payload = buildDailyReminder(state, now)
    expect(payload?.title).toMatch(/abide|Word/i)
  })

  it('suggests memory reminder when a card is due', () => {
    const now = new Date()
    const state = createInitialState('T', 'year')
    state.notifications = {
      ...DEFAULT_NOTIFICATION_PREFS,
      enabled: true,
      reminderHour: now.getHours(),
    }
    const past = new Date(now.getTime() - 86400000)
    const fsrs = { ...newFsrsSnapshot(past), due: past.toISOString() }
    state.memoryVerses = [
      {
        id: 'v1',
        reference: 'John 3:16',
        text: 'For God so loved the world',
        bookName: 'John',
        bookId: 'john',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        translationId: 'web',
        addedAt: todayKey(now),
        nextReview: yesterdayKey(now),
        intervalDays: 1,
        ease: 2.5,
        repetitions: 1,
        lapses: 0,
        status: 'learning',
        fsrs,
        reviewHistory: [],
        successfulReviews: 0,
        failedReviews: 0,
      },
    ]
    const payload = buildDailyReminder(state, now)
    expect(payload?.title).toMatch(/Memory/i)
  })

  it('shows at most one reminder marker per day', () => {
    expect(shouldShowReminderToday()).toBe(true)
    markReminderShown()
    expect(shouldShowReminderToday()).toBe(false)
  })
})
