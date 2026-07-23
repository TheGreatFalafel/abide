import { useState } from 'react'
import { TRANSLATIONS, type TranslationId } from '../data/translations'
import { PLANS } from '../data/bible'
import { updateSettings } from '../lib/progress'
import type { UserState } from '../lib/types'
import { EsvAttribution } from './EsvAttribution'
import { testEsvConnection } from '../lib/bibleApi'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
  onReset: () => void
}

export function Settings({ user, onUserChange, onReset }: Props) {
  const [keyDraft, setKeyDraft] = useState(user.esvApiKey)
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testMsg, setTestMsg] = useState<string | null>(null)
  const [testOk, setTestOk] = useState<boolean | null>(null)
  const keyReady = Boolean(user.esvApiKey.trim())

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
    const result = await testEsvConnection(keyDraft || user.esvApiKey)
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
    })
  }

  return (
    <div className="settings">
      <h2>Settings</h2>

      <section className="settings-block">
        <h3>Connect ESV</h3>
        <ol className="steps">
          <li>
            Get your free token from{' '}
            <a href="https://api.esv.org/" target="_blank" rel="noreferrer">
              api.esv.org
            </a>{' '}
            (Applications → your app → API Key).
          </li>
          <li>
            Paste it below and tap <strong>Save key</strong>.
          </li>
          <li>
            Tap <strong>Test connection</strong> to confirm Crossway accepts it.
          </li>
          <li>Use the app with an internet connection so readings can load from Crossway.</li>
        </ol>
        <p className={`nudge ${keyReady ? 'good' : 'risk'}`}>
          {keyReady
            ? 'ESV key saved on this device.'
            : 'No key saved yet — ESV readings will not load until you save one.'}
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
            disabled={testing || !(keyDraft.trim() || user.esvApiKey.trim())}
          >
            {testing ? 'Testing…' : 'Test connection'}
          </button>
        </div>
        {testMsg && <p className={`nudge ${testOk ? 'good' : 'risk'}`}>{testMsg}</p>}
      </section>

      <section className="settings-block">
        <h3>Translation</h3>
        <p className="muted">WEB and KJV need no key. ESV uses the key above.</p>
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

      <section className="settings-block">
        <h3>ESV copyright</h3>
        <p className="muted">
          Required by Crossway when using the ESV API. Also shown on reading screens.
        </p>
        <EsvAttribution />
      </section>

      <section className="settings-block">
        <h3>Reading plan</h3>
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
      </section>

      <button className="btn ghost danger" onClick={onReset}>
        Reset journey
      </button>
    </div>
  )
}
