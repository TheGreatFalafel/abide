import { afterEach, describe, expect, it, vi } from 'vitest'
import { isClerkConfigured } from './clerk'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('isClerkConfigured', () => {
  it('is false when the publishable key is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', '')
    expect(isClerkConfigured()).toBe(false)
  })

  it('is true when the publishable key is set', () => {
    vi.stubEnv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'pk_test_abide')
    expect(isClerkConfigured()).toBe(true)
  })
})
