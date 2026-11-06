'use client'

import { useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { TRANSLATIONS, type TranslationId } from '../data/translations'
import { PLANS } from '../data/bible'
import { isClerkConfigured } from '../lib/clerk'
import { esvKeyStorageMessage } from '../lib/privacy'
import { updateSettings } from '../lib/progress'
import { AbideAvatar } from './AbideAvatar'
import { saveCloudProgress } from '../lib/cloud'
import { memoryNeedsTranslationSync, standardizeMemoryTranslations } from '../lib/memoryTranslation'
import { fetchMemoryVerseText } from '../lib/memoryTextFetch'
import type { CustomPlan, UserState } from '../lib/types'
import { DAILY_GOAL_OPTIONS } from '../lib/types'
import { EsvAttribution } from './EsvAttribution'
import { CustomPlanBuilder } from './CustomPlanBuilder'
import { testEsvConnection } from '../lib/bibleApi'
import {
  isStandaloneDisplay,
  migrateNotificationPrefs,
  notificationPermission,
  requestNotificationPermission,
} from '../lib/notifications'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
  onReset: () => void
  /** Opens badges / achievements (profile secondary destination). */
  onOpenBadges?: () => void
  /** Replay Ari’s guided tour (session overlay; completion still syncs). */
  onReplayTour?: () => void
  /** Open Learning Insights (secondary Path view). */
  onOpenInsights?: () => void
}

type SectionId = 'bible' | 'reminders' | 'plan' | 'profile' | 'about'

type SettingsViewProps = Props & {
  /** From Clerk when configured; always false when Clerk is off. */
  isSignedIn: boolean
  hasClerk: boolean
}

/**
 * Settings entry: never call useAuth unless Clerk is configured
 * (layout omits ClerkProvider when keys are missing).
 */
export function Settings(props: Props) {
  const hasClerk = isClerkConfigured()
  if (!hasClerk) {
    return <SettingsView {...props} hasClerk={false} isSignedIn={false} />
  }
  return <SettingsWithClerk {...props} />
}

function SettingsWithClerk(props: Props) {
  const { isSignedIn } = useAuth()
  return (
    <SettingsView {...props} hasClerk isSignedIn={Boolean(isSignedIn)} />
  )
}

