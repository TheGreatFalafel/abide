/** Free appearance options for the flat-vector human avatar (not gem-gated). */

export type LookId = 'feminine' | 'masculine' | 'neutral'
export type FaceShapeId = 'oval' | 'round' | 'softSquare' | 'heart'
export type SkinToneId = 'fair' | 'light' | 'medium' | 'tan' | 'brown' | 'deep'
export type HairStyleId =
  | 'short'
  | 'sidePart'
  | 'wavy'
  | 'longWavy'
  | 'bun'
  | 'ponytail'
  | 'curly'
  | 'braids'
  | 'bald'
export type HairColorId = 'black' | 'brown' | 'auburn' | 'blonde' | 'gray' | 'copper'
export type BrowId = 'soft' | 'arched' | 'straight'
export type ExpressionId = 'warm' | 'calm' | 'bright' | 'thoughtful'
export type FacialHairId = 'none' | 'stubble' | 'mustache' | 'beard'
export type ClothesId = 'tee' | 'collar' | 'sweater' | 'hoodie' | 'blouse'

/** @deprecated Prefer ExpressionId — kept for legacy migration typing. */
export type FaceId = ExpressionId

export type AvatarAppearance = {
  look: LookId
  faceShape: FaceShapeId
  skin: SkinToneId
  hair: HairStyleId
  hairColor: HairColorId
  brows: BrowId
  expression: ExpressionId
  facialHair: FacialHairId
  clothes: ClothesId
}

export type AppearanceOption<T extends string> = {
  id: T
  name: string
  /** Hex fill used by the SVG layer */
  color?: string
}

export const LOOKS: AppearanceOption<LookId>[] = [
  { id: 'feminine', name: 'Feminine' },
  { id: 'masculine', name: 'Masculine' },
  { id: 'neutral', name: 'Neutral' },
]

export const FACE_SHAPES: AppearanceOption<FaceShapeId>[] = [
  { id: 'oval', name: 'Oval' },
  { id: 'round', name: 'Round' },
  { id: 'softSquare', name: 'Soft square' },
  { id: 'heart', name: 'Heart' },
]

export const SKIN_TONES: AppearanceOption<SkinToneId>[] = [
  { id: 'fair', name: 'Fair', color: '#f6d7c3' },
  { id: 'light', name: 'Light', color: '#e8b992' },
  { id: 'medium', name: 'Medium', color: '#c99264' },
  { id: 'tan', name: 'Tan', color: '#a87445' },
  { id: 'brown', name: 'Brown', color: '#7a4f2e' },
  { id: 'deep', name: 'Deep', color: '#4a2f1c' },
]

export const HAIR_STYLES: AppearanceOption<HairStyleId>[] = [
  { id: 'short', name: 'Short' },
  { id: 'sidePart', name: 'Side part' },
  { id: 'wavy', name: 'Wavy' },
  { id: 'longWavy', name: 'Long wavy' },
  { id: 'bun', name: 'Bun' },
  { id: 'ponytail', name: 'Ponytail' },
  { id: 'curly', name: 'Curly' },
  { id: 'braids', name: 'Braids' },
  { id: 'bald', name: 'Bald' },
]

export const HAIR_COLORS: AppearanceOption<HairColorId>[] = [
  { id: 'black', name: 'Black', color: '#1a1528' },
  { id: 'brown', name: 'Brown', color: '#4a2f1c' },
  { id: 'auburn', name: 'Auburn', color: '#8a3a28' },
  { id: 'blonde', name: 'Blonde', color: '#d4b06a' },
  { id: 'gray', name: 'Gray', color: '#8a8796' },
  { id: 'copper', name: 'Copper', color: '#b85a2a' },
]

export const BROWS: AppearanceOption<BrowId>[] = [
  { id: 'soft', name: 'Soft' },
  { id: 'arched', name: 'Arched' },
  { id: 'straight', name: 'Straight' },
]

export const EXPRESSIONS: AppearanceOption<ExpressionId>[] = [
  { id: 'warm', name: 'Warm' },
  { id: 'calm', name: 'Calm' },
  { id: 'bright', name: 'Bright' },
  { id: 'thoughtful', name: 'Thoughtful' },
]

