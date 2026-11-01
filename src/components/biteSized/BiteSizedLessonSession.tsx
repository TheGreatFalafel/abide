'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { LanguageTrackId } from '../../data/languages'
import { fetchPassage, type PassageContent } from '../../lib/bibleApi'
import {
  makeDraft,
  readCurriculumDraft,
  readLanguageDraft,
  resolveCurriculumBiteLesson,
  resolveLanguageBiteLesson,
  withCurriculumDraft,
  withLanguageDraft,
  type BiteLesson,
  type BiteStep,
} from '../../lib/biteSized'
import type { LessonResult } from '../../lib/progress'
import {
  completeCurriculumLesson,
  completeLanguageLesson,
  saveState,
  touchCurriculumLesson,
  touchLanguageLesson,
} from '../../lib/progress'
import { useScrollOnChange } from '../../lib/useScrollOnChange'
import type { UserState } from '../../lib/types'
import { EsvAttribution } from '../EsvAttribution'
import { BiteExercisePanel } from './BiteExercisePanel'

type Props = {
  subject: 'curriculum' | 'language'
  lessonId: string
  track?: LanguageTrackId
  user: UserState
  onUserChange: (user: UserState) => void
  onComplete: (result: LessonResult) => void
  onBack: () => void
}

function stepKindLabel(kind: BiteStep['kind']): string {
  switch (kind) {
    case 'intro':
      return 'Introduction'
    case 'teach':
      return 'Teach'
    case 'scripture':
      return 'Scripture'
    case 'practice':
      return 'Practice'
    case 'application':
      return 'Apply'
    case 'deeper':
      return 'Deeper study'
    case 'review':
      return 'Review'
    default:
      return 'Step'
  }
}

function passageKey(ref: NonNullable<BiteStep['passage']>): string {
  return `${ref.bookId}:${ref.chapter}:${ref.verseStart ?? ''}:${ref.verseEnd ?? ''}`
}

