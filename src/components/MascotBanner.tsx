'use client'

import type { AriCharacterState } from '../lib/animation'
import {
  MASCOT_NAME,
  normalizeExpression,
  poseForExpression,
  type AriExpression,
  type AriPose,
  type MascotLine,
} from '../lib/mascot'
import { AriCompanion } from './ari3d/AriCompanion'

export { AriMark } from './AriMark'
export type { AriMarkProps } from './AriMark'
export { AriRive } from './AriRive'
export { Ari } from './rive/Ari'
export { RiveCharacter } from './rive/RiveCharacter'
export { AriCompanion } from './ari3d/AriCompanion'

type BannerProps = {
  line: MascotLine
  compact?: boolean
  animate?: boolean
  /** Override facial expression (defaults to line.mood). */
  expression?: AriExpression
  /** Optional product character state for the character player. */
  characterState?: AriCharacterState
}

function characterStateFromLine(
  mood: AriExpression,
  pose?: AriPose,
): AriCharacterState {
  const p = pose ?? poseForExpression(mood)
  if (p === 'celebrate' || mood === 'celebrating') return 'celebrate'
  if (p === 'jump') return 'milestone'
  if (p === 'think' || mood === 'thinking') return 'think'
  if (p === 'guide' || mood === 'welcome') return 'greet'
  if (p === 'encourage' || mood === 'encouraging' || mood === 'comforting') return 'encourage'
  if (p === 'walk') return 'walk'
  return 'idle'
}

/** Contextual Ari banner — 3D (opt-in + GLB) → Rive → SVG fallback. */
export function MascotBanner({
  line,
  compact,
  animate = true,
  expression,
  characterState,
}: BannerProps) {
  const expr = normalizeExpression(expression ?? line.mood)
  const pose = line.pose ?? poseForExpression(expr)
  const state = characterState ?? characterStateFromLine(expr, pose)
  return (
    <aside
      className={`mascot-banner mood-${expr} ${compact ? 'compact' : ''}`}
      aria-label={`${MASCOT_NAME}: ${line.title}`}
    >
      <AriCompanion
        characterState={state}
        size={compact ? 72 : 96}
        forceFallback={!animate}
        fallbackProps={{ expression: expr, pose, motion: 'idle', animate }}
      />
      <div>
        <strong>{line.title}</strong>
        <p>{line.body}</p>
      </div>
    </aside>
  )
}
