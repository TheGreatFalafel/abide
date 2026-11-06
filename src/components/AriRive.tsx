'use client'

import type { AriCharacterState } from '../lib/animation'
import { Ari, type AriProps } from './rive/Ari'
import type { AriMarkProps } from './AriMark'

export type AriRiveProps = {
  characterState?: AriCharacterState
  size?: number
  className?: string
  /** Force SVG fallback (tests / reduced-motion callers). */
  forceFallback?: boolean
  /** Passed through to SVG fallback. */
  fallbackProps?: Omit<AriMarkProps, 'characterState' | 'size' | 'className'>
}

/**
 * Phase C Ari player — thin compatibility wrapper around `Ari`.
 * Prefer importing `Ari` (or `event` prop) for new call sites.
 */
export function AriRive({
  characterState = 'idle',
  size = 56,
  className = '',
  forceFallback = false,
  fallbackProps,
}: AriRiveProps) {
  return (
    <Ari
      characterState={characterState}
      size={size}
      className={className}
      forceFallback={forceFallback}
      fallbackProps={fallbackProps}
    />
  )
}

export type { AriProps }
