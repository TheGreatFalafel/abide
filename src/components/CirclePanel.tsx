'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { useCallback, useEffect, useState } from 'react'
import {
  circleAction,
  fetchCircle,
  type CirclePayload,
} from '../lib/cloud'
import { titleForXp, type UserState } from '../lib/types'
import { MemoryChallengePanel } from './MemoryChallengePanel'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
  onSyncedName?: (name: string) => void
}

export function CirclePanel({ user, onUserChange, onSyncedName }: Props) {
  const { isSignedIn, isLoaded } = useAuth()
  const { user: clerkUser } = useUser()
  const [data, setData] = useState<CirclePayload | null>(null)
  const [invite, setInvite] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const reload = useCallback(async () => {
    if (!isSignedIn) return
    try {
      const next = await fetchCircle()
      setData(next)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Could not load circle')
    }
  }, [isSignedIn])

  useEffect(() => {
    void reload()
  }, [reload])

  useEffect(() => {
    if (clerkUser?.firstName) onSyncedName?.(clerkUser.firstName)
  }, [clerkUser, onSyncedName])

  if (!isLoaded) return <p className="muted">Loading account…</p>

  if (!isSignedIn) {
    return (
      <div className="settings-block">
        <h3>Friend circle</h3>
        <p className="muted">
          Sign in to sync progress to the cloud and keep streaks with a few friends. Local reading
          still works without an account.
        </p>
        <div className="session-actions">
          <a className="btn primary" href="/sign-in">
            Sign in
          </a>
          <a className="btn ghost-outline" href="/sign-up">
            Create account
          </a>
        </div>
      </div>
    )
  }

  async function run(action: 'create' | 'join' | 'leave', extra: Record<string, string> = {}) {
    setBusy(true)
    setMsg(null)
    const result = await circleAction(action, extra)
    if (result.error) setMsg(result.error)
    else if (result.inviteCode) setMsg(`Circle created! Invite code: ${result.inviteCode}`)
    else setMsg('Done')
    await reload()
    setBusy(false)
  }

  async function nudge(toUserId: string) {
    setBusy(true)
    const result = await circleAction('nudge', {
      toUserId,
      message: 'Keep the streak going — praying for you!',
    })
    setMsg(result.error || 'Encouragement sent')
    await reload()
    setBusy(false)
  }

  return (
    <div className="circle">
      <div className="settings-block">
        <h3>Signed in</h3>
        <p className="muted">
          {clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.username || 'Account connected'}
        </p>
        <a className="btn tiny ghost-outline" href="/sign-in">
          Manage account
        </a>
      </div>

      <div className="settings-block">
        <h3>Friend circle</h3>
        <p className="muted">Small group (up to 8) — see streaks and send encouragement.</p>

        {!data?.circle && (
          <>
            <button className="btn primary" disabled={busy} onClick={() => void run('create')}>
              Create a circle
            </button>
            <label className="field-label">
              Or join with invite code
              <input
                className="field"
                value={invite}
                onChange={(e) => setInvite(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={8}
              />
            </label>
            <button
              className="btn ghost-outline"
              disabled={busy || invite.trim().length < 4}
              onClick={() => void run('join', { inviteCode: invite.trim() })}
            >
              Join circle
            </button>
          </>
        )}

        {data?.circle && (
          <>
            <p>
              <strong>{data.circle.name}</strong>
              <br />
              <span className="memory-meta">Invite code: {data.circle.inviteCode}</span>
            </p>

            <div className="league-card">
              <div className="league-head">
                <h3>Weekly league</h3>
                <span className="memory-meta">Resets each week · XP this week</span>
              </div>
              <ol className="challenge-board league-board">
                {[...data.members]
                  .sort((a, b) => (b.weekXp ?? 0) - (a.weekXp ?? 0) || (b.xp ?? 0) - (a.xp ?? 0))
                  .map((m, i) => (
                    <li key={m.userId} className={m.userId === clerkUser?.id ? 'me' : ''}>
                      <span className="rank">{i + 1}</span>
                      <span className="who">
                        {m.displayName || 'Friend'}
                        {i === 0 && (m.weekXp ?? 0) > 0 ? ' · leading' : ''}
                      </span>
                      <span className="pts">{m.weekXp ?? 0} XP</span>
                    </li>
                  ))}
              </ol>
              <p className="muted league-hint">
                Read, reflect, or quiz to climb. Your circle only — no strangers.
              </p>
            </div>

            <div className="memory-list">
              {data.members.map((m) => (
                <div key={m.userId} className="memory-card">
                  <div>
                    <strong>{m.displayName || 'Friend'}</strong>
                    <p className="memory-meta">
                      {titleForXp(m.xp ?? 0)} · {m.streak ?? 0} day streak · {m.xp ?? 0} XP
                      {m.lastReadDate ? ` · last ${m.lastReadDate}` : ''}
                    </p>
                  </div>
                  {m.userId !== clerkUser?.id && (
                    <button
                      className="btn tiny"
                      disabled={busy}
                      onClick={() => void nudge(m.userId)}
                    >
                      Encourage
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button className="btn ghost danger" disabled={busy} onClick={() => void run('leave')}>
              Leave circle
            </button>
          </>
        )}

        {!!data?.nudges?.length && (
          <div className="nudge-list">
            <h3>Encouragements</h3>
            {data.nudges.map((n) => (
              <p key={n.id} className="nudge good">
                {n.message}
              </p>
            ))}
          </div>
        )}

        {msg && <p className="nudge">{msg}</p>}
      </div>

      {data?.circle && (
        <MemoryChallengePanel
          user={user}
          onUserChange={onUserChange}
          myUserId={clerkUser?.id}
        />
      )}
    </div>
  )
}