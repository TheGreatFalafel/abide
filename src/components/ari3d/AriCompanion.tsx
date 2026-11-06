'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { AriCharacterState } from '../../lib/animation'
import {
  ARI_3D_MODEL_URL,
  ariMotionFromCharacterState,
  isAri3dProductEnabled,
  probeAri3dModel,
} from '../../lib/animation/ari3d'
import { prefersReducedMotion } from '../../lib/scroll'
import { AriRive, type AriRiveProps } from '../AriRive'

const Ari3D = dynamic(() => import('./Ari3D').then((m) => m.Ari3D), {
  ssr: false,
  loading: () => null,
})

export type AriCompanionProps = AriRiveProps & {
  /**
   * Prefer the WebGL character when the GLB is available.
   * Defaults to NEXT_PUBLIC_ARI_3D opt-in (preview can force true).
   */
  prefer3d?: boolean
  /** Skip 3D below this CSS pixel size to avoid tiny WebGL canvases. */
  minSizeFor3d?: number
  /** Override model URL (defaults to /characters/ari/ari.glb). */
  modelUrl?: string
  /** Extra scale for the loaded GLB after framing. */
  modelScale?: number
}

/**
 * Unified Ari entry: 3D when opted-in + GLB present + large enough surface,
 * otherwise existing AriRive → AriMark fallback chain.
 */
export function AriCompanion({
  characterState = 'idle',
  size = 96,
  className = '',
  forceFallback = false,
  fallbackProps,
  prefer3d,
  minSizeFor3d = 72,
  modelUrl = ARI_3D_MODEL_URL,
  modelScale = 1,
}: AriCompanionProps) {
  const want3d = prefer3d ?? isAri3dProductEnabled()
  const [modelReady, setModelReady] = useState(false)
  const [threeFailed, setThreeFailed] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setReduceMotion(prefersReducedMotion())
  }, [])

  useEffect(() => {
    if (!want3d || forceFallback) return
    let cancelled = false
    probeAri3dModel(modelUrl).then((ok) => {
      if (!cancelled) setModelReady(ok)
    })
    return () => {
      cancelled = true
    }
  }, [want3d, forceFallback, modelUrl])

  const use3d =
    want3d &&
    modelReady &&
    !threeFailed &&
    !forceFallback &&
    !reduceMotion &&
    size >= minSizeFor3d &&
    !(typeof process !== 'undefined' && process.env.VITEST)

  if (!use3d) {
    return (
      <AriRive
        characterState={characterState}
        size={size}
        className={className}
        forceFallback={forceFallback}
        fallbackProps={fallbackProps}
      />
    )
  }

  const motion = ariMotionFromCharacterState(characterState)
  return (
    <div
      style={{ width: size, height: size, flexShrink: 0 }}
      className={className}
      data-ari-state={characterState}
    >
      <Ari3D
        modelUrl={modelUrl}
        motion={motion}
        scale={modelScale}
        className="abide-ari3d--sized"
        onError={() => setThreeFailed(true)}
      />
    </div>
  )
}

export type { AriCharacterState }
