/**
 * Shared Rive character runtime contracts.
 * Engine-agnostic product events live in `characterEvents.ts`;
 * this module describes how `.riv` files are loaded and driven.
 */

import type { CharacterEvent } from './characterEvents'

/** How a CharacterEvent reaches a Rive state machine. */
export type RiveInputKind = 'trigger' | 'boolean' | 'number'

export type RiveInputBinding = {
  /** State-machine input name authored in the `.riv`. */
  name: string
  kind: RiveInputKind
  /** For boolean/number inputs when the event is active. */
  value?: boolean | number
}

/**
 * Declarative character asset contract — one per `.riv` character.
 * Used by `RiveCharacter` and documented for art handoff.
 */
export type RiveCharacterContract = {
  /** Public URL under `/public` (e.g. `/rive/ari.riv`). */
  src: string
  /** Artboard name inside the `.riv`. */
  artboard: string
  /** Primary state machine name. */
  stateMachine: string
  /** Intrinsic artboard aspect (width / height) for responsive sizing. */
  aspectRatio: number
  /** Default CSS pixel width when callers omit size. */
  defaultWidth: number
  /**
   * Map each CharacterEvent → SM input to fire/set.
   * Missing events should degrade to `idle` at the application layer.
   */
  eventBindings: Partial<Record<CharacterEvent, RiveInputBinding>>
  /** Events whose timelines loop until another event fires. */
  loopingEvents: readonly CharacterEvent[]
  /**
   * Optional ViewModel / nested-artboard slots for cosmetics
   * (human avatar clothing, hair, accessories). Ari leaves this empty.
   */
  cosmeticSlots?: readonly string[]
}

/** Safe defaults when an asset is missing or still being authored. */
export type RiveCharacterLoadState = 'idle' | 'loading' | 'ready' | 'error' | 'fallback'

/**
 * Resolve the binding for an event, falling back to idle when unknown.
 * Does not throw — callers decide whether to fire.
 */
export function resolveEventBinding(
  contract: RiveCharacterContract,
  event: CharacterEvent,
): RiveInputBinding {
  return (
    contract.eventBindings[event] ??
    contract.eventBindings.idle ?? {
      name: 'idle',
      kind: 'trigger',
    }
  )
}

export function isLoopingEvent(
  contract: RiveCharacterContract,
  event: CharacterEvent,
): boolean {
  return contract.loopingEvents.includes(event)
}
