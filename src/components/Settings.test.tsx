import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createInitialState } from '../lib/types'
import { Settings, SettingsView } from './Settings'

const useAuth = vi.fn(() => ({ isSignedIn: true, isLoaded: true }))

vi.mock('@clerk/nextjs', () => ({
  useAuth: () => useAuth(),
}))

vi.mock('../lib/bibleApi', () => ({
  testEsvConnection: vi.fn(async () => ({ ok: true, message: 'ok' })),
}))

vi.mock('../lib/cloud', () => ({
  saveCloudProgress: vi.fn(async (state: unknown) => state),
}))

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
  useAuth.mockClear()
})

describe('Settings without Clerk', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', '')
  })

  it('renders without calling useAuth', () => {
    const user = createInitialState('Tester', 'year')
    render(
      <Settings user={user} onUserChange={() => {}} onReset={() => {}} />,
    )
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeTruthy()
    expect(screen.getByText(/device only/i)).toBeTruthy()
    expect(useAuth).not.toHaveBeenCalled()
  })

  it('SettingsView shows device-local key status', () => {
    const user = {
      ...createInitialState('Tester', 'year'),
      esvApiKey: 'local-key',
    }
    render(
      <SettingsView
        user={user}
        onUserChange={() => {}}
        onReset={() => {}}
        hasClerk={false}
        isSignedIn={false}
      />,
    )
    expect(screen.getByText('ESV key saved on this device.')).toBeTruthy()
    expect(screen.queryByText(/saved to your account/i)).toBeNull()
  })
})

describe('Settings with Clerk', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'pk_test_phase0')
    useAuth.mockReturnValue({ isSignedIn: true, isLoaded: true })
  })

  it('uses Clerk auth when configured', () => {
    const user = {
      ...createInitialState('Tester', 'year'),
      esvApiKey: 'local-key',
    }
    render(
      <Settings user={user} onUserChange={() => {}} onReset={() => {}} />,
    )
    expect(useAuth).toHaveBeenCalled()
    expect(
      screen.getByText(/Progress syncs to your account without the key/i),
    ).toBeTruthy()
  })

  it('SettingsView signed-out still keeps key on device', () => {
    const user = {
      ...createInitialState('Tester', 'year'),
      esvApiKey: 'local-key',
    }
    render(
      <SettingsView
        user={user}
        onUserChange={() => {}}
        onReset={() => {}}
        hasClerk
        isSignedIn={false}
      />,
    )
    expect(screen.getByText('ESV key saved on this device.')).toBeTruthy()
  })
})
