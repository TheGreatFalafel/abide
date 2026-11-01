'use client'

import { useAuth } from '@clerk/nextjs'
import { useMemo, useState } from 'react'
import {
  COSMETIC_CATALOG,
  type CosmeticSlot,
  getCosmetic,
} from '../data/cosmetics/catalog'
import { purchaseStreakFreezeOnline } from '../lib/cloud'
import { isClerkConfigured } from '../lib/clerk'
import {
  migrateCosmeticsState,
  ownsCosmetic,
  slotLabel,
} from '../lib/cosmetics'
import {
  MAX_STREAK_FREEZES,
  STREAK_FREEZE_PRICE,
  buildStreakFreezePurchaseEvent,
  purchaseCosmetic,
  setEquippedCosmetic,
  streakFreezePurchaseBlockReason,
} from '../lib/gems'
import { mascotLineFor } from '../lib/mascot'
import { canPurchaseStreakFreeze } from '../lib/streak'
import type { UserState } from '../lib/types'
import { AbideAvatar } from './AbideAvatar'
import { AvatarCustomizer } from './AvatarCustomizer'
import { MascotBanner } from './MascotBanner'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
}

const SLOTS: CosmeticSlot[] = ['base', 'color', 'accessory', 'frame']
const HAS_CLERK = isClerkConfigured()

