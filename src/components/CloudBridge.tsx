'use client'

import { useAuth } from '@clerk/nextjs'
import { useEffect, useRef, useState } from 'react'
import { fetchCloudProgress, saveCloudProgress } from '../lib/cloud'
import { mergeUserStates } from '../lib/mergeState'
import { loadState, migrateUserState, saveState } from '../lib/progress'
import type { UserState } from '../lib/types'

type Props = {
  state: UserState | null
  onCloudState: (state: UserState) => void
}

function fingerprint(state: UserState): string {
  return JSON.stringify({
    xp: state.xp,
    streak: state.streak,
    longestStreak: state.longestStreak,
    planId: state.planId,
    completedDays: state.completedDays,
    completedQuizzes: state.completedQuizzes,
    memory: state.memoryVerses.map(
      (v) => `${v.id}:${v.repetitions}:${v.status}:${v.intervalDays}`,
    ),
    achievements: state.achievements,
    translationId: state.translationId,
    esvApiKey: state.esvApiKey,
    customPlans: state.customPlans.map((p) => `${p.id}:${p.days}:${p.pace}`),
    name: state.name,
    lastReadDate: state.lastReadDate,
    todayXp: state.todayXp,
    todayXpDate: state.todayXpDate,
  })
}

/** Syncs local progress to Neon when signed in with Clerk. */
export function CloudBridge({ state, onCloudState }: Props) {
  const { isSignedIn, isLoaded } = useAuth()
  const lastSaved = useRef('')
  const hydrated = useRef(false)
  const [syncNote, setSyncNote] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hydrated.current) return
    hydrated.current = true
    const local = loadState()
    fetchCloudProgress()
      .then((cloud) => {
        if (!cloud && !local) return
        if (!cloud && local) {
          void saveCloudProgress(local).then((ok) => {
            if (ok) lastSaved.current = fingerprint(local)
          })
          return
        }
        if (cloud && !local) {
          const next = migrateUserState(cloud)
          saveState(next)
          onCloudState(next)
          lastSaved.current = fingerprint(next)
          setSyncNote('Progress restored from your account')
          window.setTimeout(() => setSyncNote(null), 2500)
          return
        }
        if (cloud && local) {
          const merged = migrateUserState(mergeUserStates(local, cloud))
          saveState(merged)
          onCloudState(merged)
          void saveCloudProgress(merged).then((ok) => {
            if (ok) lastSaved.current = fingerprint(merged)
          })
          setSyncNote('Progress synced to your account')
          window.setTimeout(() => setSyncNote(null), 2500)
        }
      })
      .catch(() => {
        setSyncNote('Cloud sync unavailable — progress stays on this device')
        window.setTimeout(() => setSyncNote(null), 3500)
      })
  }, [isLoaded, isSignedIn, onCloudState])

  useEffect(() => {
    if (!isSignedIn || !state) return
    const fp = fingerprint(state)
    if (fp === lastSaved.current) return
    const timer = window.setTimeout(() => {
      saveCloudProgress(state)
        .then((ok) => {
          if (ok) lastSaved.current = fp
        })
        .catch(() => {})
    }, 500)
    return () => window.clearTimeout(timer)
  }, [state, isSignedIn])

  // Flush pending progress when leaving the tab
  useEffect(() => {
    if (!isSignedIn || !state) return
    const flush = () => {
      const fp = fingerprint(state)
      if (fp === lastSaved.current) return
      void saveCloudProgress(state).then((ok) => {
        if (ok) lastSaved.current = fp
      })
    }
    const onVis = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [state, isSignedIn])

  if (!syncNote) return null
  return <p className="sync-toast">{syncNote}</p>
}
