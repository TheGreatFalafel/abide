import { getCosmetic } from '../data/cosmetics/catalog'
import { equipCosmetic, grantCosmetic, migrateCosmeticsState, ownsCosmetic } from './cosmetics'
import { enqueueGemEvent } from './gemQueue'
import {
  GEM_DAILY_EARN_CAP,
  GEM_REWARDS,
  computeGemDelta,
  newGemEventId,
  type GemEventInput,
  type GemEventType,
} from './gemEvents'
import {
  MAX_STREAK_FREEZES,
  STREAK_FREEZE_PRICE,
  STREAK_FREEZE_SHOP_ID,
  canPurchaseStreakFreeze,
  streakFreezeActivityKey,
} from './streak'
import type { AchievementId, UserState } from './types'
import { todayKey } from './types'

function queueGem(
  type: GemEventType,
  payload: Record<string, unknown>,
): void {
  try {
    enqueueGemEvent({
      id: newGemEventId(),
      type,
      payload,
      clientCreatedAt: new Date().toISOString(),
    })
  } catch {
    /* private mode / tests */
  }
}

function normalizeGemDay(state: UserState): UserState {
  const today = todayKey()
  if (state.todayGemsDate === today) return state
  return { ...state, todayGems: 0, todayGemsDate: today }
}

/**
 * Award gems locally (optimistic) and enqueue a ledger event.
 * Respects daily earn cap and zero-delta rules from computeGemDelta.
 */
export function awardGems(
  state: UserState,
  type: Exclude<GemEventType, 'shop_purchase' | 'shop_streak_freeze' | 'legacy_gem_import'>,
  activityKey: string,
  payload: Record<string, unknown> = {},
): { state: UserState; awarded: number } {
  let next = normalizeGemDay(state)
  const fullPayload = { ...payload, activityKey }
  let amount = computeGemDelta(type, fullPayload)
  if (amount <= 0) return { state: next, awarded: 0 }

  const room = Math.max(0, GEM_DAILY_EARN_CAP - next.todayGems)
  amount = Math.min(amount, room)
  if (amount <= 0) return { state: next, awarded: 0 }

  queueGem(type, fullPayload)
  next = {
    ...next,
    gems: next.gems + amount,
    todayGems: next.todayGems + amount,
    gemsEarnedTotal: (next.gemsEarnedTotal ?? 0) + amount,
  }
  return { state: next, awarded: amount }
}

export function awardAchievementGems(
  state: UserState,
  achievementIds: AchievementId[],
): UserState {
  let next = state
  for (const achievementId of achievementIds) {
    const result = awardGems(next, 'gem_achievement', `ach:${achievementId}`, {
      achievementId,
    })
    next = result.state
  }
  return next
}

export type PurchaseResult =
  | { ok: true; state: UserState; spent: number }
  | { ok: false; error: string; state: UserState }

/** Spend gems on a cosmetic. Idempotent if already owned. */
export function purchaseCosmetic(state: UserState, itemId: string): PurchaseResult {
  const item = getCosmetic(itemId)
  if (!item) return { ok: false, error: 'Item not found.', state }
  const cosmetics = migrateCosmeticsState(state.cosmetics)
  if (ownsCosmetic(cosmetics, itemId)) {
    return { ok: false, error: 'You already own this item.', state }
  }
  if (item.price <= 0) {
    const granted = grantCosmetic(cosmetics, itemId)
    return {
      ok: true,
      spent: 0,
      state: { ...state, cosmetics: granted },
    }
  }
  if (state.gems < item.price) {
    return {
      ok: false,
      error: `Need ${item.price} gems (you have ${state.gems}).`,
      state,
    }
  }

  queueGem('shop_purchase', {
    itemId,
    activityKey: `shop:${itemId}`,
  })

  const nextCosmetics = grantCosmetic(cosmetics, itemId)
  return {
    ok: true,
    spent: item.price,
    state: {
      ...state,
      gems: state.gems - item.price,
      cosmetics: nextCosmetics,
    },
  }
}

export function setEquippedCosmetic(state: UserState, itemId: string): UserState {
  return {
    ...state,
    cosmetics: equipCosmetic(migrateCosmeticsState(state.cosmetics), itemId),
  }
}

/**
 * Local eligibility only — never grants freezes or spends gems offline.
 * Server ledger is authoritative for streak-freeze purchases.
 */
export function streakFreezePurchaseBlockReason(state: UserState): string | null {
  if (!canPurchaseStreakFreeze(state.streakFreezes)) {
    return `You already have ${MAX_STREAK_FREEZES} streak freezes (maximum).`
  }
  if (state.gems < STREAK_FREEZE_PRICE) {
    return `Need ${STREAK_FREEZE_PRICE} gems (you have ${state.gems}).`
  }
  return null
}

/** Build a one-shot ledger event for an online streak-freeze purchase (not queued offline). */
export function buildStreakFreezePurchaseEvent(now = new Date()): GemEventInput {
  const id = newGemEventId()
  return {
    id,
    type: 'shop_streak_freeze',
    clientCreatedAt: now.toISOString(),
    payload: {
      itemId: STREAK_FREEZE_SHOP_ID,
      purchaseId: id,
      activityKey: streakFreezeActivityKey(id),
    },
  }
}

export {
  GEM_REWARDS,
  GEM_DAILY_EARN_CAP,
  STREAK_FREEZE_PRICE,
  STREAK_FREEZE_SHOP_ID,
  MAX_STREAK_FREEZES,
}
