import { describe, expect, it } from 'vitest'
import { mergeUserStates } from './mergeState'
import {
  esvKeyStorageMessage,
  prepareStateForCloud,
  stripEsvApiKey,
  withLocalEsvKey,
} from './privacy'
import { createInitialState } from './types'

describe('ESV key redaction', () => {
  it('strips esvApiKey for cloud persistence', () => {
    const state = {
      ...createInitialState('Ada', 'year'),
      esvApiKey: 'secret-crossway-token',
    }
    const prepared = prepareStateForCloud(state)
    expect(prepared.esvApiKey).toBe('')
    expect(JSON.stringify(prepared)).not.toContain('secret-crossway-token')
    // Original untouched
    expect(state.esvApiKey).toBe('secret-crossway-token')
  })

  it('stripEsvApiKey is a no-op when already empty', () => {
    const state = createInitialState('Ada', 'year')
    expect(stripEsvApiKey(state)).toBe(state)
  })

  it('reattaches a local key after cloud round-trip', () => {
    const cloud = prepareStateForCloud({
      ...createInitialState('Ada', 'year'),
      esvApiKey: 'should-not-survive',
      xp: 40,
    })
    expect(cloud.esvApiKey).toBe('')
    const restored = withLocalEsvKey(cloud, 'device-key')
    expect(restored.esvApiKey).toBe('device-key')
    expect(restored.xp).toBe(40)
  })

  it('mergeUserStates never adopts a cloud ESV key', () => {
    const local = {
      ...createInitialState('Local', 'year'),
      esvApiKey: '',
      xp: 10,
    }
    const cloud = {
      ...createInitialState('Cloud', 'year'),
      esvApiKey: 'leaked-from-legacy-row',
      xp: 50,
    }
    const merged = mergeUserStates(local, cloud)
    expect(merged.esvApiKey).toBe('')
    expect(merged.xp).toBe(50)
  })

  it('mergeUserStates keeps the local ESV key', () => {
    const local = {
      ...createInitialState('Local', 'gospels'),
      esvApiKey: 'local-only',
      translationId: 'esv' as const,
      xp: 20,
    }
    const cloud = {
      ...createInitialState('Cloud', 'gospels'),
      esvApiKey: 'legacy-cloud-key',
      translationId: 'web' as const,
      xp: 5,
    }
    const merged = mergeUserStates(local, cloud)
    expect(merged.esvApiKey).toBe('local-only')
    expect(merged.translationId).toBe('esv')
  })
})

describe('esvKeyStorageMessage', () => {
  it('explains device-only storage without Clerk', () => {
    const msg = esvKeyStorageMessage({
      hasClerk: false,
      isSignedIn: false,
      keyReady: true,
    })
    expect(msg.blurb.toLowerCase()).toContain('device')
    expect(msg.status).toMatch(/this device/i)
    expect(msg.blurb.toLowerCase()).not.toContain('account')
  })

  it('notes progress sync without uploading the key when signed in', () => {
    const msg = esvKeyStorageMessage({
      hasClerk: true,
      isSignedIn: true,
      keyReady: true,
    })
    expect(msg.status.toLowerCase()).toContain('without the key')
  })
})
