import { describe, expect, it } from 'vitest'
import { validateAndBuildChallengeXpEvent } from './challengeProgress'
import { gradeSelectedText } from './serverScripture'
import { XP } from './types'

describe('challenge security helpers', () => {
  it('builds XP only for verified correct submissions', () => {
    const event = validateAndBuildChallengeXpEvent(
      '33333333-3333-4333-8333-333333333333',
      new Date('2026-06-15T12:00:00.000Z'),
    )
    expect(event?.awardedXp).toBe(XP.memoryQuiz)
    expect(event?.type).toBe('challenge_correct')
  })

  it('grades answers without trusting a client boolean', () => {
    expect(
      gradeSelectedText(
        'The Lord is my shepherd; I shall not want.',
        'The Lord is my shepherd; I shall not want.',
      ),
    ).toBe(true)
    expect(gradeSelectedText('I shall not want.', 'The Lord is my shepherd; I shall not want.')).toBe(
      true,
    )
    expect(gradeSelectedText('totally wrong', 'The Lord is my shepherd')).toBe(false)
  })
})
