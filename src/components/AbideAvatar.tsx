'use client'

import { useCallback, useId, useState, type KeyboardEvent } from 'react'
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
  /** Soft blink + idle; honors prefers-reduced-motion via CSS. */
  animate?: boolean
  /** Enable click/tap expressive flash (learner’s character, not a mascot). */
  interactive?: boolean
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
      <g fill={color}>
        <path d="M20 29c1.5-9 7-14 16-14s14.5 5 16 14c-3.5-4.5-9-7-16-7s-12.5 2.5-16 7z" />
        <path d="M21 30c0.5-2 2-3.5 4-4.2" fill="none" stroke="#fff" strokeWidth="1" opacity="0.15" />
      </g>
    )
  }
  if (style === 'bun') {
    return (
      <g fill={color}>
        <path d="M19 31c2-11 8.5-15.5 17-15.5s15 4.5 17 15.5c-4-5.5-9.5-7.5-17-7.5s-13 2-17 7.5z" />
        <circle cx="36" cy="13.5" r="5.8" />
        <circle cx="36" cy="12.5" r="2.4" fill="#fff" opacity="0.12" />
      </g>
    )
  }
  if (style === 'braids') {
    return (
      <g fill={color}>
        <path d="M19 30c2-10 8.5-14.5 17-14.5s15 4.5 17 14.5c-4-4.5-9.5-6.5-17-6.5s-13 2-17 6.5z" />
        <path d="M21.5 32c0 8.5-2.2 15-3.2 19h5.2c1-4.2 2-10.5 2-19z" />
        <path d="M46.5 32c0 8.5 2.2 15 3.2 19h-5.2c-1-4.2-2-10.5-2-19z" />
        <circle cx="21" cy="42" r="1.4" opacity="0.35" />
        <circle cx="47" cy="42" r="1.4" opacity="0.35" />
      </g>
    )
  }
  if (style === 'curly') {
    return (
      <g fill={color}>
        <circle cx="21" cy="24" r="5.2" />
        <circle cx="29" cy="17.5" r="5.6" />
        <circle cx="39" cy="17" r="5.8" />
        <circle cx="47.5" cy="23.5" r="5.2" />
        <circle cx="25" cy="29" r="4.2" />
        <circle cx="43.5" cy="28.5" r="4.2" />
        <circle cx="34" cy="15" r="4.5" />
      </g>
    )
  }
  // wavy
  return (
    <g fill={color}>
      <path d="M17.5 31c2-12 9.5-16.5 18.5-16.5s16.5 4.5 18.5 16.5c-3-6.5-9.5-9-18.5-9s-15.5 2.5-18.5 9z" />
      <path
        d="M18 31c3.5 2 7.5 0.2 11.5 1.2s8 3.2 12 1.2 8-2.2 12.5-1"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.85"
      />
    </g>
  )
}

