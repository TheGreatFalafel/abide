'use client'

import { useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { TRANSLATIONS, type TranslationId } from '../data/translations'
import { PLANS } from '../data/bible'
import { updateSettings } from '../lib/progress'
import { saveCloudProgress } from '../lib/cloud'
import type { CustomPlan, UserState } from '../lib/types'
import { DAILY_GOAL_OPTIONS } from '../lib/types'
import { EsvAttribution } from './EsvAttribution'
import { CustomPlanBuilder } from './CustomPlanBuilder'
import { testEsvConnection } from '../lib/bibleApi'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
  onReset: () => void
}

type SectionId = 'bible' | 'plan' | 'about'

const HAS_CLERK = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

export function Settings({ user, onUserChange, onReset }: Props) {
  const { isSignedIn } = useAuth()
  const customPlans = user.customPlans ?? []
  const esvKey = user.esvApiKey ?? ''
  const [keyDraft, setKeyDraft] = useState(esvKey)
  const [saved, setSaved] = useState(false)
  const [savingAccount, setSavingAccount] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testMsg, setTestMsg] = useState<string | null>(null)
  const [testOk, setTestOk] = useState<boolean | null>(null)
  const [open, setOpen] = useState<SectionId>('bible')
  const [editing, setEditing] = useState<CustomPlan | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const keyReady = Boolean(esvKey.trim())
  const accountSync = HAS_CLERK && isSignedIn

  useEffect(() => {
    setKeyDraft(esvKey)
  }, [esvKey])

  function toggle(id: SectionId) {
    setOpen((prev) => (prev === id ? prev : id))
  }

  function setTranslation(id: TranslationId) {
    if (id === 'esv' && !user.esvApiKey?.trim() && !keyDraft.trim()) {
      setOpen('bible')
      setTestMsg('Add your ESV API key above first, then switch to ESV.')
      setTestOk(false)
      return
    }
    onUserChange(updateSettings(user, { translationId: id }))
  }

  async function saveKey() {
    const trimmed = keyDraft.trim()
    if (!trimmed) return
    const next = updateSettings(user, {
      esvApiKey: trimmed,
      translationId: 'esv',
    })
    onUserChange(next)
    setSaved(true)

    if (accountSync) {
      setSavingAccount(true)
      try {
        const savedState = await saveCloudProgress(next)
        if (savedState) {
          onUserChange(savedState)
          setTestMsg('ESV key saved to your account — available whenever you sign in.')
          setTestOk(true)
        } else {
          setTestMsg('Saved on this device. Sign in to keep the key on your account.')
          setTestOk(false)
        }
      } catch {
        setTestMsg('Saved on this device, but account sync failed. Try again while signed in.')
        setTestOk(false)
      }
      setSavingAccount(false)
    }

    window.setTimeout(() => setSaved(false), 1600)
  }

  async function runTest() {
    setTesting(true)
    setTestMsg(null)
    const result = await testEsvConnection(keyDraft || esvKey)
    setTestOk(result.ok)
    setTestMsg(result.message)
    setTesting(false)
  }

  function switchPlan(planId: string) {
    if (planId === user.planId) return
    if (
      !confirm(
        'Switch plans? Your XP and streak stay, but reading progress resets for the new plan.',
      )
    ) {
      return
    }
    onUserChange({
      ...user,
      planId,
      completedDays: [],
      completedQuizzes: [],
      customPlans,
    })
  }

  function saveCustomPlan(plan: CustomPlan) {
    const exists = customPlans.some((p) => p.id === plan.id)
    const nextPlans = exists
      ? customPlans.map((p) => (p.id === plan.id ? plan : p))
      : [...customPlans, plan]
    onUserChange({
      ...user,
      customPlans: nextPlans,
      planId: plan.id,
      // Keep progress only when editing the active plan without changing length/books drastically
      completedDays:
        exists && user.planId === plan.id && plan.days === user.customPlans.find((p) => p.id === plan.id)?.days
          ? user.completedDays.filter((d) => d <= plan.days)
          : [],
      completedQuizzes:
        exists && user.planId === plan.id ? user.completedQuizzes : [],
    })
    setEditing(null)
    setShowBuilder(false)
    setOpen('plan')
  }

  function deleteCustomPlan(plan: CustomPlan) {
    if (
      !confirm(
        `Delete custom plan “${plan.name}”? This cannot be undone.`,
      )
    ) {
      return
    }
    const nextPlans = customPlans.filter((p) => p.id !== plan.id)
    onUserChange({
      ...user,
      customPlans: nextPlans,
      planId: user.planId === plan.id ? 'year' : user.planId,
      completedDays: user.planId === plan.id ? [] : user.completedDays,
      completedQuizzes: user.planId === plan.id ? [] : user.completedQuizzes,
    })
    if (editing?.id === plan.id) {
      setEditing(null)
      setShowBuilder(false)
    }
  }

  function startEdit(plan: CustomPlan) {
    setOpen('plan')
    setEditing(plan)
    setShowBuilder(true)
  }

  return (
    <div className="settings">
      <h2>Settings</h2>

      <div className="settings-acc">
        <button
          type="button"
          className={`settings-acc-head ${open === 'bible' ? 'open' : ''}`}
          onClick={() => toggle('bible')}
        >
          Bible & translation
          <span aria-hidden>{open === 'bible' ? '−' : '+'}</span>
        </button>
        {open === 'bible' && (
          <div className="settings-acc-body">
            <section className="settings-block tight">
              <h3>Connect ESV</h3>
              <p className="muted">
                Free key from{' '}
                <a href="https://api.esv.org/" target="_blank" rel="noreferrer">
                  api.esv.org
                </a>
                . WEB and KJV need no key.
                {accountSync
                  ? ' When signed in, your key is stored on your Abide account.'
                  : HAS_CLERK
                    ? ' Sign in so the key is saved to your account, not only this browser.'
                    : ''}
              </p>
              <p className={`nudge ${keyReady ? 'good' : 'risk'}`}>
                {keyReady
                  ? accountSync
                    ? 'ESV key is on your account — ESV stays available when you sign in.'
                    : 'ESV key saved on this device.'
                  : 'No key yet — ESV readings will not load until you save one.'}
              </p>
              <label className="field-label">
                ESV API key
                <div className="key-row">
                  <input
                    className="field"
                    type={showKey ? 'text' : 'password'}
                    autoComplete="off"
                    placeholder="Paste your Crossway API token"
                    value={keyDraft}
                    onChange={(e) => setKeyDraft(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn tiny ghost-outline"
                    onClick={() => setShowKey((v) => !v)}
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>
              <div className="session-actions">
                <button
                  className="btn primary"
                  onClick={() => void saveKey()}
                  disabled={!keyDraft.trim() || savingAccount}
                >
                  {savingAccount
                    ? 'Saving to account…'
                    : saved
                      ? accountSync
                        ? 'Saved to account ✓'
                        : 'Saved ✓'
                      : accountSync
                        ? 'Save to account'
                        : 'Save key'}
                </button>
                <button
                  className="btn ghost-outline"
                  onClick={() => void runTest()}
                  disabled={testing || !(keyDraft.trim() || esvKey.trim())}
                >
                  {testing ? 'Testing…' : 'Test'}
                </button>
              </div>
              {testMsg && <p className={`nudge ${testOk ? 'good' : 'risk'}`}>{testMsg}</p>}
            </section>

            <section className="settings-block tight">
              <h3>Translation</h3>
              <div className="plan-grid">
                {TRANSLATIONS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`plan-card ${user.translationId === t.id ? 'selected' : ''}`}
                    onClick={() => setTranslation(t.id)}
                  >
                    <span className="plan-vibe">{t.short}</span>
                    <strong>{t.name}</strong>
                    <span className="plan-blurb">{t.note}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="settings-block tight">
              <h3>Daily XP goal</h3>
              <p className="muted">
                How much XP fills “Today’s quest.” This only changes the target — it does not add XP.
              </p>
              <div className="plan-grid">
                {DAILY_GOAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`plan-card ${user.dailyGoalXp === opt.xp ? 'selected' : ''}`}
                    onClick={() =>
                      onUserChange(updateSettings(user, { dailyGoalXp: opt.xp }))
                    }
                  >
                    <span className="plan-vibe">{opt.xp} XP</span>
                    <strong>{opt.label}</strong>
                    <span className="plan-blurb">{opt.blurb}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        <button
          type="button"
          className={`settings-acc-head ${open === 'plan' ? 'open' : ''}`}
          onClick={() => toggle('plan')}
        >
          Reading plan
          <span aria-hidden>{open === 'plan' ? '−' : '+'}</span>
        </button>
        {open === 'plan' && (
          <div className="settings-acc-body">
            <section className="settings-block tight">
              <div className="plan-grid">
                {PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    className={`plan-card ${user.planId === plan.id ? 'selected' : ''}`}
                    onClick={() => switchPlan(plan.id)}
                  >
                    <span className="plan-vibe">{plan.vibe}</span>
                    <strong>{plan.name}</strong>
                    <span className="plan-blurb">{plan.blurb}</span>
                    <span className="plan-days">{plan.days} days</span>
                  </button>
                ))}
              </div>
              <p className="muted">
                Plans marked Bible Gateway use open schedules that match popular Bible Gateway
                reading-plan styles (not an official Bible Gateway feed).
              </p>

              {customPlans.length > 0 && (
                <>
                  <h3>Your custom plans</h3>
                  <p className="muted">Edit or delete any plan below. Tap the name to switch to it.</p>
                  <div className="custom-plan-list">
                    {customPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`custom-plan-row ${user.planId === plan.id ? 'selected' : ''}`}
                      >
                        <button
                          type="button"
                          className="custom-plan-main"
                          onClick={() => switchPlan(plan.id)}
                        >
                          <strong>{plan.name}</strong>
                          <span className="muted">
                            {plan.bookIds.length} book
                            {plan.bookIds.length === 1 ? '' : 's'} · {plan.days} days ·{' '}
                            {(plan.pace ?? 'chapter') === 'section'
                              ? 'sections'
                              : (plan.pace ?? 'chapter') === 'half'
                                ? 'half-chapters'
                                : (plan.pace ?? 'chapter') === 'verses'
                                  ? `${plan.versesPerDay ?? 10} verses`
                                  : 'chapters'}
                          </span>
                        </button>
                        <div className="custom-plan-actions">
                          <button
                            type="button"
                            className="btn tiny ghost-outline"
                            onClick={() => startEdit(plan)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn tiny ghost danger"
                            onClick={() => deleteCustomPlan(plan)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!showBuilder ? (
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => {
                    setEditing(null)
                    setShowBuilder(true)
                  }}
                >
                  New custom plan
                </button>
              ) : (
                <CustomPlanBuilder
                  initial={editing}
                  onSave={saveCustomPlan}
                  onCancel={() => {
                    setShowBuilder(false)
                    setEditing(null)
                  }}
                />
              )}
            </section>
          </div>
        )}

        <button
          type="button"
          className={`settings-acc-head ${open === 'about' ? 'open' : ''}`}
          onClick={() => toggle('about')}
        >
          About & reset
          <span aria-hidden>{open === 'about' ? '−' : '+'}</span>
        </button>
        {open === 'about' && (
          <div className="settings-acc-body">
            <section className="settings-block tight">
              <h3>ESV copyright</h3>
              <p className="muted">
                Required by Crossway when using the ESV API. Also shown on reading screens.
              </p>
              <EsvAttribution />
              <h3>Commentaries</h3>
              <p className="muted">
                Tap any verse while reading to open <strong>Matthew Henry</strong> or{' '}
                <strong>Tyndale Open Study Notes</strong> (free via bible.helloao.org).
              </p>
              <h3>Section headings</h3>
              <p className="muted">
                Standard chapter section breaks (e.g. “Jesus and Nicodemus”) appear in ESV, WEB,
                and KJV. Custom plans can use those breaks as daily units.
              </p>
            </section>
            <button className="btn ghost danger" onClick={onReset}>
              Reset journey
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
