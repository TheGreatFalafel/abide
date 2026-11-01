import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  prefersReducedMotion,
  resetElementScroll,
  scrollBehavior,
  scrollLandmarkIntoView,
  scrollWindowToTop,
} from './scroll'

describe('scroll helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('prefersReducedMotion reads matchMedia', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: q.includes('prefers-reduced-motion'),
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    expect(prefersReducedMotion()).toBe(true)
    expect(scrollBehavior()).toBe('auto')
  })

  it('scrollWindowToTop calls window.scrollTo', () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    scrollWindowToTop('auto')
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' })
  })

  it('resetElementScroll zeros nested containers', () => {
    const el = { scrollTop: 40, scrollLeft: 12 } as HTMLElement
    resetElementScroll(el)
    expect(el.scrollTop).toBe(0)
    expect(el.scrollLeft).toBe(0)
    expect(() => resetElementScroll(null)).not.toThrow()
  })

  it('scrollLandmarkIntoView uses rAF + scrollIntoView', () => {
    const scrollIntoView = vi.fn()
    const el = { scrollIntoView } as unknown as HTMLElement
    const raf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0)
        return 1
      })
    scrollLandmarkIntoView(el, 'auto')
    expect(raf).toHaveBeenCalled()
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
  })
})
