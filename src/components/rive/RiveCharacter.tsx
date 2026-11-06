'use client'

import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useStateMachineInput,
  type Rive,
} from '@rive-app/react-canvas'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import type { RiveCharacterContract } from '../../lib/animation/riveCharacter'
import { prefersReducedMotion } from '../../lib/scroll'

export type RiveCharacterApi = {
  rive: Rive | null
  fireTrigger: (name: string) => void
  setBoolean: (name: string, value: boolean) => void
  setNumber: (name: string, value: number) => void
}

export type RiveCharacterProps = {
  /** Asset URL under `/public`, or a full contract. */
  src?: string
  contract?: Partial<RiveCharacterContract> & Pick<RiveCharacterContract, 'src'>
  artboard?: string
  stateMachine?: string
  /** Trigger to fire when it changes (state-machine Trigger input). */
  trigger?: string | null
  /** Boolean SM inputs to keep in sync. */
  booleanInputs?: Record<string, boolean>
  /** Number SM inputs (cosmetics enum indices, etc.). */
  numberInputs?: Record<string, number>
  width?: number
  height?: number
  /** Override aspect when height omitted (width / height). */
  aspectRatio?: number
  className?: string
  style?: CSSProperties
  fit?: Fit
  alignment?: Alignment
  autoplay?: boolean
  /** Force fallback node (tests, callers). */
  forceFallback?: boolean
  /** Prefer static fallback when the user requests reduced motion. */
  honorReducedMotion?: boolean
  /** Rendered when Rive cannot run or the asset fails to load. */
  fallback?: ReactNode
  onLoad?: () => void
  onLoadError?: (error?: unknown) => void
  onReady?: (api: RiveCharacterApi) => void
  /** Accessible name; omit / use aria-hidden when a parent provides text. */
  'aria-label'?: string
  'aria-hidden'?: boolean | 'true' | 'false'
  /** Extra data-* attributes for debugging / tests. */
  dataAttrs?: Record<string, string>
}

function shouldPreferFallback(forceFallback: boolean): boolean {
  if (forceFallback) return true
  if (typeof process !== 'undefined' && process.env.VITEST) return true
  if (typeof window === 'undefined') return true
  if (typeof HTMLCanvasElement === 'undefined') return true
  return false
}

function RiveCharacterCanvas({
  src,
  artboard,
  stateMachine,
  trigger,
  booleanInputs,
  numberInputs,
  width,
  height,
  className,
  style,
  fit,
  alignment,
  autoplay,
  onLoad,
  onLoadError,
  onReady,
  ariaLabel,
  ariaHidden,
  dataAttrs,
}: {
  src: string
  artboard?: string
  stateMachine: string
  trigger?: string | null
  booleanInputs?: Record<string, boolean>
  numberInputs?: Record<string, number>
  width: number
  height: number
  className: string
  style?: CSSProperties
  fit: Fit
  alignment: Alignment
  autoplay: boolean
  onLoad?: () => void
  onLoadError?: (error?: unknown) => void
  onReady?: (api: RiveCharacterApi) => void
  ariaLabel?: string
  ariaHidden?: boolean | 'true' | 'false'
  dataAttrs?: Record<string, string>
}) {
  const readyRef = useRef(false)
  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    stateMachines: stateMachine,
    autoplay,
    layout: new Layout({ fit, alignment }),
    onLoad: () => onLoad?.(),
    onLoadError: (e) => onLoadError?.(e),
  })

  const triggerName = trigger && trigger.length > 0 ? trigger : 'idle'
  const triggerInput = useStateMachineInput(rive, stateMachine, triggerName)

  useEffect(() => {
    if (!rive || !trigger || !triggerInput) return
    try {
      triggerInput.fire()
    } catch {
      // Keep current SM state if the trigger is missing or fire fails.
    }
  }, [rive, trigger, triggerInput])

  useEffect(() => {
    if (!rive || !booleanInputs) return
    for (const [name, value] of Object.entries(booleanInputs)) {
      try {
        const input = rive.stateMachineInputs(stateMachine)?.find((i) => i.name === name)
        if (input && 'value' in input) {
          ;(input as { value: boolean }).value = value
        }
      } catch {
        // Ignore unknown cosmetic / boolean inputs.
      }
    }
  }, [rive, stateMachine, booleanInputs])

  useEffect(() => {
    if (!rive || !numberInputs) return
    for (const [name, value] of Object.entries(numberInputs)) {
      try {
        const input = rive.stateMachineInputs(stateMachine)?.find((i) => i.name === name)
        if (input && 'value' in input) {
          ;(input as { value: number }).value = value
        }
      } catch {
        // Ignore unknown cosmetic / number inputs.
      }
    }
  }, [rive, stateMachine, numberInputs])

  useEffect(() => {
    if (!rive || !onReady || readyRef.current) return
    readyRef.current = true
    const api: RiveCharacterApi = {
      rive,
      fireTrigger: (name: string) => {
        try {
          const input = rive.stateMachineInputs(stateMachine)?.find((i) => i.name === name)
          if (input && typeof (input as { fire?: () => void }).fire === 'function') {
            ;(input as { fire: () => void }).fire()
          }
        } catch {
          // no-op
        }
      },
      setBoolean: (name: string, value: boolean) => {
        try {
          const input = rive.stateMachineInputs(stateMachine)?.find((i) => i.name === name)
          if (input && 'value' in input) (input as { value: boolean }).value = value
        } catch {
          // no-op
        }
      },
      setNumber: (name: string, value: number) => {
        try {
          const input = rive.stateMachineInputs(stateMachine)?.find((i) => i.name === name)
          if (input && 'value' in input) (input as { value: number }).value = value
        } catch {
          // no-op
        }
      },
    }
    onReady(api)
  }, [rive, onReady, stateMachine])

  const dataProps: Record<string, string> = {
    'data-rive-src': src,
    'data-rive-sm': stateMachine,
    ...(trigger ? { 'data-rive-trigger': trigger } : {}),
    ...dataAttrs,
  }

  return (
    <div
      className={`rive-character ${className}`.trim()}
      style={{ width, height, flexShrink: 0, ...style }}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? (ariaLabel ? undefined : true)}
      {...dataProps}
    >
      <RiveComponent style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}