/** Exported for tests — pure UI with auth flags injected. */
export function SettingsView({
  user,
  onUserChange,
  onReset,
  isSignedIn,
  hasClerk,
  onOpenBadges,
  onReplayTour,
  onOpenInsights,
}: SettingsViewProps) {
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
  const accountSync = hasClerk && isSignedIn
  const customPlans = user.customPlans ?? []
  const keyCopy = esvKeyStorageMessage({ hasClerk, isSignedIn, keyReady })
  const notif = migrateNotificationPrefs(user.notifications)
  const [perm, setPerm] = useState(notificationPermission)
  const standalone = typeof window !== 'undefined' && isStandaloneDisplay()

  useEffect(() => {
    setKeyDraft(esvKey)
  }, [esvKey])

  useEffect(() => {
    setPerm(notificationPermission())
  }, [open])

  function toggle(id: SectionId) {
    setOpen((prev) => (prev === id ? prev : id))
  }

  function patchNotifications(patch: Partial<typeof notif>) {
    const next = migrateNotificationPrefs({ ...notif, ...patch })
    onUserChange(updateSettings(user, { notifications: next }))
  }

  async function enableReminders() {
    const result = await requestNotificationPermission()
    setPerm(result)
    patchNotifications({
      permissionAsked: true,
      enabled: result === 'granted',
    })
  }

  async function applyTranslationAndMigrate(id: TranslationId, base: UserState = user) {
    const next = updateSettings(base, { translationId: id })
    onUserChange(next)
    if (!memoryNeedsTranslationSync(next) && next.memoryVerses.length === 0) return next
    try {
      const { state, report } = await standardizeMemoryTranslations(
        next,
        (verse, translationId) => fetchMemoryVerseText(verse, translationId, next),
        { target: id },
      )
      onUserChange(state)
      if (report.failed.length) {
        setTestMsg(
          `Translation set to ${id.toUpperCase()}. ${report.failed.length} memory verse${report.failed.length === 1 ? '' : 's'} could not be updated yet — previous text kept.`,
        )
        setTestOk(false)
      } else if (report.migrated > 0) {
        setTestMsg(
          `Updated ${report.migrated} memory verse${report.migrated === 1 ? '' : 's'} to ${id.toUpperCase()}.`,
        )
        setTestOk(true)
      }
      return state
    } catch {
      setTestMsg(
        `Translation set to ${id.toUpperCase()}, but memory verses could not all be refreshed. Previous text kept where needed.`,
      )
      setTestOk(false)
      return next
    }
  }

  function setTranslation(id: TranslationId) {
    if (id === 'esv' && !user.esvApiKey?.trim() && !keyDraft.trim()) {
      setOpen('bible')
      setTestMsg('Add your ESV API key above first, then switch to ESV.')
      setTestOk(false)
      return
    }
    void applyTranslationAndMigrate(id)
  }

  async function saveKey() {
    const trimmed = keyDraft.trim()
    if (!trimmed) return
    const withKey = updateSettings(user, {
      esvApiKey: trimmed,
      translationId: 'esv',
    })
    const next = await applyTranslationAndMigrate('esv', withKey)
    setSaved(true)

    if (accountSync) {
      setSavingAccount(true)
      try {
        const savedState = await saveCloudProgress(next)
        if (savedState) {
          onUserChange(savedState)
          setTestMsg(
            'ESV key saved on this device. Progress synced — the key was not uploaded.',
          )
          setTestOk(true)
        } else {
          setTestMsg('ESV key saved on this device.')
          setTestOk(true)
        }
      } catch {
        setTestMsg('Key saved on this device, but progress sync failed. Try again while signed in.')
        setTestOk(false)
      }
      setSavingAccount(false)
    } else {
      setTestMsg('ESV key saved on this device.')
      setTestOk(true)
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
    if (!confirm(`Delete custom plan “${plan.name}”? This cannot be undone.`)) {
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
                {keyCopy.blurb}
              </p>
              <p className={`nudge ${keyReady ? 'good' : 'risk'}`}>{keyCopy.status}</p>
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
                  {savingAccount ? 'Saving…' : saved ? 'Saved ✓' : 'Save key'}
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
              <h3>Learn difficulty</h3>
              <p className="muted">
                Filters objectives, Go Deeper teaching, and quiz tiers in Learn (theology, history,
                witness, Greek, and Hebrew). You can still open Go Deeper steps in a lesson.
              </p>
              <div className="plan-grid">
                {(
                  [
                    {
                      id: 'beginner' as const,
                      label: 'Beginner',
                      blurb: 'Recall and understand. Plain language, one idea at a time.',
                    },
                    {
                      id: 'intermediate' as const,
                      label: 'Intermediate',
                      blurb: 'Explain and connect. Compare positions and use basic terms.',
                    },
                    {
                      id: 'advanced' as const,
                      label: 'Advanced',
                      blurb: 'Analyze and defend. Historical theology, nuance, and objections.',
                    },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`plan-card ${(user.learnDifficulty ?? 'beginner') === opt.id ? 'selected' : ''}`}
                    onClick={() =>
                      onUserChange(updateSettings(user, { learnDifficulty: opt.id }))
                    }
                  >
                    <span className="plan-vibe">{opt.label}</span>
                    <strong>{opt.label}</strong>
                    <span className="plan-blurb">{opt.blurb}</span>
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
          className={`settings-acc-head ${open === 'reminders' ? 'open' : ''}`}
          onClick={() => toggle('reminders')}
        >
          Reminders
          <span aria-hidden>{open === 'reminders' ? '−' : '+'}</span>
        </button>
        {open === 'reminders' && (
          <div className="settings-acc-body">
            <section className="settings-block tight">
              <h3>Daily reminders</h3>
              <p className="muted">
                Optional local reminders for reading, memory reviews, and daily XP goals. Abide
                never asks for notification permission on first launch — only when you enable them
                here.
              </p>
              {perm === 'unsupported' && (
                <p className="nudge risk">This browser does not support web notifications.</p>
              )}
              {perm === 'denied' && (
                <p className="nudge risk">
                  Notifications are blocked in browser settings. Re-enable them for this site to use
                  reminders.
                </p>
              )}
              {!standalone && perm !== 'unsupported' && (
                <p className="muted">
                  On iPhone, add Abide to your Home Screen (Share → Add to Home Screen) for the most
                  reliable reminder support.
                </p>
              )}
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={notif.enabled && perm === 'granted'}
                  disabled={perm === 'unsupported' || perm === 'denied'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      void enableReminders()
                    } else {
                      patchNotifications({ enabled: false })
                    }
                  }}
                />
                <span>Enable reminders</span>
              </label>
              <fieldset className="reminder-options" disabled={!notif.enabled || perm !== 'granted'}>
                <legend className="field-label">Remind me about</legend>
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={notif.readingReminder}
                    onChange={(e) => patchNotifications({ readingReminder: e.target.checked })}
                  />
                  <span>Daily reading</span>
                </label>
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={notif.memoryReminder}
                    onChange={(e) => patchNotifications({ memoryReminder: e.target.checked })}
                  />
                  <span>Due memory reviews</span>
                </label>
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={notif.goalReminder}
                    onChange={(e) => patchNotifications({ goalReminder: e.target.checked })}
                  />
                  <span>Daily XP goal</span>
                </label>
                <label className="field-label">
                  Preferred hour
                  <select
                    className="field"
                    value={notif.reminderHour}
                    onChange={(e) =>
                      patchNotifications({ reminderHour: Number(e.target.value) })
                    }
                  >
                    {Array.from({ length: 24 }, (_, h) => (
                      <option key={h} value={h}>
                        {h === 0 ? '12:00 AM' : h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`}
                      </option>
                    ))}
                  </select>
                </label>
              </fieldset>
              <p className="muted">
                Reminders use on-device notifications (no third-party push service). They appear when
                Abide is open or installed as an app; background delivery varies by browser.
              </p>
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
          className={`settings-acc-head ${open === 'profile' ? 'open' : ''}`}
          onClick={() => toggle('profile')}
        >
          Profile & badges
          <span aria-hidden>{open === 'profile' ? '−' : '+'}</span>
        </button>
        {open === 'profile' && (
          <div className="settings-acc-body">
            <section className="settings-block tight">
              <div className="settings-profile-avatar">
                <AbideAvatar user={user} size="md" animate interactive />
                <div>
                  <p className="muted">
                    Hi, {user.name}. Customize your look and buy cosmetics in the shop — they never
                    change XP, streaks, or competition.
                  </p>
                </div>
              </div>
              <div className="settings-profile-actions">
                {onOpenBadges && (
                  <button type="button" className="btn primary" onClick={onOpenBadges}>
                    View badges ({user.achievements.length})
                  </button>
                )}
                {onOpenInsights && (
                  <button type="button" className="btn ghost" onClick={onOpenInsights}>
                    Learning Insights
                  </button>
                )}
                {onReplayTour && (
                  <button type="button" className="btn ghost" onClick={onReplayTour}>
                    Replay Ari’s tour
                  </button>
                )}
              </div>
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
