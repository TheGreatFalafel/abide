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
  }
}

export function migrateCosmeticsState(raw: Partial<CosmeticsState> | null | undefined): CosmeticsState {
  const base = emptyCosmeticsState()
  if (!raw || typeof raw !== 'object') return base
  const owned = Array.isArray(raw.ownedIds)
    ? [...new Set([...base.ownedIds, ...raw.ownedIds.filter((id) => typeof id === 'string')])]
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
  return { ownedIds: owned, equipped }
}

export function mergeCosmeticsState(a: CosmeticsState, b: CosmeticsState): CosmeticsState {
  const ownedIds = [...new Set([...a.ownedIds, ...b.ownedIds])]
  // Prefer local equipped if still owned
  const pick = migrateCosmeticsState({ ownedIds, equipped: a.equipped })
  return pick
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

export function slotLabel(slot: CosmeticSlot): string {
  switch (slot) {
    case 'base':
      return 'Avatar'
    case 'color':
      return 'Color'
    case 'accessory':
      return 'Accessory'
    case 'frame':
      return 'Frame'
  }
}
