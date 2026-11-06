import {
  AVATAR_CHARACTER_STATES,
  type AnimationFeedbackEvent,
  type AvatarCharacterState,
} from './types'

/**
 * Human avatar state machine (foundation).
 * Presentation wiring into AbideAvatar is a follow-up — types + event map only.
 */
export function normalizeAvatarCharacterState(raw: unknown): AvatarCharacterState {
  if (typeof raw !== 'string') return 'idle'
  if ((AVATAR_CHARACTER_STATES as readonly string[]).includes(raw)) {
    return raw as AvatarCharacterState
  }
  return 'idle'
}

export function avatarStateFromFeedback(event: AnimationFeedbackEvent): AvatarCharacterState {
  switch (event.type) {
    case 'answer_selected':
      return 'idle'
    case 'correct_answer':
      return 'smile'
    case 'incorrect_answer':
      return 'think'
    case 'matching_completed':
    case 'exercise_completed':
      return event.correct ? 'smile' : 'think'
    case 'lesson_completed':
      return 'celebrate'
    case 'achievement_unlocked':
      return 'achievement'
    case 'streak_milestone':
      return 'celebrate'
    default:
      return 'idle'
  }
}

/**
 * Map shared CharacterEvent → avatar presentation state.
 * Keeps cosmetics / AbideAvatar as the live renderer until avatar.riv ships.
 */
export function avatarStateFromCharacterEvent(
  event: import('./characterEvents').CharacterEvent | unknown,
): AvatarCharacterState {
  const raw = typeof event === 'string' ? event : 'idle'
  switch (raw) {
    case 'react_correct':
      return 'smile'
    case 'react_incorrect':
    case 'encourage':
    case 'think':
      return 'think'
    case 'celebrate':
    case 'jump':
      return 'celebrate'
    case 'greet':
      return 'greet'
    case 'sleep':
      return 'sleep'
    case 'idle':
    case 'walk':
    case 'run':
    default:
      return 'idle'
  }
}

/** Whether the avatar should play its short react flash for this state. */
export function avatarShouldReact(state: AvatarCharacterState): boolean {
  return state === 'smile' || state === 'celebrate' || state === 'achievement'
}
