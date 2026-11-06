import { describe, expect, it } from 'vitest'
import {
  ariPresentationFromFeedback,
  ariStateFromFeedback,
  normalizeAriCharacterState,
  resolveAriPresentation,
} from './ariMachine'
import { avatarShouldReact, avatarStateFromFeedback } from './avatarMachine'
import { ARI_CHARACTER_STATES } from './types'

describe('Ari character state machine', () => {
  it('lists required product states', () => {
    expect(ARI_CHARACTER_STATES).toEqual([
      'idle',
      'blink',
      'greet',
      'walk',
      'run',
      'think',
      'guide',
      'correct',
      'encourage',
      'celebrate',
      'jump',
      'levelUp',
      'milestone',
      'sleep',
    ])
  })

  it('normalizes unknown states to idle', () => {
    expect(normalizeAriCharacterState('nope')).toBe('idle')
    expect(normalizeAriCharacterState(undefined)).toBe('idle')
    expect(normalizeAriCharacterState('greet')).toBe('greet')
  })

  it('maps feedback events to Ari states without inventing progress', () => {
    expect(ariStateFromFeedback({ type: 'answer_selected' })).toBe('idle')
    expect(ariStateFromFeedback({ type: 'correct_answer' })).toBe('correct')
    expect(ariStateFromFeedback({ type: 'incorrect_answer' })).toBe('encourage')
    expect(ariStateFromFeedback({ type: 'matching_completed', correct: true })).toBe('correct')
    expect(ariStateFromFeedback({ type: 'matching_completed', correct: false })).toBe('encourage')
    expect(ariStateFromFeedback({ type: 'exercise_completed', correct: true })).toBe('correct')
    expect(ariStateFromFeedback({ type: 'lesson_completed' })).toBe('celebrate')
    expect(ariStateFromFeedback({ type: 'level_up' })).toBe('levelUp')
    expect(ariStateFromFeedback({ type: 'achievement_unlocked' })).toBe('milestone')
    expect(ariStateFromFeedback({ type: 'streak_milestone' })).toBe('milestone')
  })

  it('resolves states onto existing SVG expression/pose classes', () => {
    expect(resolveAriPresentation('greet')).toMatchObject({
      expression: 'welcome',
      pose: 'guide',
      motion: 'idle',
      animate: true,
    })
    expect(resolveAriPresentation('correct')).toMatchObject({
      expression: 'proud',
      pose: 'celebrate',
      motion: 'react',
    })
    expect(resolveAriPresentation('encourage')).toMatchObject({
      expression: 'comforting',
      pose: 'encourage',
      motion: 'react',
    })
    expect(resolveAriPresentation('milestone')).toMatchObject({
      expression: 'celebrating',
      pose: 'jump',
      motion: 'react',
    })
    expect(resolveAriPresentation('run').extraClass).toBe('pose-run')
    expect(resolveAriPresentation('run').pose).toBe('walk')
    expect(resolveAriPresentation('walk').extraClass).toBe('')
    expect(resolveAriPresentation('sleep')).toMatchObject({
      expression: 'neutral',
      pose: 'idle',
      motion: 'idle',
    })
  })

  it('disables motion when reduceMotion is set (graceful fallback)', () => {
    const p = resolveAriPresentation('celebrate', { reduceMotion: true })
    expect(p.motion).toBe('none')
    expect(p.animate).toBe(false)
    expect(p.expression).toBe('celebrating')
    expect(p.pose).toBe('celebrate')
  })

  it('bridges correct/incorrect answer feedback to AriReactionCue presentation', () => {
    const ok = ariPresentationFromFeedback({ type: 'correct_answer' })
    expect(ok.state).toBe('correct')
    expect(ok.expression).toBe('proud')
    expect(ok.pose).toBe('celebrate')
    expect(ok.motion).toBe('react')

    const miss = ariPresentationFromFeedback({ type: 'incorrect_answer' })
    expect(miss.state).toBe('encourage')
    expect(miss.expression).toBe('comforting')
    expect(miss.pose).toBe('encourage')
  })
})

describe('Avatar character state machine (foundation)', () => {
  it('maps feedback to avatar states and react flags', () => {
    expect(avatarStateFromFeedback({ type: 'correct_answer' })).toBe('smile')
    expect(avatarStateFromFeedback({ type: 'incorrect_answer' })).toBe('think')
    expect(avatarStateFromFeedback({ type: 'achievement_unlocked' })).toBe('achievement')
    expect(avatarShouldReact('smile')).toBe(true)
    expect(avatarShouldReact('idle')).toBe(false)
  })
})
