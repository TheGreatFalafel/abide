'use client'

import { useMemo, useState } from 'react'
import { timelineSetsForDifficulty, type TimelineEvent } from '../../data/games/timeline'
import type { GameSessionProps } from '../../games/types'
import { GameChrome } from './GameChrome'

function shuffle<T>(items: T[], seed: number): T[] {
  let t = seed >>> 0
  const rand = () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function BiblicalTimeline({ difficulty, onComplete, onBack }: GameSessionProps) {
  const seed = useMemo(() => Date.now(), [])
  const set = useMemo(() => {
    const pool = timelineSetsForDifficulty(difficulty)
    return pool[seed % pool.length] ?? pool[0]
  }, [difficulty, seed])

  const [order, setOrder] = useState<TimelineEvent[]>(() =>
    set ? shuffle(set.events, seed) : [],
  )
  const [checked, setChecked] = useState(false)

  if (!set) {
    return (
      <GameChrome title="Biblical Timeline" stepLabel="Unavailable" onBack={onBack}>
        <p className="muted">No timeline set for this difficulty.</p>
      </GameChrome>
    )
  }

  const correctOrder = [...set.events].sort((a, b) => a.order - b.order)
  const positionsOk = order.every((e, i) => e.id === correctOrder[i]?.id)
  const correctCount = order.filter((e, i) => e.id === correctOrder[i]?.id).length

  function move(i: number, dir: -1 | 1) {
    if (checked) return
    const j = i + dir
    if (j < 0 || j >= order.length) return
    setOrder((prev) => {
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  function finish() {
    onComplete({
      gameId: 'biblical-timeline',
      difficulty,
      correct: correctCount,
      total: order.length,
      sessionKey: `timeline-${set.id}-${seed}`,
    })
  }

  return (
    <GameChrome
      title="Biblical Timeline"
      stepLabel={set.title}
      onBack={onBack}
      footer={
        !checked ? (
          <button type="button" className="btn primary" onClick={() => setChecked(true)}>
            Check order
          </button>
        ) : (
          <button type="button" className="btn primary" onClick={finish}>
            Finish
          </button>
        )
      }
    >
      <p className="muted">
        Arrange these events from earliest to latest in the biblical narrative (relative order, not
        disputed absolute dates).
      </p>
      <ol className="timeline-list">
        {order.map((e, i) => {
          const right = checked && e.id === correctOrder[i]?.id
          const wrong = checked && !right
          return (
            <li key={e.id} className={`timeline-item ${right ? 'correct' : ''} ${wrong ? 'wrong' : ''}`}>
              <div className="timeline-controls">
                <button
                  type="button"
                  className="btn ghost sm"
                  aria-label={`Move ${e.label} earlier`}
                  disabled={checked || i === 0}
                  onClick={() => move(i, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="btn ghost sm"
                  aria-label={`Move ${e.label} later`}
                  disabled={checked || i === order.length - 1}
                  onClick={() => move(i, 1)}
                >
                  ↓
                </button>
              </div>
              <div>
                <strong>
                  {i + 1}. {e.label}
                </strong>
                {checked && (
                  <p className="muted tiny">
                    {e.reference} — {e.explanation}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
      {checked && (
        <div className={`nudge ${positionsOk ? 'good' : 'risk'}`}>
          {positionsOk
            ? 'Perfect chronological order.'
            : `You placed ${correctCount} of ${order.length} correctly. Correct sequence: ${correctOrder
                .map((e) => e.label)
                .join(' → ')}.`}
        </div>
      )}
    </GameChrome>
  )
}
