import type { UserState } from './types'
import { dueMemoryVerses } from './memorySelect'
import { todayKey } from './types'

export type NotificationPrefs = {
  /** Master switch — off by default; never prompted on first launch */
  enabled: boolean
  readingReminder: boolean
  memoryReminder: boolean
  goalReminder: boolean
  /** Local hour 0–23 for daily reminder checks while the app (or SW) can notify */
  reminderHour: number
  /** Set after the user explicitly acts on permission */
  permissionAsked: boolean
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  enabled: false,
  readingReminder: true,
  memoryReminder: true,
  goalReminder: true,
  reminderHour: 8,
  permissionAsked: false,
}

export function migrateNotificationPrefs(
  raw: Partial<NotificationPrefs> | null | undefined,
): NotificationPrefs {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_NOTIFICATION_PREFS }
  const hour = Number(raw.reminderHour)
  return {
    enabled: raw.enabled === true,
    readingReminder: raw.readingReminder !== false,
    memoryReminder: raw.memoryReminder !== false,
    goalReminder: raw.goalReminder !== false,
    reminderHour: Number.isFinite(hour) ? Math.min(23, Math.max(0, Math.floor(hour))) : 8,
    permissionAsked: raw.permissionAsked === true,
  }
}

export function notificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return 'unsupported'
  }
  return Notification.permission
}

/** Request permission only after an explicit user gesture in Settings. */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return 'unsupported'
  }
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission
  }
  try {
    return await Notification.requestPermission()
  } catch {
    return Notification.permission
  }
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false
  const mq = window.matchMedia?.('(display-mode: standalone)')?.matches
  const ios = 'standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone
  return Boolean(mq || ios)
}

export type ReminderPayload = {
  title: string
  body: string
  url: string
}

/** Build at most one reminder for the current local conditions (no auto-permission). */
export function buildDailyReminder(state: UserState, now = new Date()): ReminderPayload | null {
  const prefs = migrateNotificationPrefs(state.notifications)
  if (!prefs.enabled) return null
  if (notificationPermission() !== 'granted') return null

  const hour = now.getHours()
  // Soft window: reminder hour ± 2 hours so opening the app still surfaces a nudge
  const inWindow =
    Math.min(Math.abs(hour - prefs.reminderHour), 24 - Math.abs(hour - prefs.reminderHour)) <= 2
  if (!inWindow) return null

  const today = todayKey(now)
  const due = dueMemoryVerses(state, undefined, now).length
  const goalMet = state.todayXpDate === today && state.todayXp >= state.dailyGoalXp
  const readToday = state.lastReadDate === today

  if (prefs.memoryReminder && due > 0) {
    return {
      title: 'Memory reviews due',
      body: `${due} verse${due === 1 ? '' : 's'} ready in Abide.`,
      url: '/?view=memory',
    }
  }
  if (prefs.readingReminder && !readToday) {
    return {
      title: 'Time to abide in the Word',
      body: 'Your reading path is waiting for today.',
      url: '/?view=path',
    }
  }
  if (prefs.goalReminder && !goalMet) {
    return {
      title: 'Daily quest open',
      body: `${state.todayXp}/${state.dailyGoalXp} XP so far — a short session keeps the streak warm.`,
      url: '/',
    }
  }
  return null
}

const LAST_SHOWN_KEY = 'abide-last-reminder-day'

export function shouldShowReminderToday(now = new Date()): boolean {
  try {
    const last = localStorage.getItem(LAST_SHOWN_KEY)
    return last !== todayKey(now)
  } catch {
    return true
  }
}

export function markReminderShown(now = new Date()): void {
  try {
    localStorage.setItem(LAST_SHOWN_KEY, todayKey(now))
  } catch {
    /* ignore */
  }
}

/** Ask the service worker (or fall back to Notification) to show a local reminder. */
export async function showLocalReminder(payload: ReminderPayload): Promise<boolean> {
  if (notificationPermission() !== 'granted') return false
  const options: NotificationOptions = {
    body: payload.body,
    icon: '/icons/icon-192.png',
    tag: 'abide-daily',
    data: { url: payload.url },
  }
  try {
    const reg = await navigator.serviceWorker?.getRegistration()
    if (reg?.showNotification) {
      await reg.showNotification(payload.title, options)
      markReminderShown()
      return true
    }
  } catch {
    /* fall through */
  }
  try {
    // eslint-disable-next-line no-new
    new Notification(payload.title, options)
    markReminderShown()
    return true
  } catch {
    return false
  }
}
