'use client'

import { useEffect, useRef } from 'react'
import type { UserState } from '../lib/types'
import {
  buildDailyReminder,
  shouldShowReminderToday,
  showLocalReminder,
} from '../lib/notifications'

type Props = {
  user: UserState | null
}

/**
 * Registers the Abide service worker and optionally surfaces a once-per-day
 * local reminder when the user has already opted in via Settings.
 */
export function PwaRegister({ user }: Props) {
  const reminded = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
    // Avoid SW on Vite legacy port
    if (window.location.port === '5173') return

    let cancelled = false
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        if (cancelled) return
        reg.update().catch(() => {})
        // Prompt refresh when a new SW is waiting
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' })
        }
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing
          if (!sw) return
          sw.addEventListener('statechange', () => {
            if (sw.state === 'installed' && navigator.serviceWorker.controller) {
              // New version ready — activate on next load via skipWaiting message
              sw.postMessage?.({ type: 'SKIP_WAITING' })
            }
          })
        })
      })
      .catch(() => {
        /* registration can fail on insecure origins except localhost */
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!user || reminded.current) return
    if (!shouldShowReminderToday()) return
    const payload = buildDailyReminder(user)
    if (!payload) return
    reminded.current = true
    void showLocalReminder(payload)
  }, [user])

  return null
}
