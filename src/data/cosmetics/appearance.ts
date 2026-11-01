/** Free appearance options for the human avatar (not gem-gated). */

export type SkinToneId = 'fair' | 'light' | 'medium' | 'tan' | 'brown' | 'deep'
export type HairStyleId = 'short' | 'wavy' | 'bun' | 'braids' | 'curly' | 'bald'
export type HairColorId = 'black' | 'brown' | 'auburn' | 'blonde' | 'gray' | 'copper'
export type FaceId = 'warm' | 'calm' | 'bright' | 'thoughtful'
export type ClothesId = 'tee' | 'sweater' | 'collar' | 'hoodie'

export type AvatarAppearance = {
  skin: SkinToneId
  hair: HairStyleId
  hairColor: HairColorId
  face: FaceId
  clothes: ClothesId
}

export type AppearanceOption<T extends string> = {
  id: T
  name: string
  /** Hex fill used by the SVG layer */
  color?: string
}

export const SKIN_TONES: AppearanceOption<SkinToneId>[] = [
  { id: 'fair', name: 'Fair', color: '#f3d0b5' },
  { id: 'light', name: 'Light', color: '#e2b48e' },
  { id: 'medium', name: 'Medium', color: '#c48a5a' },
  { id: 'tan', name: 'Tan', color: '#a86b3c' },
  { id: 'brown', name: 'Brown', color: '#7a4a2a' },
  { id: 'deep', name: 'Deep', color: '#4a2c1a' },
]

export const HAIR_STYLES: AppearanceOption<HairStyleId>[] = [
  { id: 'short', name: 'Short' },
  { id: 'wavy', name: 'Wavy' },
  { id: 'bun', name: 'Bun' },
  { id: 'braids', name: 'Braids' },
  { id: 'curly', name: 'Curly' },
  { id: 'bald', name: 'Bald' },
]

export const HAIR_COLORS: AppearanceOption<HairColorId>[] = [
  { id: 'black', name: 'Black', color: '#1c1410' },
  { id: 'brown', name: 'Brown', color: '#5c3a22' },
  { id: 'auburn', name: 'Auburn', color: '#8a3a1c' },
  { id: 'blonde', name: 'Blonde', color: '#c9a66b' },
  { id: 'gray', name: 'Gray', color: '#8a8a8a' },
  { id: 'copper', name: 'Copper', color: '#b85a2a' },
]

export const FACES: AppearanceOption<FaceId>[] = [
  { id: 'warm', name: 'Warm' },
  { id: 'calm', name: 'Calm' },
  { id: 'bright', name: 'Bright' },
  { id: 'thoughtful', name: 'Thoughtful' },
]

export const CLOTHES: AppearanceOption<ClothesId>[] = [
  { id: 'tee', name: 'Soft Tee', color: '#2f7a66' },
  { id: 'sweater', name: 'Knit Sweater', color: '#3d5a80' },
  { id: 'collar', name: 'Collared Shirt', color: '#6b4f3a' },
  { id: 'hoodie', name: 'Hoodie', color: '#4a5568' },
]

export const DEFAULT_APPEARANCE: AvatarAppearance = {
  skin: 'medium',
  hair: 'wavy',
  hairColor: 'brown',
  face: 'warm',
  clothes: 'tee',
}

export function skinColor(id: SkinToneId): string {
  return SKIN_TONES.find((s) => s.id === id)?.color ?? '#c48a5a'
}

export function hairColor(id: HairColorId): string {
  return HAIR_COLORS.find((h) => h.id === id)?.color ?? '#5c3a22'
}

export function clothesColor(id: ClothesId): string {
  return CLOTHES.find((c) => c.id === id)?.color ?? '#2f7a66'
}

function isOneOf<T extends string>(value: unknown, options: { id: T }[]): value is T {
  return typeof value === 'string' && options.some((o) => o.id === value)
}

/** Normalize unknown/legacy appearance into a valid free look. */
export function migrateAppearance(raw: Partial<AvatarAppearance> | null | undefined): AvatarAppearance {
  return {
    skin: isOneOf(raw?.skin, SKIN_TONES) ? raw!.skin : DEFAULT_APPEARANCE.skin,
    hair: isOneOf(raw?.hair, HAIR_STYLES) ? raw!.hair : DEFAULT_APPEARANCE.hair,
    hairColor: isOneOf(raw?.hairColor, HAIR_COLORS) ? raw!.hairColor : DEFAULT_APPEARANCE.hairColor,
    face: isOneOf(raw?.face, FACES) ? raw!.face : DEFAULT_APPEARANCE.face,
    clothes: isOneOf(raw?.clothes, CLOTHES) ? raw!.clothes : DEFAULT_APPEARANCE.clothes,
  }
}

export function patchAppearance(
  current: AvatarAppearance,
  patch: Partial<AvatarAppearance>,
): AvatarAppearance {
  return migrateAppearance({ ...current, ...patch })
}