export function BiteSizedLessonSession({
  subject,
  lessonId,
  track,
  user,
  onUserChange,
  onComplete,
  onBack,
}: Props) {
  const lesson: BiteLesson | null = useMemo(() => {
    if (subject === 'curriculum') return resolveCurriculumBiteLesson(lessonId)
    if (!track) return null
    return resolveLanguageBiteLesson(track, lessonId)
  }, [subject, lessonId, track])

  const initialDraft = useMemo(() => {
    if (subject === 'curriculum') return readCurriculumDraft(user, lessonId)
    if (!track) return null
    return readLanguageDraft(user, track, lessonId)
    // Only seed from storage when opening this lesson.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, subject, track])

  const [stepIndex, setStepIndex] = useState(() =>
    Math.min(initialDraft?.stepIndex ?? 0, Math.max((lesson?.steps.length ?? 1) - 1, 0)),
  )
  const [correct, setCorrect] = useState(() => initialDraft?.correct ?? 0)
  const [total, setTotal] = useState(() => initialDraft?.total ?? 0)
  const [checked, setChecked] = useState(false)
  const [practiceLogged, setPracticeLogged] = useState(false)
  const [reflectText, setReflectText] = useState('')
  const [deeperOpen, setDeeperOpen] = useState(false)
  const [passages, setPassages] = useState<Record<string, PassageContent | null>>({})
  const [loadingPassages, setLoadingPassages] = useState(false)
  const [passageError, setPassageError] = useState<string | null>(null)
  const [loadNonce, setLoadNonce] = useState(0)
  const sessionTopRef = useRef<HTMLElement>(null)
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useScrollOnChange(sessionTopRef, [lessonId, subject, track, stepIndex], {
    windowTop: true,
  })

  const steps = lesson?.steps ?? []
  const step = steps[stepIndex]
  const alreadyDone =
    subject === 'curriculum'
      ? Boolean(user.curriculum?.completedLessonIds?.includes(lessonId))
      : Boolean(track && user.languages?.[track]?.completedLessonIds?.includes(lessonId))

  const persistDraft = useCallback(
    (nextStep: number, nextCorrect: number, nextTotal: number) => {
      if (!lesson) return
      const draft = makeDraft({
        lessonId,
        subject,
        track,
        stepIndex: nextStep,
        correct: nextCorrect,
        total: nextTotal,
      })
      const next =
        subject === 'curriculum'
          ? withCurriculumDraft(user, draft)
          : track
            ? withLanguageDraft(user, track, draft)
            : user
      saveState(next)
      onUserChange(next)
    },
    [lesson, lessonId, onUserChange, subject, track, user],
  )

  const schedulePersist = useCallback(
    (nextStep: number, nextCorrect: number, nextTotal: number) => {
      if (persistTimer.current) clearTimeout(persistTimer.current)
      persistTimer.current = setTimeout(() => {
        persistDraft(nextStep, nextCorrect, nextTotal)
      }, 200)
    },
    [persistDraft],
  )

  useEffect(() => {
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!lesson) return
    if (subject === 'curriculum') {
      onUserChange(touchCurriculumLesson(user, lessonId))
    } else if (track) {
      onUserChange(touchLanguageLesson(user, track, lessonId))
    }
    // Resume pointer only on open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, subject, track])

  const loadPassages = useCallback(() => {
    if (!lesson?.prefetchPassages?.length) {
      setPassages({})
      setLoadingPassages(false)
      setPassageError(null)
      return () => undefined
    }
    let cancelled = false
    setLoadingPassages(true)
    setPassageError(null)

    void (async () => {
      const refs = lesson.prefetchPassages ?? []
      const results = await Promise.all(
        refs.map(async (p) => {
          try {
            const content = await fetchPassage(p, {
              translation: user.translationId,
              esvApiKey: user.esvApiKey,
            })
            return { key: passageKey(p), content }
          } catch (err) {
            return {
              key: passageKey(p),
              content: null as PassageContent | null,
              error: err instanceof Error ? err.message : 'Could not load Scripture',
            }
          }
        }),
      )
      if (cancelled) return
      const map: Record<string, PassageContent | null> = {}
      const errors: string[] = []
      for (const r of results) {
        map[r.key] = r.content
        if (!r.content && 'error' in r && r.error) errors.push(r.error)
      }
      setPassages(map)
      setPassageError(errors.length ? errors.slice(0, 2).join(' · ') : null)
      setLoadingPassages(false)
    })()

    return () => {
      cancelled = true
    }
  }, [lesson, user.translationId, user.esvApiKey])

  useEffect(() => {
    const cancel = loadPassages()
    return cancel
  }, [loadPassages, loadNonce])

  useEffect(() => {
    setChecked(false)
    setPracticeLogged(false)
    setReflectText('')
    setDeeperOpen(false)
  }, [stepIndex])

  if (!lesson || !step) {
    return (
      <div className="screen session">
        <p className="muted center">Lesson not found.</p>
        <button type="button" className="btn primary" onClick={onBack}>
          Back
        </button>
      </div>
    )
  }

  const activeLesson = lesson
  const progressPct = Math.round(((stepIndex + 1) / steps.length) * 100)
  const isLast = stepIndex >= steps.length - 1

  function goNext(nextCorrect = correct, nextTotal = total) {
    if (isLast) {
      finish(nextCorrect, nextTotal)
      return
    }
    const nextStep = stepIndex + 1
    setStepIndex(nextStep)
    setCorrect(nextCorrect)
    setTotal(nextTotal)
    schedulePersist(nextStep, nextCorrect, nextTotal)
  }

  function finish(finalCorrect: number, finalTotal: number) {
    const scoredTotal = Math.max(finalTotal, 1)
    const scoredCorrect = Math.min(finalCorrect, scoredTotal)
    if (subject === 'curriculum' && activeLesson.topicId) {
      const result = completeCurriculumLesson(user, {
        topicId: activeLesson.topicId,
        lessonId: activeLesson.lessonId,
        correctMc: scoredCorrect,
        totalMc: scoredTotal,
        reflectionDone: true,
      })
      onUserChange(result.state)
      onComplete(result)
      return
    }
    if (subject === 'language' && track) {
      const result = completeLanguageLesson(user, {
        track,
        lessonId: activeLesson.lessonId,
        correct: scoredCorrect,
        total: scoredTotal,
        reflectionDone: true,
      })
      onUserChange(result.state)
      onComplete(result)
    }
  }

  function onPracticeResult(ok: boolean) {
    if (practiceLogged) return
    setPracticeLogged(true)
    const nextC = correct + (ok ? 1 : 0)
    const nextT = total + 1
    setCorrect(nextC)
    setTotal(nextT)
    schedulePersist(stepIndex, nextC, nextT)
  }

  const canContinueContent = (() => {
    if (step.kind === 'practice') return checked
    if (step.kind === 'application' && step.prompt) {
      return reflectText.trim().length >= 12
    }
    if (step.kind === 'scripture' && step.passage) {
      const key = passageKey(step.passage)
      const content = passages[key]
      if (loadingPassages && content == null) return false
      // Allow continue if loaded OR after error with retry available (learner may proceed on note-only).
      return true
    }
    return true
  })()

  return (
    <div className="screen session curriculum-session bite-session">
      <header className="session-top" ref={sessionTopRef}>
        <button type="button" className="btn ghost" onClick={onBack}>
          ← Learn
        </button>
        <div className="bite-header-main">
          <p className="brand sm">
            {subject === 'curriculum'
              ? lesson.domain === 'church-history'
                ? 'Church History'
                : lesson.domain === 'evangelism-apologetics'
                  ? 'Evangelism & Apologetics'
                  : 'Theology'
              : track === 'hebrew'
                ? 'Biblical Hebrew'
                : 'Biblical Greek'}
          </p>
          <h1>{lesson.title}</h1>
          <p className="muted">
            ~{lesson.estimatedMinutes} min
            {alreadyDone ? ' · review' : ''}
            {initialDraft && initialDraft.stepIndex > 0 ? ' · resumed' : ''} ·{' '}
            {stepKindLabel(step.kind)}
          </p>
          <div
            className="bite-progress"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Lesson progress ${stepIndex + 1} of ${steps.length}`}
          >
            <div className="bite-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="muted tiny bite-step-count">
            Step {stepIndex + 1} of {steps.length}
          </p>
        </div>
      </header>

      <div className="bite-step enter" key={step.id}>
        <p className="eyebrow">{stepKindLabel(step.kind)}</p>
        <h2>{step.title}</h2>

        {step.term ? (
          <section className="curr-block concept">
            <h3>{step.term}</h3>
            {step.body ? <p>{step.body}</p> : null}
          </section>
        ) : step.body && step.kind !== 'practice' ? (
          <p className="bite-body">{step.body}</p>
        ) : null}

        {step.original ? (
          <section className="curr-block lang-example">
            <p
              className={`lang-original ${step.rtl ? 'rtl' : 'ltr'}`}
              lang={step.rtl ? 'he' : 'el'}
              dir={step.rtl ? 'rtl' : 'ltr'}
            >
              {step.original}
            </p>
            {step.transliteration ? (
              <p className="muted tiny">{step.transliteration}</p>
            ) : null}
            {step.gloss ? <p>{step.gloss}</p> : null}
          </section>
        ) : null}

        {step.kind === 'intro' && step.reviewItems?.length ? (
          <div className="learn-objectives">
            <strong>You will understand</strong>
            <ul>
              {step.reviewItems.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {step.kind === 'scripture' && step.passage ? (
          <div className="bite-scripture">
            {loadingPassages && !passages[passageKey(step.passage)] ? (
              <p className="muted">Loading Scripture…</p>
            ) : null}
            {passageError && !passages[passageKey(step.passage)] ? (
              <div className="nudge risk" role="alert">
                <p>{passageError}</p>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setLoadNonce((n) => n + 1)}
                >
                  Retry Scripture
                </button>
              </div>
            ) : null}
            {passages[passageKey(step.passage)] ? (
              <article className="passage-card">
                <h3>{passages[passageKey(step.passage)]!.reference}</h3>
                {passages[passageKey(step.passage)]!.verses.map((v) => (
                  <p key={v.number}>
                    <sup>{v.number}</sup> {v.text}
                  </p>
                ))}
              </article>
            ) : !loadingPassages ? (
              <article className="passage-card">
                <h3>
                  {step.passage.bookName} {step.passage.chapter}
                  {step.passage.verseStart != null ? `:${step.passage.verseStart}` : ''}
                </h3>
                <p className="muted">Unavailable offline — connect and retry, or continue with the note.</p>
              </article>
            ) : null}
            {step.scriptureNote ? <p className="muted">{step.scriptureNote}</p> : null}
            {user.translationId === 'esv' ? <EsvAttribution compact /> : null}
          </div>
        ) : null}

        {(step.biblical || step.interpretation) && (
          <section className="curr-block distinction">
            <h3>Text and teaching</h3>
            {step.biblical ? (
              <p>
                <strong>
                  {step.distinctionLabels?.biblical ?? 'What the passage states:'}
                </strong>{' '}
                {step.biblical}
              </p>
            ) : null}
            {step.interpretation ? (
              <p>
                <strong>
                  {step.distinctionLabels?.interpretation ?? 'Reformed interpretation:'}
                </strong>{' '}
                {step.interpretation}
              </p>
            ) : null}
            {step.disagreement ? (
              <p className="muted">
                <strong>
                  {step.distinctionLabels?.disagreement ?? 'Where Christians differ:'}
                </strong>{' '}
                {step.disagreement}
              </p>
            ) : null}
          </section>
        )}

        {step.primarySource ? (
          <section className="curr-block bite-primary-source" aria-label="Primary source">
            <p className="eyebrow">Primary source</p>
            <h3>{step.primarySource.work}</h3>
            <p className="muted tiny">
              {step.primarySource.authorOrBody}
              {step.primarySource.approxDate ? ` · ${step.primarySource.approxDate}` : ''}
            </p>
            <p>{step.primarySource.context}</p>
            {step.primarySource.excerpt ? (
              <blockquote className="bite-source-excerpt">
                <p>{step.primarySource.excerpt}</p>
              </blockquote>
            ) : (
              <p className="muted">
                Summary only — no fabricated quotation. See the reference below for a full text.
              </p>
            )}
            <p>
              <strong>Significance:</strong> {step.primarySource.significance}
            </p>
            {step.primarySource.reference ? (
              <p className="muted tiny">
                <strong>Find it:</strong> {step.primarySource.reference}
              </p>
            ) : null}
            <p className="muted tiny">
              <strong>Rights:</strong> {step.primarySource.rightsNote}
            </p>
          </section>
        ) : null}

        {step.kind === 'practice' && step.exercise ? (
          <BiteExercisePanel
            exercise={step.exercise}
            rtl={step.rtl}
            checked={checked}
            onCheckedChange={setChecked}
            onResult={(ok) => {
              onPracticeResult(ok)
            }}
          />
        ) : null}

        {step.kind === 'application' && step.prompt ? (
          <div className="bite-application">
            {step.body ? <p className="muted">{step.body}</p> : null}
            <h3 className="bite-prompt">{step.prompt}</h3>
            <textarea
              className="field area"
              rows={5}
              value={reflectText}
              onChange={(e) => setReflectText(e.target.value)}
              placeholder="Respond thoughtfully…"
              aria-label="Application response"
            />
          </div>
        ) : null}

        {step.kind === 'deeper' ? (
          <details
            className="bite-deeper"
            open={deeperOpen}
            onToggle={(e) => setDeeperOpen((e.target as HTMLDetailsElement).open)}
          >
            <summary>Expand deeper study (optional)</summary>
            {step.body ? <p>{step.body}</p> : null}
            {step.deeperItems?.length ? (
              <ul>
                {step.deeperItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </details>
        ) : null}

        {step.kind === 'review' && step.reviewItems?.length ? (
          <ul className="bite-review-list">
            {step.reviewItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}

        {step.kind !== 'practice' || checked ? (
          <div className="bite-actions">
            <button
              type="button"
              className="btn primary sticky-cta"
              disabled={!canContinueContent}
              onClick={() => goNext()}
            >
              {isLast
                ? alreadyDone
                  ? 'Finish review'
                  : 'Complete lesson'
                : 'Continue'}
            </button>
            {isLast && alreadyDone ? (
              <p className="muted center tiny">
                Reviewing a completed lesson does not award additional XP or gems.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
