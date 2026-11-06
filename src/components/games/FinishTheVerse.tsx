'use client'

import { useMemo, useRef, useState } from 'react'
import type { GameSessionProps } from '../../games/types'
import { selectPlayableVerses, splitForFinish, textMatches } from '../../games/verseUtils'
import { AriReactionCue } from '../AriReactionCue'
import { GameChrome } from './GameChrome'

export function FinishTheVerse({ user, difficulty, onComplete, onBack }: GameSessionProps) {
  const seed = useMemo(() => Date.now(), [])
  const verses = useMemo(
    () => selectPlayableVerses(user, difficulty, 4, seed),
    [user, difficulty, seed],
  )
  const scoreRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [lastOk, setLastOk] = useState(false)
  const [score, setScore] = useState(0)

  const verse = verses[index]
  const parts = useMemo(
    () => (verse ? splitForFinish(verse.text, difficulty) : null),
    [verse, difficulty],
  )

  if (!verse || !parts) {
    return (
      <GameChrome gameId="finish-the-verse" title="Finish the Verse" stepLabel="Unavailable" onBack={onBack}>
        <p className="muted">No verses available. Add memory verses or try again later.</p>
      </GameChrome>
    )
  }

  function check() {
    const ok = textMatches(answer, parts!.suffix)
    setLastOk(ok)
    setChecked(true)
    setFeedback(
      ok
        ? `Correct — ${verse.reference} (${verse.translationLabel})`
        : `Full verse (${verse.reference}): “${verse.text}”`,
    )
    if (ok) {
      scoreRef.current += 1
      setScore(scoreRef.current)
    }
  }

  function next() {
    if (index >= verses.length - 1) {
      onComplete({
        gameId: 'finish-the-verse',
        difficulty,
        correct: scoreRef.current,
        total: verses.length,
        sessionKey: `finish-${seed}`,
      })
      return
    }
    setIndex((i) => i + 1)
    setAnswer('')
    setFeedback(null)
    setChecked(false)
    setLastOk(false)
  }

  return (
    <GameChrome
      gameId="finish-the-verse"
      title="Finish the Verse"
      stepLabel={`${index + 1} / ${verses.length} · ${verse.reference}`}
      onBack={onBack}
      footer={
        !checked ? (
          <button
            type="button"
            className="btn primary"
            disabled={!answer.trim()}
            onClick={check}
          >
            Check
          </button>
        ) : (
          <button type="button" className="btn primary" onClick={next}>
            {index >= verses.length - 1 ? 'Finish' : 'Next verse'}
          </button>
        )
      }
    >
      <p className="muted">
        Complete the missing ending. Translation: {verse.translationLabel}. Punctuation is ignored.
      </p>
      <p className="muted tiny">Score: {score}</p>
      <blockquote className="game-quote">
        {parts.prefix} <span className="blank-slot">{checked ? parts.suffix : '…'}</span>
      </blockquote>
      {!checked && (
        <label className="stack">
          <span className="muted">Your completion</span>
          <textarea
            className="input area"
            rows={3}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type the rest of the verse…"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
      )}
      {checked && <AriReactionCue active correct={lastOk} />}
      {feedback && <p className={`nudge ${lastOk ? 'good' : 'risk'}`}>{feedback}</p>}
    </GameChrome>
  )
}
