'use client'

import { CirclePanel } from './CirclePanel'
import type { UserState } from '../lib/types'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
}

export function CircleGate({ user, onUserChange }: Props) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
  if (!hasClerk) {
    return (
      <div className="settings-block">
        <h3>Friend circle</h3>
        <p className="muted">
          Cloud accounts aren't configured yet. Add Clerk + Neon keys (see README Phase 2), then
          redeploy. Until then, everything still works on this device.
        </p>
      </div>
    )
  }
  return <CirclePanel user={user} onUserChange={onUserChange} />
}