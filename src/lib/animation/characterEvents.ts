/**
 * Application-facing character animation events.
 * Presentation only — never awards XP, gems, streaks, or progress.
 *
 * These events are the stable product API. Character runtimes (Rive Ari,
 * future avatar `.riv`, SVG fallback) map them onto engine-specific inputs.
 */

import type { AnimationFeedbackEvent, AriCharacterState } from './types'

/**
 * Canonical character events supported across Ari and (eventually) the
 * customizable human avatar.
 */
export type CharacterEvent =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump'
  | 'celebrate'
  | 'encourage'
  | 'think'
  | 'greet'
  | 'sleep'
  | 'react_correct'
  | 'react_incorrect'

export const CHARACTER_EVENTS: readonly CharacterEvent[] = [
  'idle',
  'walk',
  'run',
  'jump',
  'celebrate',
  'encourage',
  'think',
  'greet',
  'sleep',
  'react_correct',
  'react_incorrect',
] as const

/** Events that hold/loop until another event is dispatched. */
export const CHARACTER_EVENT_LOOPING = new Set<CharacterEvent>([
  'idle',
  'walk',
  'run',
  'think',
  'sleep',
])

/** One-shot reactions that should not interrupt critical UI input. */
export const CHARACTER_EVENT_ONESHOT = new Set<CharacterEvent>([
  'jump',
  'celebrate',
  'encourage',
  'greet',
  'react_correct',
  'react_incorrect',
])

export function isCharacterEvent(raw: unknown): raw is CharacterEvent {
  return typeof raw === 'string' && (CHARACTER_EVENTS as readonly string[]).includes(raw)
}

export function normalizeCharacterEvent(raw: unknown): CharacterEvent {
  return isCharacterEvent(raw) ? raw : 'idle'
}

/**
 * Map a product CharacterEvent → existing Ari character state.
 * Keeps legacy Ari states (`correct`, `guide`, …) as the internal bridge.
 */
export function ariStateFromCharacterEvent(event: CharacterEvent | unknown): AriCharacterState {
  const e = normalizeCharacterEvent(event)
  switch (e) {
    case 'react_correct':
      return 'correct'
    case 'react_incorrect':
      return 'encourage'
    case 'idle':
    case 'walk':
    case 'run':
    case 'jump':
    case 'celebrate':
    case 'encourage':
    case 'think':
    case 'greet':
    case 'sleep':
      return e
    default:
      return 'idle'
  }
}

/** Inverse: Ari state → closest CharacterEvent (for shared APIs / logging). */
export function characterEventFromAriState(state: AriCharacterState | unknown): CharacterEvent {
  if (typeof state !== 'string') return 'idle'
  switch (state) {
    case 'correct':
    case 'levelUp':
      return state === 'correct' ? 'react_correct' : 'celebrate'
    case 'encourage':
      return 'encourage'
    case 'milestone':
    case 'jump':
      return state === 'jump' ? 'jump' : 'celebrate'
    case 'blink':
    case 'guide':
      return state === 'guide' ? 'greet' : 'idle'
    case 'idle':
    case 'walk':
    case 'run':
    case 'think':
    case 'greet':
    case 'celebrate':
    case 'sleep':
      return state
    default:
      return 'idle'
  }
}

/**
 * Map animation feedback (games/lesson) → CharacterEvent.
 * `answer_selected` stays idle so selection chrome does not spam motion.
 */
export function characterEventFromFeedback(event: AnimationFeedbackEvent): CharacterEvent {
  switch (event.type) {
    case 'answer_selected':
      return 'idle'
    case 'correct_answer':
      return 'react_correct'
    case 'incorrect_answer':
      return 'react_incorrect'
    case 'matching_completed':
    case 'exercise_completed':
      return event.correct ? 'react_correct' : 'react_incorrect'
    case 'lesson_completed':
    case 'level_up':
      return 'celebrate'
    case 'achievement_unlocked':
    case 'streak_milestone':
      return 'celebrate'
    default:
      return 'idle'
  }
}
