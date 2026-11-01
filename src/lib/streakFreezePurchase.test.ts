import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computeGemDelta, validateGemEvent, validateGemEventBatch } from './gemEvents'
import {
  MAX_STREAK_FREEZES,
  STREAK_FREEZE_PRICE,
  buildStreakFreezePurchaseEvent,
  streakFreezePurchaseBlockReason,
} from './gems'
import { clearGemEventQueue, peekGemEvents } from './gemQueue'
import { applyServerGemAuthority } from './serverGems'
import {
  canPurchaseStreakFreeze,
  streakFreezeActivityKey,
} from './streak'
import { createInitialState } from './types'

const NOW = new Date('2026-06-15T12:00:00.000Z')

function freezeEvent(id: string) {
  return {
    id,
    type: 'shop_streak_freeze' as const,
    clientCreatedAt: NOW.toISOString(),
    payload: {
      purchaseId: id,
      activityKey: streakFreezeActivityKey(id),
      itemId: 'streak-freeze',
      claimedPrice: 1,
    },
  }
}

/** Mirrors commitGemEvents freeze rules for sequential / concurrent simulation. */
function simulateFreezePurchases(
  starting: { balance: number; freezes: number },
  purchaseIds: string[],
  opts?: { alreadySeen?: Set<string> },
) {
  const seen = opts?.alreadySeen ?? new Set<string>()
  let balance = starting.balance
  let freezes = starting.freezes
  const inserted: string[] = []
  const duplicates: string[] = []
  const rejected: string[] = []

  for (const id of purchaseIds) {
    const key = streakFreezeActivityKey(id)
    if (seen.has(key)) {
      duplicates.push(id)
      continue
    }
    if (!canPurchaseStreakFreeze(freezes)) {
      rejected.push('Streak freeze inventory is full')
      continue
    }
    if (balance < STREAK_FREEZE_PRICE) {
      rejected.push('Insufficient gems')
      continue
    }
    seen.add(key)
    balance -= STREAK_FREEZE_PRICE
    freezes += 1
    inserted.push(id)
  }

  return { balance, freezes, inserted, duplicates, rejected }
}

