'use client'

import { isClerkConfigured } from '../lib/clerk'
import { mascotLineFor } from '../lib/mascot'
import type { UserState } from '../lib/types'
import { CirclePanel } from './CirclePanel'
import { MascotBanner } from './MascotBanner'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
}

export function CircleGate({ user, onUserChange }: Props) {
  const ari = <MascotBanner line={mascotLineFor('circle', user)} compact />
  if (!isClerkConfigured()) {
    return (
      <div className="settings-block">
        {ari}
        <h3>Friend circle</h3>
        <p className="muted">
          Cloud accounts aren't configured yet. Add Clerk + Neon keys (see README Phase 2), then
          redeploy. Until then, everything still works on this device.
        </p>
      </div>
    )
  }
  return (
    <>
      {ari}
      <CirclePanel user={user} onUserChange={onUserChange} />
    </>
  )
}