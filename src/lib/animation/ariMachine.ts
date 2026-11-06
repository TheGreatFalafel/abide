import { normalizeExpression, normalizePose, type AriExpression, type AriPose } from '../mascot'
import {
  ARI_CHARACTER_STATES,
  type AnimationFeedbackEvent,
  type AnimationMotionMode,
  type AriCharacterState,
  type AriPresentation,
} from './types'

type AriStateSpec = {
  expression: AriExpression
  pose: AriPose
  motion: AnimationMotionMode
  /** Extra CSS class(es); e.g. pose-run for faster walk. */
  extraClass?: string
}

const ARI_STATE_SPECS: Record<AriCharacterState, AriStateSpec> = {
  idle: { expression: 'neutral', pose: 'idle', motion: 'idle' },
  /** Blink is ambient CSS on idle — not a discrete pose. */
  blink: { expression: 'neutral', pose: 'idle', motion: 'idle' },
  greet: { expression: 'welcome', pose: 'guide', motion: 'idle' },
  walk: { expression: 'encouraging', pose: 'walk', motion: 'idle' },
  run: { expression: 'encouraging', pose: 'walk', motion: 'idle', extraClass: 'pose-run' },
  think: { expression: 'thinking', pose: 'think', motion: 'idle' },
  guide: { expression: 'welcome', pose: 'guide', motion: 'idle' },
  correct: { expression: 'proud', pose: 'celebrate', motion: 'react' },
  encourage: { expression: 'comforting', pose: 'encourage', motion: 'react' },
  celebrate: { expression: 'celebrating', pose: 'celebrate', motion: 'react' },
  jump: { expression: 'celebrating', pose: 'jump', motion: 'react' },
  levelUp: { expression: 'celebrating', pose: 'celebrate', motion: 'react' },
  milestone: { expression: 'celebrating', pose: 'jump', motion: 'react' },
  /** Resting / overnight — soft idle until `sleep` timeline exists in SVG. */
  sleep: { expression: 'neutral', pose: 'idle', motion: 'idle' },
}

export function normalizeAriCharacterState(raw: unknown): AriCharacterState {
  if (typeof raw !== 'string') return 'idle'
  if ((ARI_CHARACTER_STATES as readonly string[]).includes(raw)) {
    return raw as AriCharacterState
  }
  return 'idle'
}

/**
 * Map a feedback event to an Ari character state.
 * `answer_selected` stays idle — selection chrome is UI-only (no Ari spam).
 */
export function ariStateFromFeedback(event: AnimationFeedbackEvent): AriCharacterState {
  switch (event.type) {
    case 'answer_selected':
      return 'idle'
    case 'correct_answer':
      return 'correct'
    case 'incorrect_answer':
      return 'encourage'
    case 'matching_completed':
    case 'exercise_completed':
      return event.correct ? 'correct' : 'encourage'
    case 'lesson_completed':
      return 'celebrate'
    case 'level_up':
      return 'levelUp'
    case 'achievement_unlocked':
    case 'streak_milestone':
      return 'milestone'
    default:
      return 'idle'
  }
}

export type ResolveAriPresentationOpts = {
  /**
   * When true, force motion none / animate false (graceful fallback + reduced motion).
   * CSS also disables keyframes via prefers-reduced-motion.
   */
  reduceMotion?: boolean
}

/**
 * Resolve product Ari state → existing AriMark expression/pose/motion.
 * Safe fallbacks: unknown state → idle; reduceMotion disables motion loops.
 */
export function resolveAriPresentation(
  state: AriCharacterState | unknown,
  opts?: ResolveAriPresentationOpts,
): AriPresentation {
  const normalized = normalizeAriCharacterState(state)
  const spec = ARI_STATE_SPECS[normalized]
  const reduce = Boolean(opts?.reduceMotion)
  const motion: AnimationMotionMode = reduce ? 'none' : spec.motion
  return {
    state: normalized,
    expression: normalizeExpression(spec.expression),
    pose: normalizePose(spec.pose),
    motion,
    extraClass: spec.extraClass ?? '',
    animate: !reduce && motion !== 'none',
  }
}

/** Convenience: feedback event → full Ari presentation. */
export function ariPresentationFromFeedback(
  event: AnimationFeedbackEvent,
  opts?: ResolveAriPresentationOpts,
): AriPresentation {
  return resolveAriPresentation(ariStateFromFeedback(event), opts)
}
