'use client'

import { useEffect, useState } from 'react'
import { isBrowserOffline } from '../lib/passageStore'

type Props = {
  /** Extra offline note (e.g. passage served from cache) */
  detail?: string | null
}

export function ConnectivityBanner({ detail }: Props) {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    function sync() {
      setOffline(isBrowserOffline())
    }
    sync()
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])

  if (!offline && !detail) return null

  return (
    <div
      className={`connectivity-banner ${offline ? 'offline' : 'cached'}`}
      role="status"
      aria-live="polite"
    >
      {offline
        ? 'You are offline. Saved readings, memory verses, curriculum text, and queued XP stay on this device.'
        : detail}
    </div>
  )
}
