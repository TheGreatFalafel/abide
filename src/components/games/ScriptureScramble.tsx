'use client'

import { useMemo, useRef, useState } from 'react'
import type { GameSessionProps } from '../../games/types'
import { selectPlayableVerses, shuffleWords, tokenizeVerse, wordsMatch } from '../../games/verseUtils'
import { AriReactionCue } from '../AriReactionCue'
import { GameChrome } from './GameChrome'

type Slot =
  | { kind: 'empty' }
  | { kind: 'filled'; bankIndex: number; word: string }

export function ScriptureScramble({ user, difficulty, onComplete, onBack }: GameSessionProps) {
  const seed = useMemo(() => Date.now(), [])
  const verses = useMemo(
    () => selectPlayableVerses(user, difficulty, 4, seed),
    [user, difficulty, seed],
  )
  const scoreRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [slots, setSlots] = useState<Slot[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [lastOk, setLastOk] = useState(false)
  const [draggingBank, setDraggingBank] = useState<number | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null)

  const verse = verses[index]
  const words = useMemo(() => (verse ? tokenizeVerse(verse.text) : []), [verse])
  const bank = useMemo(
    () => (verse ? shuffleWords(words, seed + index * 97) : []),
    [verse, words, seed, index],
  )

  // Keep slot count aligned with the current verse.
  const activeSlots =
    slots.length === words.length
      ? slots
      : words.map((): Slot => ({ kind: 'empty' }))

  if (!verse) {
    return (
      <GameChrome gameId="scripture-scramble" title="Scripture Scramble" stepLabel="Unavailable" onBack={onBack}>
        <p className="muted">No verses available. Add memory verses or try again later.</p>
      </GameChrome>
    )
  }

  const usedBank = new Set(
    activeSlots.filter((s): s is Extract<Slot, { kind: 'filled' }> => s.kind === 'filled').map((s) => s.bankIndex),
  )
  const nextEmpty = activeSlots.findIndex((s) => s.kind === 'empty')
  const filledCount = activeSlots.filter((s) => s.kind === 'filled').length

  function ensureSlots(prev: Slot[]): Slot[] {
    if (prev.length === words.length) return prev
    return words.map((): Slot => ({ kind: 'empty' }))
  }

  function placeFromBank(bankIndex: number, slotIndex?: number) {
    if (checked || usedBank.has(bankIndex)) return
    const word = bank[bankIndex]
    if (!word) return
    setSlots((prev) => {
      const next = ensureSlots(prev)
      const target = slotIndex ?? next.findIndex((s) => s.kind === 'empty')
      if (target < 0 || target >= next.length) return next
      // If target already filled, return that word to the bank by clearing first.
      const copy = [...next]
      copy[target] = { kind: 'filled', bankIndex, word }
      return copy
    })
  }

  function clearSlot(slotIndex: number) {
    if (checked) return
    setSlots((prev) => {
      const next = ensureSlots(prev)
      const copy = [...next]
      copy[slotIndex] = { kind: 'empty' }
      return copy
    })
  }

  function undo() {
    if (checked) return
    setSlots((prev) => {
      const next = ensureSlots(prev)
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i]?.kind === 'filled') {
          const copy = [...next]
          copy[i] = { kind: 'empty' }
          return copy
        }
      }
      return next
    })
  }

  function check() {
    const answer = activeSlots.map((s) => (s.kind === 'filled' ? s.word : ''))
    const ok = wordsMatch(answer, words)
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
    setSlots([])
    setFeedback(null)
    setChecked(false)
    setLastOk(false)
    setDraggingBank(null)
    setDragOverSlot(null)
  }

  return (
    <GameChrome
      gameId="scripture-scramble"
      title="Scripture Scramble"
      stepLabel={`${index + 1} / ${verses.length} · ${verse.reference}`}
      onBack={onBack}
      footer={
        !checked ? (
          <div className="game-actions">
            <button type="button" className="btn ghost" onClick={undo} disabled={!filledCount}>
              Undo
            </button>
            <button
              type="button"
              className="btn primary"
              disabled={filledCount !== words.length}
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
        Rebuild the verse in order. Click a word to place it in the next empty slot, or drag it onto a
        slot. Tap a placed word to remove it.
      </p>
      <p className="muted tiny">Score: {score}</p>

      <div
        className="scramble-slots"
        aria-label="Verse slots"
        onDragOver={(e) => {
          if (draggingBank == null || checked) return
          e.preventDefault()
        }}
      >
        {activeSlots.map((slot, i) => (
          <button
            key={`slot-${i}`}
            type="button"
            className={`scramble-slot ${slot.kind === 'empty' ? 'empty' : 'filled'} ${
              dragOverSlot === i ? 'drop-target' : ''
            } ${i === nextEmpty && slot.kind === 'empty' ? 'next' : ''}`}
            disabled={checked && slot.kind === 'empty'}
            onClick={() => {
              if (slot.kind === 'filled') clearSlot(i)
            }}
            onDragOver={(e) => {
              if (draggingBank == null || checked) return
              e.preventDefault()
              setDragOverSlot(i)
            }}
            onDragLeave={() => setDragOverSlot((cur) => (cur === i ? null : cur))}
            onDrop={(e) => {
              e.preventDefault()
              const raw = e.dataTransfer.getData('text/plain')
              const bankIndex = Number(raw)
              setDragOverSlot(null)
              setDraggingBank(null)
              if (Number.isFinite(bankIndex)) placeFromBank(bankIndex, i)
            }}
          >
            {slot.kind === 'filled' ? slot.word : i === nextEmpty ? '…' : '·'}
          </button>
        ))}
      </div>

      <div className="scramble-bank" aria-label="Word bank">
        {bank.map((w, i) => {
          const used = usedBank.has(i)
          return (
            <button
              key={`${i}-${w}`}
              type="button"
              className={`chip ${used ? 'used' : ''}`}
              draggable={!checked && !used}
              disabled={checked || used}
              onClick={() => placeFromBank(i)}
              onDragStart={(e) => {
                if (checked || used) {
                  e.preventDefault()
                  return
                }
                e.dataTransfer.setData('text/plain', String(i))
                e.dataTransfer.effectAllowed = 'move'
                setDraggingBank(i)
              }}
              onDragEnd={() => {
                setDraggingBank(null)
                setDragOverSlot(null)
              }}
            >
              {w}
            </button>
          )
        })}
      </div>
      {checked && <AriReactionCue active correct={lastOk} />}
      {feedback && <p className={`nudge ${lastOk ? 'good' : 'risk'}`}>{feedback}</p>}
    </GameChrome>
  )
}
