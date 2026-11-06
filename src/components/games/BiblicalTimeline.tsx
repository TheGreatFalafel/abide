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
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (!set) {
    return (
      <GameChrome gameId="biblical-timeline" title="Biblical Timeline" stepLabel="Unavailable" onBack={onBack}>
        <p className="muted">No timeline set for this difficulty.</p>
      </GameChrome>
    )
  }

  const correctOrder = [...set.events].sort((a, b) => a.order - b.order)
  const positionsOk = order.every((e, i) => e.id === correctOrder[i]?.id)
  const correctCount = order.filter((e, i) => e.id === correctOrder[i]?.id).length

  function moveId(fromId: string, toId: string) {
    if (checked || fromId === toId) return
    setOrder((prev) => {
      const from = prev.findIndex((e) => e.id === fromId)
      const to = prev.findIndex((e) => e.id === toId)
      if (from < 0 || to < 0) return prev
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
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
      gameId="biblical-timeline"
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
        Drag tiles to arrange events from earliest to latest (relative biblical order). On touch
        devices, tap one tile then tap another to move it there.
      </p>
      <ol className="timeline-list">
        {order.map((e, i) => {
          const right = checked && e.id === correctOrder[i]?.id
          const wrong = checked && !right
          const isDragging = draggingId === e.id
          const isSelected = selectedId === e.id
          const isOver = overId === e.id && draggingId && draggingId !== e.id
          return (
            <li
              key={e.id}
              className={`timeline-item timeline-tile ${right ? 'correct' : ''} ${wrong ? 'wrong' : ''} ${
                isDragging || isSelected ? 'dragging' : ''
              } ${isOver ? 'drop-target' : ''}`}
              draggable={!checked}
              onClick={() => {
                if (checked) return
                if (!selectedId) {
                  setSelectedId(e.id)
                  return
                }
                if (selectedId === e.id) {
                  setSelectedId(null)
                  return
                }
                moveId(selectedId, e.id)
                setSelectedId(null)
              }}
              onDragStart={(ev) => {
                if (checked) {
                  ev.preventDefault()
                  return
                }
                setSelectedId(null)
                ev.dataTransfer.setData('text/plain', e.id)
                ev.dataTransfer.effectAllowed = 'move'
                setDraggingId(e.id)
              }}
              onDragEnd={() => {
                setDraggingId(null)
                setOverId(null)
              }}
              onDragOver={(ev) => {
                if (checked || !draggingId) return
                ev.preventDefault()
                setOverId(e.id)
              }}
              onDragLeave={() => setOverId((cur) => (cur === e.id ? null : cur))}
              onDrop={(ev) => {
                ev.preventDefault()
                const fromId = ev.dataTransfer.getData('text/plain') || draggingId
                setOverId(null)
                setDraggingId(null)
                if (fromId) moveId(fromId, e.id)
              }}
            >
              <span className="timeline-grip" aria-hidden>
                ⋮⋮
              </span>
              <div className="timeline-tile-body">
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
                .map((ev) => ev.label)
                .join(' → ')}.`}
        </div>
      )}
    </GameChrome>
  )
}
