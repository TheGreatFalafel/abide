import { describe, expect, it } from 'vitest'
import {
  ARI_RIVE_ARTBOARD,
  ARI_RIVE_CONTRACT,
  ARI_RIVE_LOOPING_TRIGGERS,
  ARI_RIVE_SRC,
  ARI_RIVE_STATE_MACHINE,
  riveTriggerForAriState,
  riveTriggerForCharacterEvent,
} from './riveAri'
import { ARI_CHARACTER_STATES } from './types'
import { CHARACTER_EVENTS } from './characterEvents'

describe('riveAri contracts', () => {
  it('points at the public Ari asset and named SM', () => {
    expect(ARI_RIVE_SRC).toBe('/rive/ari.riv')
    expect(ARI_RIVE_STATE_MACHINE).toBe('AriSM')
    expect(ARI_RIVE_ARTBOARD).toBe('Ari')
    expect(ARI_RIVE_CONTRACT.src).toBe(ARI_RIVE_SRC)
    expect(ARI_RIVE_CONTRACT.stateMachine).toBe(ARI_RIVE_STATE_MACHINE)
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
    expect(riveTriggerForAriState('jump')).toBe('jump')
    expect(riveTriggerForAriState('levelUp')).toBe('celebrate')
    expect(riveTriggerForAriState('sleep')).toBe('sleep')
  })

  it('maps every CharacterEvent to an Ari trigger', () => {
    for (const event of CHARACTER_EVENTS) {
      expect(riveTriggerForCharacterEvent(event).length).toBeGreaterThan(0)
    }
    expect(riveTriggerForCharacterEvent('react_correct')).toBe('correct')
    expect(riveTriggerForCharacterEvent('react_incorrect')).toBe('encourage')
  })

  it('marks locomotion / hold states as looping', () => {
    expect(ARI_RIVE_LOOPING_TRIGGERS.has('walk')).toBe(true)
    expect(ARI_RIVE_LOOPING_TRIGGERS.has('sleep')).toBe(true)
    expect(ARI_RIVE_LOOPING_TRIGGERS.has('correct')).toBe(false)
  })
})
