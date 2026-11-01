'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
  TOUR_STEPS,
  type TourNavView,
  type TourStep,
} from '../lib/ariTour'
import { MASCOT_NAME } from '../lib/mascot'
import { AriMark } from './MascotBanner'

type Props = {
  open: boolean
  onNavigate: (view: TourNavView) => void
  onComplete: () => void
  /** Finish → prefer Read as first activity. */
  onFinishGoRead: () => void
}

export function GuidedTour({ open, onNavigate, onComplete, onFinishGoRead }: Props) {
  const [index, setIndex] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const step: TourStep = TOUR_STEPS[Math.min(index, TOUR_STEPS.length - 1)]!
  const isFirst = index <= 0
  const isLast = index >= TOUR_STEPS.length - 1

  useEffect(() => {
    if (!open) {
      setIndex(0)
      return
    }
    onNavigate(step.view)
    // Focus panel for keyboard users when step changes
    panelRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-nav when index/open change
  }, [open, index])

  if (!open) return null

  function skip() {
    onComplete()
  }

  function back() {
    setIndex((i) => Math.max(0, i - 1))
  }

  function next() {
    if (isLast) {
      onComplete()
      onFinishGoRead()
      return
    }
    setIndex((i) => Math.min(TOUR_STEPS.length - 1, i + 1))
  }

  return (
    <div className="guided-tour" role="presentation">
      <div className="guided-tour-scrim" aria-hidden onClick={skip} />
      <div
        ref={panelRef}
        className="guided-tour-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            skip()
          }
          if (e.key === 'ArrowRight' || e.key === 'Enter') {
            if ((e.target as HTMLElement).tagName === 'BUTTON') return
          }
        }}
      >
        <div className="guided-tour-ari">
          <AriMark expression={step.expression} size={64} animate />
          <span className="guided-tour-name">{MASCOT_NAME}</span>
        </div>
        <div className="guided-tour-copy">
          <p className="guided-tour-progress muted">
            Step {index + 1} of {TOUR_STEPS.length}
          </p>
          <h2 id={titleId}>{step.title}</h2>
          <p>{step.body}</p>
        </div>
        <div className="guided-tour-actions">
          <button type="button" className="btn ghost" onClick={skip}>
            Skip
          </button>
          <div className="guided-tour-nav">
            <button type="button" className="btn ghost" disabled={isFirst} onClick={back}>
              Back
            </button>
            <button type="button" className="btn primary" onClick={next}>
              {isLast ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
        <p className="guided-tour-hint muted">
          {step.actionHint}. Replay anytime in Settings.
        </p>
      </div>
    </div>
  )
}
