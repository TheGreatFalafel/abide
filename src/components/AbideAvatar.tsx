'use client'

import { useCallback, useId, useState, type KeyboardEvent } from 'react'
import {
  AVATAR_STROKE,
  clothesColor,
  hairColor as hairFill,
  migrateAppearance,
  skinColor,
  type AvatarAppearance,
  type BrowId,
  type ClothesId,
  type ExpressionId,
  type FaceShapeId,
  type FacialHairId,
  type HairStyleId,
  type LookId,
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
  user?: Pick<UserState, 'cosmetics'>
  publicAvatar?: PublicAvatar | null
  cosmetics?: CosmeticsState | null
  size?: AvatarSize
  className?: string
  previewAppearance?: Partial<AvatarAppearance>
  previewEquipped?: Partial<CosmeticsState['equipped']>
  animate?: boolean
  interactive?: boolean
}

const STROKE = AVATAR_STROKE
const SW = 1.85

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

/** Look tweaks jaw width and neck thickness (all options still available). */
function lookScale(look: LookId) {
  if (look === 'feminine') return { jaw: 0.92, neck: 0.88, cheek: 1.06 }
  if (look === 'masculine') return { jaw: 1.08, neck: 1.12, cheek: 0.96 }
  return { jaw: 1, neck: 1, cheek: 1 }
}

function headPath(shape: FaceShapeId, look: LookId): string {
  const s = lookScale(look)
  const cx = 32
  const cy = 28
  if (shape === 'round') {
    const rx = 13.2 * s.jaw
    const ry = 14.2 * s.cheek
    return `M${cx} ${cy - ry}
      a${rx} ${ry} 0 1 1 0 ${ry * 2}
      a${rx} ${ry} 0 1 1 0 ${-ry * 2}z`
  }
  if (shape === 'softSquare') {
    const w = 13.4 * s.jaw
    const h = 14
    const r = 5.5
    const x = cx - w
    const y = cy - h
    return `M${x + r} ${y}
      H${x + w * 2 - r}
      Q${x + w * 2} ${y} ${x + w * 2} ${y + r}
      V${y + h * 2 - r * 1.1}
      Q${x + w * 2} ${y + h * 2} ${x + w * 2 - r} ${y + h * 2}
      H${x + r}
      Q${x} ${y + h * 2} ${x} ${y + h * 2 - r * 1.1}
      V${y + r}
      Q${x} ${y} ${x + r} ${y}z`
  }
  if (shape === 'heart') {
    const top = 12.5 * s.cheek
    const jaw = 11.2 * s.jaw
    return `M${cx} ${cy - 13.5}
      C${cx - top} ${cy - 13.5} ${cx - 14.5} ${cy - 4} ${cx - 13.5} ${cy + 2}
      C${cx - 12.5} ${cy + 9} ${cx - jaw} ${cy + 14} ${cx} ${cy + 15.2}
      C${cx + jaw} ${cy + 14} ${cx + 12.5} ${cy + 9} ${cx + 13.5} ${cy + 2}
      C${cx + 14.5} ${cy - 4} ${cx + top} ${cy - 13.5} ${cx} ${cy - 13.5}z`
  }
  // oval
  const rx = 12.6 * s.jaw
  const ry = 14.8
  return `M${cx} ${cy - ry}
    a${rx} ${ry} 0 1 1 0 ${ry * 2}
    a${rx} ${ry} 0 1 1 0 ${-ry * 2}z`
}

