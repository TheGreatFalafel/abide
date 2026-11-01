'use client'

import { useMemo, useRef, useState } from 'react'
import { whoSaidItForDifficulty } from '../../data/games/whoSaidIt'
import type { GameSessionProps } from '../../games/types'
import { GameChrome } from './GameChrome'
import { SourceDetails } from './SourceDetails'

export function WhoSaidIt({ difficulty, onComplete, onBack }: GameSessionProps) {
  const seed = useMemo(() => Date.now(), [])
  const questions = useMemo(() => whoSaidItForDifficulty(difficulty, 5), [difficulty])
  const scoreRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)

  const q = questions[index]
  if (!q) {
    return (
      <GameChrome title="Who Said It?" stepLabel="Unavailable" onBack={onBack}>
        <p className="muted">No questions for this difficulty.</p>
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
        gameId: 'who-said-it',
        difficulty,
        correct: scoreRef.current,
        total: questions.length,
        sessionKey: `who-${seed}`,
      })
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
    setChecked(false)
  }

  return (
    <GameChrome
      title="Who Said It?"
      stepLabel={`${index + 1} / ${questions.length}`}
      onBack={onBack}
      footer={
        !checked ? (
          <button
            type="button"
            className="btn primary"
            disabled={picked === null}
            onClick={check}
          >
            Check answer
          </button>
        ) : (
          <button type="button" className="btn primary" onClick={next}>
            {index >= questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        )
      }
    >
      <p className="muted">Identify the speaker. Quotes use careful renderings with verified references.</p>
      <p className="muted tiny">Score: {score}</p>
      <blockquote className="game-quote">{q.quote}</blockquote>
      <div className="options" role="listbox" aria-label="Speaker choices">
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
          <p className={`nudge ${ok ? 'good' : 'risk'}`}>
            {ok ? 'Correct. ' : 'Not quite. '}
            {q.explanation} ({q.reference})
          </p>
          <SourceDetails sources={q.sources} />
        </div>
      )}
    </GameChrome>
  )
}
