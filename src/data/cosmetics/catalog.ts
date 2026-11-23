/** Cosmetic shop catalog — prices in gems. Flat-vector accents only (no paid outfits yet). */

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
   * - style: reserved default base (no outfit overlay for now)
   * - background: circle fill behind the bust
   * - accessory: glasses / earrings / hat / leaf
   * - frame: outer ring
   */
  layer?: 'style' | 'background' | 'accessory' | 'frame'
}

export const COSMETIC_CATALOG: CosmeticItem[] = [
  {
    id: 'base-seeker',
    name: 'Seeker',
    description: 'Default look — free for everyone. Customize appearance above.',
    slot: 'base',
    price: 0,
    color: '#3d6f9e',
    mark: '◎',
    starter: true,
    layer: 'style',
  },

  // —— Backgrounds ——
  {
    id: 'color-deep',
    name: 'Soft Mist',
    description: 'Cool mist circle — free starter background.',
    slot: 'color',
    price: 0,
    color: '#e8eef5',
    mark: '●',
    starter: true,
    layer: 'background',
  },
  {
    id: 'color-dawn',
    name: 'Dawn Wash',
    description: 'Warm peach light behind your character.',
    slot: 'color',
    price: 25,
    color: '#f3d5b5',
    mark: '☀',
    layer: 'background',
  },
  {
    id: 'color-sky',
    name: 'Open Sky',
    description: 'Soft blue sky for a bright profile.',
    slot: 'color',
    price: 30,
    color: '#b7d4f0',
    mark: '☁',
    layer: 'background',
  },
  {
    id: 'color-sage',
    name: 'Quiet Sage',
    description: 'Gentle green that echoes Abide’s path.',
    slot: 'color',
    price: 30,
    color: '#c5ddd0',
    mark: '❀',
    layer: 'background',
  },
  {
    id: 'color-lilac',
    name: 'Lilac Hush',
    description: 'Soft lilac for a calm evening look.',
    slot: 'color',
    price: 35,
    color: '#d8cce8',
    mark: '●',
    layer: 'background',
  },

  // —— Accessories ——
  {
    id: 'acc-glasses',
    name: 'Round Glasses',
    description: 'Friendly round frames.',
    slot: 'accessory',
    price: 40,
    color: '#2c2950',
    mark: '👓',
    layer: 'accessory',
  },
  {
    id: 'acc-earrings',
    name: 'Soft Hoops',
    description: 'Simple gold hoops at the ears.',
    slot: 'accessory',
    price: 35,
    color: '#c9a227',
    mark: '◯',
    layer: 'accessory',
  },
  {
    id: 'acc-hat',
    name: 'Soft Cap',
    description: 'A simple rounded cap.',
    slot: 'accessory',
    price: 45,
    color: '#3d5650',
    mark: '🧢',
    layer: 'accessory',
  },
  {
    id: 'acc-leaf',
    name: 'Olive Leaf',
    description: 'A leaf tucked near the hairline.',
    slot: 'accessory',
    price: 40,
    color: '#1f8a5b',
    mark: '🌿',
    layer: 'accessory',
  },
  {
    id: 'acc-bow',
    name: 'Ribbon Bow',
    description: 'A small ribbon accent in the hair.',
    slot: 'accessory',
    price: 40,
    color: '#c45c6a',
    mark: '🎀',
    layer: 'accessory',
  },

  // —— Frames ——
  {
    id: 'frame-simple',
    name: 'Plain Ring',
    description: 'Clean border — always free.',
    slot: 'frame',
    price: 0,
    color: '#c8d0dc',
    mark: '▢',
    starter: true,
    layer: 'frame',
  },
  {
    id: 'frame-gold',
    name: 'Quiet Gold',
    description: 'A restrained gold rim for milestones.',
    slot: 'frame',
    price: 60,
    color: '#c9a227',
    mark: '▣',
    layer: 'frame',
  },
  {
    id: 'frame-navy',
    name: 'Ink Outline',
    description: 'Bold navy ring that matches the line art.',
    slot: 'frame',
    price: 50,
    color: '#2c2950',
    mark: '◯',
    layer: 'frame',
  },
  {
    id: 'frame-teal',
    name: 'Path Teal',
    description: 'Abide teal for a branded edge.',
    slot: 'frame',
    price: 55,
    color: '#0f6e5c',
    mark: '❀',
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
