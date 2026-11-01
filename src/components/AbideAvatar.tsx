'use client'

import { useId } from 'react'
import {
  clothesColor,
  hairColor as hairFill,
  migrateAppearance,
  skinColor,
  type AvatarAppearance,
  type FaceId,
  type HairStyleId,
} from '../data/cosmetics/appearance'
import { getCosmetic } from '../data/cosmetics/catalog'
import {
  migrateCosmeticsState,
  toPublicAvatar,
  type CosmeticsState,
  type PublicAvatar,
} from '../lib/cosmetics'
import { avatarPixelSize, type AvatarSize } from '../lib/avatarSizes'
import type { UserState } from '../lib/types'

export type { AvatarSize }
export { avatarPixelSize }

type Props = {
  /** Full user — preferred when available. */
  user?: Pick<UserState, 'cosmetics'>
  /** Public snapshot for Circle / leaderboards. */
  publicAvatar?: PublicAvatar | null
  /** Raw cosmetics state. */
  cosmetics?: CosmeticsState | null
  size?: AvatarSize
  className?: string
  /** Preview overrides (shop / customizer). */
  previewAppearance?: Partial<AvatarAppearance>
  previewEquipped?: Partial<CosmeticsState['equipped']>
}

function resolveAvatar(props: Props): PublicAvatar {
  let base: PublicAvatar
  if (props.publicAvatar) base = props.publicAvatar
  else if (props.user) base = toPublicAvatar(migrateCosmeticsState(props.user.cosmetics))
  else if (props.cosmetics) base = toPublicAvatar(props.cosmetics)
  else base = toPublicAvatar(undefined)

  return {
    appearance: migrateAppearance({ ...base.appearance, ...props.previewAppearance }),
    equipped: { ...base.equipped, ...props.previewEquipped },
  }
}

function HairLayer({
  style,
  color,
}: {
  style: HairStyleId
  color: string
}) {
  if (style === 'bald') return null
  if (style === 'short') {
    return (
      <path
        d="M22 28c1-8 6-12 14-12s13 4 14 12c-3-4-8-6-14-6s-11 2-14 6z"
        fill={color}
      />
    )
  }
  if (style === 'bun') {
    return (
      <g fill={color}>
        <path d="M20 30c2-10 8-14 16-14s14 4 16 14c-4-5-9-7-16-7s-12 2-16 7z" />
        <circle cx="36" cy="14" r="5.5" />
      </g>
    )
  }
  if (style === 'braids') {
    return (
      <g fill={color}>
        <path d="M20 29c2-9 8-13 16-13s14 4 16 13c-4-4-9-6-16-6s-12 2-16 6z" />
        <path d="M22 32c0 8-2 14-3 18h5c1-4 2-10 2-18z" />
        <path d="M46 32c0 8 2 14 3 18h-5c-1-4-2-10-2-18z" />
      </g>
    )
  }
  if (style === 'curly') {
    return (
      <g fill={color}>
        <circle cx="22" cy="24" r="5" />
        <circle cx="30" cy="18" r="5.5" />
        <circle cx="40" cy="18" r="5.5" />
        <circle cx="48" cy="24" r="5" />
        <circle cx="26" cy="28" r="4" />
        <circle cx="44" cy="28" r="4" />
      </g>
    )
  }
  // wavy
  return (
    <path
      d="M18 30c2-11 9-15 18-15s16 4 18 15c-3-6-9-8-18-8s-15 2-18 8zM18 30c4 2 8 0 12 1s8 3 12 1 8-2 12-1"
      fill={color}
    />
  )
}

