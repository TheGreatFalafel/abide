'use client'

import {
  MASCOT_NAME,
  normalizeExpression,
  poseForExpression,
  type AriExpression,
  type MascotLine,
} from '../lib/mascot'
import { AriMark } from './AriMark'

export { AriMark } from './AriMark'
export type { AriMarkProps } from './AriMark'

type BannerProps = {
  line: MascotLine
  compact?: boolean
  animate?: boolean
  /** Override facial expression (defaults to line.mood). */
  expression?: AriExpression
}

/** @deprecated Prefer expression prop via AriMark — mood still accepted on banners. */
export function MascotBanner({ line, compact, animate = true, expression }: BannerProps) {
  const expr = normalizeExpression(expression ?? line.mood)
  const pose = line.pose ?? poseForExpression(expr)
  return (
    <aside
      className={`mascot-banner mood-${expr} ${compact ? 'compact' : ''}`}
      aria-label={`${MASCOT_NAME}: ${line.title}`}
    >
      <AriMark
        expression={expr}
        pose={pose}
        size={compact ? 44 : 56}
        animate={animate}
        motion="idle"
      />
      <div>
        <strong>{line.title}</strong>
        <p>{line.body}</p>
      </div>
    </aside>
  )
}
