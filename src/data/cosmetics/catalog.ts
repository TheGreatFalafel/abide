/** Cosmetic shop catalog — prices in gems. Extensible without schema changes. */

export type CosmeticSlot = 'base' | 'accessory' | 'color' | 'frame'

export type CosmeticItem = {
  id: string
  name: string
  description: string
  slot: CosmeticSlot
  price: number
  /** Accent / layer color for avatar rendering */
  color: string
  /** Simple glyph for shop list preview */
  mark: string
  /** Free starter items */
  starter?: boolean
  /**
   * How the item affects the human avatar:
   * - style: special character vibe (base slot)
   * - background: profile environment (color slot)
   * - accessory: hat/glasses/etc.
   * - frame: border / wreath
   * - outfit: premium clothing overlay (base slot paid outfits)
   */
  layer?: 'style' | 'background' | 'accessory' | 'frame' | 'outfit'
}

export const COSMETIC_CATALOG: CosmeticItem[] = [
  // —— Styles / special looks (base slot) ——
  {
    id: 'base-seeker',
    name: 'Seeker',
    description: 'Friendly default look — free for everyone.',
    slot: 'base',
    price: 0,
    color: '#0f6e5c',
    mark: '◎',
    starter: true,
    layer: 'style',
  },
  {
    id: 'base-scribe',
    name: 'Scribe Robe',
    description: 'A calm scholar’s outer robe over your clothing.',
    slot: 'base',
    price: 40,
    color: '#3d5650',
    mark: '✎',
    layer: 'outfit',
  },
  {
    id: 'base-watchman',
    name: 'Watchman Cloak',
    description: 'A steady cloak for those keeping watch.',
    slot: 'base',
    price: 60,
    color: '#0a4f42',
    mark: '◈',
    layer: 'outfit',
  },
  {
    id: 'base-pilgrim',
    name: 'Pilgrim Coat',
    description: 'Travel-worn coat for the long road of faith.',
    slot: 'base',
    price: 55,
    color: '#5c4a3a',
    mark: '⌂',
    layer: 'outfit',
  },
  {
    id: 'base-celebration',
    name: 'Festival Vest',
    description: 'A bright vest for joyful milestones.',
    slot: 'base',
    price: 75,
    color: '#c45c2a',
    mark: '✦',
    layer: 'outfit',
  },

  // —— Backgrounds (color slot) ——
  {
    id: 'color-deep',
    name: 'Quiet Grove',
    description: 'Soft teal grove — free starter background.',
    slot: 'color',
    price: 0,
    color: '#0f6e5c',
    mark: '●',
    starter: true,
    layer: 'background',
  },
  {
    id: 'color-dawn',
    name: 'Dawn Horizon',
    description: 'Warm morning light behind your character.',
    slot: 'color',
    price: 25,
    color: '#c9a227',
    mark: '☀',
    layer: 'background',
  },
  {
    id: 'color-ember',
    name: 'Ember Study',
    description: 'Soft ember glow for evening reading.',
    slot: 'color',
    price: 30,
    color: '#d4652f',
    mark: '●',
    layer: 'background',
  },
  {
    id: 'color-sky',
    name: 'Open Sky',
    description: 'Clear blue sky for a bright profile.',
    slot: 'color',
    price: 35,
    color: '#4a90c8',
    mark: '☁',
    layer: 'background',
  },
  {
    id: 'color-garden',
    name: 'Garden Path',
    description: 'Leafy greens suggesting rooted peace.',
    slot: 'color',
    price: 40,
    color: '#3d8a5a',
    mark: '❀',
    layer: 'background',
  },

  // —— Accessories ——
  {
    id: 'acc-lamp',
    name: 'Study Lamp',
    description: 'A small lamp pin for late readings.',
    slot: 'accessory',
    price: 35,
    color: '#c9a227',
    mark: '🕯',
    layer: 'accessory',
  },
  {
    id: 'acc-leaf',
    name: 'Olive Leaf',
    description: 'A leaf tucked near the hairline.',
    slot: 'accessory',
    price: 45,
    color: '#1f8a5b',
    mark: '🌿',
    layer: 'accessory',
  },
  {
    id: 'acc-scroll',
    name: 'Scroll Bundle',
    description: 'A tiny scroll badge for Word-keepers.',
    slot: 'accessory',
    price: 50,
    color: '#8a7020',
    mark: '📜',
    layer: 'accessory',
  },
  {
    id: 'acc-glasses',
    name: 'Reading Glasses',
    description: 'Friendly round glasses.',
    slot: 'accessory',
    price: 45,
    color: '#2c3e50',
    mark: '👓',
    layer: 'accessory',
  },
  {
    id: 'acc-hat',
    name: 'Soft Cap',
    description: 'A simple cap for outdoor walks.',
    slot: 'accessory',
    price: 50,
    color: '#4a6741',
    mark: '🧢',
    layer: 'accessory',
  },
  {
    id: 'acc-crosspin',
    name: 'Cross Pin',
    description: 'A small pin — optional, never required.',
    slot: 'accessory',
    price: 55,
    color: '#c9a227',
    mark: '✝',
    layer: 'accessory',
  },

  // —— Frames / environments ——
  {
    id: 'frame-simple',
    name: 'Plain Frame',
    description: 'Clean border — always free.',
    slot: 'frame',
    price: 0,
    color: '#d5e5df',
    mark: '▢',
    starter: true,
    layer: 'frame',
  },
  {
    id: 'frame-gold',
    name: 'Quiet Gold',
    description: 'A restrained gold rim for milestones.',
    slot: 'frame',
    price: 70,
    color: '#c9a227',
    mark: '▣',
    layer: 'frame',
  },
  {
    id: 'frame-wreath',
    name: 'Laurel Soft',
    description: 'Celebrate perseverance, not perfection.',
    slot: 'frame',
    price: 90,
    color: '#1f8a5b',
    mark: '❀',
    layer: 'frame',
  },
  {
    id: 'frame-scroll',
    name: 'Scroll Border',
    description: 'Parchment-inspired edge for scholars.',
    slot: 'frame',
    price: 80,
    color: '#b8a078',
    mark: '▭',
    layer: 'frame',
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

export function isValidCosmeticId(id: string): boolean {
  return byId.has(id)
}
