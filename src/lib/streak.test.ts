import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mergeUserStates } from './mergeState'
import { completeLesson, migrateUserState } from './progress'
import { applyServerAuthority } from './serverProgress'
import {
  applyActivityDays,
  applyActivityOnDay,
  applyPassiveGapCheck,
  clampStreakFreezes,
  grantStreakFreeze,
  MAX_STREAK_FREEZES,
  mergeStreakFields,
  migrateStreakFreezes,
} from './streak'
import { createInitialState, type UserState } from './types'

function fields(
  partial: Partial<{
    streak: number
    longestStreak: number
    lastReadDate: string | null
    streakFreezes: number
  }>,
) {
  return {
    streak: partial.streak ?? 0,
    longestStreak: partial.longestStreak ?? partial.streak ?? 0,
    lastReadDate: partial.lastReadDate ?? null,
    streakFreezes: partial.streakFreezes ?? 0,
  }
}

describe('streak freeze core', () => {
  it('missed day with available freeze continues streak and consumes exactly one', () => {
    const next = applyActivityOnDay(
      fields({ streak: 5, lastReadDate: '2026-10-28', streakFreezes: 1 }),
      '2026-10-30',
    )
    expect(next.streak).toBe(6)
    expect(next.lastReadDate).toBe('2026-10-30')
    expect(next.streakFreezes).toBe(0)
  })

  it('missed day without a freeze resets streak to 1 on activity', () => {
    const next = applyActivityOnDay(
      fields({ streak: 5, lastReadDate: '2026-10-28', streakFreezes: 0 }),
      '2026-10-30',
    )
    expect(next.streak).toBe(1)
    expect(next.lastReadDate).toBe('2026-10-30')
    expect(next.streakFreezes).toBe(0)
  })

  it('consecutive missed days: each passive check consumes at most one freeze', () => {
    let state = fields({
      streak: 4,
      lastReadDate: '2026-10-27',
      streakFreezes: 2,
    })
    state = applyPassiveGapCheck(state, '2026-10-29')
    expect(state.streakFreezes).toBe(1)
    expect(state.lastReadDate).toBe('2026-10-28')
    expect(state.streak).toBe(4)

    state = applyPassiveGapCheck(state, '2026-10-30')
    expect(state.streakFreezes).toBe(0)
    expect(state.lastReadDate).toBe('2026-10-29')
    expect(state.streak).toBe(4)

    state = applyPassiveGapCheck(state, '2026-10-31')
    expect(state.streak).toBe(0)
    expect(state.streakFreezes).toBe(0)
  })

  it('duplicate activity days in a batch only advance streak once', () => {
    const next = applyActivityDays(
      fields({ streak: 2, lastReadDate: '2026-10-29', streakFreezes: 1 }),
      ['2026-10-30', '2026-10-30', '2026-10-30'],
    )
    expect(next.streak).toBe(3)
    expect(next.lastReadDate).toBe('2026-10-30')
    expect(next.streakFreezes).toBe(1)
  })

  it('retrying the same day after a freeze-consuming gap does not consume again', () => {
    const afterGap = applyActivityOnDay(
      fields({ streak: 3, lastReadDate: '2026-10-27', streakFreezes: 1 }),
      '2026-10-30',
    )
    expect(afterGap.streakFreezes).toBe(0)
    const retry = applyActivityOnDay(afterGap, '2026-10-30')
    expect(retry).toEqual(afterGap)
  })

  it('preserves earning cap of two freezes', () => {
    expect(grantStreakFreeze(1)).toBe(2)
    expect(grantStreakFreeze(2)).toBe(MAX_STREAK_FREEZES)
    expect(clampStreakFreezes(99)).toBe(2)
  })
})

describe('local/cloud reconciliation', () => {
  it('does not resurrect a consumed freeze when lastReadDate matches', () => {
    const merged = mergeStreakFields(
      fields({ streak: 6, lastReadDate: '2026-10-30', streakFreezes: 0 }),
      fields({ streak: 6, lastReadDate: '2026-10-30', streakFreezes: 1 }),
    )
    expect(merged.streakFreezes).toBe(0)
    expect(merged.streak).toBe(6)
  })

  it('keeps a freeze-preserved local streak ahead of stale cloud columns', () => {
    const merged = mergeStreakFields(
      fields({ streak: 6, lastReadDate: '2026-10-30', streakFreezes: 0 }),
      fields({ streak: 5, lastReadDate: '2026-10-28', streakFreezes: 1 }),
    )
    expect(merged.streak).toBe(6)
    expect(merged.lastReadDate).toBe('2026-10-30')
    expect(merged.streakFreezes).toBe(0)
  })

  it('prefers newer cloud streak after server event commit', () => {
    const merged = mergeStreakFields(
      fields({ streak: 5, lastReadDate: '2026-10-28', streakFreezes: 1 }),
      fields({ streak: 6, lastReadDate: '2026-10-30', streakFreezes: 0 }),
    )
    expect(merged.streak).toBe(6)
    expect(merged.streakFreezes).toBe(0)
  })

  it('mergeUserStates uses freeze-safe streak merge instead of Math.max freezes', () => {
    const local = {
      ...createInitialState('A', 'year'),
      streak: 6,
      longestStreak: 6,
      lastReadDate: '2026-10-30',
      streakFreezes: 0,
      xp: 40,
    }
    const cloud = {
      ...createInitialState('A', 'year'),
      streak: 6,
      longestStreak: 6,
      lastReadDate: '2026-10-30',
      streakFreezes: 2,
      xp: 40,
    }
    const merged = mergeUserStates(local, cloud)
    expect(merged.streakFreezes).toBe(0)
    expect(merged.streak).toBe(6)
  })
})

