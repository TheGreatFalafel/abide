'use client'

import {
  MASCOT_NAME,
  normalizeExpression,
  type AriExpression,
  type MascotLine,
} from '../lib/mascot'

type AriMarkProps = {
  expression: AriExpression
  size?: number
  className?: string
  /** Soft idle motion (blink / sway). Honors prefers-reduced-motion via CSS. */
  animate?: boolean
}

type BannerProps = {
  line: MascotLine
  compact?: boolean
  animate?: boolean
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

/** Soft SVG Ari — expression variants keep the same recognizable lion. */
export function AriMark({
  expression: raw,
  size = 48,
  className = '',
  animate = true,
}: AriMarkProps) {
  const expression = normalizeExpression(raw)
  const mane = maneColor(expression)
  const fur = furColor(expression)

  const eyeRy =
    expression === 'comforting' ? 2.1 : expression === 'thinking' ? 2.4 : 2.6
  const eyeCy =
    expression === 'thinking' ? 28.5 : expression === 'comforting' ? 30.5 : 30
  const brow =
    expression === 'proud' || expression === 'thinking' ? (
      <g stroke="#5c3d28" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" fill="none">
        <path d={expression === 'thinking' ? 'M22 25.5c2-1 6-1.2 8 0.2' : 'M22 26c2-1.2 6-1.2 8 0'} />
        <path d={expression === 'thinking' ? 'M34 25.8c2-0.6 6-0.4 8 0.6' : 'M34 26c2-1.2 6-1.2 8 0'} />
      </g>
    ) : null

  const smile =
    expression === 'celebrating' ? (
      <path
        d="M27 39c2.5 3.2 7.5 3.2 10 0"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
    ) : expression === 'comforting' ? (
      <path
        d="M28.5 40c1.5 1.2 5.5 1.2 7 0"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    ) : expression === 'thinking' ? (
      <path
        d="M29 40.5h6"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    ) : expression === 'neutral' ? (
      <path
        d="M29 40c1.2 0.8 4.8 0.8 6 0"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    ) : (
      <path
        d="M28 39.5c1.5 2 6.5 2 8 0"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    )

  const cheek =
    expression === 'welcome' || expression === 'celebrating' || expression === 'proud' ? (
      <>
        <circle cx="22" cy="35" r="1.6" fill="#e8a090" opacity="0.35" />
        <circle cx="42" cy="35" r="1.6" fill="#e8a090" opacity="0.35" />
      </>
    ) : null

  return (
    <svg
      className={`mascot-mark expr-${expression} ${animate ? 'mascot-anim' : ''} ${className}`}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <ellipse className="ari-shadow" cx="32" cy="56" rx="16" ry="3.5" fill="#d5e5df" />
      <g className="ari-body">
        {/* Mane */}
        <circle cx="32" cy="30" r="22" fill={mane} />
        <circle cx="18" cy="22" r="8" fill={mane} />
        <circle cx="46" cy="22" r="8" fill={mane} />
        <circle cx="14" cy="34" r="7" fill={mane} />
        <circle cx="50" cy="34" r="7" fill={mane} />
        <circle cx="22" cy="44" r="6" fill={mane} />
        <circle cx="42" cy="44" r="6" fill={mane} />
        {/* Face */}
        <ellipse cx="32" cy="32" rx="14" ry="13" fill={fur} />
        <ellipse cx="32" cy="36" rx="9" ry="7" fill="#f3e6c4" />
        {/* Ears */}
        <circle cx="20" cy="20" r="4.5" fill={fur} />
        <circle cx="44" cy="20" r="4.5" fill={fur} />
        <circle cx="20" cy="20" r="2.2" fill="#c4894a" />
        <circle cx="44" cy="20" r="2.2" fill="#c4894a" />
        {brow}
        {/* Eyes */}
        <g className="ari-eyes">
          <ellipse className="ari-eye" cx="26" cy={eyeCy} rx="2.2" ry={eyeRy} fill="#2a3a34" />
          <ellipse className="ari-eye" cx="38" cy={eyeCy} rx="2.2" ry={eyeRy} fill="#2a3a34" />
          <circle cx="26.6" cy={eyeCy - 0.8} r="0.7" fill="#fff" />
          <circle cx="38.6" cy={eyeCy - 0.8} r="0.7" fill="#fff" />
        </g>
        {/* Nose + mouth */}
        <ellipse cx="32" cy="36" rx="2.4" ry="1.8" fill="#5c3d28" />
        {smile}
        {cheek}
        {/* Whisker dots */}
        <circle cx="24" cy="37" r="0.7" fill="#5c3d28" opacity="0.5" />
        <circle cx="40" cy="37" r="0.7" fill="#5c3d28" opacity="0.5" />
      </g>
    </svg>
  )
}

/** @deprecated Prefer expression prop via AriMark — mood still accepted on banners. */
export function MascotBanner({ line, compact, animate = true }: BannerProps) {
  const expression = normalizeExpression(line.mood)
  return (
    <aside
      className={`mascot-banner mood-${expression} ${compact ? 'compact' : ''}`}
      aria-label={`${MASCOT_NAME}: ${line.title}`}
    >
      <AriMark expression={expression} size={compact ? 40 : 48} animate={animate} />
      <div>
        <strong>{line.title}</strong>
        <p>{line.body}</p>
      </div>
    </aside>
  )
}
