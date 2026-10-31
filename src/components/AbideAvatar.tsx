'use client'

import { getCosmetic } from '../data/cosmetics/catalog'
import { migrateCosmeticsState } from '../lib/cosmetics'
import type { UserState } from '../lib/types'

type Props = {
  user: UserState
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/** Lightweight SVG avatar from equipped cosmetics — no heavy image assets. */
export function AbideAvatar({ user, size = 'md', className = '' }: Props) {
  const cosmetics = migrateCosmeticsState(user.cosmetics)
  const base = getCosmetic(cosmetics.equipped.base)
  const color = getCosmetic(cosmetics.equipped.color)
  const frame = getCosmetic(cosmetics.equipped.frame)
  const accessory = cosmetics.equipped.accessory
    ? getCosmetic(cosmetics.equipped.accessory)
    : null

  const fill = color?.color ?? '#0f6e5c'
  const rim = frame?.color ?? '#d5e5df'
  const dim = size === 'sm' ? 40 : size === 'lg' ? 96 : 64

  return (
    <div
      className={`abide-avatar ${size} ${className}`}
      style={{ width: dim, height: dim }}
      aria-label={`Avatar: ${base?.name ?? 'Seeker'}`}
    >
      <svg viewBox="0 0 64 64" width={dim} height={dim} role="img">
        <rect x="2" y="2" width="60" height="60" rx="16" fill={rim} />
        <rect x="6" y="6" width="52" height="52" rx="13" fill={fill} />
        <path
          d="M20 40V24c0-1.6 1-2.8 2.6-2.8 1.1 0 2 .5 3 1.7L32 32l6.4-9.1c1-1.2 1.9-1.7 3-1.7 1.6 0 2.6 1.2 2.6 2.8v16"
          fill="none"
          stroke="#f3f7f5"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="44" r="2.4" fill="#c9a227" />
        {accessory ? (
          <text x="48" y="18" fontSize="12" textAnchor="middle">
            {accessory.mark}
          </text>
        ) : null}
      </svg>
    </div>
  )
}
