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

function applyMerged(merged: UserState, onCloudState: (s: UserState) => void) {
  const next = migrateUserState(merged)
  saveState(next)
  onCloudState(next)
  return next
}

/** Syncs local progress to Neon when signed in with Clerk. */
export function CloudBridge({ state, onCloudState }: Props) {
  const { isSignedIn, isLoaded } = useAuth()
  const lastSaved = useRef('')
  const hydrated = useRef(false)
  const [syncNote, setSyncNote] = useState<string | null>(null)

  // Re-hydrate after sign-out (fresh sign-in should pull account ESV key again)
  useEffect(() => {
    if (!isSignedIn) hydrated.current = false
  }, [isSignedIn])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hydrated.current) return
    hydrated.current = true
    const local = loadState()
    fetchCloudProgress()
      .then((cloud) => {
        if (!cloud && !local) return
        if (!cloud && local) {
          void saveCloudProgress(local).then((saved) => {
            if (saved) lastSaved.current = fingerprint(saved)
          })
          return
        }
        if (cloud && !local) {
          const next = applyMerged(cloud, onCloudState)
          lastSaved.current = fingerprint(next)
          setSyncNote('Progress restored from your account')
          window.setTimeout(() => setSyncNote(null), 2500)
          return
        }
        if (cloud && local) {
          const merged = mergeUserStates(local, cloud)
          const next = applyMerged(merged, onCloudState)
          void saveCloudProgress(next).then((saved) => {
            if (!saved) return
            lastSaved.current = fingerprint(saved)
            // Server may have preserved an ESV key local was missing
            if (saved.esvApiKey?.trim() && saved.esvApiKey !== next.esvApiKey) {
              applyMerged(saved, onCloudState)
            }
          })
          const note = next.esvApiKey?.trim()
            ? 'Account synced — ESV key restored'
            : 'Progress synced to your account'
          setSyncNote(note)
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
        .then((saved) => {
          if (!saved) return
          lastSaved.current = fingerprint(saved)
          if (
            saved.esvApiKey?.trim() &&
            !state.esvApiKey?.trim() &&
            saved.esvApiKey !== state.esvApiKey
          ) {
            applyMerged(saved, onCloudState)
          }
        })
        .catch(() => {})
    }, 500)
    return () => window.clearTimeout(timer)
  }, [state, isSignedIn, onCloudState])

  // Flush pending progress when leaving the tab
  useEffect(() => {
    if (!isSignedIn || !state) return
    const flush = () => {
      const fp = fingerprint(state)
      if (fp === lastSaved.current) return
      void saveCloudProgress(state).then((saved) => {
        if (saved) lastSaved.current = fingerprint(saved)
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
