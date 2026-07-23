import { useMemo, useState } from 'react'
import type { SectionQuiz } from '../data/planQuizzes'
import { PLAN_QUIZZES } from '../data/planQuizzes'

type Props = {
  planId: string
  quizIndex: number
  quizId?: string
  title: string
  onComplete: (result: { correctMc: number; totalMc: number }) => void
  onBack: () => void
}

export function SectionQuizSession({
  planId,
  quizIndex,
  quizId,
  title,
  onComplete,
  onBack,
}: Props) {
  const quiz: SectionQuiz | null = useMemo(() => {
    const pack = PLAN_QUIZZES[planId]
    if (!pack) return null
    if (quizId) {
      return pack.quizzes.find((q) => q.id === quizId) ?? pack.quizzes[quizIndex] ?? null
    }
    return pack.quizzes[quizIndex] ?? null
  }, [planId, quizId, quizIndex])

  const [step, setStep] = useState(0)
  const [correctMc, setCorrectMc] = useState(0)
  const [totalMc, setTotalMc] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [openText, setOpenText] = useState('')

  if (!quiz) {
    return (
      <div className="screen session">
        <p className="muted center">Quiz not found.</p>
        <button className="btn primary" onClick={onBack}>
          Back
        </button>
      </div>
    )
  }

  const q = quiz.questions[step]
  const last = step >= quiz.questions.length - 1

  function goNext(nextCorrect: number, nextTotal: number) {
    if (last) {
      onComplete({ correctMc: nextCorrect, totalMc: nextTotal })
      return
    }
    setStep((s) => s + 1)
    setPicked(null)
    setChecked(false)
    setOpenText('')
  }

  function checkMc() {
    if (picked === null || q.type !== 'mc') return
    const ok = picked === q.answer
    const nextCorrect = correctMc + (ok ? 1 : 0)
    const nextTotal = totalMc + 1
    setCorrectMc(nextCorrect)
    setTotalMc(nextTotal)
    setChecked(true)
  }

  return (
    <div className="screen session">
      <header className="session-bar">
        <button className="btn ghost" onClick={onBack}>
          ←
        </button>
        <div>
          <p className="brand sm">Abide</p>
          <strong>
            {title} · {step + 1}/{quiz.questions.length}
          </strong>
        </div>
        <div className="session-progress">?</div>
      </header>

      <div className="reflect enter">
        <p className="eyebrow">{quiz.blurb}</p>
        <h2>{q.prompt}</h2>

        {q.type === 'mc' && (
          <>
            <div className="options">
              {q.choices.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  className={`option ${picked === i ? 'selected' : ''}`}
                  disabled={checked}
                  onClick={() => setPicked(i)}
                >
                  {c}
                </button>
              ))}
            </div>
            {checked && q.type === 'mc' && (
              <p className={`nudge ${picked === q.answer ? 'good' : 'risk'}`}>
                {picked === q.answer ? 'Correct!' : `Not quite — “${q.choices[q.answer]}”`}
              </p>
            )}
            {!checked ? (
              <button className="btn primary" disabled={picked === null} onClick={checkMc}>
                Check answer
              </button>
            ) : (
              <button
                className="btn primary"
                onClick={() => goNext(correctMc, totalMc)}
              >
                {last ? 'Finish section quiz' : 'Next'}
              </button>
            )}
          </>
        )}

        {q.type === 'open' && (
          <>
            <textarea
              className="field area"
              rows={4}
              placeholder="Write freely — no wrong answer…"
              value={openText}
              onChange={(e) => setOpenText(e.target.value)}
            />
            {q.reflection && openText.trim().length > 8 && (
              <p className="muted">{q.reflection}</p>
            )}
            <button
              className="btn primary"
              disabled={openText.trim().length < 3}
              onClick={() => goNext(correctMc, totalMc)}
            >
              {last ? 'Finish section quiz' : 'Next'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
