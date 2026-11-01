'use client'

import { useEffect, useMemo, useState } from 'react'
import type { BiteConversationChoice, BiteExercise } from '../../lib/biteSized'
import { AriReactionCue } from '../AriReactionCue'

type Props = {
  exercise: BiteExercise
  rtl?: boolean
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  onResult: (correct: boolean) => void
}

function qualityLabel(q: BiteConversationChoice['quality']): string {
  switch (q) {
    case 'helpful':
      return 'Helpful'
    case 'incomplete':
      return 'Incomplete'
    case 'inaccurate':
      return 'Inaccurate'
    case 'hostile':
      return 'Unhelpfully harsh'
    default:
      return q
  }
}

function shuffleIndices(n: number, seed: number): number[] {
  const out = Array.from({ length: n }, (_, i) => i)
  let s = seed || 1
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function BiteExercisePanel({
  exercise,
  rtl = false,
  checked,
  onCheckedChange,
  onResult,
}: Props) {
  const [picked, setPicked] = useState<number | null>(null)
  const [tf, setTf] = useState<boolean | null>(null)
  const [order, setOrder] = useState<number[]>(() =>
    exercise.kind === 'order' ? shuffleIndices(exercise.items.length, 42) : [],
  )
  const [convoStep, setConvoStep] = useState(0)
  const [convoPick, setConvoPick] = useState<number | null>(null)
  const [convoRevealed, setConvoRevealed] = useState(false)
  const [convoHelpfulCount, setConvoHelpfulCount] = useState(0)

  useEffect(() => {
    setPicked(null)
    setTf(null)
    setConvoStep(0)
    setConvoPick(null)
    setConvoRevealed(false)
    setConvoHelpfulCount(0)
    onCheckedChange(false)
    if (exercise.kind === 'order') {
      setOrder(shuffleIndices(exercise.items.length, exercise.items.length * 17 + 3))
    }
    // Reset interaction when the exercise identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional on exercise identity
  }, [exercise])

  const lastCorrect = useMemo(() => {
    if (!checked) return false
    if (exercise.kind === 'passage_guide') return true
    if (exercise.kind === 'conversation') {
      return convoHelpfulCount >= exercise.steps.length
    }
    if (exercise.kind === 'true_false') return tf === exercise.answer
    if (exercise.kind === 'order') {
      return order.every((idx, i) => idx === exercise.answerOrder[i])
    }
    if (picked === null) return false
    return picked === exercise.answer
  }, [checked, exercise, picked, tf, order, convoHelpfulCount])

  if (exercise.kind === 'passage_guide') {
    return (
      <div className="bite-exercise">
        <p className="eyebrow">{exercise.prompt}</p>
        <p className="muted tiny">{exercise.reference}</p>
        <p
          className={`lang-original large ${exercise.rtl || rtl ? 'rtl' : 'ltr'}`}
          lang={exercise.rtl || rtl ? 'he' : 'el'}
          dir={exercise.rtl || rtl ? 'rtl' : 'ltr'}
        >
          {exercise.original}
        </p>
        {exercise.transliteration ? (
          <p className="muted tiny">{exercise.transliteration}</p>
        ) : null}
        <p>
          <strong>Gloss:</strong> {exercise.gloss}
        </p>
        <p>{exercise.analysis}</p>
        <div className="nudge risk">
          <p>
            <strong>Caution:</strong> {exercise.caution}
          </p>
        </div>
        {!checked ? (
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              onCheckedChange(true)
              onResult(true)
            }}
          >
            I understand
          </button>
        ) : (
          <AriReactionCue active correct />
        )}
      </div>
    )
  }

  if (exercise.kind === 'true_false') {
    return (
      <div className="bite-exercise">
        <h2>{exercise.prompt}</h2>
        <div className="options bite-tf">
          {[true, false].map((value) => (
            <button
              key={String(value)}
              type="button"
              className={`option ${tf === value ? 'selected' : ''} ${
                checked
                  ? value === exercise.answer
                    ? 'correct'
                    : tf === value
                      ? 'wrong'
                      : ''
                  : ''
              }`}
              disabled={checked}
              onClick={() => setTf(value)}
            >
              {value ? 'True' : 'False'}
            </button>
          ))}
        </div>
        {checked ? (
          <>
            <div className={`nudge ${lastCorrect ? 'good' : 'risk'}`}>
              <p>{lastCorrect ? 'Correct.' : 'Not quite.'}</p>
              <p className="muted">{exercise.explanation}</p>
            </div>
            <AriReactionCue active correct={lastCorrect} />
          </>
        ) : (
          <button
            type="button"
            className="btn primary"
            disabled={tf === null}
            onClick={() => {
              if (tf === null) return
              const ok = tf === exercise.answer
              onCheckedChange(true)
              onResult(ok)
            }}
          >
            Check answer
          </button>
        )}
      </div>
    )
  }

  if (exercise.kind === 'order') {
    const positionsOk = order.every((idx, i) => idx === exercise.answerOrder[i])
    return (
      <div className="bite-exercise">
        <h2>{exercise.prompt}</h2>
        <ol className="timeline-list bite-order">
          {order.map((itemIndex, i) => {
            const label = exercise.items[itemIndex]
            const right = checked && itemIndex === exercise.answerOrder[i]
            const wrong = checked && !right
            return (
              <li
                key={`${itemIndex}-${i}`}
                className={`timeline-item ${right ? 'correct' : ''} ${wrong ? 'wrong' : ''}`}
              >
                <div className="timeline-controls">
                  <button
                    type="button"
                    className="btn ghost sm"
                    aria-label={`Move ${label} earlier`}
                    disabled={checked || i === 0}
                    onClick={() => {
                      setOrder((prev) => {
                        const next = [...prev]
                        ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
                        return next
                      })
                    }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm"
                    aria-label={`Move ${label} later`}
                    disabled={checked || i === order.length - 1}
                    onClick={() => {
                      setOrder((prev) => {
                        const next = [...prev]
                        ;[next[i + 1], next[i]] = [next[i], next[i + 1]]
                        return next
                      })
                    }}
                  >
                    ↓
                  </button>
                </div>
                <strong>
                  {i + 1}. {label}
                </strong>
              </li>
            )
          })}
        </ol>
        {checked ? (
          <>
            <div className={`nudge ${positionsOk ? 'good' : 'risk'}`}>
              <p>{positionsOk ? 'Correct order.' : 'Review the sequence below.'}</p>
              <p className="muted">{exercise.explanation}</p>
              {!positionsOk ? (
                <p className="muted tiny">
                  Correct: {exercise.answerOrder.map((i) => exercise.items[i]).join(' → ')}
                </p>
              ) : null}
            </div>
            <AriReactionCue active correct={positionsOk} />
          </>
        ) : (
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              const ok = order.every((idx, i) => idx === exercise.answerOrder[i])
              onCheckedChange(true)
              onResult(ok)
            }}
          >
            Check order
          </button>
        )}
      </div>
    )
  }

  if (exercise.kind === 'conversation') {
    const step = exercise.steps[convoStep]
    const choice = convoPick != null ? step?.choices[convoPick] : null
    const isLast = convoStep >= exercise.steps.length - 1

    if (!step) {
      return (
        <div className="bite-exercise">
          <p className="muted">Conversation unavailable.</p>
        </div>
      )
    }

    return (
      <div className="bite-exercise bite-conversation">
        <p className="eyebrow">{exercise.prompt}</p>
        <p className="muted">{exercise.scenario}</p>
        <div className="bite-convo-bubble" role="group" aria-label={`${exercise.partnerName} says`}>
          <p className="muted tiny">{exercise.partnerName}</p>
          <p>{step.partnerLine}</p>
        </div>
        <p className="muted tiny">
          Exchange {convoStep + 1} of {exercise.steps.length}
        </p>
        <div className="options" role="listbox" aria-label="Your reply">
          {step.choices.map((c, i) => (
            <button
              key={`${c.text}-${i}`}
              type="button"
              role="option"
              aria-selected={convoPick === i}
              className={`option ${convoPick === i ? 'selected' : ''} ${
                convoRevealed
                  ? c.quality === 'helpful'
                    ? 'correct'
                    : convoPick === i
                      ? 'wrong'
                      : ''
                  : ''
              }`}
              disabled={convoRevealed || checked}
              onClick={() => setConvoPick(i)}
            >
              {c.text}
            </button>
          ))}
        </div>
        {convoRevealed && choice ? (
          <>
            <div
              className={`nudge ${choice.quality === 'helpful' ? 'good' : 'risk'}`}
            >
              <p>
                <strong>{qualityLabel(choice.quality)}.</strong> {choice.explanation}
              </p>
            </div>
            <AriReactionCue active correct={choice.quality === 'helpful'} />
            {!checked ? (
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  const nextHelpful =
                    convoHelpfulCount + (choice.quality === 'helpful' ? 1 : 0)
                  if (isLast) {
                    setConvoHelpfulCount(nextHelpful)
                    const ok = nextHelpful >= exercise.steps.length
                    onCheckedChange(true)
                    onResult(ok)
                    return
                  }
                  setConvoHelpfulCount(nextHelpful)
                  setConvoStep((s) => s + 1)
                  setConvoPick(null)
                  setConvoRevealed(false)
                }}
              >
                {isLast ? 'Finish conversation' : 'Next exchange'}
              </button>
            ) : null}
          </>
        ) : !checked ? (
          <button
            type="button"
            className="btn primary"
            disabled={convoPick === null}
            onClick={() => {
              if (convoPick === null) return
              setConvoRevealed(true)
            }}
          >
            Check reply
          </button>
        ) : null}
        {checked ? (
          <div className={`nudge ${lastCorrect ? 'good' : 'risk'}`}>
            <p>
              {lastCorrect
                ? 'You chose helpful replies throughout — truth with love.'
                : 'Review the feedback above. Helpful witness listens, clarifies, and avoids hostility.'}
            </p>
          </div>
        ) : null}
      </div>
    )
  }

  // mc | match
  const prompt = exercise.prompt
  const choices = exercise.choices
  const answer = exercise.answer
  const target = exercise.kind === 'match' ? exercise.target : null

  return (
    <div className="bite-exercise">
      <h2>{prompt}</h2>
      {target ? (
        <p
          className={`lang-prompt-glyph ${rtl ? 'rtl' : 'ltr'}`}
          lang={rtl ? 'he' : 'el'}
          dir={rtl ? 'rtl' : 'ltr'}
          aria-label={`Letter ${target}`}
        >
          {target}
        </p>
      ) : null}
      <div className="options" role="listbox" aria-label="Answer choices">
        {choices.map((c, i) => (
          <button
            key={`${c}-${i}`}
            type="button"
            role="option"
            aria-selected={picked === i}
            className={`option ${picked === i ? 'selected' : ''} ${
              checked
                ? i === answer
                  ? 'correct'
                  : picked === i
                    ? 'wrong'
                    : ''
                : ''
            }`}
            disabled={checked}
            onClick={() => setPicked(i)}
          >
            {c}
          </button>
        ))}
      </div>
      {checked ? (
        <>
          <div className={`nudge ${lastCorrect ? 'good' : 'risk'}`}>
            <p>
              {lastCorrect
                ? 'Correct!'
                : `Not quite — “${choices[answer]}”`}
            </p>
            <p className="muted">{exercise.explanation}</p>
          </div>
          <AriReactionCue active correct={lastCorrect} />
        </>
      ) : (
        <button
          type="button"
          className="btn primary"
          disabled={picked === null}
          onClick={() => {
            if (picked === null) return
            const ok = picked === answer
            onCheckedChange(true)
            onResult(ok)
          }}
        >
          Check answer
        </button>
      )}
    </div>
  )
}
