import { describe, expect, it } from 'vitest'
import { ARI_RIVE_CONTRACT } from './riveAri'
import { isLoopingEvent, resolveEventBinding } from './riveCharacter'
import { CHARACTER_EVENTS } from './characterEvents'

describe('RiveCharacter contract helpers', () => {
  it('resolves a binding for every CharacterEvent on Ari', () => {
    for (const event of CHARACTER_EVENTS) {
      const binding = resolveEventBinding(ARI_RIVE_CONTRACT, event)
      expect(binding.kind).toBe('trigger')
      expect(binding.name.length).toBeGreaterThan(0)
    }
    expect(resolveEventBinding(ARI_RIVE_CONTRACT, 'react_correct').name).toBe('correct')
    expect(resolveEventBinding(ARI_RIVE_CONTRACT, 'react_incorrect').name).toBe('encourage')
    expect(resolveEventBinding(ARI_RIVE_CONTRACT, 'sleep').name).toBe('sleep')
  })

  it('reports looping events from the contract', () => {
    expect(isLoopingEvent(ARI_RIVE_CONTRACT, 'idle')).toBe(true)
    expect(isLoopingEvent(ARI_RIVE_CONTRACT, 'react_correct')).toBe(false)
  })
})
