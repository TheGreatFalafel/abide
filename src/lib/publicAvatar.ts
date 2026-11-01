import { toPublicAvatar, type PublicAvatar } from './cosmetics'

/**
 * Extract a public avatar snapshot from profiles.state_json without leaking
 * owned inventory, gems, ESV keys, or other private fields.
 */
export function publicAvatarFromStateJson(stateJson: unknown): PublicAvatar {
  if (!stateJson || typeof stateJson !== 'object') return toPublicAvatar(undefined)
  const cosmetics = (stateJson as { cosmetics?: unknown }).cosmetics
  return toPublicAvatar(
    cosmetics && typeof cosmetics === 'object'
      ? (cosmetics as Parameters<typeof toPublicAvatar>[0])
      : undefined,
  )
}