function HairBack({ style, color }: { style: HairStyleId; color: string }) {
  if (style === 'bald' || style === 'short' || style === 'sidePart') return null
  if (style === 'wavy') {
    // Lower wave tips only — main bob is one front path
    return (
      <g fill={color} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round">
        <path d="M16.5 33
          C15.2 36.5 16.5 40 19.2 41.2
          C21.2 42 23 40.5 22.4 38.5
          C21.6 36 20.2 34 18.5 32.5z" />
        <path d="M47.5 33
          C48.8 36.5 47.5 40 44.8 41.2
          C42.8 42 41 40.5 41.6 38.5
          C42.4 36 43.8 34 45.5 32.5z" />
      </g>
    )
  }
  if (style === 'longWavy') {
    return (
      <g fill={color} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round">
        <path d="M16 32
          C13.5 37 14.5 44 18 48.5
          C19.5 50.5 22.5 50 23.2 47.5
          C23.8 45.5 22 43 20 40.5
          C17.8 37.5 16.8 34.5 17.5 32z" />
        <path d="M48 32
          C50.5 37 49.5 44 46 48.5
          C44.5 50.5 41.5 50 40.8 47.5
          C40.2 45.5 42 43 44 40.5
          C46.2 37.5 47.2 34.5 46.5 32z" />
      </g>
    )
  }
  if (style === 'curly') {
    // Soft side volume (teardrops, not pigtail buns)
    return (
      <g fill={color} stroke={STROKE} strokeWidth={SW * 0.9} strokeLinejoin="round" strokeLinecap="round">
        <path d="M18.5 25.5c-4.2 1-6.2 5-5.2 9.2 0.6 2.5 3.2 4 5.5 3.2 1.8-0.6 2.4-2.5 1.8-4.2-0.8-2.4-1.2-5.2-2.1-8.2z" />
        <path d="M45.5 25.5c4.2 1 6.2 5 5.2 9.2-0.6 2.5-3.2 4-5.5 3.2-1.8-0.6-2.4-2.5-1.8-4.2 0.8-2.4 1.2-5.2 2.1-8.2z" />
      </g>
    )
  }
  if (style === 'ponytail') {
    return (
      <g fill={color} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
        <path d="M40 18c6-1 10 4 11 10 1 5-1 10-3 12l-4-2c2-2 3-6 2-10-1-3-3-5-6-6z" />
      </g>
    )
  }
  if (style === 'braids') {
    return (
      <g fill={color} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
        <path d="M19 32c-1 7-2.5 14-3 18h5.5c0.8-4 1.5-10 1.2-18z" />
        <path d="M45 32c1 7 2.5 14 3 18H42.5c-0.8-4-1.5-10-1.2-18z" />
      </g>
    )
  }
  return null
}

function HairFront({ style, color }: { style: HairStyleId; color: string }) {
  if (style === 'bald') return null

  if (style === 'short') {
    return (
      <g fill={color} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
        <path d="M19 28c1.2-10 7-15.5 13-15.5s11.8 5.5 13 15.5c-3.2-4.5-8-6.8-13-6.8S22.2 23.5 19 28z" />
      </g>
    )
  }
  if (style === 'sidePart') {
    return (
      <g fill={color} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
        <path d="M18.5 29c1-11 7.5-16.5 14.5-16 6.5 0.4 12 5.5 13 15.5-2.5-5-7-8-13.5-8.2-5.5-0.2-10 2.5-14 8.7z" />
        <path d="M28 14.5c2 2 3.5 5 4 8" fill="none" stroke={STROKE} strokeWidth="1.4" />
      </g>
    )
  }
  if (style === 'wavy') {
    // One connected wavy bob: S-curve sides + soft W bangs (2 lobes)
    return (
      <g fill={color} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round">
        <path d="M17 31
          C14.5 27.5 14.8 21.5 18.5 16.5
          C22 12.5 27.5 11 32 11.2
          C36.5 11 42 12.5 45.5 16.5
          C49.2 21.5 49.5 27.5 47 31
          C48.2 34.2 46.8 37.5 44.2 38.2
          C42.2 38.8 41.2 36.5 42.2 34.2
          C43 32 43.8 29.2 44.2 27.2
          C41.8 25.5 38.2 24.5 35 25.6
          C33.4 26.2 32.6 27 32 26.6
          C31.4 27 30.6 26.2 29 25.6
          C25.8 24.5 22.2 25.5 19.8 27.2
          C20.2 29.2 21 32 21.8 34.2
          C22.8 36.5 21.8 38.8 19.8 38.2
          C17.2 37.5 15.8 34.2 17 31z" />
      </g>
    )
  }
  if (style === 'longWavy') {
    return (
      <g fill={color} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round">
        <path d="M16.5 31.5
          C14 27.5 14.2 20.5 18.5 15.5
          C22.2 11.2 27.5 9.8 32 10
          C36.5 9.8 41.8 11.2 45.5 15.5
          C49.8 20.5 50 27.5 47.5 31.5
          C43.5 28.5 39 26.8 35 27.8
          C33.2 28.4 32.6 29.8 32 29.6
          C31.4 29.8 30.8 28.4 29 27.8
          C25 26.8 20.5 28.5 16.5 31.5z" />
      </g>
    )
  }
  if (style === 'bun') {
    return (
      <g fill={color} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
        <path d="M18.5 29c1.5-11 8-16 13.5-16s12 5 13.5 16c-3.5-5.5-8.5-8-13.5-8s-10 2.5-13.5 8z" />
        <circle cx="32" cy="11.5" r="5.6" />
      </g>
    )
  }
  if (style === 'ponytail') {
    return (
      <g fill={color} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
        <path d="M18.5 29c1.2-11 7.5-16 13.5-16s12.3 5 13.5 16c-3.2-5-8-7.5-13.5-7.5S21.7 24 18.5 29z" />
      </g>
    )
  }
  if (style === 'curly') {
    // Soft coil crown — lobed outline, face open, curl arcs (not floating grapes)
    return (
      <g fill={color} stroke={STROKE} strokeWidth={SW * 0.95} strokeLinejoin="round" strokeLinecap="round">
        <path d="M19 27.5
          C16.5 25 15.5 21 17.2 17.5
          C18.5 14.5 21.5 12.5 24.8 12
          C25.5 9 28.5 7.2 31.8 7.8
          C33.2 6.2 36.2 6.2 37.6 7.8
          C40.8 7.2 43.8 9 44.6 12
          C48 12.5 50.8 14.5 52.2 17.5
          C53.8 21 52.8 25 50.2 27.5
          C47.2 24.8 43 23.5 38.8 24.2
          C35.8 24.8 33.6 26.5 32 26.5
          C30.4 26.5 28.2 24.8 25.2 24.2
          C21 23.5 16.8 24.8 19 27.5z" />
        <path
          d="M23.5 17.5c1.8-2.4 4.8-3.2 7.2-2M34 15.2c2.2 0.2 4.2 1.4 5.5 3.2M26 22.5c1.6-1.4 3.8-1.6 5.6-0.4"
          fill="none"
          stroke={STROKE}
          strokeWidth="1.3"
          opacity="0.48"
        />
      </g>
    )
  }
  // braids
  return (
    <g fill={color} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
      <path d="M18.5 29c1.5-10.5 8-15.5 13.5-15.5s12 5 13.5 15.5c-3.5-5-8.5-7.2-13.5-7.2s-10 2.2-13.5 7.2z" />
    </g>
  )
}

