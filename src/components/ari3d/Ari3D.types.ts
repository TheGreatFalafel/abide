export type AriMotion =
  | 'idle'
  | 'greet'
  | 'walk'
  | 'run'
  | 'think'
  | 'guide'
  | 'correct'
  | 'encourage'
  | 'celebrate'
  | 'jump'
  | 'levelUp'
  | 'milestone'

export type AriAnimationMap = Partial<Record<AriMotion, string>>

export type Ari3DProps = {
  /** Path to a rigged .glb model in /public, e.g. /characters/ari/ari.glb */
  modelUrl?: string
  /** Product/UI state. The component maps this to a clip in the GLB. */
  motion: AriMotion
  /** Override Blender/exported clip names when they differ from the defaults. */
  animationMap?: AriAnimationMap
  className?: string
  /** Model scale multiplier. Adjust after inspecting the exported model. */
  scale?: number
  /** Cross-fade duration in seconds. */
  blendDuration?: number
  /** Accessible description for the character canvas. */
  label?: string
  /** Called when the GLB fails to load or render. */
  onError?: (error: Error) => void
}

export const DEFAULT_ARI_ANIMATION_MAP: Record<AriMotion, string> = {
  idle: 'Idle',
  greet: 'Greet',
  walk: 'Walk',
  run: 'Run',
  think: 'Think',
  guide: 'Guide',
  correct: 'Correct',
  encourage: 'Encourage',
  celebrate: 'Celebrate',
  jump: 'Jump',
  levelUp: 'LevelUp',
  milestone: 'Milestone',
}

export const ARI_MOTIONS: readonly AriMotion[] = [
  'idle',
  'greet',
  'walk',
  'run',
  'think',
  'guide',
  'correct',
  'encourage',
  'celebrate',
  'jump',
  'levelUp',
  'milestone',
] as const
