'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  buildBlankPuzzle,
  normalizeWord,
  type BlankPuzzle,
} from '../lib/blanks'
import type { MemoryVerse } from '../lib/types'

type Props = {
  verse: MemoryVerse
  onGrade: (ok: boolean) => void
  onReshuffle?: () => void
}

export function BlankPractice({ verse, onGrade }: Props) {
  const [seed, setSeed] = useState(() => Date.now())
  const puzzle: BlankPuzzle = useMemo(
    () =>
      buildBlankPuzzle(verse.text, {
        seed,
        repetitions: verse.repetitions,
        intervalDays: verse.intervalDays,
        status: verse.status,
      }),
    [verse, seed],
  )

  const [activeBlank, setActiveBlank] = useState<number | null>(null)
  const [fills, setFills] = useState<Record<number, string>>({})
  /** Maps blank id → word-bank chip index currently placed there */
  const [usedBank, setUsedBank] = useState<Record<number, number>>({})
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setFills({})
    setUsedBank({})
    setChecked(false)
    setActiveBlank(puzzle.blankIds[0] ?? null)
  }, [puzzle])

  function reshuffle() {
    setSeed(Date.now())
  }

  function placeWord(word: string, bankIndex: number) {
    if (checked || activeBlank === null) return
    if (Object.values(usedBank).includes(bankIndex)) return

    // If this blank already had a word, free that bank chip
    const nextUsed = { ...usedBank }
    if (nextUsed[activeBlank] !== undefined) delete nextUsed[activeBlank]
    nextUsed[activeBlank] = bankIndex

    const nextFills = { ...fills, [activeBlank]: word }
    setUsedBank(nextUsed)
    setFills(nextFills)
    const stillEmpty = puzzle.blankIds.find((id) => !nextFills[id])
    setActiveBlank(stillEmpty ?? activeBlank)
  }

  function clearBlank(id: number) {
    if (checked) return
    setFills((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setUsedBank((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setActiveBlank(id)
  }

  const allFilled = puzzle.blankIds.every((id) => Boolean(fills[id]))
  const allCorrect =
    allFilled &&
    puzzle.blankIds.every((id) => {
      const token = puzzle.tokens.find((t) => t.kind === 'blank' && t.id === id)
      if (!token || token.kind !== 'blank') return false
      return normalizeWord(fills[id] || '') === normalizeWord(token.answer)
    })

  return (
    <div className="blank-practice">
      <p className="memory-meta">
        {puzzle.difficultyLabel} · {puzzle.blankCount} blank
        {puzzle.blankCount === 1 ? '' : 's'} · tap a blank, then a word
      </p>

      <div className="memory-text blank-verse" role="group" aria-label="Fill in the blanks">
        {puzzle.tokens.map((t, i) => {
          if (t.kind === 'text') {
            return <span key={`t-${i}`}>{t.value}</span>
          }
          const filled = fills[t.id]
          const isActive = activeBlank === t.id
          const wrong =
            checked &&
            filled &&
            normalizeWord(filled) !== normalizeWord(t.answer)
          const right =
            checked &&
            filled &&
            normalizeWord(filled) === normalizeWord(t.answer)
          return (
            <button
              key={`b-${t.id}`}
              type="button"
              className={`blank-slot ${isActive ? 'active' : ''} ${filled ? 'filled' : ''} ${wrong ? 'wrong' : ''} ${right ? 'right' : ''}`}
              onClick={() => (filled && !checked ? clearBlank(t.id) : setActiveBlank(t.id))}
            >
              {filled || '____'}
            </button>
          )
        })}
      </div>

      <div className="word-bank" aria-label="Word bank">
        {puzzle.bank.map((word, i) => {
          const exhausted = Object.values(usedBank).includes(i)
          return (
            <button
              key={`${word}-${i}`}
              type="button"
              className={`bank-chip ${exhausted ? 'used' : ''}`}
              disabled={checked || exhausted || activeBlank === null}
              onClick={() => placeWord(word, i)}
            >
              {word}
            </button>
          )
        })}
      </div>

      {!checked ? (
        <div className="session-actions">
          <button className="btn ghost-outline" onClick={reshuffle}>
            New blanks
          </button>
          <button
            className="btn primary"
            disabled={!allFilled}
            onClick={() => {
              setChecked(true)
            }}
          >
            Check
          </button>
        </div>
      ) : (
        <>
          <p className={`nudge ${allCorrect ? 'good' : 'risk'}`}>
            {allCorrect
              ? 'Perfect — every blank correct.'
              : 'Some blanks need another look. Try again or grade Hard.'}
          </p>
          <div className="session-actions">
            <button
              className="btn ghost-outline"
              onClick={() => {
                setChecked(false)
                setFills({})
                setUsedBank({})
                setActiveBlank(puzzle.blankIds[0] ?? null)
              }}
            >
              Try again
            </button>
            <button className="btn primary" onClick={() => onGrade(allCorrect)}>
              {allCorrect ? 'Grade Good' : 'Grade Hard'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