function FaceLayer({
  face,
  skin,
  reacting,
}: {
  face: FaceId
  skin: string
  reacting: boolean
}) {
  const blush =
    face === 'warm' || face === 'bright' || reacting ? (
      <>
        <ellipse cx="24" cy="36.5" rx="2.6" ry="1.8" fill="#e8a090" opacity={reacting ? 0.55 : 0.42} />
        <ellipse cx="44" cy="36.5" rx="2.6" ry="1.8" fill="#e8a090" opacity={reacting ? 0.55 : 0.42} />
      </>
    ) : null
  const browY = face === 'thoughtful' ? 29.2 : 30.2
  const smile = reacting ? (
    <path
      d="M27.5 41c2.4 3.4 10.6 3.4 13 0"
      fill="none"
      stroke="#5a3a2a"
      strokeWidth="1.65"
      strokeLinecap="round"
    />
  ) : face === 'bright' ? (
    <path d="M28 41c2 3 10 3 12 0" fill="none" stroke="#5a3a2a" strokeWidth="1.6" strokeLinecap="round" />
  ) : face === 'calm' ? (
    <path d="M29 41.5c2 1.5 8 1.5 10 0" fill="none" stroke="#5a3a2a" strokeWidth="1.5" strokeLinecap="round" />
  ) : face === 'thoughtful' ? (
    <path d="M30 42h8" fill="none" stroke="#5a3a2a" strokeWidth="1.5" strokeLinecap="round" />
  ) : (
    <path d="M28.5 41c2.2 2.4 9 2.4 11 0" fill="none" stroke="#5a3a2a" strokeWidth="1.55" strokeLinecap="round" />
  )

  return (
    <g className="avatar-face">
      {/* neck with soft shade */}
      <rect x="30" y="44" width="8" height="9" rx="2.5" fill={skin} />
      <rect x="30" y="44" width="8" height="9" rx="2.5" fill="#000" opacity="0.06" />

      {/* head */}
      <ellipse cx="34" cy="33.5" rx="14.2" ry="15.2" fill={skin} />
      {/* cheek / forehead light */}
      <ellipse cx="30" cy="28" rx="7" ry="6" fill="#fff" opacity="0.14" />
      <ellipse cx="38" cy="36" rx="5" ry="4" fill="#000" opacity="0.04" />

      {/* ears */}
      <ellipse cx="20.5" cy="34" rx="2.4" ry="3.2" fill={skin} />
      <ellipse cx="47.5" cy="34" rx="2.4" ry="3.2" fill={skin} />
      <ellipse cx="20.5" cy="34" rx="1.1" ry="1.6" fill="#c4894a" opacity="0.35" />
      <ellipse cx="47.5" cy="34" rx="1.1" ry="1.6" fill="#c4894a" opacity="0.35" />

      {blush}

      {/* eyes */}
      <g className="avatar-eyes">
        <ellipse className="avatar-eye" cx="28" cy="32.8" rx="1.85" ry="2.25" fill="#2a2018" />
        <ellipse className="avatar-eye" cx="40" cy="32.8" rx="1.85" ry="2.25" fill="#2a2018" />
        <circle cx="27.45" cy="32.1" r="0.55" fill="#fff" />
        <circle cx="39.45" cy="32.1" r="0.55" fill="#fff" />
        <circle cx="28.35" cy="33.4" r="0.35" fill="#fff" opacity="0.35" />
        <circle cx="40.35" cy="33.4" r="0.35" fill="#fff" opacity="0.35" />
      </g>

      {/* brows */}
      <path
        d={`M24 ${browY}c2-1.5 6-1.5 8 0`}
        fill="none"
        stroke="#3a2a20"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path
        d={`M36 ${browY}c2-1.5 6-1.5 8 0`}
        fill="none"
        stroke="#3a2a20"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.72"
      />

      {/* nose */}
      <path
        d="M34 33.5c0.4 1.6 0.2 3.2-0.8 3.8"
        fill="none"
        stroke="#8a5a40"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.5"
      />
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
        <path d="M22 44c-1 4 0 8 1 10" fill="none" stroke={base} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
        <path d="M46 44c1 4 0 8-1 10" fill="none" stroke={base} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
      </g>
    )
  }
  if (clothesId === 'collar') {
    return (
      <g>
        <path d="M14 62c2-12 10-18 20-18s18 6 20 18" fill={base} />
        <path d="M30 44l4 6 4-6" fill="#f5efe6" />
        <path d="M28 45h12" stroke="#fff" strokeWidth="1" opacity="0.25" />
      </g>
    )
  }
  if (clothesId === 'sweater') {
    return (
      <g>
        <path d="M12 62c3-14 11-20 22-20s19 6 22 20" fill={base} />
        <path d="M18 50h32" stroke="#fff" strokeWidth="1.2" opacity="0.12" />
      </g>
    )
  }
  return (
    <g>
      <path d="M14 62c2-12 10-18 20-18s18 6 20 18" fill={base} />
      <path d="M26 46h16" stroke="#fff" strokeWidth="1" opacity="0.15" />
    </g>
  )
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
  animate = true,
  interactive = false,
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
  const [reacting, setReacting] = useState(false)

  const flash = useCallback(() => {
    if (!interactive) return
    setReacting(true)
    window.setTimeout(() => setReacting(false), 700)
  }, [interactive])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!interactive) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        flash()
      }
    },
    [flash, interactive],
  )

  return (
    <div
      className={[
        'abide-avatar',
        'human',
        size,
        animate ? 'avatar-anim' : '',
        reacting ? 'avatar-react' : '',
        interactive ? 'avatar-interactive' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ width: dim, height: dim }}
      aria-label="Abide avatar"
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? flash : undefined}
      onKeyDown={interactive ? onKeyDown : undefined}
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
        <FaceLayer face={appearance.face} skin={skin} reacting={reacting} />
        <HairLayer style={appearance.hair} color={hair} />
        <AccessoryLayer id={equipped.accessory} />
        <FrameOverlay color={frame} id={equipped.frame} />
      </svg>
    </div>
  )
}
