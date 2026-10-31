import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(__dirname, '../..')

describe('PWA assets', () => {
  it('ships a valid web app manifest', () => {
    const raw = readFileSync(resolve(root, 'public/manifest.webmanifest'), 'utf8')
    const manifest = JSON.parse(raw) as {
      name: string
      short_name: string
      display: string
      start_url: string
      theme_color: string
      icons: { src: string; sizes: string; purpose?: string }[]
    }
    expect(manifest.short_name).toBe('Abide')
    expect(manifest.display).toBe('standalone')
    expect(manifest.start_url).toBe('/')
    expect(manifest.theme_color).toBe('#0f6e5c')
    expect(manifest.icons.some((i) => i.sizes === '192x192')).toBe(true)
    expect(manifest.icons.some((i) => i.sizes === '512x512')).toBe(true)
    expect(manifest.icons.some((i) => i.purpose === 'maskable')).toBe(true)
  })

  it('includes icon PNGs generated from the brand mark', () => {
    for (const file of [
      'public/icons/icon-192.png',
      'public/icons/icon-512.png',
      'public/icons/icon-maskable-512.png',
      'public/icons/apple-touch-icon.png',
    ]) {
      const buf = readFileSync(resolve(root, file))
      expect(buf.subarray(0, 8).toString('binary')).toContain('\x89PNG')
    }
  })

  it('service worker avoids caching API and auth routes', () => {
    const sw = readFileSync(resolve(root, 'public/sw.js'), 'utf8')
    expect(sw).toMatch(/isAuthOrApi/)
    expect(sw).toMatch(/\/api\//)
    expect(sw).toMatch(/sign-in/)
    expect(sw).toMatch(/SHOW_NOTIFICATION/)
    expect(sw).not.toMatch(/X-ESV-API-Key/)
    expect(sw).not.toMatch(/CLERK_SECRET/)
  })
})
