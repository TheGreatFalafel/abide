'use client'

import { useMemo, useRef, useState } from 'react'
import { bookChallengeForDifficulty } from '../../data/games/bookOfTheBible'
import type { GameSessionProps } from '../../games/types'
import { AriReactionCue } from '../AriReactionCue'
import { GameChrome } from './GameChrome'

export function BookOfTheBibleChallenge({ difficulty, onComplete, onBack }: GameSessionProps) {
  const seed = useMemo(() => Date.now(), [])
  const questions = useMemo(() => bookChallengeForDifficulty(difficulty, 5), [difficulty])
  const scoreRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)

  const q = questions[index]
  if (!q) {
    return (
      <GameChrome
        gameId="book-of-the-bible-challenge"
        title="Book of the Bible Challenge"
        stepLabel="Unavailable"
        onBack={onBack}
      >
        <p className="muted">No book-challenge items for this difficulty.</p>
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
        gameId: 'book-of-the-bible-challenge',
        difficulty,
        correct: scoreRef.current,
        total: questions.length,
        sessionKey: `bob-${seed}`,
      })
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
    setChecked(false)
  }

  return (
    <GameChrome
      gameId="book-of-the-bible-challenge"
      title="Book of the Bible Challenge"
      stepLabel={`${index + 1} / ${questions.length} · ${q.kind}`}
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
          <AriReactionCue active correct={ok} />
          <p className={`nudge ${ok ? 'good' : 'risk'}`}>
            {ok ? 'Correct. ' : 'Not quite. '}
            {q.explanation}
          </p>
        </div>
      )}
    </GameChrome>
  )
}
