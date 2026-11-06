'use client'

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import { LoopOnce, LoopRepeat, type AnimationAction, type Group } from 'three'
import type { Ari3DProps, AriMotion } from './Ari3D.types'
import { DEFAULT_ARI_ANIMATION_MAP } from './Ari3D.types'
import './Ari3D.css'

const DEFAULT_MODEL_URL = '/characters/ari/ari.glb'

function usePrefersReducedMotion() {
  const reduced = useRef(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      reduced.current = query.matches
    }
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  return reduced
}

function AriModel({
  modelUrl,
  motion,
  animationMap,
  scale,
  blendDuration,
  onReady,
}: Required<Pick<Ari3DProps, 'modelUrl' | 'motion' | 'scale' | 'blendDuration'>> &
  Pick<Ari3DProps, 'animationMap'> & { onReady?: () => void }) {
  const group = useRef<Group>(null)
  const gltf = useGLTF(modelUrl)
  const { actions } = useAnimations(gltf.animations, group)
  const previousAction = useRef<AnimationAction | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const readyOnce = useRef(false)

  const clipName = useMemo(() => {
    const map = { ...DEFAULT_ARI_ANIMATION_MAP, ...animationMap }
    return map[motion]
  }, [animationMap, motion])

  useEffect(() => {
    if (readyOnce.current) return
    readyOnce.current = true
    onReady?.()
  }, [onReady])

  useEffect(() => {
    const preferredName = reducedMotion.current ? 'Idle' : clipName
    const nextAction =
      actions[preferredName] ??
      actions[DEFAULT_ARI_ANIMATION_MAP.idle] ??
      Object.values(actions).find(Boolean) ??
      null

    if (!nextAction) return

    const isLooping: AriMotion[] = ['idle', 'walk', 'run']
    nextAction.reset()
    nextAction.enabled = true
    nextAction.clampWhenFinished = !isLooping.includes(motion)
    nextAction.setLoop(
      isLooping.includes(motion) ? LoopRepeat : LoopOnce,
      isLooping.includes(motion) ? Infinity : 1,
    )
    nextAction.fadeIn(blendDuration).play()

    previousAction.current?.fadeOut(blendDuration)
    previousAction.current = nextAction

    return () => {
      nextAction.fadeOut(blendDuration)
    }
  }, [actions, blendDuration, clipName, motion, reducedMotion])

  return (
    <group ref={group} scale={scale} position={[0, -1.05, 0]}>
      <primitive object={gltf.scene} />
    </group>
  )
}

function LoadingFallback({ className }: { className?: string }) {
  return (
    <div className={['abide-ari3d__fallback', 'abide-ari3d__loading', className].filter(Boolean).join(' ')} aria-hidden="true">
      Loading Ari…
    </div>
  )
}

class AriErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode; onError?: (error: Error) => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error)
    if (process.env.NODE_ENV !== 'production') {
      console.error('Ari 3D asset failed to load:', error)
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/**
 * Renders a rigged, animated Ari GLB.
 * Presentation only — game state and rewards stay outside and flow in via `motion`.
 */
export function Ari3D({
  modelUrl = DEFAULT_MODEL_URL,
  motion,
  animationMap,
  className,
  scale = 1,
  blendDuration = 0.22,
  label = 'Ari, your Abide learning companion',
  onError,
}: Ari3DProps) {
  const [ready, setReady] = useState(false)

  return (
    <div
      className={['abide-ari3d', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={label}
      data-ari-motion={motion}
      data-ari-engine="three"
      data-ari-ready={ready ? 'true' : 'false'}
    >
      <AriErrorBoundary
        onError={onError}
        fallback={
          <div className="abide-ari3d__fallback">Ari is taking a moment to get ready.</div>
        }
      >
        {!ready && <LoadingFallback />}
        <Canvas
          camera={{ position: [0, 1.15, 4.2], fov: 34 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
          shadows
          frameloop="always"
        >
          <ambientLight intensity={0.75} />
          <hemisphereLight args={['#fff3dc', '#7a6048', 1.05]} />
          <directionalLight
            position={[3.5, 5, 4]}
            intensity={2.0}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-3, 2, -2]} intensity={0.65} color="#d5e8dc" />
          <Suspense fallback={null}>
            <AriModel
              modelUrl={modelUrl}
              motion={motion}
              animationMap={animationMap}
              scale={scale}
              blendDuration={blendDuration}
              onReady={() => setReady(true)}
            />
          </Suspense>
        </Canvas>
      </AriErrorBoundary>
    </div>
  )
}

