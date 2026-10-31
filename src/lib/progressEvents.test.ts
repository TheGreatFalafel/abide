import { describe, expect, it } from 'vitest'
import {
  answersMatch,
  computeEventXp,
  validateProgressEvent,
  validateProgressEventBatch,
} from './progressEvents'
import { XP } from './types'
import { prepareStateForCloud, stripEsvApiKey } from './privacy'
import { createInitialState } from './types'

const NOW = new Date('2026-06-15T12:00:00.000Z')

function event(partial: Record<string, unknown>) {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    type: 'lesson_complete',
    clientCreatedAt: NOW.toISOString(),
    payload: {},
    ...partial,
  }
}

describe('computeEventXp', () => {
  it('caps lesson awards server-side', () => {
    expect(
      computeEventXp('lesson_complete', {
        reflection: true,
        streakBonus: true,
        perfectDay: true,
      }),
    ).toBe(XP.lesson + XP.reflection + XP.streakBonus + XP.perfectDay)
  })

  it('ignores client-claimed inflated memory quiz XP', () => {
    expect(computeEventXp('memory_quiz', { correct: true, claimedXp: 999 })).toBe(XP.memoryQuiz)
    expect(computeEventXp('memory_quiz', { correct: false })).toBe(0)
  })

  it('requires applySchedule for memory review XP', () => {
    expect(computeEventXp('memory_review', { grade: 'good', applySchedule: false })).toBe(0)
    expect(computeEventXp('memory_review', { grade: 'good', applySchedule: true })).toBe(
      XP.memoryGood,
    )
  })
})

describe('validateProgressEvent', () => {
  it('accepts well-formed events and assigns server XP', () => {
    const result = validateProgressEvent(
      event({
        payload: { reflection: true },
      }),
      NOW,
    )
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.event.awardedXp).toBe(XP.lesson + XP.reflection)
    }
  })

  it('rejects forged event types', () => {
    const result = validateProgressEvent(event({ type: 'grant_million_xp' }), NOW)
    expect(result.ok).toBe(false)
  })

  it('rejects non-uuid ids (replay / forge protection)', () => {
    const result = validateProgressEvent(event({ id: 'not-a-uuid' }), NOW)
    expect(result.ok).toBe(false)
  })

  it('rejects future timestamps beyond skew', () => {
    const future = new Date(NOW.getTime() + 60 * 60 * 1000).toISOString()
    const result = validateProgressEvent(event({ clientCreatedAt: future }), NOW)
    expect(result.ok).toBe(false)
  })

  it('rejects duplicate ids within a batch', () => {
    const a = event({ id: '22222222-2222-4222-8222-222222222222' })
    const { accepted, rejected } = validateProgressEventBatch([a, a], NOW)
    expect(accepted).toHaveLength(1)
    expect(rejected.some((r) => /Duplicate/i.test(r.error))).toBe(true)
  })
})

describe('challenge answer matching', () => {
  it('matches normalized scripture text', () => {
    expect(
      answersMatch(
        'For God so loved the world,',
        'For God so loved the world.',
      ),
    ).toBe(true)
    expect(answersMatch('wrong', 'For God so loved the world.')).toBe(false)
  })
})

describe('ESV key redaction', () => {
  it('strips keys from cloud payloads', () => {
    const state = {
      ...createInitialState('Ada', 'year'),
      esvApiKey: 'secret-token-do-not-leak',
    }
    const prepared = prepareStateForCloud(state)
    expect(prepared.esvApiKey).toBe('')
    expect(JSON.stringify(prepared)).not.toContain('secret-token')
    expect(stripEsvApiKey(state).esvApiKey).toBe('')
  })
})
