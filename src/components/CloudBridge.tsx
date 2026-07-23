'use client'

import { useAuth } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'
import { fetchCloudProgress, saveCloudProgress } from '../lib/cloud'
import type { UserState } from '../lib/types'

type Props = {
  state: UserState | null
  onCloudState: (state: UserState) => void
}

/** Syncs local progress to Neon when signed in with Clerk. */
export function CloudBridge({ state, onCloudState }: Props) {
  const { isSignedIn, isLoaded } = useAuth()
  const lastSaved = useRef('')
  const hydrated = useRef(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hydrated.current) return
    hydrated.current = true
    fetchCloudProgress()
      .then((cloud) => {
        if (cloud) onCloudState(cloud)
      })
      .catch(() => {
        /* local-only fallback */
      })
  }, [isLoaded, isSignedIn, onCloudState])

  useEffect(() => {
    if (!isSignedIn || !state) return
    const fingerprint = JSON.stringify({
      xp: state.xp,
      streak: state.streak,
      planId: state.planId,
      completedDays: state.completedDays,
      memory: state.memoryVerses.length,
      achievements: state.achievements.length,
    })
    if (fingerprint === lastSaved.current) return
    const timer = window.setTimeout(() => {
      saveCloudProgress(state)
        .then((ok) => {
          if (ok) lastSaved.current = fingerprint
        })
        .catch(() => {})
    }, 900)
    return () => window.clearTimeout(timer)
  }, [state, isSignedIn])

  return null
}
