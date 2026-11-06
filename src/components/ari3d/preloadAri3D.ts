import { useGLTF } from '@react-three/drei'
import { ARI_3D_MODEL_URL } from '../../lib/animation/ari3d'

/** Warm the GLB cache for preview / hero paths. Safe to call when the file is missing. */
export function preloadAri3D(modelUrl: string = ARI_3D_MODEL_URL) {
  try {
    useGLTF.preload(modelUrl)
  } catch {
    // Ignore preload failures; runtime Suspense/ErrorBoundary handle them.
  }
}
