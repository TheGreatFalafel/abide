import { mergeCurriculumProgress, migrateCurriculumProgress } from '../data/curriculum/access'
import { mergeLanguageProgress, migrateLanguageProgress } from '../data/languages/access'
import { mergeCosmeticsState, migrateCosmeticsState } from './cosmetics'
import { migrateNotificationPrefs } from './notifications'
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
      (x.status === 'memorized' ? 1000 : 0) +
      (x.fsrs?.reps ?? x.repetitions) * 10 +
      (x.fsrs?.stability ?? x.intervalDays)
    const progressed = score(v) >= score(prev) ? { ...prev, ...v } : prev
    const newerText =
      (v.textVersion ?? 0) > (prev.textVersion ?? 0)
        ? v
        : (prev.textVersion ?? 0) > (v.textVersion ?? 0)
          ? prev
          : progressed
    map.set(key, {
      ...progressed,
      text: newerText.text,
      reference: newerText.reference,
      translationId: newerText.translationId,
      textVersion: newerText.textVersion,
    })
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

  // ESV keys are device-local only — never adopt a key from cloud state_json
  const esvApiKey = local.esvApiKey?.trim() || ''
  const translationId = local.translationId || cloud.translationId

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
    curriculum: mergeCurriculumProgress(
      migrateCurriculumProgress(local.curriculum),
      migrateCurriculumProgress(cloud.curriculum),
    ),
    languages: mergeLanguageProgress(
      migrateLanguageProgress(local.languages),
      migrateLanguageProgress(cloud.languages),
    ),
    // Prefer local notification prefs (device permission is local)
    notifications: migrateNotificationPrefs(
      local.notifications?.permissionAsked || local.notifications?.enabled
        ? local.notifications
        : cloud.notifications ?? local.notifications,
    ),
    // Gems: take max until server ledger reconciles (never prefer a lower cloud wipe)
    gems: Math.max(local.gems ?? 0, cloud.gems ?? 0),
    gemsEarnedTotal: Math.max(local.gemsEarnedTotal ?? 0, cloud.gemsEarnedTotal ?? 0),
    todayGems:
      local.todayGemsDate === cloud.todayGemsDate
        ? Math.max(local.todayGems ?? 0, cloud.todayGems ?? 0)
        : (local.todayGemsDate ?? '') >= (cloud.todayGemsDate ?? '')
          ? local.todayGems ?? 0
          : cloud.todayGems ?? 0,
    todayGemsDate:
      (local.todayGemsDate ?? '') >= (cloud.todayGemsDate ?? '')
        ? local.todayGemsDate
        : cloud.todayGemsDate,
    memoryQuestsCompleted: Math.max(
      local.memoryQuestsCompleted ?? 0,
      cloud.memoryQuestsCompleted ?? 0,
    ),
    cosmetics: mergeCosmeticsState(
      migrateCosmeticsState(local.cosmetics),
      migrateCosmeticsState(cloud.cosmetics),
    ),
    gameStats: {
      completedGameIds: [
        ...new Set([
          ...(local.gameStats?.completedGameIds ?? []),
          ...(cloud.gameStats?.completedGameIds ?? []),
        ]),
      ],
      gamesPlayed: Math.max(local.gameStats?.gamesPlayed ?? 0, cloud.gameStats?.gamesPlayed ?? 0),
      perfectGames: Math.max(
        local.gameStats?.perfectGames ?? 0,
        cloud.gameStats?.perfectGames ?? 0,
      ),
      lastRewardDateByGame: {
        ...(cloud.gameStats?.lastRewardDateByGame ?? {}),
        ...(local.gameStats?.lastRewardDateByGame ?? {}),
      },
    },
    esvApiKey,
    translationId,
    dailyGoalXp: local.dailyGoalXp || cloud.dailyGoalXp,
    todayXp: Math.max(local.todayXp, cloud.todayXp),
    todayXpDate:
      local.todayXpDate >= cloud.todayXpDate ? local.todayXpDate : cloud.todayXpDate,
    weekXp:
      local.weekKey === cloud.weekKey
        ? Math.max(local.weekXp ?? 0, cloud.weekXp ?? 0)
        : (local.weekKey ?? '') >= (cloud.weekKey ?? '')
          ? local.weekXp ?? 0
          : cloud.weekXp ?? 0,
    weekKey:
      (local.weekKey ?? '') >= (cloud.weekKey ?? '') ? local.weekKey : cloud.weekKey,
    createdAt:
      local.createdAt && cloud.createdAt
        ? local.createdAt <= cloud.createdAt
          ? local.createdAt
          : cloud.createdAt
        : local.createdAt || cloud.createdAt,
  }
}
