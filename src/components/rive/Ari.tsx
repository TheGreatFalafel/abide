'use client'

import { useEffect, useState } from 'react'
import {
  ariStateFromCharacterEvent,
  type CharacterEvent,
  normalizeCharacterEvent,
} from '../../lib/animation/characterEvents'
import type { AriCharacterState } from '../../lib/animation'
import {
  ARI_RIVE_CONTRACT,
  ARI_RIVE_HEIGHT,
  ARI_RIVE_WIDTH,
  riveTriggerForAriState,
  riveTriggerForCharacterEvent,
} from '../../lib/animation/riveAri'
import { prefersReducedMotion } from '../../lib/scroll'
import { AriMark, type AriMarkProps } from '../AriMark'
import { RiveCharacter } from './RiveCharacter'

export type AriProps = {
  /**
   * Application-facing character event (preferred).
   * Takes precedence over `characterState` when both are set.
   */
  event?: CharacterEvent
  /** Legacy / internal Ari state bridge. */
  characterState?: AriCharacterState
  size?: number
  className?: string
  /** Force SVG fallback (tests / reduced-motion callers). */
  forceFallback?: boolean
  /** Passed through to SVG fallback. */
  fallbackProps?: Omit<AriMarkProps, 'characterState' | 'size' | 'className'>
  onLoadError?: (error?: unknown) => void
}

function resolveState(
  event: CharacterEvent | undefined,
  characterState: AriCharacterState,
): AriCharacterState {
  if (event !== undefined) return ariStateFromCharacterEvent(normalizeCharacterEvent(event))
  return characterState
}

/**
 * Dedicated Ari (golden lion) character.
 * Loads `public/rive/ari.riv` via the shared RiveCharacter host and falls
 * back to SVG `AriMark` when the asset/runtime is unavailable.
 *
 * The approved lion illustration is a visual reference only — never animate
 * a flattened JPG. Replace `ari.riv` when a newly authored file is exported.
 */
export function Ari({
  event,
  characterState = 'idle',
  size = 56,
  className = '',
  forceFallback = false,
  fallbackProps,
  onLoadError,
}: AriProps) {
  const state = resolveState(event, characterState)
  const trigger = event
    ? riveTriggerForCharacterEvent(event)
    : riveTriggerForAriState(state)
  const height = Math.round(size * (ARI_RIVE_HEIGHT / ARI_RIVE_WIDTH))
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setReduceMotion(prefersReducedMotion())
  }, [])

  const mark = (
    <AriMark
      characterState={state}
      size={size}
      className={className}
      reduceMotion={reduceMotion || forceFallback}
      {...fallbackProps}
    />
  )

  // Prefer a direct SVG mount when we know Rive will not run — avoids a
  // duplicate wrapper and skips Rive WASM/canvas initialization entirely.
  if (
    forceFallback ||
    reduceMotion ||
    (typeof process !== 'undefined' && process.env.VITEST) ||
    typeof window === 'undefined'
  ) {
    return mark
  }

  return (
    <RiveCharacter
      contract={ARI_RIVE_CONTRACT}
      trigger={trigger}
      width={size}
      height={height}
      className={`ari-rive ${className}`.trim()}
      forceFallback={false}
      honorReducedMotion={false}
      onLoadError={onLoadError}
      dataAttrs={{
        'data-ari-state': state,
        'data-ari-engine': 'rive',
        ...(event ? { 'data-ari-event': normalizeCharacterEvent(event) } : {}),
      }}
      fallback={mark}
    />
  )
}

export type { CharacterEvent, AriCharacterState }