function FacialHairLayer({
  id,
  color,
  skin,
}: {
  id: FacialHairId
  color: string
  skin: string
}) {
  if (id === 'none') return null
  if (id === 'stubble') {
    return (
      <g fill={color} opacity="0.35">
        <ellipse cx="32" cy="38" rx="9.5" ry="5.5" />
      </g>
    )
  }
  if (id === 'mustache') {
    return (
      <g fill={color} stroke={STROKE} strokeWidth={1.4} strokeLinejoin="round">
        <path d="M25 35.5c2.5 2 5 2.2 7 0.2 2 2 4.5 1.8 7-0.2-2.5 1.2-4.8 1.5-7 0.1-2.2 1.4-4.5 1.1-7-0.1z" />
      </g>
    )
  }
  // beard
  return (
    <g fill={color} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
      <path d="M21.5 34c1.5 2 3 6.5 4.5 9.5 2 4 4.5 6 6 6.5 1.5-0.5 4-2.5 6-6.5 1.5-3 3-7.5 4.5-9.5-2.5 3.5-6 5.5-10.5 5.5S24 37.5 21.5 34z" />
      <ellipse cx="32" cy="34.5" rx="3.2" ry="1.4" fill={skin} stroke="none" opacity="0.35" />
    </g>
  )
}

