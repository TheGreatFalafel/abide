import type { AriCharacterState } from './types'
import { normalizeAriCharacterState } from './ariMachine'

/** Public URL for the Phase C Ari runtime asset (built from `rive/ari`). */
export const ARI_RIVE_SRC = '/rive/ari.riv'

/** State machine name authored in `rive/ari/scene.rml`. */
export const ARI_RIVE_STATE_MACHINE = 'AriSM'

/** Artboard name in the Ari `.riv`. */
export const ARI_RIVE_ARTBOARD = 'Ari'

/**
 * Map product Ari states → Rive state-machine trigger names.
 * `blink` is ambient inside the idle timeline (no separate trigger).
 */
export function riveTriggerForAriState(state: AriCharacterState | unknown): string {
  const s = normalizeAriCharacterState(state)
  if (s === 'blink') return 'idle'
  return s
}

/** Triggers that loop until another trigger fires (do not auto-return). */
export const ARI_RIVE_LOOPING_TRIGGERS = new Set(['idle', 'walk', 'run', 'think', 'guide'])
