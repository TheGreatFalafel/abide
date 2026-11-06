'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
  AVATAR_RIVE_CONTRACT,
  probeAvatarRive,
  type AvatarRiveCosmeticInputs,
} from '../../lib/animation/avatarRive'
import {
  type CharacterEvent,
  normalizeCharacterEvent,
} from '../../lib/animation/characterEvents'
import { resolveEventBinding } from '../../lib/animation/riveCharacter'
import { prefersReducedMotion } from '../../lib/scroll'
import { RiveCharacter } from './RiveCharacter'

export type AvatarRiveProps = {
  event?: CharacterEvent
  size?: number
  className?: string
  /** Cosmetics as SM number inputs (enum indices). Ignored until avatar.riv ships. */
  cosmetics?: AvatarRiveCosmeticInputs
  forceFallback?: boolean
  /** Required: existing SVG / customizer preview until the `.riv` exists. */
  fallback: ReactNode
  onLoadError?: (error?: unknown) => void
}

/**
 * Prepared host for a future customizable human-avatar `.riv`.
 * Does not replace `AbideAvatar` or the cosmetics inventory — when the asset
 * is missing (default today), renders `fallback` only and never initializes Rive.
 */
export function AvatarRive({
  event = 'idle',
  size = 96,
  className = '',
  cosmetics,
  forceFallback = false,
  fallback,
  onLoadError,
}: AvatarRiveProps) {
  const [assetReady, setAssetReady] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const characterEvent = normalizeCharacterEvent(event)
  const binding = resolveEventBinding(AVATAR_RIVE_CONTRACT, characterEvent)

  useEffect(() => {
    setReduceMotion(prefersReducedMotion())
  }, [])

  useEffect(() => {
    if (forceFallback) return
    let cancelled = false
    probeAvatarRive().then((ok) => {
      if (!cancelled) setAssetReady(ok)
    })
    return () => {
      cancelled = true
    }
  }, [forceFallback])

  const skipRive =
    forceFallback ||
    reduceMotion ||
    !assetReady ||
    (typeof process !== 'undefined' && process.env.VITEST) ||
    typeof window === 'undefined'

  if (skipRive) {
    return (
      <div
        className={`avatar-rive avatar-rive--fallback ${className}`.trim()}
        style={{ width: size, height: size, flexShrink: 0 }}
        data-avatar-engine="svg"
        data-avatar-event={characterEvent}
      >
        {fallback}
      </div>
    )
  }

  return (
    <RiveCharacter
      contract={AVATAR_RIVE_CONTRACT}
      trigger={binding.kind === 'trigger' ? binding.name : 'idle'}
      numberInputs={cosmetics}
      width={size}
      height={size}
      className={`avatar-rive ${className}`.trim()}
      honorReducedMotion={false}
      onLoadError={onLoadError}
      dataAttrs={{
        'data-avatar-engine': 'rive',
        'data-avatar-event': characterEvent,
      }}
      fallback={fallback}
    />
  )
}
