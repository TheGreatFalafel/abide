import { describe, expect, it } from 'vitest'
import { avatarPixelSize } from './avatarSizes'
import {
  DEFAULT_APPEARANCE,
  migrateAppearance,
  patchAppearance,
} from '../data/cosmetics/appearance'
import { COSMETIC_CATALOG, getCosmetic, starterCosmeticIds } from '../data/cosmetics/catalog'
import {
  emptyCosmeticsState,
  migrateCosmeticsState,
  ownsCosmetic,
  setAppearance,
  toPublicAvatar,
} from './cosmetics'
import {
  shopPurchaseActivityKey,
  validateGemEvent,
  validateGemEventBatch,
} from './gemEvents'
import { publicAvatarFromStateJson } from './publicAvatar'
import { purchaseCosmetic, setEquippedCosmetic } from './gems'
import { createInitialState } from './types'

const NOW = new Date('2026-06-15T12:00:00.000Z')

function shopEvent(id: string, itemId: string, activityKey?: string) {
  return {
    id,
    type: 'shop_purchase' as const,
    clientCreatedAt: NOW.toISOString(),
    payload: {
      itemId,
      ...(activityKey ? { activityKey } : {}),
    },
  }
}

/** Mirrors commitGemEvents shop_purchase ownership + balance rules. */
function simulateShopPurchases(
  starting: { balance: number; owned: string[] },
  itemIds: string[],
  opts?: { alreadySeenKeys?: Set<string> },
) {
  const seen = opts?.alreadySeenKeys ?? new Set<string>()
  let balance = starting.balance
  const owned = [...starting.owned]
  const inserted: string[] = []
  const duplicates: string[] = []
  const rejected: string[] = []

  for (const itemId of itemIds) {
    const key = shopPurchaseActivityKey(itemId)
    if (seen.has(key)) {
      duplicates.push(itemId)
      continue
    }
    const item = getCosmetic(itemId)
    if (!item || item.price <= 0) {
      rejected.push('Unknown shop item')
      continue
    }
    if (owned.includes(itemId)) {
      rejected.push('Already owns this item')
      continue
    }
    if (balance < item.price) {
      rejected.push('Insufficient gems')
      continue
    }
    seen.add(key)
    balance -= item.price
    owned.push(itemId)
    inserted.push(itemId)
  }

  return { balance, owned, inserted, duplicates, rejected }
}

describe('free appearance', () => {
  it('migrates missing or invalid appearance to defaults', () => {
    expect(migrateAppearance(undefined)).toEqual(DEFAULT_APPEARANCE)
    expect(migrateAppearance({ skin: 'not-real' as 'fair', hair: 'wavy' }).skin).toBe(
      DEFAULT_APPEARANCE.skin,
    )
    expect(patchAppearance(DEFAULT_APPEARANCE, { hair: 'bun' }).hair).toBe('bun')
  })

  it('stores appearance on cosmetics without affecting gems or owned catalog', () => {
    const base = emptyCosmeticsState()
    const next = setAppearance(base, { skin: 'deep', clothes: 'hoodie' })
    expect(next.appearance.skin).toBe('deep')
    expect(next.appearance.clothes).toBe('hoodie')
    expect(next.ownedIds).toEqual(base.ownedIds)
    expect(next.equipped).toEqual(base.equipped)
  })
})

describe('cosmetic catalog expansion', () => {
  it('keeps starters free and prices non-negative', () => {
    const starters = starterCosmeticIds()
    expect(starters).toContain('base-seeker')
    expect(starters).toContain('color-deep')
    expect(starters).toContain('frame-simple')
    for (const item of COSMETIC_CATALOG) {
      expect(item.price).toBeGreaterThanOrEqual(0)
      expect(getCosmetic(item.id)?.id).toBe(item.id)
    }
    expect(COSMETIC_CATALOG.some((c) => c.id === 'acc-glasses')).toBe(true)
    expect(COSMETIC_CATALOG.some((c) => c.id === 'base-pilgrim')).toBe(true)
    expect(COSMETIC_CATALOG.some((c) => c.id === 'color-sky')).toBe(true)
  })

  it('purchase remains idempotent and equip requires ownership', () => {
    let state = { ...createInitialState('A', 'year'), gems: 200 }
    const buy = purchaseCosmetic(state, 'acc-glasses')
    expect(buy.ok).toBe(true)
    if (!buy.ok) return
    state = buy.state
    const again = purchaseCosmetic(state, 'acc-glasses')
    expect(again.ok).toBe(false)
    const equipped = setEquippedCosmetic(state, 'acc-glasses')
    expect(equipped.cosmetics.equipped.accessory).toBe('acc-glasses')
    const blocked = setEquippedCosmetic(state, 'frame-gold')
    expect(blocked.cosmetics.equipped.frame).not.toBe('frame-gold')
  })
})

