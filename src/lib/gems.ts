import { getCosmetic } from '../data/cosmetics/catalog'
import { equipCosmetic, grantCosmetic, migrateCosmeticsState, ownsCosmetic } from './cosmetics'
import { enqueueGemEvent } from './gemQueue'
import {
  GEM_DAILY_EARN_CAP,
  GEM_REWARDS,
  computeGemDelta,
  newGemEventId,
  type GemEventType,
} from './gemEvents'
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
  type: Exclude<GemEventType, 'shop_purchase' | 'legacy_gem_import'>, // includes gem_bible_game
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

export { GEM_REWARDS, GEM_DAILY_EARN_CAP }