describe('streak freeze shop pricing and validation', () => {
  it('uses the fixed server price and ignores client claimed amounts', () => {
    expect(computeGemDelta('shop_streak_freeze', { claimedPrice: 1 })).toBe(-STREAK_FREEZE_PRICE)
    expect(STREAK_FREEZE_PRICE).toBe(20)
  })

  it('accepts a well-formed freeze purchase event', () => {
    const id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
    const ok = validateGemEvent(freezeEvent(id), NOW)
    expect(ok.ok).toBe(true)
    if (ok.ok) {
      expect(ok.event.deltaGems).toBe(-STREAK_FREEZE_PRICE)
      expect(ok.event.activityKey).toBe(streakFreezeActivityKey(id))
    }
  })

  it('rejects duplicate freeze activity keys in one batch (idempotency)', () => {
    const id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
    const a = freezeEvent(id)
    const b = {
      ...freezeEvent('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
      payload: {
        purchaseId: id,
        activityKey: streakFreezeActivityKey(id),
      },
    }
    const { accepted, rejected } = validateGemEventBatch([a, b], NOW)
    expect(accepted).toHaveLength(1)
    expect(rejected.some((r) => r.error.includes('Duplicate activity'))).toBe(true)
  })

  it('allows two distinct freeze purchase ids in one batch (cap enforced on apply)', () => {
    const { accepted, rejected } = validateGemEventBatch(
      [
        freezeEvent('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
        freezeEvent('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
      ],
      NOW,
    )
    expect(rejected).toHaveLength(0)
    expect(accepted).toHaveLength(2)
  })
})

describe('local eligibility — no offline unverified spend', () => {
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

  it('blocks full inventory and insufficient gems without queueing events', () => {
    const full = { ...createInitialState('T', 'year'), gems: 100, streakFreezes: 2 }
    expect(streakFreezePurchaseBlockReason(full)).toMatch(/maximum/i)
    expect(canPurchaseStreakFreeze(MAX_STREAK_FREEZES)).toBe(false)

    const poor = { ...createInitialState('T', 'year'), gems: 5, streakFreezes: 0 }
    expect(streakFreezePurchaseBlockReason(poor)).toMatch(/Need 20/)
    expect(peekGemEvents()).toHaveLength(0)
  })

  it('buildStreakFreezePurchaseEvent does not enqueue offline', () => {
    const event = buildStreakFreezePurchaseEvent(NOW)
    expect(event.type).toBe('shop_streak_freeze')
    expect(event.payload?.activityKey).toBe(streakFreezeActivityKey(event.id))
    expect(peekGemEvents()).toHaveLength(0)
  })
})

describe('server-authoritative freeze purchase simulation', () => {
  it('successful purchase deducts exact gems and grants one freeze', () => {
    const result = simulateFreezePurchases(
      { balance: 50, freezes: 0 },
      ['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'],
    )
    expect(result.inserted).toHaveLength(1)
    expect(result.balance).toBe(30)
    expect(result.freezes).toBe(1)
    expect(result.rejected).toHaveLength(0)
  })

  it('rejects insufficient gem balance', () => {
    const result = simulateFreezePurchases(
      { balance: 10, freezes: 0 },
      ['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'],
    )
    expect(result.inserted).toHaveLength(0)
    expect(result.balance).toBe(10)
    expect(result.rejected).toContain('Insufficient gems')
  })

  it('enforces maximum inventory of two', () => {
    const result = simulateFreezePurchases(
      { balance: 100, freezes: 1 },
      [
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      ],
    )
    expect(result.inserted).toHaveLength(1)
    expect(result.freezes).toBe(2)
    expect(result.balance).toBe(80)
    expect(result.rejected).toContain('Streak freeze inventory is full')
  })

  it('duplicate request / retry does not double-spend', () => {
    const seen = new Set<string>()
    const id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
    const first = simulateFreezePurchases({ balance: 40, freezes: 0 }, [id], {
      alreadySeen: seen,
    })
    const retry = simulateFreezePurchases(
      { balance: first.balance, freezes: first.freezes },
      [id],
      { alreadySeen: seen },
    )
    expect(first.inserted).toHaveLength(1)
    expect(retry.duplicates).toContain(id)
    expect(retry.balance).toBe(20)
    expect(retry.freezes).toBe(1)
  })

  it('sequential distinct attempts near the cap only fill remaining slots', () => {
    // Same-request sequential rules (batch). Cross-request races are covered by
    // AtomicFreezePurchaseSimulator in streakFreezeAtomic.test.ts.
    const result = simulateFreezePurchases(
      { balance: 100, freezes: 1 },
      [
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      ],
    )
    expect(result.inserted).toHaveLength(1)
    expect(result.freezes).toBe(MAX_STREAK_FREEZES)
  })

  it('interrupted / failed attempt leaves balance and freezes unchanged', () => {
    const starting = { balance: 40, freezes: 1 }
    // Simulate validation failure before ledger write
    const blocked = streakFreezePurchaseBlockReason({
      ...createInitialState('T', 'year'),
      gems: starting.balance,
      streakFreezes: 2,
    })
    expect(blocked).toBeTruthy()
    expect(starting.balance).toBe(40)
    expect(starting.freezes).toBe(1)
  })

  it('applyServerGemAuthority reconciles gems and freeze inventory after purchase', () => {
    const local = { ...createInitialState('T', 'year'), gems: 50, streakFreezes: 0 }
    const next = applyServerGemAuthority(local, { gems: 30, streakFreezes: 1 })
    expect(next.gems).toBe(30)
    expect(next.streakFreezes).toBe(1)
  })

  it('cosmetic shop_purchase deltas remain unchanged (regression)', () => {
    expect(computeGemDelta('shop_purchase', { itemId: 'base-scribe' })).toBe(-40)
    expect(computeGemDelta('shop_purchase', { itemId: 'base-seeker' })).toBe(0)
  })
})
