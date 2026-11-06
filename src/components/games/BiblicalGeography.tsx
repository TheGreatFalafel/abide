'use client'

import { useMemo, useRef, useState } from 'react'
import { geographyForDifficulty } from '../../data/games/biblicalGeography'
import type { GameSessionProps } from '../../games/types'
import { AriReactionCue } from '../AriReactionCue'
import { GameChrome } from './GameChrome'

export function BiblicalGeography({ difficulty, onComplete, onBack }: GameSessionProps) {
  const seed = useMemo(() => Date.now(), [])
  const questions = useMemo(() => geographyForDifficulty(difficulty, 5), [difficulty])
  const scoreRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)

  const q = questions[index]
  if (!q) {
    return (
      <GameChrome gameId="biblical-geography" title="Biblical Geography" stepLabel="Unavailable" onBack={onBack}>
        <p className="muted">No geography items for this difficulty.</p>
      </GameChrome>
    )
  }

  const ok = picked === q.answer

  function check() {
    if (picked === null) return
    setChecked(true)
    if (picked === q.answer) {
      scoreRef.current += 1
      setScore(scoreRef.current)
    }
  }

  function next() {
    if (index >= questions.length - 1) {
      onComplete({
        gameId: 'biblical-geography',
        difficulty,
        correct: scoreRef.current,
        total: questions.length,
        sessionKey: `geo-${seed}`,
      })
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
    setChecked(false)
  }

  return (
    <GameChrome
      gameId="biblical-geography"
      title="Biblical Geography"
      stepLabel={`${index + 1} / ${questions.length}`}
      onBack={onBack}
      footer={
        !checked ? (
          <button type="button" className="btn primary" disabled={picked === null} onClick={check}>
            Check answer
          </button>
        ) : (
          <button type="button" className="btn primary" onClick={next}>
            {index >= questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        )
      }
    >
      <p className="muted tiny">Score: {score}</p>
      <h2 className="game-prompt">Which place matches this reference — {q.reference}?</h2>
      {q.debated ? <p className="muted tiny">Scholars differ on the precise site.</p> : null}
      <div className="options" role="listbox" aria-label="Places">
        {q.choices.map((c, i) => {
          let cls = 'option'
          if (checked) {
            if (i === q.answer) cls += ' correct'
            else if (i === picked) cls += ' wrong'
          } else if (i === picked) cls += ' selected'
          return (
            <button
              key={c}
              type="button"
              role="option"
              aria-selected={picked === i}
              className={cls}
              disabled={checked}
              onClick={() => setPicked(i)}
            >
              {c}
            </button>
          )
        })}
      </div>
      {checked && (
        <div className="game-feedback">
          <AriReactionCue active correct={ok} />
          <p className={`nudge ${ok ? 'good' : 'risk'}`}>
            {ok ? 'Correct. ' : 'Not quite. '}
            {q.place}: {q.explanation} ({q.reference})
          </p>
          <p className="muted tiny">
            Approx. coordinates {q.lat}, {q.lng} — verify before map scoring ships.
          </p>
        </div>
      )}
    </GameChrome>
  )
}
