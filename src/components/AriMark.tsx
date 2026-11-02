'use client'

import { resolveAriPresentation, type AriCharacterState } from '../lib/animation'
import {
  normalizeExpression,
  normalizePose,
  poseForExpression,
  type AriExpression,
  type AriPose,
} from '../lib/mascot'

export type AriMarkProps = {
  /**
   * Product-level character state from the animation machine.
   * When set, expression / pose / motion / animate resolve from `resolveAriPresentation`
   * unless explicitly overridden below.
   */
  characterState?: AriCharacterState
  expression?: AriExpression
  /** Full-body pose; defaults from expression when omitted. */
  pose?: AriPose
  size?: number
  className?: string
  /**
   * Soft idle motion (breath / blink / pose loops).
   * Honors prefers-reduced-motion via CSS.
   */
  animate?: boolean
  /**
   * `react` plays a short one-shot pose emphasis (celebrate bounce, etc.).
   * `idle` is the calm loop used in banners.
   */
  motion?: 'idle' | 'react' | 'none'
  /** When true, force static mark (graceful fallback / reduced-motion callers). */
  reduceMotion?: boolean
}

function maneColor(expression: AriExpression): string {
  switch (expression) {
    case 'celebrating':
      return '#c9a227'
    case 'comforting':
      return '#b86a3a'
    case 'proud':
      return '#9a6b2f'
    case 'thinking':
      return '#7a5230'
    case 'welcome':
      return '#8b5a2b'
    default:
      return '#8b5a2b'
  }
}

function furColor(expression: AriExpression): string {
  return expression === 'celebrating' ? '#e8c97a' : '#d4a84b'
}

function muzzleColor(expression: AriExpression): string {
  return expression === 'celebrating' ? '#f7ecd0' : '#f3e6c4'
}

/**
 * SVG fallback Ari — quadruped sitting lion (Storybook Warmth).
 * Not anthropomorphic; matches the Rive character silhouette.
 */
