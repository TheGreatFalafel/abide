import { describe, expect, it } from 'vitest'
import {
  contentIsGoDeeper,
  contentVisibleInline,
  nextDifficulty,
  objectivesForDifficulty,
  questionMatchesDifficulty,
  shuffleMcChoices,
} from './difficulty'

describe('curriculum difficulty helpers', () => {
  it('shows all and at-or-below content inline', () => {
    expect(contentVisibleInline('all', 'beginner')).toBe(true)
    expect(contentVisibleInline(undefined, 'beginner')).toBe(true)
    expect(contentVisibleInline('beginner', 'beginner')).toBe(true)
    expect(contentVisibleInline('intermediate', 'beginner')).toBe(false)
    expect(contentVisibleInline('advanced', 'intermediate')).toBe(false)
    expect(contentVisibleInline('intermediate', 'advanced')).toBe(true)
  })

  it('marks higher tiers as Go Deeper', () => {
    expect(contentIsGoDeeper('advanced', 'beginner')).toBe(true)
    expect(contentIsGoDeeper('all', 'beginner')).toBe(false)
  })

  it('filters questions with optional challenge-up', () => {
    expect(questionMatchesDifficulty(undefined, 'beginner')).toBe(true)
    expect(questionMatchesDifficulty('beginner', 'beginner')).toBe(true)
    expect(questionMatchesDifficulty('intermediate', 'beginner')).toBe(false)
    expect(
      questionMatchesDifficulty('intermediate', 'beginner', { includeChallengeUp: true }),
    ).toBe(true)
    expect(nextDifficulty('advanced')).toBeNull()
  })

  it('resolves tiered objectives', () => {
    const objectives = {
      beginner: ['B'],
      intermediate: ['I'],
      advanced: ['A'],
    }
    expect(objectivesForDifficulty(objectives, 'intermediate')).toEqual(['I'])
    expect(objectivesForDifficulty(['flat'], 'advanced')).toEqual(['flat'])
  })

  it('shuffles choices and remaps the answer index', () => {
    const q = {
      choices: ['A', 'B', 'C', 'D'],
      answer: 1,
    }
    const shuffled = shuffleMcChoices(q, () => 0.99)
    expect(shuffled.choices).toHaveLength(4)
    expect(shuffled.choices[shuffled.answer]).toBe('B')
    expect(new Set(shuffled.choices).size).toBe(4)
  })
})
