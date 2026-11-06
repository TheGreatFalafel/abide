import { describe, expect, it } from 'vitest'
import {
  AVATAR_RIVE_ARTBOARD,
  AVATAR_RIVE_CONTRACT,
  AVATAR_RIVE_COSMETIC_SLOTS,
  AVATAR_RIVE_SRC,
  AVATAR_RIVE_STATE_MACHINE,
  probeAvatarRive,
  resetAvatarRiveProbe,
} from './avatarRive'
import { CHARACTER_EVENTS } from './characterEvents'
import { resolveEventBinding } from './riveCharacter'
import { avatarStateFromCharacterEvent } from './avatarMachine'

describe('avatar Rive preparation', () => {
  it('documents the future asset location and SM names', () => {
    expect(AVATAR_RIVE_SRC).toBe('/rive/avatar.riv')
    expect(AVATAR_RIVE_ARTBOARD).toBe('Avatar')
    expect(AVATAR_RIVE_STATE_MACHINE).toBe('AvatarSM')
    expect(AVATAR_RIVE_CONTRACT.cosmeticSlots).toEqual([...AVATAR_RIVE_COSMETIC_SLOTS])
  })

  it('binds every CharacterEvent for a second character', () => {
    for (const event of CHARACTER_EVENTS) {
      expect(resolveEventBinding(AVATAR_RIVE_CONTRACT, event).name.length).toBeGreaterThan(0)
    }
  })

  it('maps CharacterEvents onto avatar presentation states', () => {
    expect(avatarStateFromCharacterEvent('react_correct')).toBe('smile')
    expect(avatarStateFromCharacterEvent('react_incorrect')).toBe('think')
    expect(avatarStateFromCharacterEvent('sleep')).toBe('sleep')
    expect(avatarStateFromCharacterEvent('greet')).toBe('greet')
  })

  it('probe reports false under Vitest (no network / no asset required)', async () => {
    resetAvatarRiveProbe()
    await expect(probeAvatarRive()).resolves.toBe(false)
  })
})
