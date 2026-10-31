import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { isBrowserOffline } from './passageStore'

describe('passageStore helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { onLine: true })
  })

  it('reports offline from navigator.onLine', () => {
    expect(isBrowserOffline()).toBe(false)
    vi.stubGlobal('navigator', { onLine: false })
    expect(isBrowserOffline()).toBe(true)
  })

  it('persists passages without API credentials in the store module', () => {
    const storeSrc = readFileSync(resolve(__dirname, 'passageStore.ts'), 'utf8')
    const apiSrc = readFileSync(resolve(__dirname, 'bibleApi.ts'), 'utf8')
    expect(storeSrc).not.toMatch(/esvApiKey|Authorization|CLERK/)
    expect(apiSrc).toMatch(/writeStoredPassage\(key, content\)/)
    expect(apiSrc).toMatch(/fromOfflineCache/)
  })
})
