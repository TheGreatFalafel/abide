import type { UserState, MemoryVerse } from './types'

function memoryKey(v: MemoryVerse): string {
  return v.id || `${v.bookId}:${v.chapter}:${v.verseStart}:${v.reference}`
}

function mergeMemories(a: MemoryVerse[], b: MemoryVerse[]): MemoryVerse[] {
  const map = new Map<string, MemoryVerse>()
  for (const v of [...a, ...b]) {
    const key = memoryKey(v)
    const prev = map.get(key)
    if (!prev) {
      map.set(key, v)
      continue
    }
    // Keep the more practiced / further along copy
    const score = (x: MemoryVerse) =>
      (x.status === 'memorized' ? 1000 : 0) + x.repetitions * 10 + x.intervalDays
    map.set(key, score(v) >= score(prev) ? { ...prev, ...v } : prev)
  }
  return [...map.values()]
}

function unionSorted(a: number[], b: number[]): number[] {
  return [...new Set([...a, ...b])].sort((x, y) => x - y)
}

/**
 * Merge local + cloud so signing in never wipes the richer progress.
 * Prefer higher XP/streak, union completed days & memory, keep non-empty keys/plans.
 */
export function mergeUserStates(local: UserState, cloud: UserState): UserState {
  const xp = Math.max(local.xp, cloud.xp)
  const streak = Math.max(local.streak, cloud.streak)
  const longestStreak = Math.max(local.longestStreak, cloud.longestStreak)

  // Prefer the plan that has more reading progress when both exist
  const localProgress = local.completedDays.length
  const cloudProgress = cloud.completedDays.length
  const planId =
    local.planId === cloud.planId
      ? local.planId
      : localProgress >= cloudProgress
        ? local.planId
        : cloud.planId

  const completedDays =
    local.planId === cloud.planId
      ? unionSorted(local.completedDays, cloud.completedDays)
      : planId === local.planId
        ? local.completedDays
        : cloud.completedDays

  const completedQuizzes =
    local.planId === cloud.planId
      ? [...new Set([...local.completedQuizzes, ...cloud.completedQuizzes])]
      : planId === local.planId
        ? local.completedQuizzes
        : cloud.completedQuizzes

  const customPlans = [...cloud.customPlans]
  for (const p of local.customPlans) {
    if (!customPlans.some((c) => c.id === p.id)) customPlans.push(p)
  }

  const lastReadDate = (() => {
    const a = local.lastReadDate
    const b = cloud.lastReadDate
    if (!a) return b
    if (!b) return a
    return a >= b ? a : b
  })()

  return {
    ...cloud,
    ...local,
    name: local.name?.trim() || cloud.name,
    planId,
    xp,
    streak,
    longestStreak,
    lastReadDate,
    streakFreezes: Math.max(local.streakFreezes, cloud.streakFreezes),
    achievements: [...new Set([...local.achievements, ...cloud.achievements])],
    completedDays,
    completedQuizzes,
    memoryVerses: mergeMemories(local.memoryVerses, cloud.memoryVerses),
    customPlans,
    esvApiKey: local.esvApiKey?.trim() || cloud.esvApiKey || '',
    translationId: local.esvApiKey?.trim()
      ? local.translationId
      : cloud.esvApiKey?.trim()
        ? cloud.translationId
        : local.translationId || cloud.translationId,
    dailyGoalXp: local.dailyGoalXp || cloud.dailyGoalXp,
    todayXp: Math.max(local.todayXp, cloud.todayXp),
    todayXpDate:
      local.todayXpDate >= cloud.todayXpDate ? local.todayXpDate : cloud.todayXpDate,
    createdAt:
      local.createdAt && cloud.createdAt
        ? local.createdAt <= cloud.createdAt
          ? local.createdAt
          : cloud.createdAt
        : local.createdAt || cloud.createdAt,
  }
}
