/** Cosmetic shop catalog — prices in gems. Extensible without schema changes. */

export type CosmeticSlot = 'base' | 'accessory' | 'color' | 'frame'

export type CosmeticItem = {
  id: string
  name: string
  description: string
  slot: CosmeticSlot
  price: number
  /** CSS accent used in lightweight SVG avatar */
  color: string
  /** Simple glyph / mark for preview */
  mark: string
  /** Free starter items */
  starter?: boolean
}

export const COSMETIC_CATALOG: CosmeticItem[] = [
  {
    id: 'base-seeker',
    name: 'Seeker',
    description: 'A humble traveler of the Word.',
    slot: 'base',
    price: 0,
    color: '#0f6e5c',
    mark: '◎',
    starter: true,
  },
  {
    id: 'base-scribe',
    name: 'Scribe',
    description: 'Quiet diligence with parchment and pen.',
    slot: 'base',
    price: 40,
    color: '#3d5650',
    mark: '✎',
  },
  {
    id: 'base-watchman',
    name: 'Watchman',
    description: 'Alert and steady on the wall.',
    slot: 'base',
    price: 60,
    color: '#0a4f42',
    mark: '◈',
  },
  {
    id: 'color-dawn',
    name: 'Dawn Glow',
    description: 'Warm morning light for your avatar.',
    slot: 'color',
    price: 25,
    color: '#c9a227',
    mark: '☀',
  },
  {
    id: 'color-deep',
    name: 'Deep Teal',
    description: 'Abide’s signature quiet teal.',
    slot: 'color',
    price: 0,
    color: '#0f6e5c',
    mark: '●',
    starter: true,
  },
  {
    id: 'color-ember',
    name: 'Ember',
    description: 'A soft ember accent for evening study.',
    slot: 'color',
    price: 30,
    color: '#d4652f',
    mark: '●',
  },
  {
    id: 'acc-lamp',
    name: 'Study Lamp',
    description: 'A small lamp for late readings.',
    slot: 'accessory',
    price: 35,
    color: '#c9a227',
    mark: '🕯',
  },
  {
    id: 'acc-leaf',
    name: 'Olive Leaf',
    description: 'A reminder of rooted peace.',
    slot: 'accessory',
    price: 45,
    color: '#1f8a5b',
    mark: '🌿',
  },
  {
    id: 'acc-scroll',
    name: 'Scroll Bundle',
    description: 'For those hiding the Word in heart.',
    slot: 'accessory',
    price: 50,
    color: '#8a7020',
    mark: '📜',
  },
  {
    id: 'frame-simple',
    name: 'Plain Frame',
    description: 'Clean border — always free.',
    slot: 'frame',
    price: 0,
    color: '#d5e5df',
    mark: '▢',
    starter: true,
  },
  {
    id: 'frame-gold',
    name: 'Quiet Gold',
    description: 'A restrained gold rim for milestones.',
    slot: 'frame',
    price: 70,
    color: '#c9a227',
    mark: '▣',
  },
  {
    id: 'frame-wreath',
    name: 'Laurel Soft',
    description: 'Celebrate perseverance, not perfection.',
    slot: 'frame',
    price: 90,
    color: '#1f8a5b',
    mark: '❀',
  },
]

const byId = new Map(COSMETIC_CATALOG.map((c) => [c.id, c]))

export function getCosmetic(id: string): CosmeticItem | undefined {
  return byId.get(id)
}

export function starterCosmeticIds(): string[] {
  return COSMETIC_CATALOG.filter((c) => c.starter).map((c) => c.id)
}

export function cosmeticsBySlot(slot: CosmeticSlot): CosmeticItem[] {
  return COSMETIC_CATALOG.filter((c) => c.slot === slot)
}