export function AriMark({
  characterState,
  expression: rawExpression,
  pose: rawPose,
  size = 72,
  className = '',
  animate,
  motion,
  reduceMotion = false,
}: AriMarkProps) {
  const fromState = characterState
    ? resolveAriPresentation(characterState, { reduceMotion })
    : null

  const expression = normalizeExpression(
    rawExpression ?? fromState?.expression ?? 'neutral',
  )
  const pose = normalizePose(
    rawPose ?? fromState?.pose ?? poseForExpression(expression),
  )
  const resolvedAnimate = animate ?? fromState?.animate ?? true
  const resolvedMotion = motion ?? fromState?.motion ?? 'idle'
  const extraClass = fromState?.extraClass ?? ''
  const mane = maneColor(expression)
  const fur = furColor(expression)
  const muzzle = muzzleColor(expression)
  const motionMode =
    reduceMotion || !resolvedAnimate || resolvedMotion === 'none' ? 'none' : resolvedMotion

  const eyeRy =
    expression === 'comforting' ? 2.4 : expression === 'thinking' ? 2.8 : 3.2
  const eyeCy =
    expression === 'thinking' ? 21.5 : expression === 'comforting' ? 23 : 22.5
  const brow =
    expression === 'proud' || expression === 'thinking' || expression === 'celebrating' ? (
      <g stroke="#5c3d28" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" fill="none">
        <path
          d={
            expression === 'thinking'
              ? 'M22 17.5c2-1.2 6-1.4 8 0.4'
              : expression === 'celebrating'
                ? 'M22 16.8c2-1.6 6-1.6 8 0'
                : 'M22 17.2c2-1.4 6-1.4 8 0'
          }
        />
        <path
          d={
            expression === 'thinking'
              ? 'M38 17.8c2-0.6 6-0.2 8 0.8'
              : expression === 'celebrating'
                ? 'M38 16.8c2-1.6 6-1.6 8 0'
                : 'M38 17.2c2-1.4 6-1.4 8 0'
          }
        />
      </g>
    ) : null

  const smile =
    expression === 'celebrating' ? (
      <path
        d="M28 31c2.5 3.4 9.5 3.4 12 0"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ) : expression === 'comforting' ? (
      <path
        d="M30 31.5c1.6 1.2 6 1.2 7.6 0"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    ) : expression === 'thinking' ? (
      <path
        d="M31 32h6"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    ) : expression === 'neutral' ? (
      <path
        d="M30.5 31.2c1.3 0.8 5 0.8 6.3 0"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    ) : (
      <path
        d="M29 30.8c2 2.2 8 2.2 10 0"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    )

  const cheek =
    expression === 'welcome' || expression === 'celebrating' || expression === 'proud' ? (
      <>
        <circle cx="22" cy="27" r="2" fill="#e8a090" opacity="0.4" />
        <circle cx="46" cy="27" r="2" fill="#e8a090" opacity="0.4" />
      </>
    ) : null

  const height = Math.round(size * (400 / 520))

  return (
    <svg
      className={[
        'mascot-mark',
        'ari-full',
        'ari-quad',
        characterState ? `ari-state-${characterState}` : '',
        `expr-${expression}`,
        `pose-${pose}`,
        extraClass,
        motionMode !== 'none' ? 'mascot-anim' : '',
        motionMode === 'react' ? 'ari-react' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      viewBox="0 0 104 80"
      width={size}
      height={height}
      data-ari-state={characterState ?? undefined}
      aria-hidden
    >
      <ellipse className="ari-shadow" cx="52" cy="74" rx="34" ry="4" fill="#d5e5df" />

      <g className="ari-body">
        {/* Tail */}
        <g className="ari-tail">
          <path
            d="M78 42c14 2 20-6 18-16"
            fill="none"
            stroke={mane}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="96" cy="26" r="5" fill={mane} />
          <circle cx="96" cy="26" r="2.4" fill={fur} />
        </g>

        {/* Hind haunch + legs */}
        <g className="ari-leg-r">
          <ellipse cx="68" cy="52" rx="16" ry="14" fill={fur} />
          <path d="M70 55c2 8 2 14 1 16h10c1-4 0-10-2-16z" fill={fur} />
          <ellipse cx="76" cy="70" rx="7" ry="3.2" fill="#c4894a" />
        </g>
        <g className="ari-leg-l">
          <ellipse cx="58" cy="54" rx="14" ry="13" fill="#c4894a" opacity="0.35" />
          <path d="M56 56c1 8 1 13 0 15h9c1-4 0-9-1-15z" fill={fur} />
          <ellipse cx="61" cy="70" rx="6.5" ry="3" fill="#c4894a" />
        </g>

        {/* Torso (horizontal) */}
        <g className="ari-torso">
          <ellipse cx="48" cy="48" rx="28" ry="16" fill={fur} />
          <ellipse cx="44" cy="52" rx="18" ry="10" fill={muzzle} opacity="0.9" />
        </g>

        {/* Forelegs */}
        <g className="ari-arm-l">
          <path d="M28 48c-1 10-1 16 0 20h9c0-5 0-12 1-20z" fill={fur} />
          <ellipse className="ari-paw" cx="32.5" cy="68.5" rx="6.5" ry="3" fill="#c4894a" />
        </g>
        <g className="ari-arm-r">
          <path d="M38 46c0 10 0 16 1 20h9c-1-5-1-12-1-20z" fill={fur} />
          <ellipse className="ari-paw" cx="43" cy="67.5" rx="6.5" ry="3" fill="#c4894a" />
        </g>

        {/* Head + mane */}
        <g className="ari-head">
          <circle cx="30" cy="28" r="22" fill={mane} />
          <circle cx="16" cy="18" r="9" fill={mane} />
          <circle cx="44" cy="18" r="9" fill={mane} />
          <circle cx="12" cy="30" r="8" fill={mane} />
          <circle cx="48" cy="30" r="8" fill={mane} />
          <circle cx="20" cy="40" r="7.5" fill={mane} />
          <circle cx="40" cy="40" r="7.5" fill={mane} />

          <circle cx="18" cy="14" r="4.5" fill={fur} />
          <circle cx="42" cy="14" r="4.5" fill={fur} />
          <circle cx="18" cy="14" r="2.1" fill="#c4894a" />
          <circle cx="42" cy="14" r="2.1" fill="#c4894a" />

          <ellipse cx="30" cy="28" rx="15" ry="14" fill={fur} />
          <ellipse cx="30" cy="32" rx="9" ry="7" fill={muzzle} />
          <ellipse cx="30" cy="24" rx="11" ry="7" fill="#fff" opacity="0.12" />

          {brow}

          <g className="ari-eyes">
            <ellipse className="ari-eye" cx="24" cy={eyeCy} rx="2.6" ry={eyeRy} fill="#2a3a34" />
            <ellipse className="ari-eye" cx="36" cy={eyeCy} rx="2.6" ry={eyeRy} fill="#2a3a34" />
            <circle cx="24.7" cy={eyeCy - 0.9} r="0.75" fill="#fff" />
            <circle cx="36.7" cy={eyeCy - 0.9} r="0.75" fill="#fff" />
          </g>

          <ellipse cx="30" cy="31.5" rx="2.6" ry="1.8" fill="#5c3d28" />
          {smile}
          {cheek}
        </g>
      </g>
    </svg>
  )
}