function ShopView({
  user,
  onUserChange,
  isSignedIn,
}: Props & { isSignedIn: boolean }) {
  const cosmetics = migrateCosmeticsState(user.cosmetics)
  const [filter, setFilter] = useState<CosmeticSlot | 'all'>('all')
  const [message, setMessage] = useState<string | null>(null)
  const [messageTone, setMessageTone] = useState<'good' | 'risk'>('good')
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [freezePending, setFreezePending] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)

  const items = useMemo(() => {
    const list =
      filter === 'all' ? COSMETIC_CATALOG : COSMETIC_CATALOG.filter((i) => i.slot === filter)
    return list
  }, [filter])

  const freezes = user.streakFreezes ?? 0
  const freezeFull = !canPurchaseStreakFreeze(freezes)
  const freezeBlock = streakFreezePurchaseBlockReason(user)
  const freezeAffordable = (user.gems ?? 0) >= STREAK_FREEZE_PRICE

  function buy(itemId: string) {
    const item = getCosmetic(itemId)
    if (!item) return
    if (ownsCosmetic(cosmetics, itemId)) {
      onUserChange(setEquippedCosmetic(user, itemId))
      setMessageTone('good')
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
      setMessageTone('risk')
      setMessage(result.error)
      return
    }
    const equipped = setEquippedCosmetic(result.state, itemId)
    onUserChange(equipped)
    setMessageTone('good')
    setMessage(
      result.spent > 0
        ? `Purchased ${item.name} (−${result.spent} gems).`
        : `Unlocked ${item.name}.`,
    )
  }

  async function buyFreeze() {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setMessageTone('risk')
      setMessage('Connect to the internet to buy a streak freeze. Freezes are not sold offline.')
      return
    }
    if (!HAS_CLERK || !isSignedIn) {
      setMessageTone('risk')
      setMessage('Sign in to buy streak freezes. Purchases are verified on your account.')
      return
    }
    if (freezeBlock) {
      setMessageTone('risk')
      setMessage(freezeBlock)
      return
    }
    if (!confirm(`Spend ${STREAK_FREEZE_PRICE} gems on one Streak Freeze?`)) return

    setFreezePending(true)
    setMessage(null)
    try {
      const event = buildStreakFreezePurchaseEvent()
      const result = await purchaseStreakFreezeOnline(user.gems ?? 0, event)
      if (!result.ok) {
        setMessageTone('risk')
        setMessage(result.error)
        return
      }
      if (result.state) {
        onUserChange({
          ...result.state,
          esvApiKey: user.esvApiKey,
        })
      } else {
        onUserChange({
          ...user,
          gems: result.serverGems,
          streakFreezes: result.streakFreezes,
        })
      }
      setMessageTone('good')
      setMessage(
        result.duplicate
          ? 'Streak freeze purchase already recorded.'
          : `Purchased 1 streak freeze (−${result.spent || STREAK_FREEZE_PRICE} gems). You have ${result.streakFreezes}/${MAX_STREAK_FREEZES}.`,
      )
    } catch {
      setMessageTone('risk')
      setMessage('Network error — no gems were spent. Try again when the connection is stable.')
    } finally {
      setFreezePending(false)
    }
  }

  return (
    <div className="shop">
      <header className="shop-head">
        <div>
          <h2>Shop</h2>
          <p className="muted">
            Cosmetics change your look only. Streak freezes are optional account purchases.
          </p>
        </div>
        <div className="shop-balance" aria-label={`${user.gems} gems`}>
          <span aria-hidden>💠</span>
          <strong>{user.gems ?? 0}</strong>
          <span className="muted">gems</span>
        </div>
      </header>

      <MascotBanner line={mascotLineFor('shop', user)} compact />

      <AvatarCustomizer user={user} onUserChange={onUserChange} />

      <section className="shop-freeze" aria-label="Streak freezes">
        <div className="shop-freeze-card">
          <div className="shop-swatch shop-freeze-swatch" aria-hidden>
            ❄
          </div>
          <div className="shop-card-body">
            <strong>Streak Freeze</strong>
            <span className="muted">
              Inventory {freezes}/{MAX_STREAK_FREEZES}
            </span>
            <p>
              If you miss a day, one freeze is used automatically to keep your streak. Freezes also
              still earn from steady reading (every 7 plan days, up to {MAX_STREAK_FREEZES}).
            </p>
            <div className="shop-card-meta">
              <span className={`pill ${freezeAffordable && !freezeFull ? '' : 'risk'}`}>
                {STREAK_FREEZE_PRICE} gems
              </span>
              <button
                type="button"
                className="btn tiny primary"
                disabled={
                  freezePending ||
                  freezeFull ||
                  !freezeAffordable ||
                  (HAS_CLERK && !isSignedIn)
                }
                onClick={() => void buyFreeze()}
              >
                {freezePending ? 'Buying…' : freezeFull ? 'Full' : 'Buy freeze'}
              </button>
            </div>
            {HAS_CLERK && !isSignedIn && (
              <p className="muted shop-freeze-hint">Sign in to purchase — verified on the server.</p>
            )}
          </div>
        </div>
      </section>

      <div className="shop-preview">
        <AbideAvatar
          user={user}
          size="lg"
          previewEquipped={
            previewId
              ? (() => {
                  const item = getCosmetic(previewId)
                  if (!item) return undefined
                  if (item.slot === 'accessory') return { accessory: previewId }
                  return { [item.slot]: previewId } as Partial<typeof cosmetics.equipped>
                })()
              : undefined
          }
        />
        <p className="muted">
          {previewId
            ? `Preview: ${getCosmetic(previewId)?.name ?? 'item'}`
            : 'Equipped look · tap a cosmetic to preview'}
        </p>
      </div>

      <h3 className="shop-section-title">Gem cosmetics</h3>
      <p className="muted shop-section-blurb">
        Outfits, backgrounds, accessories, and frames. Cosmetics never affect XP, streaks, or
        league standing.
      </p>

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

      {message && <p className={`nudge ${messageTone}`}>{message}</p>}

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
            <li
              key={item.id}
              className={`shop-card ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''} ${previewId === item.id ? 'previewing' : ''}`}
            >
              <button
                type="button"
                className="shop-swatch"
                style={{ background: item.color }}
                aria-label={`Preview ${item.name}`}
                onClick={() => setPreviewId(item.id)}
              >
                {item.mark}
              </button>
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
                    className="btn tiny ghost-outline"
                    onClick={() => setPreviewId(item.id)}
                  >
                    Preview
                  </button>
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

function ShopWithAuth(props: Props) {
  const { isSignedIn, isLoaded } = useAuth()
  if (!isLoaded) {
    return <ShopView {...props} isSignedIn={false} />
  }
  return <ShopView {...props} isSignedIn={Boolean(isSignedIn)} />
}

export function Shop(props: Props) {
  if (!HAS_CLERK) {
    return <ShopView {...props} isSignedIn={false} />
  }
  return <ShopWithAuth {...props} />
}
