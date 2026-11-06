import {
  ariStateFromCharacterEvent,
  type CharacterEvent,
  normalizeCharacterEvent,
} from './characterEvents'
import type { RiveCharacterContract, RiveInputBinding } from './riveCharacter'
import type { AriCharacterState } from './types'
import { normalizeAriCharacterState } from './ariMachine'

/** Public URL for the Ari runtime asset (built from `rive/ari`). */
export const ARI_RIVE_SRC = '/rive/ari.riv'

/** State machine name authored in `rive/ari/scene.rml`. */
export const ARI_RIVE_STATE_MACHINE = 'AriSM'

/** Artboard name in the Ari `.riv`. */
export const ARI_RIVE_ARTBOARD = 'Ari'

/** Artboard size used for responsive aspect (see phase-c docs). */
export const ARI_RIVE_WIDTH = 520
export const ARI_RIVE_HEIGHT = 400
export const ARI_RIVE_ASPECT = ARI_RIVE_WIDTH / ARI_RIVE_HEIGHT

/**
 * CharacterEvent → Rive SM trigger names for Ari.
 * `react_*` map onto existing `correct` / `encourage` triggers until the
 * authored file adds aliases. `sleep` is reserved; falls back to idle timeline
 * if the trigger is not yet present in the `.riv`.
 */
const ARI_EVENT_BINDINGS: Record<CharacterEvent, RiveInputBinding> = {
  idle: { name: 'idle', kind: 'trigger' },
  walk: { name: 'walk', kind: 'trigger' },
  run: { name: 'run', kind: 'trigger' },
  jump: { name: 'jump', kind: 'trigger' },
  celebrate: { name: 'celebrate', kind: 'trigger' },
  encourage: { name: 'encourage', kind: 'trigger' },
  think: { name: 'think', kind: 'trigger' },
  greet: { name: 'greet', kind: 'trigger' },
  sleep: { name: 'sleep', kind: 'trigger' },
  react_correct: { name: 'correct', kind: 'trigger' },
  react_incorrect: { name: 'encourage', kind: 'trigger' },
}

export const ARI_RIVE_CONTRACT: RiveCharacterContract = {
  src: ARI_RIVE_SRC,
  artboard: ARI_RIVE_ARTBOARD,
  stateMachine: ARI_RIVE_STATE_MACHINE,
  aspectRatio: ARI_RIVE_ASPECT,
  defaultWidth: 96,
  eventBindings: ARI_EVENT_BINDINGS,
  loopingEvents: ['idle', 'walk', 'run', 'think', 'sleep'],
}

/**
 * Map product Ari states → Rive state-machine trigger names.
 * `blink` is ambient inside the idle timeline (no separate trigger).
 */
export function riveTriggerForAriState(state: AriCharacterState | unknown): string {
  const s = normalizeAriCharacterState(state)
  if (s === 'blink') return 'idle'
  if (s === 'jump') return 'jump'
  if (s === 'levelUp') return 'celebrate'
  if (s === 'milestone') return 'milestone'
  if (s === 'sleep') return 'sleep'
  return s
}

/** Resolve a CharacterEvent to the Ari SM trigger name. */
export function riveTriggerForCharacterEvent(event: CharacterEvent | unknown): string {
  const e = normalizeCharacterEvent(event)
  return ARI_EVENT_BINDINGS[e]?.name ?? 'idle'
}

/** Triggers that loop until another trigger fires (do not auto-return). */
export const ARI_RIVE_LOOPING_TRIGGERS = new Set([
  'idle',
  'walk',
  'run',
  'think',
  'guide',
  'sleep',
])

/** Convenience: CharacterEvent → Ari state → trigger (single path for tests). */
export function riveTriggerFromCharacterEvent(event: CharacterEvent | unknown): string {
  return riveTriggerForAriState(ariStateFromCharacterEvent(event))
}
