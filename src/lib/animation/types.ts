/**
 * Central animation contracts — presentation only.
 * Never awards XP, gems, streaks, or progress.
 */

import type { AriExpression, AriPose } from '../mascot'

/**
 * Product-level Ari states (event-driven character machine).
 * Prefer `CharacterEvent` at the application boundary; these states remain
 * the internal bridge to SVG / Rive / 3D renderers.
 */
export type AriCharacterState =
  | 'idle'
  | 'blink'
  | 'greet'
  | 'walk'
  | 'run'
  | 'think'
  | 'guide'
  | 'correct'
  | 'encourage'
  | 'celebrate'
  | 'jump'
  | 'levelUp'
  | 'milestone'
  | 'sleep'

export const ARI_CHARACTER_STATES: readonly AriCharacterState[] = [
  'idle',
  'blink',
  'greet',
  'walk',
  'run',
  'think',
  'guide',
  'correct',
  'encourage',
  'celebrate',
  'jump',
  'levelUp',
  'milestone',
  'sleep',
] as const

/**
 * Product-level human avatar states.
 * SVG `AbideAvatar` remains the live renderer; Rive avatar is prepared in
 * `avatarRive.ts` without replacing cosmetics / inventory.
 */
export type AvatarCharacterState =
  | 'idle'
  | 'blink'
  | 'smile'
  | 'think'
  | 'celebrate'
  | 'achievement'
  | 'sleep'
  | 'greet'

export const AVATAR_CHARACTER_STATES: readonly AvatarCharacterState[] = [
  'idle',
  'blink',
  'smile',
  'think',
  'celebrate',
  'achievement',
  'sleep',
  'greet',
] as const

/**
 * Feedback events emitted by games / lessons / celebration UI.
 * Descriptive only — progress modules remain the source of truth for outcomes.
 */
export type AnimationFeedbackEvent =
  | { type: 'answer_selected' }
  | { type: 'correct_answer' }
  | { type: 'incorrect_answer' }
  | { type: 'matching_completed'; correct: boolean }
  | { type: 'exercise_completed'; correct: boolean }
  | { type: 'lesson_completed' }
  | { type: 'level_up' }
  | { type: 'achievement_unlocked' }
  | { type: 'streak_milestone' }

export type AnimationMotionMode = 'idle' | 'react' | 'none'

/**
 * Resolved presentation for AriMark (bridges to existing expression/pose CSS).
 * `extraClass` may include modifiers like `pose-run` (faster walk).
 */
export type AriPresentation = {
  state: AriCharacterState
  expression: AriExpression
  pose: AriPose
  motion: AnimationMotionMode
  /** Extra CSS classes on the SVG (e.g. pose-run). */
  extraClass: string
  /** Soft idle animation; false when motion is none or reduced-motion fallback. */
  animate: boolean
}
