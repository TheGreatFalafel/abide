'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { TMS_SERIES, TMS_VERSES, tmsRefLabel, type TmsVerse } from '../data/tms'
import {
  challengeAction,
  fetchChallenges,
  type ChallengeVerse,
  type MemoryChallenge,
} from '../lib/cloud'
import { fetchVerseRange, passageToPlainText } from '../lib/bibleApi'
import {
  addMemoryVerse,
  makeMemoryId,
  scoreMemoryQuiz,
} from '../lib/progress'
import type { MemoryVerse, UserState } from '../lib/types'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
  myUserId?: string | null
}

function tmsToChallengeVerse(seed: TmsVerse): ChallengeVerse {
  const end = seed.verseEnd ?? seed.verseStart
  return {
    id: makeMemoryId(seed.bookId, seed.chapter, seed.verseStart, end),
    reference: tmsRefLabel(seed),
    bookId: seed.bookId,
    bookName: seed.bookName,
    chapter: seed.chapter,
    verseStart: seed.verseStart,
    verseEnd: end,
  }
}

function endsLabel(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function MemoryChallengePanel({ user, onUserChange, myUserId }: Props) {
  const [challenges, setChallenges] = useState<MemoryChallenge[]>([])
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('Memory quiz race')
  const [seriesId, setSeriesId] = useState<(typeof TMS_SERIES)[number]['id'] | 'memorized'>('A')
  const [days, setDays] = useState(7)

  const [active, setActive] = useState<MemoryChallenge | null>(null)
  const [quizPool, setQuizPool] = useState<MemoryVerse[]>([])
  const [qIndex, setQIndex] = useState(0)
  const [choices, setChoices] = useState<string[]>([])
  const [pick, setPick] = useState<number | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [roundCorrect, setRoundCorrect] = useState(0)
  const [roundAsked, setRoundAsked] = useState(0)

  const reload = useCallback(async () => {
    try {
      const list = await fetchChallenges()
      setChallenges(list)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Could not load challenges')
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const memorized = useMemo(
    () => user.memoryVerses.filter((v) => v.status === 'memorized'),
    [user.memoryVerses],
  )

  function buildVerses(): ChallengeVerse[] {
    if (seriesId === 'memorized') {
      return memorized.slice(0, 40).map((v) => ({
        id: v.id,
        reference: v.reference,
        bookId: v.bookId,
        bookName: v.bookName,
        chapter: v.chapter,
        verseStart: v.verseStart,
        verseEnd: v.verseEnd,
      }))
    }
    return TMS_VERSES.filter((v) => v.seriesId === seriesId).map(tmsToChallengeVerse)
  }

  async function createChallenge() {
    const verses = buildVerses()
    if (verses.length < 2) {
      setMsg(
        seriesId === 'memorized'
          ? 'Mark at least 2 verses memorized first, or pick a TMS series.'
          : 'Need at least 2 verses.',
      )
      return
    }
    setBusy(true)
    setMsg(null)
    const seriesName =
      seriesId === 'memorized'
        ? 'Shared memorized verses'
        : TMS_SERIES.find((s) => s.id === seriesId)?.name || seriesId
    const result = await challengeAction({
      action: 'create',
      name: name.trim() || `${seriesName} race`,
      source: seriesId,
      verses,
      days,
    })
    if (result.error) setMsg(result.error)
    else {
      setMsg('Challenge started — invite your circle to compete!')
      setShowCreate(false)
      await reload()
    }
    setBusy(false)
  }

  async function ensureVersesInBank(challenge: MemoryChallenge): Promise<UserState> {
    let state = user
    const missing = challenge.verses.filter(
      (cv) => !state.memoryVerses.some((v) => v.id === cv.id),
    )
    for (const cv of missing) {
      const content = await fetchVerseRange(
        cv.bookName,
        cv.chapter,
        cv.verseStart,
        cv.verseEnd,
        { translation: state.translationId, esvApiKey: state.esvApiKey },
      )
      const text = passageToPlainText(content)
      const result = addMemoryVerse(state, {
        id: cv.id,
        reference: cv.reference || content.reference,
        text,
        bookName: cv.bookName,
        bookId: cv.bookId,
        chapter: cv.chapter,
        verseStart: cv.verseStart,
        verseEnd: cv.verseEnd,
        translationId: state.translationId,
      })
      state = result.state
    }
    if (state !== user) onUserChange(state)
    return state
  }

  function makeQuestion(pool: MemoryVerse[], index: number) {
    const answer = pool[index]
    if (!answer) return
    const distractors = pool
      .filter((v) => v.id !== answer.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((v) => v.text)
    const bank = user.memoryVerses.filter((v) => !distractors.includes(v.text) && v.id !== answer.id)
    while (distractors.length < 3 && bank.length) {
      const extra = bank[Math.floor(Math.random() * bank.length)]
      if (extra && !distractors.includes(extra.text)) distractors.push(extra.text)
      else break
    }
    const nextChoices = [answer.text, ...distractors].sort(() => Math.random() - 0.5)
    setChoices(nextChoices)
    setPick(null)
    setResult(null)
  }

  async function startCompete(challenge: MemoryChallenge) {
    setBusy(true)
    setMsg(null)
    try {
      const state = await ensureVersesInBank(challenge)
      const pool = challenge.verses
        .map((cv) => state.memoryVerses.find((v) => v.id === cv.id))
        .filter((v): v is MemoryVerse => Boolean(v && v.text?.trim()))
        .sort(() => Math.random() - 0.5)

      if (pool.length < 2) {
        setMsg('Need verse text loaded to quiz — check your translation / ESV key.')
        setBusy(false)
        return
      }

      setActive(challenge)
      setQuizPool(pool)
      setQIndex(0)
      setRoundCorrect(0)
      setRoundAsked(0)
      makeQuestion(pool, 0)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Could not start challenge quiz')
    }
    setBusy(false)
  }

  async function submitAnswer() {
    if (pick === null || !active || !quizPool[qIndex]) return
    const answer = quizPool[qIndex]
    const ok = choices[pick] === answer.text
    setRoundAsked((n) => n + 1)
    if (ok) setRoundCorrect((n) => n + 1)

    const xp = scoreMemoryQuiz(user, ok)
    onUserChange(xp.state)

    const posted = await challengeAction({
      action: 'submit',
      challengeId: active.id,
      correct: ok,
    })
    if (posted.error) {
      setResult(ok ? `Correct! (board sync failed: ${posted.error})` : `Not quite — ${answer.reference}`)
    } else {
      setResult(
        ok
          ? `Correct! +${xp.earnedXp} XP · board ${posted.score?.score ?? '—'} pts`
          : `Not quite — ${answer.reference}`,
      )
    }
  }

  function nextQuestion() {
    if (!quizPool.length) return
    const next = (qIndex + 1) % quizPool.length
    setQIndex(next)
    makeQuestion(quizPool, next)
  }

  async function endChallenge(id: string) {
    if (!confirm('End this challenge early for everyone?')) return
    setBusy(true)
    const result = await challengeAction({ action: 'end', challengeId: id })
    if (result.error) setMsg(result.error)
    await reload()
    setBusy(false)
  }

  if (active) {
    const q = quizPool[qIndex]
    return (
      <div className="settings-block challenge-quiz">
        <p className="eyebrow">{active.name}</p>
        <h3>Challenge quiz</h3>
        <p className="muted">
          Round {roundCorrect}/{roundAsked || 0} correct · {q?.reference}
        </p>
        <h2 className="challenge-prompt">Which text is {q?.reference}?</h2>
        <div className="options">
          {choices.map((c, i) => (
            <button
              key={`${i}-${c.slice(0, 12)}`}
              type="button"
              className={`option ${pick === i ? 'selected' : ''}`}
              disabled={result !== null}
              onClick={() => setPick(i)}
            >
              {c.length > 160 ? `${c.slice(0, 160)}…` : c}
            </button>
          ))}
        </div>
        {result && <p className="nudge good">{result}</p>}
        <div className="session-actions">
          {result === null ? (
            <button className="btn primary" disabled={pick === null} onClick={() => void submitAnswer()}>
              Check
            </button>
          ) : (
            <button className="btn primary" onClick={nextQuestion}>
              Next verse
            </button>
          )}
          <button
            className="btn ghost-outline"
            onClick={() => {
              setActive(null)
              void reload()
            }}
          >
            Back to board
          </button>
        </div>
      </div>
    )
  }

  const activeList = challenges.filter((c) => c.status === 'active')
  const endedList = challenges.filter((c) => c.status !== 'active').slice(0, 3)

  return (
    <div className="settings-block">
      <h3>Memory competitions</h3>
      <p className="muted">
        Compete with your circle on the same verses — quiz for points on a shared leaderboard.
      </p>

      {!showCreate ? (
        <button className="btn primary" disabled={busy} onClick={() => setShowCreate(true)}>
          Start a challenge
        </button>
      ) : (
        <div className="challenge-create">
          <label className="field-label">
            Challenge name
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field-label">
            Verse set
            <select
              className="field"
              value={seriesId}
              onChange={(e) =>
                setSeriesId(e.target.value as (typeof TMS_SERIES)[number]['id'] | 'memorized')
              }
            >
              {TMS_SERIES.map((s) => (
                <option key={s.id} value={s.id}>
                  TMS {s.id}: {s.name}
                </option>
              ))}
              <option value="memorized">
                My memorized verses ({memorized.length})
              </option>
            </select>
          </label>
          <label className="field-label">
            Length
            <select
              className="field"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </label>
          <div className="session-actions">
            <button className="btn primary" disabled={busy} onClick={() => void createChallenge()}>
              Launch challenge
            </button>
            <button className="btn ghost-outline" onClick={() => setShowCreate(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeList.map((ch) => {
        const mine = ch.scores.find((s) => s.userId === myUserId)
        return (
          <div key={ch.id} className="challenge-card">
            <div className="challenge-card-head">
              <div>
                <strong>{ch.name}</strong>
                <p className="memory-meta">
                  {ch.verses.length} verses · ends {endsLabel(ch.endsAt)}
                  {mine ? ` · you: ${mine.score} pts` : ''}
                </p>
              </div>
              <button className="btn tiny" disabled={busy} onClick={() => void startCompete(ch)}>
                Compete
              </button>
            </div>
            <ol className="challenge-board">
              {ch.scores.length === 0 && (
                <li className="muted">No scores yet — be the first to quiz.</li>
              )}
              {ch.scores.map((s, i) => (
                <li key={s.userId} className={s.userId === myUserId ? 'me' : ''}>
                  <span className="rank">{i + 1}</span>
                  <span className="who">{s.displayName || 'Friend'}</span>
                  <span className="pts">
                    {s.score} pts · {s.correct}/{s.attempts}
                  </span>
                </li>
              ))}
            </ol>
            {ch.createdBy === myUserId && (
              <button
                className="btn tiny ghost-outline"
                disabled={busy}
                onClick={() => void endChallenge(ch.id)}
              >
                End early
              </button>
            )}
          </div>
        )
      })}

      {endedList.length > 0 && (
        <>
          <h3>Recent results</h3>
          {endedList.map((ch) => (
            <div key={ch.id} className="challenge-card ended">
              <strong>{ch.name}</strong>
              <p className="memory-meta">Ended · {ch.verses.length} verses</p>
              <ol className="challenge-board">
                {ch.scores.slice(0, 3).map((s, i) => (
                  <li key={s.userId}>
                    <span className="rank">{i + 1}</span>
                    <span className="who">{s.displayName || 'Friend'}</span>
                    <span className="pts">{s.score} pts</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </>
      )}

      {msg && <p className="nudge">{msg}</p>}
    </div>
  )
}