function FaceFeatures({
  expression,
  brows,
  reacting,
}: {
  expression: ExpressionId
  brows: BrowId
  reacting: boolean
}) {
  const browY = brows === 'arched' ? 23.2 : brows === 'straight' ? 24.2 : 23.8
  const browPath = (x: number) => {
    if (brows === 'straight') return `M${x} ${browY}h7.5`
    if (brows === 'arched') return `M${x} ${browY + 0.8}c2-2 5.5-2 7.5 0`
    return `M${x} ${browY}c2-1.2 5.5-1.2 7.5 0`
  }

  const smile = reacting ? (
    <path
      d="M26.5 39.5c2.5 3.2 8.5 3.2 11 0"
      fill="none"
      stroke={STROKE}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  ) : expression === 'bright' ? (
    <path
      d="M27 39.2c2.2 2.8 7.8 2.8 10 0"
      fill="none"
      stroke={STROKE}
      strokeWidth="1.65"
      strokeLinecap="round"
    />
  ) : expression === 'calm' ? (
    <path
      d="M28 39.8c2 1.2 6 1.2 8 0"
      fill="none"
      stroke={STROKE}
      strokeWidth="1.55"
      strokeLinecap="round"
    />
  ) : expression === 'thoughtful' ? (
    <path d="M29 40h6" fill="none" stroke={STROKE} strokeWidth="1.55" strokeLinecap="round" />
  ) : (
    <path
      d="M27.2 39.4c2.2 2.2 7.4 2.2 9.6 0"
      fill="none"
      stroke={STROKE}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  )

  const blush =
    expression === 'warm' || expression === 'bright' || reacting ? (
      <>
        <ellipse cx="23.5" cy="34.5" rx="2.8" ry="1.9" fill="#e8a090" opacity={reacting ? 0.55 : 0.4} />
        <ellipse cx="40.5" cy="34.5" rx="2.8" ry="1.9" fill="#e8a090" opacity={reacting ? 0.55 : 0.4} />
      </>
    ) : null

  return (
    <g className="avatar-face">
      {blush}
      <g className="avatar-eyes">
        <circle className="avatar-eye" cx="26.5" cy="30.5" r="2.55" fill={STROKE} />
        <circle className="avatar-eye" cx="37.5" cy="30.5" r="2.55" fill={STROKE} />
        <circle cx="25.7" cy="29.8" r="0.7" fill="#fff" />
        <circle cx="36.7" cy="29.8" r="0.7" fill="#fff" />
      </g>
      <path d={browPath(22.5)} fill="none" stroke={STROKE} strokeWidth="1.45" strokeLinecap="round" />
      <path d={browPath(33.5)} fill="none" stroke={STROKE} strokeWidth="1.45" strokeLinecap="round" />
      <path
        d="M32 31.5c0.5 1.8 0.2 3.4-1.1 4"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      {smile}
    </g>
  )
}

function ClothesLayer({
  clothesId,
  look,
}: {
  clothesId: ClothesId
  look: LookId
}) {
  const fill = clothesColor(clothesId)
  const wide = look === 'masculine'
  // Bust silhouette from shoulders into the circle bottom
  const body = wide
    ? 'M8 64c3-16 12-22 24-22s21 6 24 22'
    : look === 'feminine'
      ? 'M12 64c2-14 10-20 20-20s18 6 20 20'
      : 'M10 64c2.5-15 11-21 22-21s19.5 6 22 21'

  if (clothesId === 'hoodie') {
    return (
      <g fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
        <path d={body} />
        <path
          d="M24 46c2-4 5.5-6 8-6s6 2 8 6"
          fill="none"
          stroke={STROKE}
          strokeWidth="1.6"
          opacity="0.85"
        />
        <path d="M30 48v8M34 48v8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      </g>
    )
  }
  if (clothesId === 'collar') {
    return (
      <g fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
        <path d={body} />
        <path d="M28.5 45.5l3.5 5.5 3.5-5.5" fill="#f5efe6" stroke={STROKE} strokeWidth="1.5" />
      </g>
    )
  }
  if (clothesId === 'sweater') {
    return (
      <g fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
        <path d={body} />
        <path d="M20 52h24" stroke="#fff" strokeWidth="1.3" opacity="0.2" />
      </g>
    )
  }
  if (clothesId === 'blouse') {
    return (
      <g fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
        <path d={body} />
        <path d="M29 46.5h6" stroke="#fff" strokeWidth="1.4" opacity="0.45" />
        <circle cx="32" cy="50" r="1.1" fill="#fff" opacity="0.55" />
      </g>
    )
  }
  // tee — reference-like crew with lighter collar band
  const collar = '#7a9ec4'
  return (
    <g fill={fill} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
      <path d={body} />
      <path
        d="M24.5 46.5c2.5-3.5 5.5-5 7.5-5s5 1.5 7.5 5"
        fill={collar}
        stroke={STROKE}
        strokeWidth="1.5"
      />
    </g>
  )
}