function FaceLayer({ face, skin }: { face: FaceId; skin: string }) {
  const blush =
    face === 'warm' || face === 'bright' ? (
      <>
        <circle cx="24" cy="36" r="2.2" fill="#e8a090" opacity="0.45" />
        <circle cx="44" cy="36" r="2.2" fill="#e8a090" opacity="0.45" />
      </>
    ) : null
  const browY = face === 'thoughtful' ? 29.5 : 30.5
  const smile =
    face === 'bright' ? (
      <path d="M28 41c2 3 10 3 12 0" fill="none" stroke="#5a3a2a" strokeWidth="1.6" strokeLinecap="round" />
    ) : face === 'calm' ? (
      <path d="M29 41.5c2 1.5 8 1.5 10 0" fill="none" stroke="#5a3a2a" strokeWidth="1.5" strokeLinecap="round" />
    ) : face === 'thoughtful' ? (
      <path d="M30 42h8" fill="none" stroke="#5a3a2a" strokeWidth="1.5" strokeLinecap="round" />
    ) : (
      <path d="M28.5 41c2.2 2.4 9 2.4 11 0" fill="none" stroke="#5a3a2a" strokeWidth="1.55" strokeLinecap="round" />
    )

  return (
    <g>
      {/* neck */}
      <rect x="30" y="44" width="8" height="8" rx="2" fill={skin} />
      {/* head */}
      <ellipse cx="34" cy="34" rx="14" ry="15" fill={skin} />
      {blush}
      {/* eyes */}
      <ellipse cx="28" cy="33" rx="1.7" ry="2" fill="#2a2018" />
      <ellipse cx="40" cy="33" rx="1.7" ry="2" fill="#2a2018" />
      <circle cx="27.5" cy="32.4" r="0.45" fill="#fff" />
      <circle cx="39.5" cy="32.4" r="0.45" fill="#fff" />
      {/* brows */}
      <path
        d={`M24 ${browY}c2-1.5 6-1.5 8 0`}
        fill="none"
        stroke="#3a2a20"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d={`M36 ${browY}c2-1.5 6-1.5 8 0`}
        fill="none"
        stroke="#3a2a20"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* nose hint */}
      <path d="M34 34v3.5" stroke="#8a5a40" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" />
      {smile}
    </g>
  )
}

function ClothesLayer({
  clothesId,
  outfitId,
  outfitColor,
}: {
  clothesId: AvatarAppearance['clothes']
  outfitId: string | null
  outfitColor: string | null
}) {
  const base = clothesColor(clothesId)
  // Distinct premium silhouettes when an outfit is equipped
  if (outfitId === 'base-scribe' && outfitColor) {
    return (
      <g>
        <path d="M10 62c2-16 12-24 24-24s22 8 24 24" fill={outfitColor} />
        <path d="M22 42c3-5 7-7 12-7s9 2 12 7" fill="#2a3834" opacity="0.35" />
        <path d="M32 40v22M36 40v22" stroke="#fff" strokeWidth="1.2" opacity="0.2" />
      </g>
    )
  }
  if (outfitId === 'base-watchman' && outfitColor) {
    return (
      <g>
        <path d="M8 62c3-18 14-26 26-26s23 8 26 26" fill={outfitColor} />
        <path d="M18 48l16-6 16 6v14H18z" fill="#083830" opacity="0.4" />
        <circle cx="34" cy="50" r="2" fill="#c9a227" opacity="0.85" />
      </g>
    )
  }
  if (outfitId === 'base-pilgrim' && outfitColor) {
    return (
      <g>
        <path d="M12 62c2-14 11-22 22-22s20 8 22 22" fill={outfitColor} />
        <path d="M20 50h28v4H20z" fill="#3a2e22" opacity="0.35" />
        <path d="M26 44c2-3 5-4 8-4s6 1 8 4" fill="none" stroke="#efe6d8" strokeWidth="1.4" opacity="0.5" />
      </g>
    )
  }
  if (outfitId === 'base-celebration' && outfitColor) {
    return (
      <g>
        <path d="M14 62c2-12 10-18 20-18s18 6 20 18" fill={outfitColor} />
        <path d="M22 48h24v3H22z" fill="#f5d76e" opacity="0.85" />
        <path d="M26 44l4 6 4-6 4 6 4-6" fill="none" stroke="#fff" strokeWidth="1.3" opacity="0.45" />
      </g>
    )
  }
  if (clothesId === 'hoodie') {
    return (
      <g>
        <path d="M14 62c2-12 10-18 20-18s18 6 20 18" fill={base} />
        <path d="M24 46c2-4 6-6 10-6s8 2 10 6" fill="none" stroke="#2d3748" strokeWidth="2" opacity="0.35" />
      </g>
    )
  }
  if (clothesId === 'collar') {
    return (
      <g>
        <path d="M14 62c2-12 10-18 20-18s18 6 20 18" fill={base} />
        <path d="M30 44l4 6 4-6" fill="#f5efe6" />
      </g>
    )
  }
  if (clothesId === 'sweater') {
    return <path d="M12 62c3-14 11-20 22-20s19 6 22 20" fill={base} />
  }
  return <path d="M14 62c2-12 10-18 20-18s18 6 20 18" fill={base} />
}