describe('offline-to-online and server authority', () => {
  it('applyServerAuthority writes authoritative streakFreezes', () => {
    const local = {
      ...createInitialState('A', 'year'),
      streak: 4,
      streakFreezes: 1,
      lastReadDate: '2026-10-28',
    }
    const next = applyServerAuthority(local, {
      xp: 100,
      streak: 5,
      longestStreak: 5,
      lastReadDate: '2026-10-30',
      streakFreezes: 0,
    })
    expect(next.xp).toBe(100)
    expect(next.streak).toBe(5)
    expect(next.lastReadDate).toBe('2026-10-30')
    expect(next.streakFreezes).toBe(0)
  })

  it('simulates offline consume then cloud merge without restoring freezes', () => {
    // Device offline: gap + activity consumes freeze
    const offline = applyActivityOnDay(
      fields({ streak: 3, lastReadDate: '2026-10-27', streakFreezes: 1 }),
      '2026-10-30',
    )
    // Stale cloud still has the freeze
    const cloud = fields({
      streak: 3,
      lastReadDate: '2026-10-27',
      streakFreezes: 1,
    })
    const synced = mergeStreakFields(offline, cloud)
    expect(synced.streak).toBe(4)
    expect(synced.streakFreezes).toBe(0)
    expect(synced.lastReadDate).toBe('2026-10-30')
  })

  it('concurrent freeze consumption on same gap resolves to a single consume', () => {
    const base = fields({ streak: 8, lastReadDate: '2026-10-26', streakFreezes: 1 })
    const deviceA = applyActivityOnDay(base, '2026-10-29')
    const deviceB = applyActivityOnDay(base, '2026-10-29')
    expect(deviceA.streakFreezes).toBe(0)
    expect(deviceB.streakFreezes).toBe(0)
    const merged = mergeStreakFields(deviceA, deviceB)
    expect(merged.streak).toBe(9)
    expect(merged.streakFreezes).toBe(0)
    // Server batch with duplicate calendar day also consumes once
    const server = applyActivityDays(base, ['2026-10-29', '2026-10-29'])
    expect(server.streakFreezes).toBe(0)
    expect(server.streak).toBe(9)
  })
})

describe('migration and local lesson path', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
    })
  })

  it('migrateStreakFreezes clamps and defaults without wiping inventory', () => {
    expect(migrateStreakFreezes(undefined, 1)).toBe(1)
    expect(migrateStreakFreezes(2)).toBe(2)
    expect(migrateStreakFreezes(-3)).toBe(0)
    expect(migrateStreakFreezes(9)).toBe(2)
  })

  it('migrateUserState preserves existing freeze inventory', () => {
    const raw = {
      ...createInitialState('Pat', 'year'),
      streakFreezes: 2,
      streak: 10,
      lastReadDate: '2026-10-30',
    }
    const migrated = migrateUserState(raw)
    expect(migrated.streakFreezes).toBe(2)
    expect(migrated.streak).toBe(10)
  })

  it('completeLesson after a gap consumes one freeze and keeps earning rules', () => {
    vi.setSystemTime(new Date('2026-10-30T15:00:00.000Z'))
    const state: UserState = {
      ...createInitialState('Pat', 'year'),
      streak: 5,
      longestStreak: 5,
      lastReadDate: '2026-10-28',
      streakFreezes: 1,
      completedDays: [1, 2, 3, 4, 5, 6],
    }
    const result = completeLesson(state, 7, { reflection: false, planTotalDays: 365 })
    expect(result.state.streak).toBe(6)
    // Day 7 completion grants a freeze (every 7 days) after the gap consume → back to 1
    expect(result.state.streakFreezes).toBe(1)
    expect(result.state.lastReadDate).toBe('2026-10-30')
    vi.useRealTimers()
  })
})
