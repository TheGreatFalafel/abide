import { describe, expect, it } from 'vitest'
import {
  ARI_RIVE_ARTBOARD,
  ARI_RIVE_LOOPING_TRIGGERS,
  ARI_RIVE_SRC,
  ARI_RIVE_STATE_MACHINE,
  riveTriggerForAriState,
} from './riveAri'
import { ARI_CHARACTER_STATES } from './types'

describe('riveAri contracts', () => {
  it('points at the public Ari asset and named SM', () => {
    expect(ARI_RIVE_SRC).toBe('/rive/ari.riv')
    expect(ARI_RIVE_STATE_MACHINE).toBe('AriSM')
    expect(ARI_RIVE_ARTBOARD).toBe('Ari')
  })

  it('maps every product state to a trigger name', () => {
    for (const state of ARI_CHARACTER_STATES) {
      const trigger = riveTriggerForAriState(state)
      expect(typeof trigger).toBe('string')
      expect(trigger.length).toBeGreaterThan(0)
    }
    expect(riveTriggerForAriState('blink')).toBe('idle')
    expect(riveTriggerForAriState('correct')).toBe('correct')
    expect(riveTriggerForAriState('milestone')).toBe('milestone')
  })

  it('marks locomotion / hold states as looping', () => {
    expect(ARI_RIVE_LOOPING_TRIGGERS.has('walk')).toBe(true)
    expect(ARI_RIVE_LOOPING_TRIGGERS.has('correct')).toBe(false)
  })
})
