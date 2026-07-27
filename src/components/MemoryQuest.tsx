'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  buildMemoryQuestDeck,
  completeMemoryQuest,
  type LessonResult,
} from '../lib/progress'
import type { MemoryVerse, UserState } from '../lib/types'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
  onComplete: (result: LessonResult) => void
  onBack: () => void
  onGoMemory: () => void
}

const QUEST_SECONDS = 120
const QUEST_ROUNDS = 5

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildChoices(answer: MemoryVerse, bank: MemoryVerse[]): string[] {
  const distractors = shuffle(bank.filter((v) => v.id !== answer.id && v.text?.trim()))
    .slice(0, 3)
    .map((v) => v.text)
  while (distractors.length < 3) {
    distractors.push('(Keep practicing — add more verses for harder quizzes)')
  }
  return shuffle([answer.text, ...distractors.slice(0, 3)])
}

export function MemoryQuest({
  user,
  onUserChange,
  onComplete,
  onBack,
  onGoMemory,
}: Props) {
  const deck = useMemo(() => buildMemoryQuestDeck(user, QUEST_ROUNDS), [user])
  const [started, setStarted] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(QUEST_SECONDS)
  const [step, setStep] = useState(0)
  const [choices, setChoices] = useState<string[]>([])
  const [pick, setPick] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState<{ verseId: string; correct: boolean }[]>([])
  const [timedOut, setTimedOut] = useState(false)
  const finishedRef = useRef(false)
  const resultsRef = useRef(results)
  resultsRef.current = results

  const current = deck[step]
  const correctCount = results.filter((r) => r.correct).length

  useEffect(() => {
    if (!started || !current) return
    setChoices(buildChoices(current, user.memoryVerses))
    setPick(null)
    setChecked(false)
  }, [started, step, current, user.memoryVerses])

  useEffect(() => {
    if (!started || finishedRef.current) return
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id)
          setTimedOut(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [started])

  function wrapUp(finalResults: { verseId: string; correct: boolean }[]) {
    if (finishedRef.current) return
    finishedRef.current = true
    const result = completeMemoryQuest(user, { rounds: finalResults })
    onUserChange(result.state)
    onComplete(result)
  }

  function checkAnswer() {
    if (pick === null || !current || checked) return
    const ok = choices[pick] === current.text
    const nextResults = [...results, { verseId: current.id, correct: ok }]
    setResults(nextResults)
    resultsRef.current = nextResults
    setChecked(true)
  }

  function advance() {
    if (!checked) return
    if (step + 1 >= deck.length || timedOut) {
      wrapUp(resultsRef.current)
      return
    }
    setStep((s) => s + 1)
  }

  if (deck.length < 2) {
    return (
      <div className="screen session quest-screen">
        <header className="session-bar">
          <button type="button" className="btn ghost" onClick={onBack}>
            ←
          </button>
          <div>
            <p className="brand sm">Abide</p>
            <strong>2-min Memory Quest</strong>
          </div>
          <div />
        </header>
        <div className="quest-empty enter">
          <h2>Add a couple of verses first</h2>
          <p className="muted">
            Quests pull from your memory bank. Add at least two verses (TMS pack is an easy start),
            then come back for a quick round.
          </p>
          <div className="session-actions">
            <button type="button" className="btn primary" onClick={onGoMemory}>
              Open Memory
            </button>
            <button type="button" className="btn ghost-outline" onClick={onBack}>
              Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="screen session quest-screen">
        <header className="session-bar">
          <button type="button" className="btn ghost" onClick={onBack}>
            ←
          </button>
          <div>
            <p className="brand sm">Abide</p>
            <strong>2-min Memory Quest</strong>
          </div>
          <div />
        </header>
        <div className="quest-intro enter">
          <p className="eyebrow">Quick session</p>
          <h2>Hide the Word in two minutes</h2>
          <p className="muted">
            {Math.min(QUEST_ROUNDS, deck.length)} rapid checks · 2:00 timer · keeps your streak ·
            earns XP for today and the Circle league.
          </p>
          <ul className="quest-bullets">
            <li>See a reference, pick the right wording</li>
            <li>Due verses show up first</li>
            <li>Finish early or race the clock</li>
          </ul>
          <button type="button" className="btn primary" onClick={() => setStarted(true)}>
            Start quest
          </button>
        </div>
      </div>
    )
  }

  const mm = String(Math.floor(secondsLeft / 60))
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const progress = ((step + (checked ? 1 : 0)) / deck.length) * 100
  const lastRound = step + 1 >= deck.length || timedOut

  return (
    <div className="screen session quest-screen">
      <header className="session-bar">
        <button type="button" className="btn ghost" onClick={onBack}>
          ←
        </button>
        <div>
          <p className="brand sm">Abide</p>
          <strong>
            Quest · {Math.min(step + 1, deck.length)}/{deck.length}
          </strong>
        </div>
        <div className={`quest-timer ${secondsLeft <= 20 ? 'urgent' : ''}`}>
          {mm}:{ss}
        </div>
      </header>

      <div className="quest-progress">
        <div className="meter-fill gold" style={{ width: `${progress}%` }} />
      </div>

      {timedOut && !checked && (
        <div className="quest-timeout enter">
          <h2>Time&apos;s up!</h2>
          <p className="muted">
            You got {correctCount}/{results.length} this round. Still counts for streak and XP.
          </p>
          <button type="button" className="btn primary" onClick={() => wrapUp(resultsRef.current)}>
            See results
          </button>
        </div>
      )}

      {current && !(timedOut && !checked) && (
        <div className="quest-round enter" key={current.id}>
          <p className="eyebrow">Which wording matches?</p>
          <h2 className="quest-ref">{current.reference}</h2>
          {current.topic && <p className="memory-meta">{current.topic}</p>}

          <div className="options">
            {choices.map((c, i) => {
              const isAnswer = c === current.text
              const showMark = checked
              return (
                <button
                  key={`${i}-${c.slice(0, 16)}`}
                  type="button"
                  className={`option ${pick === i ? 'selected' : ''} ${
                    showMark && isAnswer ? 'correct' : ''
                  } ${showMark && pick === i && !isAnswer ? 'wrong' : ''}`}
                  disabled={checked}
                  onClick={() => setPick(i)}
                >
                  {c.length > 180 ? `${c.slice(0, 180)}…` : c}
                </button>
              )
            })}
          </div>

          {checked && pick !== null && (
            <p className={`nudge ${choices[pick] === current.text ? 'good' : 'risk'}`}>
              {choices[pick] === current.text
                ? 'Correct!'
                : `Not quite — remember ${current.reference}`}
            </p>
          )}

          <div className="session-actions">
            {!checked ? (
              <button
                type="button"
                className="btn primary"
                disabled={pick === null}
                onClick={checkAnswer}
              >
                Check
              </button>
            ) : (
              <button type="button" className="btn primary" onClick={advance}>
                {lastRound ? 'Finish quest' : 'Next'}
              </button>
            )}
          </div>
          <p className="muted center">
            Score so far: {correctCount}/{results.length || 0}
          </p>
        </div>
      )}
    </div>
  )
}