function AccessoryLayer({ id }: { id: string | null }) {
  if (!id) return null
  if (id === 'acc-glasses') {
    return (
      <g fill="none" stroke={STROKE} strokeWidth="1.7">
        <circle cx="26.5" cy="30.5" r="4.4" />
        <circle cx="37.5" cy="30.5" r="4.4" />
        <path d="M30.9 30.5h2.2" />
        <path d="M22.1 30.2c-1.5-0.2-2.5 0.2-3.2 0.8" />
        <path d="M41.9 30.2c1.5-0.2 2.5 0.2 3.2 0.8" />
      </g>
    )
  }
  if (id === 'acc-earrings') {
    return (
      <g fill="none" stroke="#c9a227" strokeWidth="1.6">
        <circle cx="18.2" cy="33" r="2.1" />
        <circle cx="45.8" cy="33" r="2.1" />
      </g>
    )
  }
  if (id === 'acc-hat') {
    return (
      <g fill="#3d5650" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round">
        <ellipse cx="32" cy="18.5" rx="15.5" ry="3.8" />
        <rect x="23" y="9" width="18" height="11" rx="3.5" />
      </g>
    )
  }
  if (id === 'acc-leaf') {
    return (
      <path
        d="M46 18c-4.5 1-7 5.5-5.5 9 4.5-1.2 7.5-4.5 5.5-9z"
        fill="#1f8a5b"
        stroke={STROKE}
        strokeWidth="1.4"
      />
    )
  }
  if (id === 'acc-bow') {
    return (
      <g fill="#c45c6a" stroke={STROKE} strokeWidth="1.4" strokeLinejoin="round">
        <path d="M40 16l-4 3 4 3 1.5-3z" />
        <path d="M48 16l4 3-4 3-1.5-3z" />
        <circle cx="44" cy="19" r="1.6" />
      </g>
    )
  }
  return null
}

function FrameRing({ color, id }: { color: string; id: string }) {
  const width = id === 'frame-navy' ? 3.2 : id === 'frame-gold' ? 2.8 : 2.4
  return (
    <circle
      cx="32"
      cy="32"
      r="30.2"
      fill="none"
      stroke={color}
      strokeWidth={width}
    />
  )
}

/**
 * Flat-vector illustrated human avatar (circular bust).
 * Free appearance + gem backgrounds / accessories / frames.
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
  const colorItem = getCosmetic(equipped.color)
  const frameItem = getCosmetic(equipped.frame)
  const bg = colorItem?.color ?? '#e8eef5'
  const frame = frameItem?.color ?? '#c8d0dc'
  const skin = skinColor(appearance.skin)
  const hair = hairFill(appearance.hairColor)
  const dim = avatarPixelSize(size)
  const clipId = useId().replace(/:/g, '')
  const [reacting, setReacting] = useState(false)
  const s = lookScale(appearance.look)
  const neckW = 7.2 * s.neck

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
          <clipPath id={clipId}>
            <circle cx="32" cy="32" r="30" />
          </clipPath>
        </defs>
        <circle cx="32" cy="32" r="30" fill={bg} />
        <g clipPath={`url(#${clipId})`}>
          <ClothesLayer clothesId={appearance.clothes} look={appearance.look} />
          <HairBack style={appearance.hair} color={hair} />
          <rect
            x={32 - neckW / 2}
            y="39.5"
            width={neckW}
            height="11"
            rx="2.4"
            fill={skin}
            stroke={STROKE}
            strokeWidth={SW}
          />
          {/* Head sits above clothes/neck so outlines read cleanly */}
          <path
            d={headPath(appearance.faceShape, appearance.look)}
            fill={skin}
            stroke={STROKE}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          <ellipse
            cx={18.8}
            cy="30.8"
            rx="2.15"
            ry="3.05"
            fill={skin}
            stroke={STROKE}
            strokeWidth={SW * 0.85}
          />
          <ellipse
            cx={45.2}
            cy="30.8"
            rx="2.15"
            ry="3.05"
            fill={skin}
            stroke={STROKE}
            strokeWidth={SW * 0.85}
          />
          <FaceFeatures
            expression={appearance.expression}
            brows={appearance.brows}
            reacting={reacting}
          />
          <FacialHairLayer id={appearance.facialHair} color={hair} skin={skin} />
          <HairFront style={appearance.hair} color={hair} />
          <AccessoryLayer id={equipped.accessory} />
        </g>
        <FrameRing color={frame} id={equipped.frame} />
      </svg>
    </div>
  )
}
