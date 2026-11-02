'use client'

import { useEffect, useState } from 'react'
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas'
import type { AriCharacterState } from '../lib/animation'
import {
  ARI_RIVE_ARTBOARD,
  ARI_RIVE_SRC,
  ARI_RIVE_STATE_MACHINE,
  riveTriggerForAriState,
} from '../lib/animation/riveAri'
import { prefersReducedMotion } from '../lib/scroll'
import { AriMark, type AriMarkProps } from './AriMark'

export type AriRiveProps = {
  characterState?: AriCharacterState
  size?: number
  className?: string
  /** Force SVG fallback (tests / reduced-motion callers). */
  forceFallback?: boolean
  /** Passed through to SVG fallback. */
  fallbackProps?: Omit<AriMarkProps, 'characterState' | 'size' | 'className'>
}

function shouldPreferFallback(forceFallback: boolean): boolean {
  if (forceFallback) return true
  if (typeof process !== 'undefined' && process.env.VITEST) return true
  if (typeof window === 'undefined') return true
  if (typeof HTMLCanvasElement === 'undefined') return true
  return false
}

function AriRiveCanvas({
  characterState,
  size,
  className,
  onFail,
}: {
  characterState: AriCharacterState
  size: number
  className: string
  onFail: () => void
}) {
  const height = Math.round(size * (400 / 520))
  const { rive, RiveComponent } = useRive({
    src: ARI_RIVE_SRC,
    artboard: ARI_RIVE_ARTBOARD,
    stateMachines: ARI_RIVE_STATE_MACHINE,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => onFail(),
  })

  const triggerName = riveTriggerForAriState(characterState)
  const trigger = useStateMachineInput(rive, ARI_RIVE_STATE_MACHINE, triggerName)

  useEffect(() => {
    if (!rive || !trigger) return
    try {
      trigger.fire()
    } catch {
      // Keep current SM state if fire fails
    }
  }, [characterState, trigger, rive, triggerName])

  return (
    <div
      className={`ari-rive ${className}`.trim()}
      style={{ width: size, height, flexShrink: 0 }}
      data-ari-state={characterState}
      data-ari-engine="rive"
      aria-hidden
    >
      <RiveComponent style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}

/**
 * Phase C Ari player: loads the real `ari.riv` state machine and fires
 * event-driven triggers. Falls back to SVG AriMark when Rive fails,
 * is unavailable, or the user prefers reduced motion.
 */
export function AriRive({
  characterState = 'idle',
  size = 56,
  className = '',
  forceFallback = false,
  fallbackProps,
}: AriRiveProps) {
  const [failed, setFailed] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setReduceMotion(prefersReducedMotion())
  }, [])

  const useFallback =
    shouldPreferFallback(forceFallback) || failed || reduceMotion

  if (useFallback) {
    return (
      <AriMark
        characterState={characterState}
        size={size}
        className={className}
        reduceMotion={reduceMotion || forceFallback}
        {...fallbackProps}
      />
    )
  }

  return (
    <AriRiveCanvas
      characterState={characterState}
      size={size}
      className={className}
      onFail={() => setFailed(true)}
    />
  )
}
