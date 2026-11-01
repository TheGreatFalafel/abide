'use client'

import { useMemo, useRef, useState } from 'react'
import { matchItemsForDifficulty, type MatchItem } from '../../data/games/matchPassage'
import type { GameSessionProps } from '../../games/types'
import { GameChrome } from './GameChrome'
import { SourceDetails } from './SourceDetails'

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

export function MatchThePassage({ difficulty, onComplete, onBack }: GameSessionProps) {
  const seed = useMemo(() => Date.now(), [])
  const items = useMemo(() => matchItemsForDifficulty(difficulty, 4), [difficulty])
  const refs = useMemo(() => shuffle(items, seed), [items, seed])
  const summaries = useMemo(() => shuffle(items, seed + 17), [items, seed])

  const scoreRef = useRef(0)
  const [pairs, setPairs] = useState<Record<string, string>>({})
  const [selectedRef, setSelectedRef] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)

  if (!items.length) {
    return (
      <GameChrome title="Match the Passage" stepLabel="Unavailable" onBack={onBack}>
        <p className="muted">No match items for this difficulty.</p>
      </GameChrome>
    )
  }

  const usedSummaries = new Set(Object.values(pairs))

  function pickRef(id: string) {
    if (checked) return
    setSelectedRef(id)
  }

  function pickSummary(item: MatchItem) {
    if (checked || !selectedRef) return
    if (usedSummaries.has(item.id) && pairs[selectedRef] !== item.id) return
    setPairs((p) => ({ ...p, [selectedRef]: item.id }))
    setSelectedRef(null)
  }

  function check() {
    let correct = 0
    for (const item of items) {
      if (pairs[item.id] === item.id) correct += 1
    }
    scoreRef.current = correct
    setScore(correct)
    setChecked(true)
  }

  function finish() {
    onComplete({
      gameId: 'match-the-passage',
      difficulty,
      correct: scoreRef.current,
      total: items.length,
      sessionKey: `match-${seed}`,
    })
  }

  return (
    <GameChrome
      title="Match the Passage"
      stepLabel={`${Object.keys(pairs).length} / ${items.length} paired`}
      onBack={onBack}
      footer={
        !checked ? (
          <button
            type="button"
            className="btn primary"
            disabled={Object.keys(pairs).length < items.length}
            onClick={check}
          >
            Check matches
          </button>
        ) : (
          <button type="button" className="btn primary" onClick={finish}>
            Finish
          </button>
        )
      }
    >
      <p className="muted">
        Tap a reference, then tap its matching summary. Factual descriptions only.
      </p>
      <p className="muted tiny">Score: {checked ? score : '—'}</p>
      <div className="match-board">
        <div>
          <h3 className="game-subhead">References</h3>
          <div className="match-col">
            {refs.map((item) => {
              const paired = pairs[item.id]
              const right = checked && paired === item.id
              const wrong = checked && paired && paired !== item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`chip match-chip ${selectedRef === item.id ? 'selected' : ''} ${paired ? 'paired' : ''} ${right ? 'correct' : ''} ${wrong ? 'wrong' : ''}`}
                  disabled={checked}
                  onClick={() => pickRef(item.id)}
                >
                  {item.reference}
                  {paired && !checked ? ' ✓' : ''}
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <h3 className="game-subhead">Summaries</h3>
          <div className="match-col">
            {summaries.map((item) => {
              const taken = usedSummaries.has(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`chip match-chip summary ${taken ? 'paired' : ''}`}
                  disabled={checked || (taken && !selectedRef)}
                  onClick={() => pickSummary(item)}
                >
                  {item.summary}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      {checked && (
        <ul className="match-explain">
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.reference}</strong> — {item.summary}{' '}
              <span className="muted">({item.explanation})</span>
              <SourceDetails sources={item.sources} />
            </li>
          ))}
        </ul>
      )}
    </GameChrome>
  )
}
