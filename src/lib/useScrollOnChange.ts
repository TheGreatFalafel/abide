'use client'

import { useEffect, type DependencyList, type RefObject } from 'react'
import { resetElementScroll, scrollLandmarkIntoView, scrollWindowToTop } from './scroll'

type Options = {
  /** Also reset this nested scroll container (e.g. `.verses`). */
  nestedRef?: RefObject<HTMLElement | null>
  /** When true, also force window scroll to top. */
  windowTop?: boolean
}

/**
 * On dependency change (and mount), bring the landmark into view and optionally
 * reset nested scroll. Callers should include identity keys (lessonId, phase,
 * step, passageIndex) so navigation resets while ordinary re-renders do not.
 */
export function useScrollOnChange(
  landmarkRef: RefObject<HTMLElement | null>,
  deps: DependencyList,
  options: Options = {},
): void {
  const { nestedRef, windowTop = false } = options

  useEffect(() => {
    if (windowTop) scrollWindowToTop('auto')
    resetElementScroll(nestedRef?.current)
    scrollLandmarkIntoView(landmarkRef.current, 'auto')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller owns dep list
  }, deps)
}
