import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createInitialState } from './types'
import {
  awardGems,
  purchaseCosmetic,
  setEquippedCosmetic,
  GEM_DAILY_EARN_CAP,
  GEM_REWARDS,
} from './gems'
import { computeGemDelta, validateGemEvent, validateGemEventBatch } from './gemEvents'
import { peekGemEvents, clearGemEventQueue } from './gemQueue'
import { ownsCosmetic, migrateCosmeticsState } from './cosmetics'

const NOW = new Date('2026-06-15T12:00:00.000Z')

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
  clearGemEventQueue()
})

describe('computeGemDelta', () => {
  it('awards fixed amounts and ignores client inflation', () => {
    expect(computeGemDelta('gem_lesson', { alreadyCompleted: false, claimed: 999 })).toBe(
      GEM_REWARDS.lesson,
    )
    expect(computeGemDelta('gem_lesson', { alreadyCompleted: true })).toBe(0)
    expect(computeGemDelta('gem_curriculum', { alreadyCompleted: false, reflection: true })).toBe(
      GEM_REWARDS.curriculum,
    )
    expect(computeGemDelta('gem_memory_review', { applySchedule: false, grade: 'good' })).toBe(0)
  })

  it('computes shop spend from catalog price only', () => {
    expect(computeGemDelta('shop_purchase', { itemId: 'base-scribe' })).toBe(-40)
    expect(computeGemDelta('shop_purchase', { itemId: 'nope' })).toBe(0)
    expect(computeGemDelta('shop_purchase', { itemId: 'base-seeker' })).toBe(0)
  })
})

describe('gem event validation', () => {
  it('rejects forged types and duplicate activity in a batch', () => {
    const a = {
      id: '11111111-1111-4111-8111-111111111111',
      type: 'gem_lesson',
      clientCreatedAt: NOW.toISOString(),
      payload: { activityKey: 'lesson:1' },
    }
    const forged = validateGemEvent({ ...a, type: 'grant_million_gems' }, NOW)
    expect(forged.ok).toBe(false)

    const { accepted, rejected } = validateGemEventBatch([a, { ...a, id: '22222222-2222-4222-8222-222222222222' }], NOW)
    expect(accepted).toHaveLength(1)
    expect(rejected.some((r) => r.error.includes('Duplicate activity'))).toBe(true)
  })
})

describe('local gem awards and purchases', () => {
  it('awards gems, queues events, and respects the daily cap', () => {
    let state = createInitialState('T', 'year')
    const first = awardGems(state, 'gem_lesson', 'lesson:1', { alreadyCompleted: false })
    expect(first.awarded).toBe(GEM_REWARDS.lesson)
    expect(first.state.gems).toBe(GEM_REWARDS.lesson)
    expect(peekGemEvents()).toHaveLength(1)

    state = { ...first.state, todayGems: GEM_DAILY_EARN_CAP }
    const capped = awardGems(state, 'gem_lesson', 'lesson:2', { alreadyCompleted: false })
    expect(capped.awarded).toBe(0)
  })

  it('prevents negative balances and duplicate purchases', () => {
    let state = createInitialState('T', 'year')
    state = { ...state, gems: 10 }
    const poor = purchaseCosmetic(state, 'base-scribe')
    expect(poor.ok).toBe(false)
    if (!poor.ok) expect(poor.error).toMatch(/Need 40/)

    state = { ...state, gems: 100 }
    const buy = purchaseCosmetic(state, 'base-scribe')
    expect(buy.ok).toBe(true)
    if (buy.ok) {
      expect(buy.state.gems).toBe(60)
      expect(ownsCosmetic(migrateCosmeticsState(buy.state.cosmetics), 'base-scribe')).toBe(true)
      const again = purchaseCosmetic(buy.state, 'base-scribe')
      expect(again.ok).toBe(false)
      if (!again.ok) expect(again.error).toMatch(/already own/i)
    }
  })

  it('equips only owned cosmetics', () => {
    let state = createInitialState('T', 'year')
    state = { ...state, gems: 100 }
    const buy = purchaseCosmetic(state, 'color-dawn')
    expect(buy.ok).toBe(true)
    if (!buy.ok) return
    const equipped = setEquippedCosmetic(buy.state, 'color-dawn')
    expect(equipped.cosmetics.equipped.color).toBe('color-dawn')
    const blocked = setEquippedCosmetic(equipped, 'frame-gold')
    expect(blocked.cosmetics.equipped.frame).not.toBe('frame-gold')
  })
})
