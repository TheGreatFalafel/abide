import { afterEach, describe, expect, it } from 'vitest'
import {
  ARI_3D_LOOPING_MOTIONS,
  ARI_3D_MODEL_URL,
  ariMotionFromCharacterState,
  ariMotionFromFeedback,
  isAri3dProductEnabled,
  resetAri3dModelProbe,
} from './ari3d'
import { ARI_CHARACTER_STATES } from './types'

describe('ari3d motion bridge', () => {
  afterEach(() => {
    resetAri3dModelProbe()
  })

  it('points at the contracted public GLB path', () => {
    expect(ARI_3D_MODEL_URL).toBe('/characters/ari/ari.glb')
  })

  it('maps every product state to a 3D motion', () => {
    for (const state of ARI_CHARACTER_STATES) {
      const motion = ariMotionFromCharacterState(state)
      expect(typeof motion).toBe('string')
      expect(motion.length).toBeGreaterThan(0)
    }
    expect(ariMotionFromCharacterState('blink')).toBe('idle')
    expect(ariMotionFromCharacterState('jump')).toBe('jump')
    expect(ariMotionFromCharacterState('levelUp')).toBe('levelUp')
    expect(ariMotionFromCharacterState('sleep')).toBe('idle')
    expect(ariMotionFromCharacterState('unknown')).toBe('idle')
  })

  it('maps feedback events through the shared product machine', () => {
    expect(ariMotionFromFeedback({ type: 'correct_answer' })).toBe('correct')
    expect(ariMotionFromFeedback({ type: 'incorrect_answer' })).toBe('encourage')
    expect(ariMotionFromFeedback({ type: 'lesson_completed' })).toBe('celebrate')
    expect(ariMotionFromFeedback({ type: 'level_up' })).toBe('levelUp')
    expect(ariMotionFromFeedback({ type: 'streak_milestone' })).toBe('milestone')
    expect(ariMotionFromFeedback({ type: 'answer_selected' })).toBe('idle')
  })

  it('marks locomotion motions as looping', () => {
    expect(ARI_3D_LOOPING_MOTIONS.has('idle')).toBe(true)
    expect(ARI_3D_LOOPING_MOTIONS.has('walk')).toBe(true)
    expect(ARI_3D_LOOPING_MOTIONS.has('run')).toBe(true)
    expect(ARI_3D_LOOPING_MOTIONS.has('celebrate')).toBe(false)
  })

  it('defaults product 3D opt-in to off', () => {
    expect(isAri3dProductEnabled()).toBe(false)
  })
})
