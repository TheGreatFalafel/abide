'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getLanguageLesson,
  hearItUrl,
  type LanguageContentBlock,
  type LanguageExercise,
  type LanguageTrackId,
} from '../../data/languages'
import type { LessonResult } from '../../lib/progress'
import { completeLanguageLesson, touchLanguageLesson } from '../../lib/progress'
import { useScrollOnChange } from '../../lib/useScrollOnChange'
import type { UserState } from '../../lib/types'

type Phase = 'study' | 'practice' | 'reflect'

type Props = {
  lessonId: string
  track: LanguageTrackId
  user: UserState
  onUserChange: (user: UserState) => void
  onComplete: (result: LessonResult) => void
  onBack: () => void
}

function BlockView({
  block,
  rtl,
}: {
  block: LanguageContentBlock
  rtl: boolean
}) {
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
    case 'caution':
      return (
        <section className="curr-block caution nudge risk">
          <strong>Method caution</strong>
          <p>{block.body}</p>
        </section>
      )
    case 'rtl_note':
      return (
        <section className="curr-block">
          <p className="muted">{block.body}</p>
        </section>
      )
    case 'example':
      return (
        <section className="curr-block lang-example">
          <p
            className={`lang-original ${rtl ? 'rtl' : 'ltr'}`}
            lang={rtl ? 'he' : 'el'}
            dir={rtl ? 'rtl' : 'ltr'}
          >
            {block.original}
          </p>
          {block.transliteration ? (
            <p className="muted tiny">{block.transliteration}</p>
          ) : null}
          <p>{block.gloss}</p>
          {block.note ? <p className="muted">{block.note}</p> : null}
        </section>
      )
    default:
      return null
  }
}

function scoreExercise(
  ex: LanguageExercise,
  picked: number | null,
  alphabetPick: string | null,
  targetLetterId: string | null,
): boolean | null {
  if (ex.kind === 'passage_guide') return true
  if (ex.kind === 'alphabet_match') {
    if (!alphabetPick || !targetLetterId) return null
    return alphabetPick === targetLetterId
  }
  if (picked === null) return null
  if (ex.kind === 'mc') return picked === ex.question.answer
  return picked === ex.answer
}

