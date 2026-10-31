'use client'

import { MASCOT_NAME, type MascotLine } from '../lib/mascot'

type Props = {
  line: MascotLine
  compact?: boolean
}

/** Soft SVG mascot — a playful, refined adult lion. */
function AriMark({ mood }: { mood: MascotLine['mood'] }) {
  const mane =
    mood === 'celebrate' ? '#c9a227' : mood === 'nudge' ? '#b86a3a' : '#8b5a2b'
  const fur = mood === 'celebrate' ? '#e8c97a' : '#d4a84b'
  return (
    <svg
      className="mascot-mark"
      viewBox="0 0 64 64"
      width="48"
      height="48"
      aria-hidden
    >
      <ellipse cx="32" cy="56" rx="16" ry="3.5" fill="#d5e5df" />
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
      {/* Eyes */}
      <ellipse cx="26" cy="30" rx="2.2" ry="2.6" fill="#2a3a34" />
      <ellipse cx="38" cy="30" rx="2.2" ry="2.6" fill="#2a3a34" />
      <circle cx="26.6" cy="29.2" r="0.7" fill="#fff" />
      <circle cx="38.6" cy="29.2" r="0.7" fill="#fff" />
      {/* Nose + mouth — slight smile */}
      <ellipse cx="32" cy="36" rx="2.4" ry="1.8" fill="#5c3d28" />
      <path
        d="M28 39.5c1.5 2 6.5 2 8 0"
        fill="none"
        stroke="#5c3d28"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Whisker dots */}
      <circle cx="24" cy="37" r="0.7" fill="#5c3d28" opacity="0.5" />
      <circle cx="40" cy="37" r="0.7" fill="#5c3d28" opacity="0.5" />
    </svg>
  )
}

export function MascotBanner({ line, compact }: Props) {
  return (
    <aside
      className={`mascot-banner mood-${line.mood} ${compact ? 'compact' : ''}`}
      aria-label={`${MASCOT_NAME}: ${line.title}`}
    >
      <AriMark mood={line.mood} />
      <div>
        <strong>{line.title}</strong>
        <p>{line.body}</p>
      </div>
    </aside>
  )
}
