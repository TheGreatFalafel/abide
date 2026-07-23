import { useState } from 'react'
import { PLANS } from '../data/bible'

type Props = {
  onStart: (name: string, planId: string) => void
}

export function Onboarding({ onStart }: Props) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [planId, setPlanId] = useState('year')

  return (
    <div className="screen onboarding">
      <div className="orb orb-a" aria-hidden />
      <div className="orb orb-b" aria-hidden />

      {step === 0 && (
        <section className="hero-panel enter">
          <p className="brand">Abide</p>
          <h1 className="hero-title">Stay with the Word — one small step a day.</h1>
          <p className="hero-sub">
            Streaks, XP, and a path that pulls you back tomorrow. Built to feel
            hard to put down — for all the right reasons.
          </p>
          <button className="btn primary pulse" onClick={() => setStep(1)}>
            Begin the path
          </button>
        </section>
      )}

      {step === 1 && (
        <section className="card-panel enter">
          <h2>What should we call you?</h2>
          <p className="muted">Your name stays on this device only.</p>
          <input
            className="field"
            autoFocus
            maxLength={24}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name.trim()) setStep(2)
            }}
          />
          <button
            className="btn primary"
            disabled={!name.trim()}
            onClick={() => setStep(2)}
          >
            Continue
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="card-panel enter wide">
          <h2>Pick your first trail</h2>
          <p className="muted">You can restart anytime. Short plans build streaks faster.</p>
          <div className="plan-grid">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                className={`plan-card ${planId === plan.id ? 'selected' : ''}`}
                onClick={() => setPlanId(plan.id)}
              >
                <span className="plan-vibe">{plan.vibe}</span>
                <strong>{plan.name}</strong>
                <span className="plan-blurb">{plan.blurb}</span>
                <span className="plan-days">{plan.days} days</span>
              </button>
            ))}
          </div>
          <button className="btn primary" onClick={() => onStart(name, planId)}>
            Start day 1
          </button>
        </section>
      )}
    </div>
  )
}
