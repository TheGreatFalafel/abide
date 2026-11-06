/**
 * 3D Ari bridge — presentation only.
 * Maps existing product character states / feedback events → GLB clip motions.
 * Never awards XP, gems, streaks, or progress.
 */

import type { AriMotion } from '../../components/ari3d/Ari3D.types'
import { ariStateFromFeedback, normalizeAriCharacterState } from './ariMachine'
import type { AnimationFeedbackEvent, AriCharacterState } from './types'

/** Public URL for the production rigged Ari model (see docs/ASSET_CONTRACT.md). */
export const ARI_3D_MODEL_URL = '/characters/ari/ari.glb'

/** Motions that loop while the product state is held. */
export const ARI_3D_LOOPING_MOTIONS = new Set<AriMotion>(['idle', 'walk', 'run'])

/**
 * Map product Ari states → 3D clip motions.
 * `blink` is ambient on idle in 2D/Rive; 3D has no separate blink clip.
 */
export function ariMotionFromCharacterState(state: AriCharacterState | unknown): AriMotion {
  const s = normalizeAriCharacterState(state)
  switch (s) {
    case 'blink':
      return 'idle'
    case 'idle':
    case 'greet':
    case 'walk':
    case 'run':
    case 'think':
    case 'guide':
    case 'correct':
    case 'encourage':
    case 'celebrate':
    case 'jump':
    case 'levelUp':
    case 'milestone':
      return s
    case 'sleep':
      return 'idle'
    default:
      return 'idle'
  }
}

/** Convenience: feedback event → 3D motion (via the shared product state machine). */
export function ariMotionFromFeedback(event: AnimationFeedbackEvent): AriMotion {
  return ariMotionFromCharacterState(ariStateFromFeedback(event))
}

let modelProbe: Promise<boolean> | null = null

/** Reset the cached HEAD/GET probe (tests / after uploading a model). */
export function resetAri3dModelProbe() {
  modelProbe = null
}

/**
 * Probe whether the production GLB exists under /public.
 * Result is cached for the page lifetime to avoid repeated network checks.
 */
export function probeAri3dModel(url: string = ARI_3D_MODEL_URL): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (typeof process !== 'undefined' && process.env.VITEST) return Promise.resolve(false)

  if (!modelProbe) {
    modelProbe = (async () => {
      try {
        const head = await fetch(url, { method: 'HEAD', cache: 'no-store' })
        if (head.ok) return true
        // Some static hosts reject HEAD; fall back to a tiny GET.
        if (head.status === 405 || head.status === 501) {
          const get = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: { Range: 'bytes=0-0' },
          })
          return get.ok || get.status === 206
        }
        return false
      } catch {
        return false
      }
    })()
  }
  return modelProbe
}

/**
 * Opt-in: set NEXT_PUBLIC_ARI_3D=1 to prefer 3D in product UI when the GLB is present.
 * Without the flag, 3D remains available on the /dev/ari-3d preview.
 */
export function isAri3dProductEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ARI_3D === '1' || process.env.NEXT_PUBLIC_ARI_3D === 'true'
}
