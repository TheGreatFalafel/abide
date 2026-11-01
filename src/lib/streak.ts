import { yesterdayKey } from './types'

/** Soft inventory cap for earned (and held) streak freezes. */
export const MAX_STREAK_FREEZES = 2

/** Gem shop — server prices only; clients must not invent amounts. */
export const STREAK_FREEZE_SHOP_ID = 'streak-freeze'
export const STREAK_FREEZE_PRICE = 20

export function streakFreezeActivityKey(purchaseId: string): string {
  return `shop:${STREAK_FREEZE_SHOP_ID}:${purchaseId}`
}

export function canPurchaseStreakFreeze(freezes: number): boolean {
  return clampStreakFreezes(freezes) < MAX_STREAK_FREEZES
}

export type StreakFields = {
  streak: number
  longestStreak: number
  lastReadDate: string | null
  streakFreezes: number
}

export function clampStreakFreezes(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(MAX_STREAK_FREEZES, Math.floor(n)))
}

export function migrateStreakFreezes(raw: unknown, fallback = 1): number {
  if (raw == null || raw === '') return clampStreakFreezes(fallback)
  const n = Number(raw)
  if (!Number.isFinite(n)) return clampStreakFreezes(fallback)
  return clampStreakFreezes(n)
}

/**
 * Grant one freeze from reading cadence (every 7 newly completed plan days).
 * Preserves the existing cap of two.
 */
export function grantStreakFreeze(freezes: number): number {
  return clampStreakFreezes(freezes + 1)
}

function withLongest(fields: StreakFields): StreakFields {
  return {
    ...fields,
    streakFreezes: clampStreakFreezes(fields.streakFreezes),
    longestStreak: Math.max(fields.longestStreak, fields.streak),
  }
}

/**
 * Apply a qualifying activity on calendar day `day` (YYYY-MM-DD).
 * A gap consumes at most one freeze and continues the streak; without a freeze the streak resets to 1.
 * Same-day activity is a no-op for streak math.
 */
export function applyActivityOnDay(state: StreakFields, day: string): StreakFields {
  const lastReadDate = state.lastReadDate
  if (lastReadDate === day) {
    return withLongest({ ...state, lastReadDate: day })
  }

  let streak = state.streak
  let streakFreezes = clampStreakFreezes(state.streakFreezes)

  if (lastReadDate === null) {
    streak = 1
  } else {
    const y = yesterdayKey(new Date(`${day}T12:00:00.000Z`))
    if (lastReadDate === y) {
      streak = streak + 1
    } else if (streakFreezes > 0) {
      streakFreezes -= 1
      streak = streak + 1
    } else {
      streak = 1
    }
  }

  return withLongest({
    streak,
    longestStreak: state.longestStreak,
    lastReadDate: day,
    streakFreezes,
  })
}

/**
 * Passive open-app gap check (local normalizeDay).
 * If last activity is older than yesterday and a freeze remains, consume exactly one and
 * bridge `lastReadDate` to yesterday so today's activity can continue the streak.
 * Without a freeze, the streak drops to 0 (awaiting a fresh start on next activity).
 */
export function applyPassiveGapCheck(state: StreakFields, today: string): StreakFields {
  const last = state.lastReadDate
  if (!last || state.streak <= 0) return withLongest(state)

  const yesterday = yesterdayKey(new Date(`${today}T12:00:00.000Z`))
  if (last === today || last === yesterday) return withLongest(state)

  const freezes = clampStreakFreezes(state.streakFreezes)
  if (freezes > 0) {
    return withLongest({
      ...state,
      streakFreezes: freezes - 1,
      lastReadDate: yesterday,
    })
  }

  return withLongest({
    ...state,
    streak: 0,
  })
}

/**
 * Apply a sorted list of activity calendar days once each (deduped).
 * Used by the server when committing newly inserted progress events.
 */
export function applyActivityDays(state: StreakFields, days: string[]): StreakFields {
  const unique = [...new Set(days.filter(Boolean))].sort()
  let next = withLongest(state)
  for (const day of unique) {
    next = applyActivityOnDay(next, day)
  }
  return next
}

/**
 * Reconcile local + cloud streak tuples without resurrecting consumed freezes
 * or discarding a legitimately newer preserved streak.
 */
export function mergeStreakFields(local: StreakFields, cloud: StreakFields): StreakFields {
  const localDate = local.lastReadDate ?? ''
  const cloudDate = cloud.lastReadDate ?? ''
  const longestStreak = Math.max(local.longestStreak, cloud.longestStreak)

  if (localDate > cloudDate) {
    return withLongest({
      streak: local.streak,
      longestStreak,
      lastReadDate: local.lastReadDate,
      streakFreezes: local.streakFreezes,
    })
  }

  if (cloudDate > localDate) {
    return withLongest({
      streak: cloud.streak,
      longestStreak,
      lastReadDate: cloud.lastReadDate,
      streakFreezes: cloud.streakFreezes,
    })
  }

  // Same lastReadDate (including both null): take the stronger streak, then the
  // freezes that belong with it. On a tie, prefer the lower freeze count so a
  // consumed freeze is not revived by Math.max.
  if (local.streak > cloud.streak) {
    return withLongest({
      streak: local.streak,
      longestStreak,
      lastReadDate: local.lastReadDate ?? cloud.lastReadDate,
      streakFreezes: local.streakFreezes,
    })
  }
  if (cloud.streak > local.streak) {
    return withLongest({
      streak: cloud.streak,
      longestStreak,
      lastReadDate: cloud.lastReadDate ?? local.lastReadDate,
      streakFreezes: cloud.streakFreezes,
    })
  }

  return withLongest({
    streak: local.streak,
    longestStreak,
    lastReadDate: local.lastReadDate ?? cloud.lastReadDate,
    streakFreezes: Math.min(
      clampStreakFreezes(local.streakFreezes),
      clampStreakFreezes(cloud.streakFreezes),
    ),
  })
}
