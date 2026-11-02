/**
 * Central animation contracts — presentation only.
 * Never awards XP, gems, streaks, or progress.
 */

import type { AriExpression, AriPose } from '../mascot'

/** Product-level Ari states (event-driven character machine). */
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
  | 'milestone'

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
  'milestone',
] as const

/** Product-level human avatar states (foundation; AbideAvatar wiring is follow-up). */
export type AvatarCharacterState =
  | 'idle'
  | 'blink'
  | 'smile'
  | 'think'
  | 'celebrate'
  | 'achievement'

export const AVATAR_CHARACTER_STATES: readonly AvatarCharacterState[] = [
  'idle',
  'blink',
  'smile',
  'think',
  'celebrate',
  'achievement',
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
