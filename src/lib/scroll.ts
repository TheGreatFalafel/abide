/**
 * Reading / lesson scroll helpers.
 * Window is the primary scroll container; nested `.verses` may also need reset.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Instant or smooth based on reduced-motion preference. */
export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth'
}

/** Reset document scroll without fighting nested containers on ordinary updates. */
export function scrollWindowToTop(behavior: ScrollBehavior = 'auto'): void {
  if (typeof window === 'undefined') return
  window.scrollTo({ top: 0, left: 0, behavior })
}

/** Reset an inner scroll region (e.g. `.verses`) when the passage changes. */
export function resetElementScroll(el: HTMLElement | null | undefined): void {
  if (!el) return
  el.scrollTop = 0
  el.scrollLeft = 0
}

/**
 * Scroll a session landmark into view (header / reader top).
 * Uses rAF so layout from the phase change can settle first.
 */
export function scrollLandmarkIntoView(
  el: HTMLElement | null | undefined,
  behavior: ScrollBehavior = 'auto',
): void {
  if (!el || typeof window === 'undefined') return
  window.requestAnimationFrame(() => {
    el.scrollIntoView({ behavior, block: 'start' })
  })
}