export function LanguageLessonSession({
  lessonId,
  track,
  user,
  onUserChange,
  onComplete,
  onBack,
}: Props) {
  const found = useMemo(() => getLanguageLesson(lessonId), [lessonId])
  const [phase, setPhase] = useState<Phase>('study')
  const [step, setStep] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [alphabetPick, setAlphabetPick] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [reflectText, setReflectText] = useState('')
  const [reflectIndex, setReflectIndex] = useState(0)
  const [targetLetterId, setTargetLetterId] = useState<string | null>(null)
  const sessionTopRef = useRef<HTMLElement>(null)

  useScrollOnChange(sessionTopRef, [lessonId, track, phase, step, reflectIndex], {
    windowTop: true,
  })

  useEffect(() => {
    if (!found) return
    onUserChange(touchLanguageLesson(user, track, lessonId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, track])

  useEffect(() => {
    if (!found) return
    const exercise = found.lesson.exercises[step]
    if (exercise?.kind === 'alphabet_match' && exercise.letterIds.length) {
      setTargetLetterId(
        exercise.letterIds[step % exercise.letterIds.length] ?? exercise.letterIds[0],
      )
    }
  }, [found, step])

  const letterById = useMemo(
    () => new Map((found?.course.alphabet ?? []).map((l) => [l.id, l])),
    [found],
  )

  if (!found || found.course.id !== track) {
    return (
      <div className="screen session">
        <p className="muted center">Language lesson not found.</p>
        <button type="button" className="btn primary" onClick={onBack}>
          Back
        </button>
      </div>
    )
  }

  const { course, lesson } = found
  const rtl = course.scriptDirection === 'rtl'
  const exercises = lesson.exercises
  const ex = exercises[step]
  const alreadyDone = user.languages?.[track]?.completedLessonIds?.includes(lesson.id)

  function finish(reflectionDone: boolean, c: number, t: number) {
    const result = completeLanguageLesson(user, {
      track,
      lessonId: lesson.id,
      correct: c,
      total: t,
      reflectionDone,
    })
    onUserChange(result.state)
    onComplete(result)
  }

  function goNext(nextCorrect: number, nextTotal: number) {
    if (step >= exercises.length - 1) {
      setCorrect(nextCorrect)
      setTotal(nextTotal)
      setPhase('reflect')
      setReflectIndex(0)
      setReflectText('')
      return
    }
    setStep((s) => s + 1)
    setPicked(null)
    setAlphabetPick(null)
    setChecked(false)
    setCorrect(nextCorrect)
    setTotal(nextTotal)
  }

  return (
    <div className="screen session curriculum-session language-session">
      <header className="session-top" ref={sessionTopRef}>
        <button type="button" className="btn ghost" onClick={onBack}>
          ← Learn
        </button>
        <div>
          <p className="brand sm">{course.title}</p>
          <h1>{lesson.title}</h1>
          <p className="muted">
            ~{lesson.estimatedMinutes} min
            {alreadyDone ? ' · review' : ''} ·{' '}
            {phase === 'study' ? 'Study' : phase === 'practice' ? 'Practice' : 'Reflection'}
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
          <p className="muted tiny">{course.pronunciationNote}</p>
          {lesson.content.map((block, i) => (
            <BlockView key={i} block={block} rtl={rtl} />
          ))}
          {lesson.introduceVocabIds?.length ? (
            <section className="curr-block">
              <h3>Vocabulary</h3>
              <ul className="lang-vocab-hear">
                {lesson.introduceVocabIds.map((vid) => {
                  const entry = course.vocabulary.find((v) => v.id === vid)
                  if (!entry) return null
                  const hear = hearItUrl(entry)
                  return (
                    <li key={vid}>
                      <span
                        className={rtl ? 'rtl' : 'ltr'}
                        lang={rtl ? 'he' : 'el'}
                        dir={rtl ? 'rtl' : 'ltr'}
                      >
                        {entry.lemma}
                      </span>{' '}
                      <span className="muted">
                        ({entry.transliteration}) — {entry.gloss}
                      </span>
                      {hear ? (
                        <>
                          {' '}
                          <a
                            className="btn ghost tiny"
                            href={hear}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Hear it
                          </a>
                          <span className="muted tiny"> Blue Letter Bible lexicon</span>
                        </>
                      ) : entry.strongs ? (
                        <span className="muted tiny">
                          {' '}
                          (Hear it pending Strong&apos;s verification)
                        </span>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}
          <button
            type="button"
            className="btn primary sticky-cta"
            onClick={() => {
              setPhase('practice')
              setStep(0)
              setCorrect(0)
              setTotal(0)
              setPicked(null)
              setChecked(false)
            }}
          >
            Continue to practice
          </button>
        </div>
      )}

      {phase === 'practice' && ex && (
        <div className="reflect enter">
          <p className="eyebrow">
            Exercise {step + 1} of {exercises.length}
          </p>

          {ex.kind === 'alphabet_match' && targetLetterId && (
            <>
              <h2>{ex.prompt}</h2>
              <p
                className={`lang-prompt-glyph ${rtl ? 'rtl' : 'ltr'}`}
                lang={rtl ? 'he' : 'el'}
                dir={rtl ? 'rtl' : 'ltr'}
              >
                {letterById.get(targetLetterId)?.glyph}
              </p>
              <div className="options">
                {ex.letterIds.slice(0, 6).map((id) => {
                  const letter = letterById.get(id)
                  if (!letter) return null
                  let cls = 'option'
                  if (checked) {
                    if (id === targetLetterId) cls += ' correct'
                    else if (id === alphabetPick) cls += ' wrong'
                  } else if (id === alphabetPick) cls += ' selected'
                  return (
                    <button
                      key={id}
                      type="button"
                      className={cls}
                      disabled={checked}
                      onClick={() => setAlphabetPick(id)}
                    >
                      {letter.name} ({letter.transliteration})
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {ex.kind === 'mc' && (
            <>
              <h2>{ex.question.prompt}</h2>
              <div className="options">
                {ex.question.choices.map((c, i) => {
                  let cls = 'option'
                  if (checked) {
                    if (i === ex.question.answer) cls += ' correct'
                    else if (i === picked) cls += ' wrong'
                  } else if (i === picked) cls += ' selected'
                  return (
                    <button
                      key={c}
                      type="button"
                      className={cls}
                      disabled={checked}
                      onClick={() => setPicked(i)}
                    >
                      {c}
                    </button>
                  )
                })}
              </div>
              {checked && ex.question.explanation ? (
                <p className="muted">{ex.question.explanation}</p>
              ) : null}
            </>
          )}

          {(ex.kind === 'parse' || ex.kind === 'translate') && (
            <>
              <h2>{ex.prompt}</h2>
              <p
                className={`lang-original ${rtl ? 'rtl' : 'ltr'}`}
                lang={rtl ? 'he' : 'el'}
                dir={rtl ? 'rtl' : 'ltr'}
              >
                {ex.kind === 'parse' ? ex.form : ex.original}
              </p>
              {ex.transliteration ? <p className="muted tiny">{ex.transliteration}</p> : null}
              <div className="options">
                {ex.choices.map((c, i) => {
                  let cls = 'option'
                  if (checked) {
                    if (i === ex.answer) cls += ' correct'
                    else if (i === picked) cls += ' wrong'
                  } else if (i === picked) cls += ' selected'
                  return (
                    <button
                      key={c}
                      type="button"
                      className={cls}
                      disabled={checked}
                      onClick={() => setPicked(i)}
                    >
                      {c}
                    </button>
                  )
                })}
              </div>
              {checked ? <p className="muted">{ex.explanation}</p> : null}
            </>
          )}

          {ex.kind === 'passage_guide' && (
            <>
              <h2>Guided reading — {ex.reference}</h2>
              <p
                className={`lang-original large ${rtl ? 'rtl' : 'ltr'}`}
                lang={rtl ? 'he' : 'el'}
                dir={rtl ? 'rtl' : 'ltr'}
              >
                {ex.originalSnippet}
              </p>
              <p className="muted">{ex.transliteration}</p>
              <p>{ex.gloss}</p>
              <section className="curr-block">
                <h3>Analysis</h3>
                <p>{ex.analysis}</p>
              </section>
              <p className="nudge risk">{ex.caution}</p>
            </>
          )}

          {!checked && ex.kind !== 'passage_guide' ? (
            <button
              type="button"
              className="btn primary"
              disabled={
                ex.kind === 'alphabet_match' ? !alphabetPick : picked === null
              }
              onClick={() => {
                const ok = scoreExercise(ex, picked, alphabetPick, targetLetterId)
                const nextCorrect = correct + (ok ? 1 : 0)
                const nextTotal = total + 1
                setCorrect(nextCorrect)
                setTotal(nextTotal)
                setChecked(true)
              }}
            >
              Check
            </button>
          ) : (
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                if (ex.kind === 'passage_guide' && !checked) {
                  const nextCorrect = correct + 1
                  const nextTotal = total + 1
                  setChecked(true)
                  goNext(nextCorrect, nextTotal)
                  return
                }
                goNext(correct, total)
              }}
            >
              {step >= exercises.length - 1 ? 'Continue to reflection' : 'Next'}
            </button>
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
            placeholder="Respond thoughtfully…"
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
              finish(true, correct, Math.max(total, 1))
            }}
          >
            {reflectIndex < lesson.reflectionPrompts.length - 1
              ? 'Next reflection'
              : alreadyDone
                ? 'Finish review'
                : 'Complete lesson'}
          </button>
          {alreadyDone ? (
            <p className="muted">Review does not award additional XP.</p>
          ) : (
            <p className="muted">XP is awarded once when practice and reflection are finished.</p>
          )}
        </div>
      )}
    </div>
  )
}
