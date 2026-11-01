'use client'

import { useMemo, useRef, useState } from 'react'
import { triviaForDifficulty } from '../../data/games/trivia'
import type { GameSessionProps } from '../../games/types'
import { GameChrome } from './GameChrome'
import { SourceDetails } from './SourceDetails'

export function BibleTrivia({ difficulty, onComplete, onBack }: GameSessionProps) {
  const seed = useMemo(() => Date.now(), [])
  const questions = useMemo(() => triviaForDifficulty(difficulty, 5), [difficulty])
  const scoreRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)

  const q = questions[index]
  if (!q) {
    return (
      <GameChrome title="Bible Trivia" stepLabel="Unavailable" onBack={onBack}>
        <p className="muted">No trivia questions for this difficulty.</p>
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
        gameId: 'bible-trivia',
        difficulty,
        correct: scoreRef.current,
        total: questions.length,
        sessionKey: `trivia-${seed}`,
      })
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
    setChecked(false)
  }

  return (
    <GameChrome
      title="Bible Trivia"
      stepLabel={`${index + 1} / ${questions.length} · ${q.category}`}
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
      <p className="muted tiny">Score: {score}</p>
      <h2 className="game-prompt">{q.prompt}</h2>
      <div className="options" role="listbox" aria-label="Answer choices">
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
