import {
  DEFAULT_APPEARANCE,
  migrateAppearance,
  patchAppearance,
  type AvatarAppearance,
} from '../data/cosmetics/appearance'
import { starterCosmeticIds, getCosmetic, type CosmeticSlot } from '../data/cosmetics/catalog'

export type EquippedCosmetics = {
  base: string
  color: string
  accessory: string | null
  frame: string
}

export type CosmeticsState = {
  ownedIds: string[]
  equipped: EquippedCosmetics
  /** Free human appearance (skin, hair, face, basic clothes). */
  appearance: AvatarAppearance
}

/** Safe public snapshot for Circle / leaderboards — no owned inventory. */
export type PublicAvatar = {
  appearance: AvatarAppearance
  equipped: EquippedCosmetics
}

export function emptyCosmeticsState(): CosmeticsState {
  const starters = starterCosmeticIds()
  return {
    ownedIds: [...starters],
    equipped: {
      base: 'base-seeker',
      color: 'color-deep',
      accessory: null,
      frame: 'frame-simple',
    },
    appearance: { ...DEFAULT_APPEARANCE },
  }
}

/** Accepts persisted UserState cosmetics (stringly-typed appearance) and legacy shapes. */
export function migrateCosmeticsState(
  raw:
    | Partial<CosmeticsState>
    | {
        ownedIds?: string[]
        equipped?: Partial<EquippedCosmetics>
        appearance?: Partial<AvatarAppearance> | Record<string, string>
      }
    | null
    | undefined,
): CosmeticsState {
  const base = emptyCosmeticsState()
  if (!raw || typeof raw !== 'object') return base
  const owned = Array.isArray(raw.ownedIds)
    ? [
        ...new Set([
          ...base.ownedIds,
          ...raw.ownedIds.filter((id) => typeof id === 'string' && Boolean(getCosmetic(id))),
        ]),
      ]
    : base.ownedIds
  const eq = raw.equipped && typeof raw.equipped === 'object' ? raw.equipped : base.equipped
  const equipped: EquippedCosmetics = {
    base: typeof eq.base === 'string' && owned.includes(eq.base) ? eq.base : base.equipped.base,
    color:
      typeof eq.color === 'string' && owned.includes(eq.color) ? eq.color : base.equipped.color,
    accessory:
      typeof eq.accessory === 'string' && owned.includes(eq.accessory) ? eq.accessory : null,
    frame:
      typeof eq.frame === 'string' && owned.includes(eq.frame) ? eq.frame : base.equipped.frame,
  }
  return {
    ownedIds: owned,
    equipped,
    appearance: migrateAppearance(raw.appearance as Partial<AvatarAppearance> | undefined),
  }
}

export function mergeCosmeticsState(a: CosmeticsState, b: CosmeticsState): CosmeticsState {
  const ownedIds = [
    ...new Set([
      ...a.ownedIds,
      ...b.ownedIds.filter((id) => Boolean(getCosmetic(id))),
    ]),
  ]
  // Prefer local equipped + appearance if still valid
  return migrateCosmeticsState({
    ownedIds,
    equipped: a.equipped,
    appearance: a.appearance || b.appearance,
  })
}

export function ownsCosmetic(state: CosmeticsState, itemId: string): boolean {
  return state.ownedIds.includes(itemId)
}

export function canEquip(state: CosmeticsState, itemId: string): boolean {
  return ownsCosmetic(state, itemId) && Boolean(getCosmetic(itemId))
}

export function equipCosmetic(state: CosmeticsState, itemId: string): CosmeticsState {
  const item = getCosmetic(itemId)
  if (!item || !ownsCosmetic(state, itemId)) return state
  const equipped = { ...state.equipped }
  if (item.slot === 'accessory') {
    equipped.accessory = itemId
  } else {
    equipped[item.slot] = itemId
  }
  return { ...state, equipped }
}

export function unequipAccessory(state: CosmeticsState): CosmeticsState {
  return { ...state, equipped: { ...state.equipped, accessory: null } }
}

export function grantCosmetic(state: CosmeticsState, itemId: string): CosmeticsState {
  if (!getCosmetic(itemId) || state.ownedIds.includes(itemId)) return state
  return { ...state, ownedIds: [...state.ownedIds, itemId] }
}

export function setAppearance(
  state: CosmeticsState,
  patch: Partial<AvatarAppearance>,
): CosmeticsState {
  return {
    ...state,
    appearance: patchAppearance(state.appearance, patch),
  }
}

/** Public-safe avatar for social surfaces (no ownedIds / gem data). */
export function toPublicAvatar(
  state: Parameters<typeof migrateCosmeticsState>[0],
): PublicAvatar {
  const c = migrateCosmeticsState(state)
  return {
    appearance: c.appearance,
    equipped: { ...c.equipped },
  }
}

export function publicAvatarFromUnknown(raw: unknown): PublicAvatar {
  if (!raw || typeof raw !== 'object') return toPublicAvatar(undefined)
  const obj = raw as {
    equipped?: Partial<EquippedCosmetics>
    appearance?: Partial<AvatarAppearance> | Record<string, string>
  }
  return toPublicAvatar({
    ownedIds: [],
    equipped: obj.equipped,
    appearance: obj.appearance,
  })
}

export function slotLabel(slot: CosmeticSlot): string {
  switch (slot) {
    case 'base':
      return 'Outfit / style'
    case 'color':
      return 'Background'
    case 'accessory':
      return 'Accessory'
    case 'frame':
      return 'Frame'
  }
}
