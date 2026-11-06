import { mergeCurriculumProgress, migrateCurriculumProgress } from '../data/curriculum/access'
import { mergeLanguageProgress, migrateLanguageProgress } from '../data/languages/access'
import { mergeCosmeticsState, migrateCosmeticsState } from './cosmetics'
import {
  collapseMemoryBankByScripture,
  reconcileMemoryPair,
  scriptureMemoryKey,
} from './memoryTranslation'
import { mergeGuidedTour, migrateGuidedTour } from './ariTour'
import { migrateNotificationPrefs } from './notifications'
import { mergeStreakFields } from './streak'
import type { UserState, MemoryVerse } from './types'
import type { TranslationId } from '../data/translations'

/**
 * Merge memory banks by scripture reference (not raw id) so older cloud cards
 * in an obsolete translation cannot resurrect as duplicates after a local migrate.
 */
function mergeMemories(
  a: MemoryVerse[],
  b: MemoryVerse[],
  preferredTranslation?: TranslationId,
): MemoryVerse[] {
  const map = new Map<string, MemoryVerse>()
  for (const v of [...a, ...b]) {
    const key = scriptureMemoryKey(v)
    const prev = map.get(key)
    if (!prev) {
      map.set(key, v)
      continue
    }
    const progressed = reconcileMemoryPair(prev, v)
    const preferred =
      preferredTranslation &&
      [prev, v].find((x) => x.translationId === preferredTranslation)
    const newerText =
      preferred ??
      ((v.textVersion ?? 0) > (prev.textVersion ?? 0)
        ? v
        : (prev.textVersion ?? 0) > (v.textVersion ?? 0)
          ? prev
          : progressed)
    map.set(key, {
      ...progressed,
      text: newerText.text,
      reference: newerText.reference,
      translationId: newerText.translationId,
      textVersion: newerText.textVersion,
      translationStale:
        preferredTranslation != null && newerText.translationId !== preferredTranslation
          ? true
          : newerText.translationStale,
    })
  }
  return collapseMemoryBankByScripture([...map.values()], preferredTranslation)
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
  const streaked = mergeStreakFields(
    {
      streak: local.streak,
      longestStreak: local.longestStreak,
      lastReadDate: local.lastReadDate,
      streakFreezes: local.streakFreezes,
    },
    {
      streak: cloud.streak,
      longestStreak: cloud.longestStreak,
      lastReadDate: cloud.lastReadDate,
      streakFreezes: cloud.streakFreezes,
    },
  )

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

  // ESV keys are device-local only — never adopt a key from cloud state_json
  const esvApiKey = local.esvApiKey?.trim() || ''
  const translationId = local.translationId || cloud.translationId

  return {
    ...cloud,
    ...local,
    name: local.name?.trim() || cloud.name,
    planId,
    xp,
    streak: streaked.streak,
    longestStreak: streaked.longestStreak,
    lastReadDate: streaked.lastReadDate,
    streakFreezes: streaked.streakFreezes,
    achievements: [...new Set([...local.achievements, ...cloud.achievements])],
    completedDays,
    completedQuizzes,
    memoryVerses: mergeMemories(local.memoryVerses, cloud.memoryVerses, translationId),
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
    // Tour: completed if either side finished — never reopen after sync
    guidedTour: mergeGuidedTour(
      migrateGuidedTour(local.guidedTour, {
        hasProgress:
          local.xp > 0 ||
          local.completedDays.length > 0 ||
          Boolean(local.lastReadDate) ||
          local.memoryVerses.length > 0,
      }),
      migrateGuidedTour(cloud.guidedTour, {
        hasProgress:
          cloud.xp > 0 ||
          cloud.completedDays.length > 0 ||
          Boolean(cloud.lastReadDate) ||
          cloud.memoryVerses.length > 0,
      }),
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
    // Device preference — prefer local Learn difficulty setting
    learnDifficulty: local.learnDifficulty || cloud.learnDifficulty || 'beginner',
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
