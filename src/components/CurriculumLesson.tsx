'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  assembleCurriculumQuestions,
  curriculumPrimaryPassagesReady,
  getCurriculumLesson,
} from '../data/curriculum'
import type { ContentBlock } from '../data/curriculum/types'
import { fetchPassage, type PassageContent } from '../lib/bibleApi'
import type { LessonResult } from '../lib/progress'
import { completeCurriculumLesson, touchCurriculumLesson } from '../lib/progress'
import { useScrollOnChange } from '../lib/useScrollOnChange'
import type { UserState } from '../lib/types'
import { EsvAttribution } from './EsvAttribution'

type Phase = 'study' | 'quiz' | 'reflect'

type Props = {
  lessonId: string
  user: UserState
  onUserChange: (user: UserState) => void
  onComplete: (result: LessonResult) => void
  onBack: () => void
}

function BlockView({ block }: { block: ContentBlock }) {
  switch (block.kind) {
    case 'teaching':
      return (
        <section className="curr-block">
          {block.title ? <h3>{block.title}</h3> : null}
          <p>{block.body}</p>
        </section>
      )
    case 'concept':
      return (
        <section className="curr-block concept">
          <h3>{block.term}</h3>
          <p>{block.explanation}</p>
        </section>
      )
    case 'distinction':
      return (
        <section className="curr-block distinction">
          <h3>Text and teaching</h3>
          <p>
            <strong>What the passage states:</strong> {block.biblical}
          </p>
          <p>
            <strong>Reformed interpretation:</strong> {block.interpretation}
          </p>
          {block.disagreement ? (
            <p className="muted">
              <strong>Where Christians differ:</strong> {block.disagreement}
            </p>
          ) : null}
        </section>
      )
    case 'scripture_focus': {
      const p = block.passage
      const ref = `${p.bookName} ${p.chapter}${
        p.verseStart
          ? `:${p.verseStart}${p.verseEnd && p.verseEnd !== p.verseStart ? `–${p.verseEnd}` : ''}`
          : ''
      }`
      return (
        <section className="curr-block scripture-focus">
          <h3>Scripture focus — {ref}</h3>
          <p className="muted">{block.note}</p>
        </section>
      )
    }
    case 'attribution':
      return (
        <section className="curr-block attribution muted">
          <p>
            <strong>
              {block.teacherId === 'grudem'
                ? 'Wayne Grudem'
                : block.teacherId === 'sproul'
                  ? 'R.C. Sproul'
                  : block.teacherId === 'macarthur'
                    ? 'John MacArthur'
                    : block.teacherId === 'schaff'
                      ? 'Philip Schaff'
                      : block.teacherId === 'needham'
                        ? 'Nick Needham'
                        : block.teacherId === 'gonzalez'
                          ? 'Justo L. González'
                          : block.teacherId === 'packer'
                            ? 'J.I. Packer'
                            : block.teacherId === 'frame'
                              ? 'John M. Frame'
                              : block.teacherId}
            </strong>{' '}
            (<em>{block.work}</em>): {block.note}
          </p>
        </section>
      )
    default:
      return null
  }
}

