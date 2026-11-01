'use client'

import { useAuth } from '@clerk/nextjs'
import { useEffect, useRef, useState } from 'react'
import {
  fetchCloudProgress,
  saveCloudProgress,
  syncGemEvents,
  fetchActivityHistory,
  syncProgressEvents,
} from '../lib/cloud'
import { mergeUserStates } from '../lib/mergeState'
import { withLocalEsvKey } from '../lib/privacy'
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
    streakFreezes: state.streakFreezes,
    planId: state.planId,
    completedDays: state.completedDays,
    completedQuizzes: state.completedQuizzes,
    curriculum: {
      completedLessonIds: state.curriculum?.completedLessonIds ?? [],
      lastLessonId: state.curriculum?.lastLessonId ?? null,
      catalogVersion: state.curriculum?.catalogVersion ?? 0,
    },
    notifications: state.notifications,
    guidedTour: state.guidedTour,
    gems: state.gems,
    cosmetics: state.cosmetics,
    memory: state.memoryVerses.map(
      (v) =>
        `${v.id}:${v.repetitions}:${v.status}:${v.intervalDays}:${v.textVersion ?? 0}:${v.text}`,
    ),
    achievements: state.achievements,
    translationId: state.translationId,
    customPlans: state.customPlans.map(
      (p) => `${p.id}:${p.days}:${p.pace}:${p.versesPerDay ?? ''}`,
    ),
    name: state.name,
    lastReadDate: state.lastReadDate,
    todayXp: state.todayXp,
    todayXpDate: state.todayXpDate,
    weekXp: state.weekXp,
    weekKey: state.weekKey,
    dailyGoalXp: state.dailyGoalXp,
  })
}

function applyMerged(
  merged: UserState,
  localKey: string | undefined,
  onCloudState: (s: UserState) => void,
) {
  const next = migrateUserState(withLocalEsvKey(merged, localKey))
  saveState(next)
  onCloudState(next)
  return next
}

async function flushEvents(
  seedXp: number,
  seedGems: number,
  localKey: string | undefined,
  onCloudState: (s: UserState) => void,
) {
  const result = await syncProgressEvents(seedXp)
  if (result?.state) {
    applyMerged(result.state, localKey, onCloudState)
  } else if (result) {
    const local = loadState()
    if (local) {
      applyMerged(
        {
          ...local,
          xp: result.serverXp,
          streak: result.streak,
          longestStreak: Math.max(local.longestStreak, result.longestStreak),
          lastReadDate: result.lastReadDate ?? local.lastReadDate,
          streakFreezes:
            result.streakFreezes != null ? result.streakFreezes : local.streakFreezes,
        },
        localKey,
        onCloudState,
      )
    }
  }

  const gems = await syncGemEvents(seedGems)
  if (gems?.state) {
    applyMerged(gems.state, localKey, onCloudState)
  } else if (gems) {
    const local = loadState()
    if (local) {
      applyMerged(
        {
          ...local,
          gems: gems.serverGems,
          ...(gems.streakFreezes != null ? { streakFreezes: gems.streakFreezes } : {}),
        },
        localKey,
        onCloudState,
      )
    }
  }

  // Refresh private activity history for Insights (best-effort; never blocks XP sync)
  try {
    await fetchActivityHistory({ limit: 200 })
  } catch {
    /* offline / unsigned */
  }
}

/** Syncs local progress + event ledger to Neon when signed in with Clerk. */
export function CloudBridge({ state, onCloudState }: Props) {
  const { isSignedIn, isLoaded } = useAuth()
  const lastSaved = useRef('')
  const hydrated = useRef(false)
  const [syncNote, setSyncNote] = useState<string | null>(null)

  useEffect(() => {
    if (!isSignedIn) hydrated.current = false
  }, [isSignedIn])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hydrated.current) return
    hydrated.current = true
    const local = loadState()
    const localKey = local?.esvApiKey
    fetchCloudProgress()
      .then(async (cloud) => {
        if (!cloud && !local) return
        if (!cloud && local) {
          await flushEvents(local.xp, local.gems ?? 0, localKey, onCloudState)
          const saved = await saveCloudProgress(loadState() ?? local)
          if (saved) lastSaved.current = fingerprint(saved)
          return
        }
        if (cloud && !local) {
          const next = applyMerged(cloud, localKey, onCloudState)
          lastSaved.current = fingerprint(next)
          await flushEvents(next.xp, next.gems ?? 0, localKey, onCloudState)
          setSyncNote('Progress restored from your account')
          window.setTimeout(() => setSyncNote(null), 2500)
          return
        }
        if (cloud && local) {
          const merged = mergeUserStates(local, cloud)
          const next = applyMerged(merged, local.esvApiKey, onCloudState)
          await flushEvents(
            Math.max(local.xp, cloud.xp, next.xp),
            Math.max(local.gems ?? 0, cloud.gems ?? 0, next.gems ?? 0),
            local.esvApiKey,
            onCloudState,
          )
          const saved = await saveCloudProgress(loadState() ?? next)
          if (saved) lastSaved.current = fingerprint(saved)
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
      void flushEvents(state.xp, state.gems ?? 0, state.esvApiKey, onCloudState)
        .then(() => saveCloudProgress(loadState() ?? state))
        .then((saved) => {
          if (!saved) return
          lastSaved.current = fingerprint(saved)
        })
        .catch(() => {})
    }, 500)
    return () => window.clearTimeout(timer)
  }, [state, isSignedIn, onCloudState])

  useEffect(() => {
    if (!isSignedIn || !state) return
    const flush = () => {
      void flushEvents(state.xp, state.gems ?? 0, state.esvApiKey, onCloudState)
        .then(() => saveCloudProgress(loadState() ?? state))
        .then((saved) => {
          if (saved) lastSaved.current = fingerprint(saved)
        })
        .catch(() => {})
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
  }, [state, isSignedIn, onCloudState])

  if (!syncNote) return null
  return <p className="sync-toast">{syncNote}</p>
}
