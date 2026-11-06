'use client'

import { useMemo, useRef, useState } from 'react'
import {
  doctrineChallengeForDifficulty,
  type DoctrineBin,
} from '../../data/games/doctrineChallenge'
import type { GameSessionProps } from '../../games/types'
import { AriReactionCue } from '../AriReactionCue'
import { GameChrome } from './GameChrome'

const BINS: { id: DoctrineBin; label: string }[] = [
  { id: 'orthodox', label: 'Orthodox' },
  { id: 'heresy', label: 'Heresy or error' },
  { id: 'debated', label: 'Debated among believers' },
]

export function DoctrineChallenge({ difficulty, onComplete, onBack }: GameSessionProps) {
  const seed = useMemo(() => Date.now(), [])
  const questions = useMemo(() => doctrineChallengeForDifficulty(difficulty, 5), [difficulty])
  const scoreRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<DoctrineBin | null>(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)

  const q = questions[index]
  if (!q) {
    return (
      <GameChrome gameId="doctrine-challenge" title="Doctrine Challenge" stepLabel="Unavailable" onBack={onBack}>
        <p className="muted">No doctrine items for this difficulty.</p>
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
        gameId: 'doctrine-challenge',
        difficulty,
        correct: scoreRef.current,
        total: questions.length,
        sessionKey: `doctrine-${seed}`,
      })
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
    setChecked(false)
  }

  return (
    <GameChrome
      gameId="doctrine-challenge"
      title="Doctrine Challenge"
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
      <h2 className="game-prompt">{q.statement}</h2>
      <p className="muted tiny">Swipe the statement into a bin:</p>
      <div className="options" role="listbox" aria-label="Doctrine bins">
        {BINS.map((b) => {
          let cls = 'option'
          if (checked) {
            if (b.id === q.answer) cls += ' correct'
            else if (b.id === picked) cls += ' wrong'
          } else if (b.id === picked) cls += ' selected'
          return (
            <button
              key={b.id}
              type="button"
              role="option"
              aria-selected={picked === b.id}
              className={cls}
              disabled={checked}
              onClick={() => setPicked(b.id)}
            >
              {b.label}
            </button>
          )
        })}
      </div>
      {checked && (
        <div className="game-feedback">
          <AriReactionCue active correct={ok} />
          <p className={`nudge ${ok ? 'good' : 'risk'}`}>
            {ok ? 'Correct. ' : 'Not quite. '}
            <strong>{q.name}.</strong> {q.explanation}
            {q.reference ? ` (${q.reference})` : ''}
          </p>
        </div>
      )}
    </GameChrome>
  )
}
