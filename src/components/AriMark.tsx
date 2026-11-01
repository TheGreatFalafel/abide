'use client'

import {
  normalizeExpression,
  normalizePose,
  poseForExpression,
  type AriExpression,
  type AriPose,
} from '../lib/mascot'

export type AriMarkProps = {
  expression: AriExpression
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
 * Full-body illustrated Ari — Abide’s lion companion.
 * Layered SVG keeps proportions stable across expression + pose variants.
 */
export function AriMark({
  expression: rawExpression,
  pose: rawPose,
  size = 56,
  className = '',
  animate = true,
  motion = 'idle',
}: AriMarkProps) {
  const expression = normalizeExpression(rawExpression)
  const pose = normalizePose(rawPose ?? poseForExpression(expression))
  const mane = maneColor(expression)
  const fur = furColor(expression)
  const muzzle = muzzleColor(expression)
  const motionMode = !animate || motion === 'none' ? 'none' : motion

  const eyeRy =
    expression === 'comforting' ? 1.9 : expression === 'thinking' ? 2.2 : 2.4
  const eyeCy =
    expression === 'thinking' ? 22.2 : expression === 'comforting' ? 23.8 : 23.4
  const brow =
    expression === 'proud' || expression === 'thinking' ? (
      <g stroke="#5c3d28" strokeWidth="1.05" strokeLinecap="round" opacity="0.55" fill="none">
        <path d={expression === 'thinking' ? 'M22 19.2c1.8-0.9 5.4-1.1 7.2 0.2' : 'M22 19.6c1.8-1.1 5.4-1.1 7.2 0'} />
        <path d={expression === 'thinking' ? 'M33.5 19.4c1.8-0.5 5.4-0.3 7.2 0.55' : 'M33.5 19.6c1.8-1.1 5.4-1.1 7.2 0'} />
      </g>
    ) : null

  const smile =
    expression === 'celebrating' ? (
      <path
        d="M27.5 30.5c2.2 2.9 6.8 2.9 9 0"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    ) : expression === 'comforting' ? (
      <path
        d="M28.5 31.2c1.4 1.1 5 1.1 6.4 0"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    ) : expression === 'thinking' ? (
      <path
        d="M29.2 31.5h5.6"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    ) : expression === 'neutral' ? (
      <path
        d="M29 31c1.1 0.7 4.4 0.7 5.5 0"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    ) : (
      <path
        d="M28.2 30.8c1.4 1.8 5.9 1.8 7.3 0"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    )

  const cheek =
    expression === 'welcome' || expression === 'celebrating' || expression === 'proud' ? (
      <>
        <circle cx="23.5" cy="27.5" r="1.45" fill="#e8a090" opacity="0.38" />
        <circle cx="40.5" cy="27.5" r="1.45" fill="#e8a090" opacity="0.38" />
      </>
    ) : null

  const height = Math.round(size * (80 / 64))

  return (
    <svg
      className={[
        'mascot-mark',
        'ari-full',
        `expr-${expression}`,
        `pose-${pose}`,
        motionMode !== 'none' ? 'mascot-anim' : '',
        motionMode === 'react' ? 'ari-react' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      viewBox="0 0 64 80"
      width={size}
      height={height}
      aria-hidden
    >
      <ellipse className="ari-shadow" cx="32" cy="74.5" rx="14" ry="2.8" fill="#d5e5df" />

      <g className="ari-body">
        {/* Tail */}
        <g className="ari-tail">
          <path
            d="M44 52c8 2 12-4 11-11"
            fill="none"
            stroke={mane}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="55" cy="40" r="3.2" fill={mane} />
          <circle cx="55" cy="40" r="1.6" fill={fur} />
        </g>

        {/* Legs */}
        <g className="ari-legs">
          <g className="ari-leg-l">
            <path d="M24 58c-1 5-1.5 10-1 12h7c0.4-4 0.2-9-0.5-12z" fill={fur} />
            <ellipse cx="26.5" cy="70.5" rx="4.2" ry="2.1" fill="#c4894a" />
          </g>
          <g className="ari-leg-r">
            <path d="M33 58c1 5 1.5 10 1 12h7c0.4-4 0-9-1-12z" fill={fur} />
            <ellipse cx="37.5" cy="70.5" rx="4.2" ry="2.1" fill="#c4894a" />
          </g>
        </g>

        {/* Torso */}
        <g className="ari-torso">
          <ellipse cx="32" cy="52" rx="13" ry="11" fill={fur} />
          <ellipse cx="32" cy="54" rx="8" ry="7" fill={muzzle} opacity="0.85" />
          {/* Chest tuft */}
          <path
            d="M29 48c1 3 2.5 5 3 6 0.5-1 2-3 3-6"
            fill="none"
            stroke={mane}
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>

        {/* Arms — filled limbs (not stroke sticks) for a clearer silhouette */}
        <g className="ari-arm-l">
          <ellipse cx="19" cy="50" rx="3.6" ry="6.2" fill={fur} transform="rotate(-28 19 50)" />
          <ellipse className="ari-paw" cx="15.5" cy="56.5" rx="3.6" ry="2.8" fill="#c4894a" />
          <circle cx="14.2" cy="55.6" r="0.7" fill="#a8743a" opacity="0.55" />
          <circle cx="16.2" cy="55.2" r="0.7" fill="#a8743a" opacity="0.55" />
        </g>
        <g className="ari-arm-r">
          <ellipse cx="45" cy="50" rx="3.6" ry="6.2" fill={fur} transform="rotate(28 45 50)" />
          <ellipse className="ari-paw" cx="48.5" cy="56.5" rx="3.6" ry="2.8" fill="#c4894a" />
          <circle cx="47.2" cy="55.6" r="0.7" fill="#a8743a" opacity="0.55" />
          <circle cx="49.2" cy="55.2" r="0.7" fill="#a8743a" opacity="0.55" />
        </g>

        {/* Head + mane */}
        <g className="ari-head">
          <circle cx="32" cy="24" r="16.5" fill={mane} />
          <circle cx="20" cy="16" r="6.2" fill={mane} />
          <circle cx="44" cy="16" r="6.2" fill={mane} />
          <circle cx="16.5" cy="26" r="5.4" fill={mane} />
          <circle cx="47.5" cy="26" r="5.4" fill={mane} />
          <circle cx="23" cy="35" r="5" fill={mane} />
          <circle cx="41" cy="35" r="5" fill={mane} />

          {/* Ears */}
          <circle cx="21" cy="14.5" r="3.6" fill={fur} />
          <circle cx="43" cy="14.5" r="3.6" fill={fur} />
          <circle cx="21" cy="14.5" r="1.7" fill="#c4894a" />
          <circle cx="43" cy="14.5" r="1.7" fill="#c4894a" />

          {/* Face */}
          <ellipse cx="32" cy="25" rx="11.5" ry="10.5" fill={fur} />
          <ellipse cx="32" cy="28.5" rx="7.2" ry="5.6" fill={muzzle} />

          {/* Soft face shading */}
          <ellipse cx="32" cy="22" rx="9" ry="6" fill="#fff" opacity="0.12" />

          {brow}

          <g className="ari-eyes">
            <ellipse className="ari-eye" cx="27" cy={eyeCy} rx="2" ry={eyeRy} fill="#2a3a34" />
            <ellipse className="ari-eye" cx="37" cy={eyeCy} rx="2" ry={eyeRy} fill="#2a3a34" />
            <circle cx="27.55" cy={eyeCy - 0.7} r="0.6" fill="#fff" />
            <circle cx="37.55" cy={eyeCy - 0.7} r="0.6" fill="#fff" />
          </g>

          <ellipse cx="32" cy="28.2" rx="2.1" ry="1.55" fill="#5c3d28" />
          {smile}
          {cheek}
          <circle cx="25.5" cy="29" r="0.55" fill="#5c3d28" opacity="0.5" />
          <circle cx="38.5" cy="29" r="0.55" fill="#5c3d28" opacity="0.5" />
        </g>
      </g>
    </svg>
  )
}