export function CurriculumLessonSession({
  lessonId,
  user,
  onUserChange,
  onComplete,
  onBack,
}: Props) {
  const found = useMemo(() => getCurriculumLesson(lessonId), [lessonId])
  const [phase, setPhase] = useState<Phase>('study')
  const [passages, setPassages] = useState<(PassageContent | null)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadNonce, setLoadNonce] = useState(0)
  const [step, setStep] = useState(0)
  const [correctMc, setCorrectMc] = useState(0)
  const [totalMc, setTotalMc] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [openText, setOpenText] = useState('')
  const [reflectText, setReflectText] = useState('')
  const [reflectIndex, setReflectIndex] = useState(0)
  const sessionTopRef = useRef<HTMLElement>(null)

  useScrollOnChange(sessionTopRef, [lessonId, phase, step, reflectIndex], {
    windowTop: true,
  })

  const questions = useMemo(
    () => (found ? assembleCurriculumQuestions(found.topic, found.lesson) : []),
    [found],
  )

  const primaryCount = found?.lesson.primaryPassages.length ?? 0
  const primaryReady = curriculumPrimaryPassagesReady(primaryCount, passages, loading)

  const loadPassages = useCallback(() => {
    if (!found) return
    let cancelled = false
    const refs = [...found.lesson.primaryPassages, ...found.lesson.supportingPassages]
    setLoading(true)
    setError(null)
    setPassages(Array(refs.length).fill(null))

    void (async () => {
      const results = await Promise.all(
        refs.map(async (p) => {
          try {
            return await fetchPassage(p, {
              translation: user.translationId,
              esvApiKey: user.esvApiKey,
            })
          } catch (err) {
            return err instanceof Error ? err : new Error('Could not load Scripture')
          }
        }),
      )
      if (cancelled) return

      const next: (PassageContent | null)[] = results.map((r) =>
        r instanceof Error ? null : r,
      )
      setPassages(next)

      const primaryFails = results
        .slice(0, found.lesson.primaryPassages.length)
        .map((r, i) => ({ r, i }))
        .filter(({ r }) => r instanceof Error)

      if (primaryFails.length) {
        const messages = primaryFails.map(({ r, i }) => {
          const ref = found.lesson.primaryPassages[i]
          const label = `${ref.bookName} ${ref.chapter}`
          return `${label}: ${r instanceof Error ? r.message : 'unavailable'}`
        })
        setError(
          `Required Scripture could not be loaded (and is not cached offline). ${messages.join(
            ' · ',
          )}`,
        )
      } else {
        setError(null)
      }
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [found, user.translationId, user.esvApiKey])

  useEffect(() => {
    if (!found) return
    onUserChange(touchCurriculumLesson(user, lessonId))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resume pointer only on open
  }, [lessonId])

  useEffect(() => {
    const cancel = loadPassages()
    return cancel
  }, [loadPassages, loadNonce])

  if (!found) {
    return (
      <div className="screen session">
        <p className="muted center">Lesson not found.</p>
        <button type="button" className="btn primary" onClick={onBack}>
          Back
        </button>
      </div>
    )
  }

  const { topic, lesson } = found
  const q = questions[step]
  const alreadyDone = user.curriculum?.completedLessonIds?.includes(lesson.id)

  function finishLesson(reflectionDone: boolean, mcCorrect: number, mcTotal: number) {
    const result = completeCurriculumLesson(user, {
      topicId: topic.id,
      lessonId: lesson.id,
      correctMc: mcCorrect,
      totalMc: mcTotal,
      reflectionDone,
    })
    onUserChange(result.state)
    onComplete(result)
  }

  function goQuizNext(nextCorrect: number, nextTotal: number) {
    if (step >= questions.length - 1) {
      setCorrectMc(nextCorrect)
      setTotalMc(nextTotal)
      setPhase('reflect')
      setReflectIndex(0)
      setReflectText('')
      return
    }
    setStep((s) => s + 1)
    setPicked(null)
    setChecked(false)
    setOpenText('')
    setCorrectMc(nextCorrect)
    setTotalMc(nextTotal)
  }

  return (
    <div className="screen session curriculum-session">
      <header className="session-top" ref={sessionTopRef}>
        <button type="button" className="btn ghost" onClick={onBack}>
          ← Learn
        </button>
        <div>
          <p className="brand sm">{topic.title}</p>
          <h1>{lesson.title}</h1>
          <p className="muted">
            ~{lesson.estimatedMinutes} min
            {alreadyDone ? ' · review' : ''} ·{' '}
            {phase === 'study' ? 'Study' : phase === 'quiz' ? 'Questions' : 'Reflection'}
          </p>
        </div>
      </header>

      {phase === 'study' && (
        <div className="curr-study">
          <div className="learn-objectives">
            <strong>Objectives</strong>
            <ul>
              {lesson.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>

          {loading && <p className="muted">Loading Scripture…</p>}
          {error && (
            <div className="nudge risk" role="alert">
              <p>{error}</p>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setLoadNonce((n) => n + 1)}
              >
                Retry Scripture
              </button>
            </div>
          )}

          {!loading &&
            passages.slice(0, lesson.primaryPassages.length).map((p, i) =>
              p ? (
                <article key={p.reference} className="passage-card">
                  <h3>{p.reference}</h3>
                  {p.verses.map((v) => (
                    <p key={v.number}>
                      <sup>{v.number}</sup> {v.text}
                    </p>
                  ))}
                </article>
              ) : (
                <article key={`missing-primary-${i}`} className="passage-card">
                  <h3>
                    {lesson.primaryPassages[i].bookName} {lesson.primaryPassages[i].chapter}
                  </h3>
                  <p className="muted">Unavailable offline — connect and retry.</p>
                </article>
              ),
            )}

          {lesson.content.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}

          {passages.length > lesson.primaryPassages.length && (
            <details className="curr-supporting">
              <summary>Supporting passages</summary>
              {passages.slice(lesson.primaryPassages.length).map((p, i) =>
                p ? (
                  <article key={p.reference} className="passage-card">
                    <h3>{p.reference}</h3>
                    {p.verses.map((v) => (
                      <p key={v.number}>
                        <sup>{v.number}</sup> {v.text}
                      </p>
                    ))}
                  </article>
                ) : (
                  <p key={`missing-support-${i}`} className="muted">
                    Supporting passage unavailable offline.
                  </p>
                ),
              )}
            </details>
          )}

          {lesson.furtherStudy?.length ? (
            <section className="curr-block">
              <h3>Further study</h3>
              <ul>
                {lesson.furtherStudy.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {user.translationId === 'esv' ? <EsvAttribution compact /> : null}

          <button
            type="button"
            className="btn primary sticky-cta"
            disabled={loading || !primaryReady}
            onClick={() => {
              setPhase('quiz')
              setStep(0)
              setCorrectMc(0)
              setTotalMc(0)
              setPicked(null)
              setChecked(false)
            }}
          >
            Continue to questions
          </button>
          {!loading && !primaryReady && (
            <p className="muted center">
              Load required Scripture (online or from cache) before continuing.
            </p>
          )}
        </div>
      )}

      {phase === 'quiz' && q && (
        <div className="reflect enter">
          <p className="eyebrow">
            Question {step + 1} of {questions.length}
          </p>
          <h2>{q.prompt}</h2>
          {q.type === 'mc' ? (
            <>
              <div className="options">
                {q.choices.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    className={`option ${picked === i ? 'selected' : ''} ${
                      checked
                        ? i === q.answer
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
              {checked && (
                <div className={`nudge ${picked === q.answer ? 'good' : 'risk'}`}>
                  <p>
                    {picked === q.answer ? 'Correct!' : `Not quite — “${q.choices[q.answer]}”`}
                  </p>
                  {q.explanation ? <p className="muted">{q.explanation}</p> : null}
                </div>
              )}
              {!checked ? (
                <button
                  type="button"
                  className="btn primary"
                  disabled={picked === null}
                  onClick={() => {
                    if (picked === null) return
                    const ok = picked === q.answer
                    const nextCorrect = correctMc + (ok ? 1 : 0)
                    const nextTotal = totalMc + 1
                    setCorrectMc(nextCorrect)
                    setTotalMc(nextTotal)
                    setChecked(true)
                  }}
                >
                  Check answer
                </button>
              ) : (
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => goQuizNext(correctMc, totalMc)}
                >
                  {step >= questions.length - 1 ? 'Continue to reflection' : 'Next'}
                </button>
              )}
            </>
          ) : (
            <>
              <textarea
                className="field area"
                rows={4}
                value={openText}
                onChange={(e) => setOpenText(e.target.value)}
                placeholder="Write a short answer…"
              />
              {q.reflection ? <p className="muted">{q.reflection}</p> : null}
              <button
                type="button"
                className="btn primary"
                disabled={openText.trim().length < 8}
                onClick={() => goQuizNext(correctMc, totalMc)}
              >
                {step >= questions.length - 1 ? 'Continue to reflection' : 'Next'}
              </button>
            </>
          )}
        </div>
      )}

      {phase === 'reflect' && (
        <div className="reflect enter">
          <p className="eyebrow">
            Reflection {reflectIndex + 1} of {lesson.reflectionPrompts.length}
          </p>
          <h2>{lesson.reflectionPrompts[reflectIndex]}</h2>
          <textarea
            className="field area"
            rows={5}
            value={reflectText}
            onChange={(e) => setReflectText(e.target.value)}
            placeholder="Respond honestly before God…"
          />
          <button
            type="button"
            className="btn primary"
            disabled={reflectText.trim().length < 12}
            onClick={() => {
              if (reflectIndex < lesson.reflectionPrompts.length - 1) {
                setReflectIndex((i) => i + 1)
                setReflectText('')
                return
              }
              finishLesson(true, correctMc, Math.max(totalMc, 1))
            }}
          >
            {reflectIndex < lesson.reflectionPrompts.length - 1
              ? 'Next reflection'
              : alreadyDone
                ? 'Finish review'
                : 'Complete lesson'}
          </button>
          {alreadyDone ? (
            <p className="muted">Reviewing a completed lesson does not award additional XP.</p>
          ) : (
            <p className="muted">XP is awarded only when questions and reflection are finished.</p>
          )}
        </div>
      )}
    </div>
  )
}
