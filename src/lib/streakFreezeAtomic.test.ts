import { describe, expect, it } from 'vitest'
import {
  MAX_STREAK_FREEZES,
  STREAK_FREEZE_PRICE,
  streakFreezeActivityKey,
} from './streak'
import {
  AtomicFreezePurchaseSimulator,
  parseAtomicFreezePurchaseResult,
} from './streakFreezeAtomic'

const A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'

describe('parseAtomicFreezePurchaseResult', () => {
  it('normalizes successful purchase payloads', () => {
    const parsed = parseAtomicFreezePurchaseResult({
      ok: true,
      duplicate: false,
      serverGems: 30,
      streakFreezes: 1,
      freezesGranted: 1,
      spent: 20,
    })
    expect(parsed).toEqual({
      ok: true,
      duplicate: false,
      error: undefined,
      serverGems: 30,
      streakFreezes: 1,
      freezesGranted: 1,
      spent: 20,
    })
  })
})

describe('atomic freeze purchase concurrency (simulated FOR UPDATE)', () => {
  it('allows a normal purchase and exact gem deduction', async () => {
    const sim = new AtomicFreezePurchaseSimulator(50, 0)
    const result = await sim.purchase(A, streakFreezeActivityKey(A))
    expect(result.ok).toBe(true)
    expect(result.spent).toBe(STREAK_FREEZE_PRICE)
    expect(result.serverGems).toBe(30)
    expect(result.streakFreezes).toBe(1)
    expect(result.freezesGranted).toBe(1)
  })

  it('two distinct simultaneous purchases with one inventory slot — only one wins', async () => {
    const sim = new AtomicFreezePurchaseSimulator(100, 1)
    const [r1, r2] = await Promise.all([
      sim.purchase(A, streakFreezeActivityKey(A)),
      sim.purchase(B, streakFreezeActivityKey(B)),
    ])
    const granted = [r1, r2].filter((r) => r.ok && !r.duplicate && r.freezesGranted === 1)
    const rejected = [r1, r2].filter((r) => !r.ok)
    expect(granted).toHaveLength(1)
    expect(rejected).toHaveLength(1)
    expect(rejected[0]?.error).toMatch(/full/i)
    expect(sim.freezes).toBe(MAX_STREAK_FREEZES)
    expect(sim.balance).toBe(80)
    expect(sim.keys.size).toBe(1)
  })

  it('two simultaneous purchases with capacity 0 — both rejected, no spend', async () => {
    const sim = new AtomicFreezePurchaseSimulator(100, 2)
    const [r1, r2] = await Promise.all([
      sim.purchase(A, streakFreezeActivityKey(A)),
      sim.purchase(B, streakFreezeActivityKey(B)),
    ])
    expect(r1.ok).toBe(false)
    expect(r2.ok).toBe(false)
    expect(sim.balance).toBe(100)
    expect(sim.freezes).toBe(2)
    expect(sim.keys.size).toBe(0)
  })

  it('simultaneous duplicate requests with the same purchase id are idempotent', async () => {
    const sim = new AtomicFreezePurchaseSimulator(40, 0)
    const key = streakFreezeActivityKey(A)
    const [r1, r2] = await Promise.all([sim.purchase(A, key), sim.purchase(A, key)])
    const successes = [r1, r2].filter((r) => r.ok && r.freezesGranted === 1)
    const duplicates = [r1, r2].filter((r) => r.ok && r.duplicate)
    expect(successes).toHaveLength(1)
    expect(duplicates).toHaveLength(1)
    expect(sim.balance).toBe(20)
    expect(sim.freezes).toBe(1)
    expect(sim.keys.size).toBe(1)
  })

  it('insufficient balance under concurrent requests — at most floor(balance/price) grants', async () => {
    const sim = new AtomicFreezePurchaseSimulator(30, 0)
    const [r1, r2] = await Promise.all([
      sim.purchase(A, streakFreezeActivityKey(A)),
      sim.purchase(B, streakFreezeActivityKey(B)),
    ])
    const granted = [r1, r2].filter((r) => r.freezesGranted === 1)
    const poor = [r1, r2].filter((r) => r.error?.includes('Insufficient'))
    expect(granted).toHaveLength(1)
    expect(poor).toHaveLength(1)
    expect(sim.balance).toBe(10)
    expect(sim.freezes).toBe(1)
  })

  it('failure between ledger and inventory leaves neither applied (statement abort)', async () => {
    const sim = new AtomicFreezePurchaseSimulator(40, 0)
    sim.failAfterLedger = true
    await expect(sim.purchase(A, streakFreezeActivityKey(A))).rejects.toThrow(/simulated failure/)
    expect(sim.balance).toBe(40)
    expect(sim.freezes).toBe(0)
    expect(sim.keys.size).toBe(0)
    expect(sim.ids.size).toBe(0)

    // Recovery purchase still works after the aborted attempt.
    sim.failAfterLedger = false
    const recovered = await sim.purchase(A, streakFreezeActivityKey(A))
    expect(recovered.ok).toBe(true)
    expect(sim.balance).toBe(20)
    expect(sim.freezes).toBe(1)
  })

  it('preserves existing idempotency after a successful purchase', async () => {
    const sim = new AtomicFreezePurchaseSimulator(60, 0)
    const first = await sim.purchase(A, streakFreezeActivityKey(A))
    const retry = await sim.purchase(A, streakFreezeActivityKey(A))
    expect(first.freezesGranted).toBe(1)
    expect(retry.duplicate).toBe(true)
    expect(retry.freezesGranted).toBe(0)
    expect(sim.balance).toBe(40)
    expect(sim.freezes).toBe(1)
  })
})