function AccessoryLayer({ id }: { id: string | null }) {
  if (!id) return null
  if (id === 'acc-glasses') {
    return (
      <g fill="none" stroke="#2c3e50" strokeWidth="1.6">
        <circle cx="28" cy="33" r="4.2" />
        <circle cx="40" cy="33" r="4.2" />
        <path d="M32.2 33h3.6" />
      </g>
    )
  }
  if (id === 'acc-hat') {
    return (
      <g fill="#4a6741">
        <ellipse cx="34" cy="20" rx="16" ry="4" />
        <rect x="24" y="10" width="20" height="11" rx="3" />
      </g>
    )
  }
  if (id === 'acc-leaf') {
    return <path d="M48 22c-4 1-6 5-5 8 4-1 7-4 5-8z" fill="#1f8a5b" />
  }
  if (id === 'acc-lamp') {
    return (
      <g>
        <path d="M48 14c3 0 5 2 5 5 0 3-2 4-3 5h-4c-1-1-3-2-3-5 0-3 2-5 5-5z" fill="#c9a227" />
        <rect x="49" y="24" width="4" height="3" rx="1" fill="#8a7020" />
        <circle cx="51" cy="17" r="1.2" fill="#fff6d0" opacity="0.9" />
      </g>
    )
  }
  if (id === 'acc-scroll') {
    return (
      <g>
        <rect x="46" y="12" width="10" height="14" rx="2" fill="#e8d9b0" />
        <path d="M48 15h6M48 18h6M48 21h4" stroke="#8a7020" strokeWidth="1" opacity="0.7" />
        <circle cx="48" cy="13" r="1.5" fill="#c9a227" />
      </g>
    )
  }
  if (id === 'acc-crosspin') {
    return (
      <g stroke="#c9a227" strokeWidth="1.8" strokeLinecap="round">
        <path d="M52 12v10M48 16h8" />
      </g>
    )
  }
  return null
}

function FrameOverlay({ color, id }: { color: string; id: string }) {
  if (id === 'frame-wreath') {
    return (
      <g fill="none" stroke={color} strokeWidth="2.2" opacity="0.9">
        <path d="M8 40c2-14 10-28 26-28" />
        <path d="M60 40c-2-14-10-28-26-28" />
        <path d="M10 48c4 8 12 12 24 12s20-4 24-12" />
      </g>
    )
  }
  if (id === 'frame-scroll') {
    return (
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="10"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray="4 3"
      />
    )
  }
  return (
    <rect x="2" y="2" width="60" height="60" rx="16" fill="none" stroke={color} strokeWidth="3.5" />
  )
}

/**
 * Layered 2D illustrated human avatar.
 * Compatible with legacy equipped cosmetics + free appearance.
 */
export function AbideAvatar({
  user,
  publicAvatar,
  cosmetics,
  size = 'md',
  className = '',
  previewAppearance,
  previewEquipped,
}: Props) {
  const avatar = resolveAvatar({ user, publicAvatar, cosmetics, previewAppearance, previewEquipped })
  const { appearance, equipped } = avatar
  const baseItem = getCosmetic(equipped.base)
  const colorItem = getCosmetic(equipped.color)
  const frameItem = getCosmetic(equipped.frame)
  const bg = colorItem?.color ?? '#0f6e5c'
  const frame = frameItem?.color ?? '#d5e5df'
  const skin = skinColor(appearance.skin)
  const hair = hairFill(appearance.hairColor)
  const outfitId =
    baseItem && baseItem.id !== 'base-seeker' && (baseItem.layer === 'outfit' || baseItem.slot === 'base')
      ? baseItem.id
      : null
  const outfitColor = outfitId ? (baseItem?.color ?? null) : null
  const dim = avatarPixelSize(size)
  const gradId = useId().replace(/:/g, '')

  return (
    <div
      className={`abide-avatar human ${size} ${className}`}
      style={{ width: dim, height: dim }}
      aria-label="Abide avatar"
    >
      <svg viewBox="0 0 64 64" width={dim} height={dim} role="img">
        <defs>
          <radialGradient id={gradId} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="55%" stopColor={bg} stopOpacity="0.92" />
            <stop offset="100%" stopColor={bg} />
          </radialGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="16" fill={frame} />
        <rect x="5" y="5" width="54" height="54" rx="13" fill={`url(#${gradId})`} />
        <ClothesLayer clothesId={appearance.clothes} outfitId={outfitId} outfitColor={outfitColor} />
        <FaceLayer face={appearance.face} skin={skin} />
        <HairLayer style={appearance.hair} color={hair} />
        <AccessoryLayer id={equipped.accessory} />
        <FrameOverlay color={frame} id={equipped.frame} />
      </svg>
    </div>
  )
}
