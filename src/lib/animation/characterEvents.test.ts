import { describe, expect, it } from 'vitest'
import {
  CHARACTER_EVENT_LOOPING,
  CHARACTER_EVENT_ONESHOT,
  CHARACTER_EVENTS,
  ariStateFromCharacterEvent,
  characterEventFromAriState,
  characterEventFromFeedback,
  isCharacterEvent,
  normalizeCharacterEvent,
} from './characterEvents'

describe('CharacterEvent contract', () => {
  it('lists the product events required by the Rive foundation', () => {
    expect(CHARACTER_EVENTS).toEqual([
      'idle',
      'walk',
      'run',
      'jump',
      'celebrate',
      'encourage',
      'think',
      'greet',
      'sleep',
      'react_correct',
      'react_incorrect',
    ])
  })

  it('normalizes unknown values to idle', () => {
    expect(normalizeCharacterEvent('nope')).toBe('idle')
    expect(normalizeCharacterEvent(undefined)).toBe('idle')
    expect(isCharacterEvent('react_correct')).toBe(true)
    expect(isCharacterEvent('correct')).toBe(false)
  })

  it('maps events onto Ari states', () => {
    expect(ariStateFromCharacterEvent('react_correct')).toBe('correct')
    expect(ariStateFromCharacterEvent('react_incorrect')).toBe('encourage')
    expect(ariStateFromCharacterEvent('sleep')).toBe('sleep')
    expect(ariStateFromCharacterEvent('greet')).toBe('greet')
  })

  it('maps Ari states back to CharacterEvents', () => {
    expect(characterEventFromAriState('correct')).toBe('react_correct')
    expect(characterEventFromAriState('encourage')).toBe('encourage')
    expect(characterEventFromAriState('levelUp')).toBe('celebrate')
    expect(characterEventFromAriState('guide')).toBe('greet')
    expect(characterEventFromAriState('sleep')).toBe('sleep')
  })

  it('maps feedback without inventing progress outcomes', () => {
    expect(characterEventFromFeedback({ type: 'answer_selected' })).toBe('idle')
    expect(characterEventFromFeedback({ type: 'correct_answer' })).toBe('react_correct')
    expect(characterEventFromFeedback({ type: 'incorrect_answer' })).toBe('react_incorrect')
    expect(characterEventFromFeedback({ type: 'exercise_completed', correct: false })).toBe(
      'react_incorrect',
    )
    expect(characterEventFromFeedback({ type: 'lesson_completed' })).toBe('celebrate')
    expect(characterEventFromFeedback({ type: 'streak_milestone' })).toBe('celebrate')
  })

  it('marks locomotion / sleep as looping and reactions as one-shot', () => {
    expect(CHARACTER_EVENT_LOOPING.has('walk')).toBe(true)
    expect(CHARACTER_EVENT_LOOPING.has('sleep')).toBe(true)
    expect(CHARACTER_EVENT_ONESHOT.has('react_correct')).toBe(true)
    expect(CHARACTER_EVENT_ONESHOT.has('idle')).toBe(false)
  })
})
