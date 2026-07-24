'use client'

import { useState } from 'react'
import { TRANSLATIONS, type TranslationId } from '../data/translations'
import { PLANS } from '../data/bible'
import { updateSettings } from '../lib/progress'
import type { CustomPlan, UserState } from '../lib/types'
import { EsvAttribution } from './EsvAttribution'
import { CustomPlanBuilder } from './CustomPlanBuilder'
import { testEsvConnection } from '../lib/bibleApi'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
  onReset: () => void
}

type SectionId = 'bible' | 'plan' | 'about'

export function Settings({ user, onUserChange, onReset }: Props) {
  const customPlans = user.customPlans ?? []
  const esvKey = user.esvApiKey ?? ''
  const [keyDraft, setKeyDraft] = useState(esvKey)
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testMsg, setTestMsg] = useState<string | null>(null)
  const [testOk, setTestOk] = useState<boolean | null>(null)
  const [open, setOpen] = useState<SectionId>('bible')
  const [editing, setEditing] = useState<CustomPlan | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const keyReady = Boolean(esvKey.trim())

  function toggle(id: SectionId) {
    setOpen((prev) => (prev === id ? prev : id))
  }

  function setTranslation(id: TranslationId) {
    onUserChange(updateSettings(user, { translationId: id }))
  }

  function saveKey() {
    const trimmed = keyDraft.trim()
    onUserChange(
      updateSettings(user, {
        esvApiKey: trimmed,
        translationId: trimmed ? 'esv' : user.translationId,
      }),
    )
    setSaved(true)
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
      completedDays: exists && user.planId === plan.id ? user.completedDays : [],
      completedQuizzes: exists && user.planId === plan.id ? user.completedQuizzes : [],
    })
    setEditing(null)
    setShowBuilder(false)
  }

  function deleteCustomPlan(plan: CustomPlan) {
    if (!confirm(`Delete “${plan.name}”?`)) return
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
              </p>
              <p className={`nudge ${keyReady ? 'good' : 'risk'}`}>
                {keyReady
                  ? 'ESV key saved on this device.'
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
                <button className="btn primary" onClick={saveKey} disabled={!keyDraft.trim()}>
                  {saved ? 'Saved ✓' : 'Save key'}
                </button>
                <button
                  className="btn ghost-outline"
                  onClick={runTest}
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
                                : 'chapters'}
                          </span>
                        </button>
                        <div className="custom-plan-actions">
                          <button
                            type="button"
                            className="btn tiny ghost-outline"
                            onClick={() => {
                              setEditing(plan)
                              setShowBuilder(true)
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn tiny ghost-outline"
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