describe('public avatar privacy', () => {
  it('strips owned inventory from public snapshots', () => {
    const migrated = migrateCosmeticsState({
      ownedIds: [
        'base-seeker',
        'color-deep',
        'frame-simple',
        'acc-lamp',
        'base-scribe',
        'color-dawn',
      ],
      equipped: {
        base: 'base-scribe',
        color: 'color-dawn',
        accessory: 'acc-lamp',
        frame: 'frame-simple',
      },
      appearance: {
        skin: 'tan',
        hair: 'short',
        hairColor: 'black',
        face: 'bright',
        clothes: 'collar',
      },
    })
    const pub = toPublicAvatar(migrated)
    expect(pub.appearance.skin).toBe('tan')
    expect(pub.equipped.base).toBe('base-scribe')
    expect(pub.equipped.color).toBe('color-dawn')
    expect('ownedIds' in pub).toBe(false)

    const fromJson = publicAvatarFromStateJson({
      gems: 999,
      esvApiKey: 'secret',
      cosmetics: migrated,
    })
    expect(fromJson.appearance.face).toBe('bright')
    expect(JSON.stringify(fromJson)).not.toMatch(/secret|999|ownedIds/)
  })

  it('clears unequipped cosmetics the user does not own', () => {
    const migrated = migrateCosmeticsState({
      ownedIds: ['base-seeker', 'color-deep', 'frame-simple'],
      equipped: {
        base: 'base-scribe',
        color: 'color-dawn',
        accessory: 'acc-lamp',
        frame: 'frame-gold',
      },
    })
    expect(migrated.equipped.base).toBe('base-seeker')
    expect(migrated.equipped.color).toBe('color-deep')
    expect(migrated.equipped.accessory).toBeNull()
    expect(migrated.equipped.frame).toBe('frame-simple')
  })

  it('falls back gracefully for legacy / missing avatar data', () => {
    const legacy = migrateCosmeticsState({
      ownedIds: ['base-seeker', 'color-deep', 'frame-simple'],
      equipped: {
        base: 'base-seeker',
        color: 'color-deep',
        accessory: null,
        frame: 'frame-simple',
      },
    })
    expect(legacy.appearance).toEqual(DEFAULT_APPEARANCE)
    expect(publicAvatarFromStateJson(null).equipped.base).toBe('base-seeker')
    expect(publicAvatarFromStateJson({}).appearance.hair).toBe(DEFAULT_APPEARANCE.hair)
  })
})

describe('avatar rendering sizes', () => {
  it('exposes stable pixel sizes for sm/md/lg layouts', () => {
    expect(avatarPixelSize('sm')).toBe(40)
    expect(avatarPixelSize('md')).toBe(64)
    expect(avatarPixelSize('lg')).toBe(112)
  })
})

describe('server shop purchase safeguards', () => {
  it('forces shop activity keys from itemId (ignores spoofed client keys)', () => {
    const id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
    const spoofed = validateGemEvent(
      shopEvent(id, 'base-scribe', 'shop:base-scribe:replay'),
      NOW,
    )
    expect(spoofed.ok).toBe(true)
    if (spoofed.ok) {
      expect(spoofed.event.activityKey).toBe(shopPurchaseActivityKey('base-scribe'))
      expect(spoofed.event.deltaGems).toBe(-40)
    }
  })

  it('rejects duplicate shop activity in one batch', () => {
    const a = shopEvent('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'base-scribe')
    const b = shopEvent('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'base-scribe')
    const { accepted, rejected } = validateGemEventBatch([a, b], NOW)
    expect(accepted).toHaveLength(1)
    expect(rejected.some((r) => r.error.includes('Duplicate activity'))).toBe(true)
  })

  it('simulates concurrent purchases: one wins, others reject on ownership/balance', () => {
    const starters = starterCosmeticIds()
    const first = simulateShopPurchases(
      { balance: 100, owned: starters },
      ['base-scribe', 'base-scribe', 'color-dawn'],
    )
    // Duplicate base-scribe collapses via activity key; color-dawn still fits (100-40-25).
    expect(first.inserted).toEqual(['base-scribe', 'color-dawn'])
    expect(first.duplicates).toEqual(['base-scribe'])
    expect(first.balance).toBe(35)
    expect(first.owned).toContain('base-scribe')
    expect(first.owned).toContain('color-dawn')

    const concurrent = simulateShopPurchases(
      { balance: 40, owned: starters },
      ['base-scribe', 'base-watchman'],
    )
    expect(concurrent.inserted).toEqual(['base-scribe'])
    expect(concurrent.rejected).toContain('Insufficient gems')
    expect(concurrent.balance).toBe(0)

    const already = simulateShopPurchases(
      { balance: 200, owned: [...starters, 'base-scribe'] },
      ['base-scribe'],
    )
    expect(already.inserted).toEqual([])
    expect(already.rejected).toContain('Already owns this item')
  })

  it('client purchase + equip still leave XP/streak untouched', () => {
    let state = { ...createInitialState('A', 'year'), gems: 100, xp: 42, streak: 5 }
    const buy = purchaseCosmetic(state, 'acc-hat')
    expect(buy.ok).toBe(true)
    if (!buy.ok) return
    state = buy.state
    expect(state.xp).toBe(42)
    expect(state.streak).toBe(5)
    expect(ownsCosmetic(migrateCosmeticsState(state.cosmetics), 'acc-hat')).toBe(true)
  })
})
