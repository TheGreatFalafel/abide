export type AvatarSize = 'sm' | 'md' | 'lg'

/** Pixel box for each size — keeps sm readable and lg suitable for customizer. */
export function avatarPixelSize(size: AvatarSize): number {
  return size === 'sm' ? 40 : size === 'lg' ? 112 : 64
}
