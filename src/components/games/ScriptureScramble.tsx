'use client'

import { useMemo, useRef, useState } from 'react'
import type { GameSessionProps } from '../../games/types'
import { selectPlayableVerses, shuffleWords, tokenizeVerse, wordsMatch } from '../../games/verseUtils'
import { GameChrome } from './GameChrome'

export function ScriptureScramble({ user, difficulty, onComplete, onBack }: GameSessionProps) {
  const seed = useMemo(() => Date.now(), [])
  const verses = useMemo(
    () => selectPlayableVerses(user, difficulty, 4, seed),
    [user, difficulty, seed],
  )
  const scoreRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string[]>([])
  const [used, setUsed] = useState<number[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [lastOk, setLastOk] = useState(false)

  const verse = verses[index]
  const words = useMemo(() => (verse ? tokenizeVerse(verse.text) : []), [verse])
  const bank = useMemo(
    () => (verse ? shuffleWords(words, seed + index * 97) : []),
    [verse, words, seed, index],
  )

  if (!verse) {
    return (
      <GameChrome title="Scripture Scramble" stepLabel="Unavailable" onBack={onBack}>
        <p className="muted">No verses available. Add memory verses or try again later.</p>
      </GameChrome>
    )
  }

  const available = bank.map((w, i) => ({ w, i })).filter(({ i }) => !used.includes(i))

  function addWord(i: number, w: string) {
    if (checked) return
    setUsed((u) => [...u, i])
    setPicked((p) => [...p, w])
  }

  function undo() {
    if (checked || !picked.length) return
    setUsed((u) => u.slice(0, -1))
    setPicked((p) => p.slice(0, -1))
  }

  function check() {
    const ok = wordsMatch(picked, words)
    setLastOk(ok)
    setChecked(true)
    setFeedback(
      ok
        ? `Correct — ${verse.reference} (${verse.translationLabel})`
        : `Not quite. ${verse.reference}: “${verse.text}”`,
    )
    if (ok) {
      scoreRef.current += 1
      setScore(scoreRef.current)
    }
  }

  function next() {
    if (index >= verses.length - 1) {
      onComplete({
        gameId: 'scripture-scramble',
        difficulty,
        correct: scoreRef.current,
        total: verses.length,
        sessionKey: `scramble-${seed}`,
      })
      return
    }
    setIndex((i) => i + 1)
    setPicked([])
    setUsed([])
    setFeedback(null)
    setChecked(false)
    setLastOk(false)
  }

  return (
    <GameChrome
      title="Scripture Scramble"
      stepLabel={`${index + 1} / ${verses.length} · ${verse.reference}`}
      onBack={onBack}
      footer={
        !checked ? (
          <div className="game-actions">
            <button type="button" className="btn ghost" onClick={undo} disabled={!picked.length}>
              Undo
            </button>
            <button
              type="button"
              className="btn primary"
              disabled={picked.length !== words.length}
              onClick={check}
            >
              Check order
            </button>
          </div>
        ) : (
          <button type="button" className="btn primary" onClick={next}>
            {index >= verses.length - 1 ? 'Finish' : 'Next verse'}
          </button>
        )
      }
    >
      <p className="muted">
        Rebuild the verse in order. Uses your memory-bank translation when available; otherwise WEB
        (public domain).
      </p>
      <p className="muted tiny">Score: {score}</p>
      <div className="scramble-built" aria-live="polite">
        {picked.length ? picked.join(' ') : <span className="muted">Tap words below…</span>}
      </div>
      <div className="scramble-bank">
        {available.map(({ w, i }) => (
          <button key={`${i}-${w}`} type="button" className="chip" onClick={() => addWord(i, w)}>
            {w}
          </button>
        ))}
      </div>
      {feedback && <p className={`nudge ${lastOk ? 'good' : 'risk'}`}>{feedback}</p>}
    </GameChrome>
  )
}