/**
 * Reusable Rive character host.
 * Single canvas instance per mount; falls back without initializing Rive when
 * canvas/SSR/tests/reduced-motion/errors require it.
 */
export function RiveCharacter({
  src,
  contract,
  artboard,
  stateMachine,
  trigger = null,
  booleanInputs,
  numberInputs,
  width,
  height,
  aspectRatio,
  className = '',
  style,
  fit = Fit.Contain,
  alignment = Alignment.Center,
  autoplay = true,
  forceFallback = false,
  honorReducedMotion = true,
  fallback = null,
  onLoad,
  onLoadError,
  onReady,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  dataAttrs,
}: RiveCharacterProps) {
  const resolvedSrc = src ?? contract?.src
  const resolvedArtboard = artboard ?? contract?.artboard
  const resolvedSm = stateMachine ?? contract?.stateMachine ?? 'State Machine 1'
  const resolvedAspect = aspectRatio ?? contract?.aspectRatio ?? 1
  const resolvedWidth = width ?? contract?.defaultWidth ?? 96
  const resolvedHeight = height ?? Math.round(resolvedWidth / resolvedAspect)

  const [failed, setFailed] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    if (!honorReducedMotion) return
    setReduceMotion(prefersReducedMotion())
  }, [honorReducedMotion])

  const useFallback =
    !resolvedSrc ||
    shouldPreferFallback(forceFallback) ||
    failed ||
    (honorReducedMotion && reduceMotion)

  if (useFallback) {
    return (
      <div
        className={`rive-character rive-character--fallback ${className}`.trim()}
        style={{ width: resolvedWidth, height: resolvedHeight, flexShrink: 0, ...style }}
        data-rive-engine="fallback"
        aria-label={ariaLabel}
        aria-hidden={ariaHidden ?? (ariaLabel ? undefined : true)}
        {...dataAttrs}
      >
        {fallback}
      </div>
    )
  }

  return (
    <RiveCharacterCanvas
      src={resolvedSrc}
      artboard={resolvedArtboard}
      stateMachine={resolvedSm}
      trigger={trigger}
      booleanInputs={booleanInputs}
      numberInputs={numberInputs}
      width={resolvedWidth}
      height={resolvedHeight}
      className={className}
      style={style}
      fit={fit}
      alignment={alignment}
      autoplay={autoplay}
      onLoad={onLoad}
      onLoadError={(e) => {
        setFailed(true)
        onLoadError?.(e)
      }}
      onReady={onReady}
      ariaLabel={ariaLabel}
      ariaHidden={ariaHidden}
      dataAttrs={{ 'data-rive-engine': 'rive', ...dataAttrs }}
    />
  )
}
