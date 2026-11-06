/**
 * Future human-avatar Rive contract.
 *
 * The live UI still renders `AbideAvatar` (SVG + cosmetics inventory).
 * This module prepares a second Rive character that can eventually mirror
 * interchangeable clothing, hairstyles, accessories, and expressions
 * without redesigning the cosmetics data model.
 */

import type { CharacterEvent } from './characterEvents'
import type { RiveCharacterContract, RiveInputBinding } from './riveCharacter'

/** Public URL once `avatar.riv` is authored and exported. */
export const AVATAR_RIVE_SRC = '/rive/avatar.riv'

export const AVATAR_RIVE_ARTBOARD = 'Avatar'
export const AVATAR_RIVE_STATE_MACHINE = 'AvatarSM'

/**
 * Cosmetic slots expected as number (enum index) or boolean inputs on AvatarSM.
 * Indices map onto existing `cosmetics` / `appearance` catalog IDs at wire-up time.
 */
export const AVATAR_RIVE_COSMETIC_SLOTS = [
  'skinTone',
  'hairStyle',
  'hairColor',
  'top',
  'bottom',
  'accessory',
  'frame',
  'expression',
] as const

export type AvatarRiveCosmeticSlot = (typeof AVATAR_RIVE_COSMETIC_SLOTS)[number]

/** Number inputs the future `.riv` should expose for cosmetics. */
export type AvatarRiveCosmeticInputs = Partial<Record<AvatarRiveCosmeticSlot, number>>

const avatarEventBindings: Partial<Record<CharacterEvent, RiveInputBinding>> = {
  idle: { name: 'idle', kind: 'trigger' },
  walk: { name: 'walk', kind: 'trigger' },
  run: { name: 'run', kind: 'trigger' },
  jump: { name: 'jump', kind: 'trigger' },
  celebrate: { name: 'celebrate', kind: 'trigger' },
  encourage: { name: 'encourage', kind: 'trigger' },
  think: { name: 'think', kind: 'trigger' },
  greet: { name: 'greet', kind: 'trigger' },
  sleep: { name: 'sleep', kind: 'trigger' },
  react_correct: { name: 'react_correct', kind: 'trigger' },
  react_incorrect: { name: 'react_incorrect', kind: 'trigger' },
}

/**
 * Contract for the not-yet-shipped avatar `.riv`.
 * Loaders must treat a missing file as fallback → `AbideAvatar` (do not remove SVG).
 */
export const AVATAR_RIVE_CONTRACT: RiveCharacterContract = {
  src: AVATAR_RIVE_SRC,
  artboard: AVATAR_RIVE_ARTBOARD,
  stateMachine: AVATAR_RIVE_STATE_MACHINE,
  aspectRatio: 1,
  defaultWidth: 96,
  eventBindings: avatarEventBindings,
  loopingEvents: ['idle', 'walk', 'run', 'think', 'sleep'],
  cosmeticSlots: AVATAR_RIVE_COSMETIC_SLOTS,
}

/**
 * Probe whether the avatar Rive asset exists.
 * Cached per page lifetime; false in SSR / Vitest.
 */
let avatarProbe: Promise<boolean> | null = null

export function resetAvatarRiveProbe() {
  avatarProbe = null
}

export function probeAvatarRive(url: string = AVATAR_RIVE_SRC): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (typeof process !== 'undefined' && process.env.VITEST) return Promise.resolve(false)

  if (!avatarProbe) {
    avatarProbe = (async () => {
      try {
        const head = await fetch(url, { method: 'HEAD', cache: 'no-store' })
        if (head.ok) return true
        if (head.status === 405 || head.status === 501) {
          const get = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: { Range: 'bytes=0-0' },
          })
          return get.ok || get.status === 206
        }
        return false
      } catch {
        return false
      }
    })()
  }
  return avatarProbe
}
