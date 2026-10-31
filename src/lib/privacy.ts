import type { UserState } from './types'

/**
 * Personal Crossway ESV API keys stay on-device (localStorage).
 * Never include them in Neon state_json, API bodies, or API responses.
 */
export function stripEsvApiKey(state: UserState): UserState {
  if (!state.esvApiKey) return state
  return { ...state, esvApiKey: '' }
}

/** Payload safe to PUT to /api/progress or store in profiles.state_json. */
export function prepareStateForCloud(state: UserState): UserState {
  return stripEsvApiKey(state)
}

/**
 * After merging or loading cloud progress, reattach the device-local ESV key
 * so sync never wipes Settings.
 */
export function withLocalEsvKey(state: UserState, localKey: string | undefined | null): UserState {
  const key = localKey?.trim() || ''
  if (state.esvApiKey === key) return state
  return { ...state, esvApiKey: key }
}

/** Copy for Settings UI about where the ESV key lives. */
export function esvKeyStorageMessage(opts: {
  hasClerk: boolean
  isSignedIn: boolean
  keyReady: boolean
}): { blurb: string; status: string } {
  const { hasClerk, isSignedIn, keyReady } = opts
  const blurb =
    ' Your Crossway key stays on this device only and is never uploaded to Abide cloud sync.'
  if (!keyReady) {
    return {
      blurb,
      status: 'No key yet — ESV readings will not load until you save one.',
    }
  }
  if (hasClerk && isSignedIn) {
    return {
      blurb,
      status:
        'ESV key saved on this device. Reading progress syncs to your account without the key.',
    }
  }
  return {
    blurb,
    status: 'ESV key saved on this device.',
  }
}
