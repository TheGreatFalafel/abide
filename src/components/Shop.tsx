'use client'

import { useMemo, useState } from 'react'
import {
  COSMETIC_CATALOG,
  type CosmeticSlot,
  getCosmetic,
} from '../data/cosmetics/catalog'
import {
  migrateCosmeticsState,
  ownsCosmetic,
  slotLabel,
} from '../lib/cosmetics'
import { purchaseCosmetic, setEquippedCosmetic } from '../lib/gems'
import { mascotLineFor } from '../lib/mascot'
import type { UserState } from '../lib/types'
import { AbideAvatar } from './AbideAvatar'
import { MascotBanner } from './MascotBanner'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
}

const SLOTS: CosmeticSlot[] = ['base', 'color', 'accessory', 'frame']

export function Shop({ user, onUserChange }: Props) {
  const cosmetics = migrateCosmeticsState(user.cosmetics)
  const [filter, setFilter] = useState<CosmeticSlot | 'all'>('all')
  const [message, setMessage] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const items = useMemo(() => {
    const list =
      filter === 'all' ? COSMETIC_CATALOG : COSMETIC_CATALOG.filter((i) => i.slot === filter)
    return list
  }, [filter])

  function buy(itemId: string) {
    const item = getCosmetic(itemId)
    if (!item) return
    if (ownsCosmetic(cosmetics, itemId)) {
      onUserChange(setEquippedCosmetic(user, itemId))
      setMessage(`Equipped ${item.name}.`)
      return
    }
    if (item.price > 0 && !confirm(`Spend ${item.price} gems on “${item.name}”?`)) {
      return
    }
    setPendingId(itemId)
    const result = purchaseCosmetic(user, itemId)
    setPendingId(null)
    if (!result.ok) {
      setMessage(result.error)
      return
    }
    const equipped = setEquippedCosmetic(result.state, itemId)
    onUserChange(equipped)
    setMessage(
      result.spent > 0
        ? `Purchased ${item.name} (−${result.spent} gems).`
        : `Unlocked ${item.name}.`,
    )
  }

  return (
    <div className="shop">
      <header className="shop-head">
        <div>
          <h2>Shop</h2>
          <p className="muted">Cosmetic rewards only — no gameplay advantages.</p>
        </div>
        <div className="shop-balance" aria-label={`${user.gems} gems`}>
          <span aria-hidden>💠</span>
          <strong>{user.gems ?? 0}</strong>
          <span className="muted">gems</span>
        </div>
      </header>

      <MascotBanner line={mascotLineFor('shop', user)} compact />

      <div className="shop-preview">
        <AbideAvatar user={user} size="lg" />
        <p className="muted">Your equipped look</p>
      </div>

      <div className="shop-filters" role="tablist" aria-label="Cosmetic type">
        <button
          type="button"
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {SLOTS.map((slot) => (
          <button
            key={slot}
            type="button"
            className={filter === slot ? 'active' : ''}
            onClick={() => setFilter(slot)}
          >
            {slotLabel(slot)}
          </button>
        ))}
      </div>

      {message && <p className="nudge good">{message}</p>}

      {(user.gems ?? 0) <= 0 && (
        <p className="nudge">
          Earn gems by completing readings, memory reviews, curriculum lessons, and daily goals —
          not by replaying the same day forever.
        </p>
      )}

      <ul className="shop-grid">
        {items.map((item) => {
          const owned = ownsCosmetic(cosmetics, item.id)
          const equipped =
            cosmetics.equipped.base === item.id ||
            cosmetics.equipped.color === item.id ||
            cosmetics.equipped.frame === item.id ||
            cosmetics.equipped.accessory === item.id
          const canAfford = (user.gems ?? 0) >= item.price
          return (
            <li key={item.id} className={`shop-card ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}`}>
              <div
                className="shop-swatch"
                style={{ background: item.color }}
                aria-hidden
              >
                {item.mark}
              </div>
              <div className="shop-card-body">
                <strong>{item.name}</strong>
                <span className="muted">{slotLabel(item.slot)}</span>
                <p>{item.description}</p>
                <div className="shop-card-meta">
                  {owned ? (
                    <span className="pill">{equipped ? 'Equipped' : 'Owned'}</span>
                  ) : item.price === 0 ? (
                    <span className="pill">Free</span>
                  ) : (
                    <span className={`pill ${canAfford ? '' : 'risk'}`}>{item.price} gems</span>
                  )}
                  <button
                    type="button"
                    className="btn tiny primary"
                    disabled={pendingId === item.id || (!owned && !canAfford && item.price > 0)}
                    onClick={() => buy(item.id)}
                  >
                    {owned ? (equipped ? 'Equipped' : 'Equip') : item.price === 0 ? 'Claim' : 'Buy'}
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
