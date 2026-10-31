import { describe, expect, it } from 'vitest'
import { PLANS, getPlanById } from '../data/bible'

describe('reading plans', () => {
  it('exposes the core built-in plans', () => {
    const ids = PLANS.map((p) => p.id)
    expect(ids).toEqual(
      expect.arrayContaining(['year', 'gospels', 'psalms30', 'nt90', 'proverbs31']),
    )
  })

  it('generates sequential days for Bible in a Year', () => {
    const plan = getPlanById('year')
    expect(plan.id).toBe('year')
    const days = plan.generate()
    expect(days.length).toBeGreaterThan(300)
    expect(days[0].day).toBe(1)
    expect(days.every((d) => d.passages.length > 0 || d.kind === 'quiz')).toBe(true)
  })

  it('keeps gospel readings and inserts quiz checkpoints', () => {
    const plan = getPlanById('gospels')
    const days = plan.generate()
    const reads = days.filter((d) => d.kind === 'read')
    expect(reads.length).toBe(plan.days)
    expect(days.some((d) => d.kind === 'quiz')).toBe(true)
    expect(days.length).toBeGreaterThan(plan.days)
  })

  it('resolves custom plans by id', () => {
    const custom = {
      id: 'custom-test',
      name: 'John only',
      bookIds: ['john'],
      days: 21,
      pace: 'chapter' as const,
      createdAt: '2026-01-01',
    }
    const plan = getPlanById('custom-test', [custom])
    expect(plan.id).toBe('custom-test')
    const days = plan.generate()
    expect(days.length).toBeGreaterThan(0)
    expect(days.length).toBeLessThanOrEqual(custom.days)
  })
})