/** @deprecated Use EXPRESSIONS */
export const FACES = EXPRESSIONS

export const FACIAL_HAIR: AppearanceOption<FacialHairId>[] = [
  { id: 'none', name: 'None' },
  { id: 'stubble', name: 'Stubble' },
  { id: 'mustache', name: 'Mustache' },
  { id: 'beard', name: 'Beard' },
]

export const CLOTHES: AppearanceOption<ClothesId>[] = [
  { id: 'tee', name: 'Soft Tee', color: '#3d6f9e' },
  { id: 'collar', name: 'Collared Shirt', color: '#4a5f8a' },
  { id: 'sweater', name: 'Knit Sweater', color: '#5c6b8a' },
  { id: 'hoodie', name: 'Hoodie', color: '#3a3f55' },
  { id: 'blouse', name: 'Blouse', color: '#6b5b95' },
]

export const DEFAULT_APPEARANCE: AvatarAppearance = {
  look: 'neutral',
  faceShape: 'oval',
  skin: 'medium',
  hair: 'wavy',
  hairColor: 'brown',
  brows: 'soft',
  expression: 'warm',
  facialHair: 'none',
  clothes: 'tee',
}

/** Flat-vector outline used across avatar layers. */
export const AVATAR_STROKE = '#2c2950'

export function skinColor(id: SkinToneId): string {
  return SKIN_TONES.find((s) => s.id === id)?.color ?? '#c99264'
}

export function hairColor(id: HairColorId): string {
  return HAIR_COLORS.find((h) => h.id === id)?.color ?? '#4a2f1c'
}

export function clothesColor(id: ClothesId): string {
  return CLOTHES.find((c) => c.id === id)?.color ?? '#3d6f9e'
}

function isOneOf<T extends string>(value: unknown, options: { id: T }[]): value is T {
  return typeof value === 'string' && options.some((o) => o.id === value)
}

const LEGACY_HAIR: Record<string, HairStyleId> = {
  short: 'short',
  wavy: 'wavy',
  bun: 'bun',
  braids: 'braids',
  curly: 'curly',
  bald: 'bald',
}

type AppearanceMigrationInput = Partial<AvatarAppearance> & {
  /** Legacy expression field */
  face?: string
}

/** Normalize unknown/legacy appearance into a valid free look. */
export function migrateAppearance(raw: AppearanceMigrationInput | null | undefined): AvatarAppearance {
  const legacyFace = typeof raw?.face === 'string' ? raw.face : undefined
  const expressionRaw = raw?.expression ?? legacyFace
  const hairRaw = typeof raw?.hair === 'string' ? (LEGACY_HAIR[raw.hair] ?? raw.hair) : undefined

  return {
    look: isOneOf(raw?.look, LOOKS) ? raw!.look : DEFAULT_APPEARANCE.look,
    faceShape: isOneOf(raw?.faceShape, FACE_SHAPES) ? raw!.faceShape : DEFAULT_APPEARANCE.faceShape,
    skin: isOneOf(raw?.skin, SKIN_TONES) ? raw!.skin : DEFAULT_APPEARANCE.skin,
    hair: isOneOf(hairRaw, HAIR_STYLES) ? hairRaw : DEFAULT_APPEARANCE.hair,
    hairColor: isOneOf(raw?.hairColor, HAIR_COLORS) ? raw!.hairColor : DEFAULT_APPEARANCE.hairColor,
    brows: isOneOf(raw?.brows, BROWS) ? raw!.brows : DEFAULT_APPEARANCE.brows,
    expression: isOneOf(expressionRaw, EXPRESSIONS) ? expressionRaw : DEFAULT_APPEARANCE.expression,
    facialHair: isOneOf(raw?.facialHair, FACIAL_HAIR)
      ? raw!.facialHair
      : DEFAULT_APPEARANCE.facialHair,
    clothes: isOneOf(raw?.clothes, CLOTHES) ? raw!.clothes : DEFAULT_APPEARANCE.clothes,
  }
}

export function patchAppearance(
  current: AvatarAppearance,
  patch: Partial<AvatarAppearance>,
): AvatarAppearance {
  return migrateAppearance({ ...current, ...patch })
}
