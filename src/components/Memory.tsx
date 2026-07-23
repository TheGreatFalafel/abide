import { useEffect, useMemo, useState } from 'react'
import { TMS_SERIES, TMS_VERSES, tmsRefLabel, type TmsVerse } from '../data/tms'
import { fetchVerseRange, passageToPlainText } from '../lib/bibleApi'
import {
  addMemoryVerse,
  dueMemoryVerses,
  makeMemoryId,
  markMemorized,
  memorizedVerses,
  removeMemoryVerse,
  scoreMemoryQuiz,
  type MemoryGrade,
} from '../lib/progress'
import { isMastered, type MemoryVerse, type UserState } from '../lib/types'
import { EsvAttribution } from './EsvAttribution'
import { BlankPractice } from './BlankPractice'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
  onReviewed: (verseId: string, grade: MemoryGrade) => void
}

type Tab = 'learn' | 'memorized' | 'tms' | 'quiz'

function normalizeForCompare(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchTmsText(
  seed: TmsVerse,
  user: UserState,
): Promise<{ reference: string; text: string }> {
  const end = seed.verseEnd ?? seed.verseStart
  const primary = await fetchVerseRange(seed.bookName, seed.chapter, seed.verseStart, end, {
    translation: user.translationId,
    esvApiKey: user.esvApiKey,
  })
  let text = passageToPlainText(primary)
  let reference = primary.reference

  if (seed.extraVerses?.length) {
    const extras: string[] = []
    for (const n of seed.extraVerses) {
      const extra = await fetchVerseRange(seed.bookName, seed.chapter, n, n, {
        translation: user.translationId,
        esvApiKey: user.esvApiKey,
      })
      extras.push(passageToPlainText(extra))
    }
    text = `${text} ${extras.join(' ')}`
    reference = tmsRefLabel(seed)
  }

  return { reference, text }
}

export function Memory({ user, onUserChange, onReviewed }: Props) {
  const dueLearn = useMemo(() => dueMemoryVerses(user, 'learning'), [user])
  const dueMemorized = useMemo(() => dueMemoryVerses(user, 'memorized'), [user])
  const mastered = useMemo(() => memorizedVerses(user), [user])
  const learning = useMemo(
    () => user.memoryVerses.filter((v) => v.status !== 'memorized'),
    [user],
  )

  const [tab, setTab] = useState<Tab>('learn')
  const [mode, setMode] = useState<'list' | 'practice' | 'quiz'>('list')
  const [active, setActive] = useState<MemoryVerse | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [typed, setTyped] = useState('')
  const [practiceKind, setPracticeKind] = useState<'reveal' | 'type' | 'blanks'>('reveal')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [tmsSeries, setTmsSeries] = useState<(typeof TMS_SERIES)[number]['id']>('A')
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizChoices, setQuizChoices] = useState<string[]>([])
  const [quizPick, setQuizPick] = useState<number | null>(null)
  const [quizResult, setQuizResult] = useState<string | null>(null)

  useEffect(() => {
    setRevealed(false)
    setTyped('')
  }, [active, practiceKind])

  async function addTms(seed: TmsVerse) {
    setAdding(true)
    setAddError(null)
    try {
      const { reference, text } = await fetchTmsText(seed, user)
      const end = seed.verseEnd ?? seed.verseStart
      const result = addMemoryVerse(user, {
        id: makeMemoryId(seed.bookId, seed.chapter, seed.verseStart, end),
        reference,
        text,
        bookName: seed.bookName,
        bookId: seed.bookId,
        chapter: seed.chapter,
        verseStart: seed.verseStart,
        verseEnd: end,
        translationId: user.translationId,
        topic: seed.topic,
        seriesId: seed.seriesId,
        seriesName: seed.seriesName,
      })
      onUserChange(result.state)
      setMsg(result.added ? `Added ${reference}` : 'Already in your bank')
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Could not add verse')
    } finally {
      setAdding(false)
    }
  }

  async function addEntireSeries() {
    setAdding(true)
    setAddError(null)
    let state = user
    let added = 0
    try {
      const pack = TMS_VERSES.filter((v) => v.seriesId === tmsSeries)
      for (const seed of pack) {
        const end = seed.verseEnd ?? seed.verseStart
        const id = makeMemoryId(seed.bookId, seed.chapter, seed.verseStart, end)
        if (state.memoryVerses.some((v) => v.id === id)) continue
        const { reference, text } = await fetchTmsText(seed, state)
        const result = addMemoryVerse(state, {
          id,
          reference,
          text,
          bookName: seed.bookName,
          bookId: seed.bookId,
          chapter: seed.chapter,
          verseStart: seed.verseStart,
          verseEnd: end,
          translationId: state.translationId,
          topic: seed.topic,
          seriesId: seed.seriesId,
          seriesName: seed.seriesName,
        })
        state = result.state
        if (result.added) added += 1
      }
      onUserChange(state)
      setMsg(`Added ${added} verse${added === 1 ? '' : 's'} from series ${tmsSeries}`)
      setTab('learn')
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Could not import series')
    } finally {
      setAdding(false)
    }
  }

  function startPractice(verse?: MemoryVerse, prefer: 'learning' | 'memorized' = 'learning') {
    const pool = prefer === 'memorized' ? dueMemorized : dueLearn
    const target = verse ?? pool[0] ?? (prefer === 'memorized' ? mastered[0] : learning[0])
    if (!target) {
      setMsg(prefer === 'memorized' ? 'Mark some verses memorized first' : 'Add a verse first')
      return
    }
    setActive(target)
    setMode('practice')
  }

  function grade(g: MemoryGrade) {
    if (!active) return
    onReviewed(active.id, g)
    setMsg(g === 'again' ? 'We’ll bring that one back soon' : 'Nice — scheduled for later')
    setActive(null)
    setMode('list')
  }

  function startQuiz() {
    if (mastered.length < 1) {
      setMsg('Memorize at least one verse to unlock the quiz')
      return
    }
    const idx = Math.floor(Math.random() * mastered.length)
    setQuizIndex(idx)
    const answer = mastered[idx]
    const distractors = mastered
      .filter((v) => v.id !== answer.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((v) => v.text)
    while (distractors.length < 3 && learning.length) {
      const extra = learning[distractors.length % learning.length]
      if (extra && !distractors.includes(extra.text)) distractors.push(extra.text)
      else break
    }
    const choices = [answer.text, ...distractors].sort(() => Math.random() - 0.5)
    setQuizChoices(choices)
    setQuizPick(null)
    setQuizResult(null)
    setMode('quiz')
    setTab('quiz')
  }

  function submitQuiz() {
    if (quizPick === null) return
    const answer = mastered[quizIndex]
    const ok = quizChoices[quizPick] === answer.text
    const result = scoreMemoryQuiz(user, ok)
    onUserChange(result.state)
    setQuizResult(ok ? `Correct! +${result.earnedXp} XP` : `Not quite — ${answer.reference}`)
  }

  const typeOk =
    active &&
    typed.trim().length > 0 &&
    normalizeForCompare(typed).includes(
      normalizeForCompare(active.text).slice(0, Math.min(40, active.text.length)),
    )

  const tmsPack = TMS_VERSES.filter((v) => v.seriesId === tmsSeries)

  return (
    <div className="memory">
      <div className="memory-head">
        <div>
          <h2>Scripture memory</h2>
          <p className="muted">
            {dueLearn.length + dueMemorized.length} due · {learning.length} learning ·{' '}
            {mastered.length} memorized
          </p>
        </div>
      </div>

      <nav className="tabs tabs-4 memory-tabs">
        {(
          [
            ['learn', 'Learning'],
            ['memorized', 'Memorized'],
            ['tms', 'TMS Pack'],
            ['quiz', 'Quiz'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            className={tab === id ? 'active' : ''}
            onClick={() => {
              setTab(id)
              setMode('list')
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {msg && <p className="nudge good">{msg}</p>}
      {addError && <p className="nudge risk">{addError}</p>}

      {mode === 'list' && tab === 'learn' && (
        <div className="memory-list">
          <div className="memory-actions row">
            <button
              className="btn tiny"
              onClick={() => startPractice(undefined, 'learning')}
              disabled={!learning.length}
            >
              Practice due
            </button>
          </div>
          {!learning.length && (
            <p className="muted">Add verses from the TMS Pack tab, or tap a verse number while reading.</p>
          )}
          {learning.map((v) => (
            <div key={v.id} className="memory-card">
              <div>
                <strong>{v.reference}</strong>
                {v.topic && <span className="memory-meta"> · {v.topic}</span>}
                <p className="memory-preview">{v.text}</p>
                <span className="memory-meta">Next: {v.nextReview}</span>
              </div>
              <div className="memory-card-actions">
                <button className="btn tiny" onClick={() => startPractice(v)}>
                  Review
                </button>
                <button
                  className="btn tiny ghost-outline"
                  onClick={() => {
                    onUserChange(markMemorized(user, v.id))
                    setMsg(`Moved ${v.reference} to Memorized`)
                  }}
                >
                  Memorized
                </button>
                <button
                  className="btn tiny ghost-outline"
                  onClick={() => onUserChange(removeMemoryVerse(user, v.id))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'list' && tab === 'memorized' && (
        <div className="memory-list">
          <div className="memory-actions row">
            <button
              className="btn tiny"
              onClick={() => startPractice(undefined, 'memorized')}
              disabled={!mastered.length}
            >
              Retention review
            </button>
            <button className="btn tiny ghost-outline" onClick={startQuiz} disabled={!mastered.length}>
              Start quiz
            </button>
          </div>
          <p className="muted">
            Memorized verses return periodically so they stay fresh. Due today: {dueMemorized.length}.
          </p>
          {!mastered.length && (
            <p className="muted">When a verse is solid, tap Memorized on a learning card.</p>
          )}
          {mastered.map((v) => (
            <div key={v.id} className="memory-card mastered">
              <div>
                <strong>{v.reference}</strong>
                <p className="memory-preview">{v.text}</p>
                <span className="memory-meta">
                  Retention · next {v.nextReview}
                  {isMastered(v) ? ' · ✓' : ''}
                </span>
              </div>
              <div className="memory-card-actions">
                <button className="btn tiny" onClick={() => startPractice(v, 'memorized')}>
                  Review
                </button>
                <button
                  className="btn tiny ghost-outline"
                  onClick={() => onUserChange(removeMemoryVerse(user, v.id))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'list' && tab === 'tms' && (
        <div className="memory-add">
          <p className="muted">
            Topical Memory System verse references from The Navigators (60 verses). Text loads in your
            current translation. TMS © The Navigators.
          </p>
          <div className="practice-tabs">
            {TMS_SERIES.map((s) => (
              <button
                key={s.id}
                className={tmsSeries === s.id ? 'active' : ''}
                onClick={() => setTmsSeries(s.id)}
              >
                {s.id}
              </button>
            ))}
          </div>
          <h3 className="starter-title">
            Series {tmsSeries}: {TMS_SERIES.find((s) => s.id === tmsSeries)?.name}
          </h3>
          <button className="btn primary" disabled={adding} onClick={addEntireSeries}>
            {adding ? 'Importing…' : `Add all series ${tmsSeries} to Learning`}
          </button>
          <div className="starter-grid">
            {tmsPack.map((s) => {
              const end = s.verseEnd ?? s.verseStart
              const id = makeMemoryId(s.bookId, s.chapter, s.verseStart, end)
              const owned = user.memoryVerses.some((v) => v.id === id)
              return (
                <button
                  key={id}
                  type="button"
                  className={`starter ${owned ? 'owned' : ''}`}
                  disabled={adding || owned}
                  onClick={() => addTms(s)}
                >
                  <strong>{tmsRefLabel(s)}</strong>
                  <span>
                    {s.topic}
                    {owned ? ' · In bank' : ''}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {mode === 'list' && tab === 'quiz' && (
        <div className="memory-add">
          <p className="muted">
            Cycle through memorized verses — see the reference, pick the right text.
          </p>
          <button className="btn primary" onClick={startQuiz} disabled={mastered.length < 1}>
            Start memory quiz
          </button>
        </div>
      )}

      {mode === 'quiz' && mastered[quizIndex] && (
        <div className="memory-practice enter">
          <p className="eyebrow">Memory quiz</p>
          <h3>{mastered[quizIndex].reference}</h3>
          <p className="muted">Which text matches this reference?</p>
          <div className="options">
            {quizChoices.map((c, i) => (
              <button
                key={`${i}-${c.slice(0, 12)}`}
                type="button"
                className={`option ${quizPick === i ? 'selected' : ''}`}
                disabled={quizResult !== null}
                onClick={() => setQuizPick(i)}
              >
                {c.length > 140 ? `${c.slice(0, 140)}…` : c}
              </button>
            ))}
          </div>
          {quizResult && <p className="nudge good">{quizResult}</p>}
          {mastered[quizIndex].translationId === 'esv' && <EsvAttribution compact />}
          <div className="session-actions">
            {quizResult === null ? (
              <button className="btn primary" disabled={quizPick === null} onClick={submitQuiz}>
                Check
              </button>
            ) : (
              <button className="btn primary" onClick={startQuiz}>
                Next verse
              </button>
            )}
            <button className="btn ghost" onClick={() => setMode('list')}>
              Exit quiz
            </button>
          </div>
        </div>
      )}

      {mode === 'practice' && active && (
        <div className="memory-practice enter">
          <div className="practice-tabs">
            {(['reveal', 'type', 'blanks'] as const).map((k) => (
              <button
                key={k}
                className={practiceKind === k ? 'active' : ''}
                onClick={() => setPracticeKind(k)}
              >
                {k === 'reveal' ? 'Reveal' : k === 'type' ? 'Type it' : 'Blanks'}
              </button>
            ))}
          </div>
          <p className="eyebrow">
            {active.status === 'memorized' ? 'Retention' : 'Learning'} · {active.reference}
          </p>

          {practiceKind === 'reveal' && (
            <>
              <p className={`memory-text ${revealed ? '' : 'hidden-text'}`}>
                {revealed ? active.text : 'Say it aloud, then reveal.'}
              </p>
              {!revealed ? (
                <button className="btn primary" onClick={() => setRevealed(true)}>
                  Reveal
                </button>
              ) : (
                <div className="grade-row">
                  <button className="btn grade again" onClick={() => grade('again')}>
                    Again
                  </button>
                  <button className="btn grade hard" onClick={() => grade('hard')}>
                    Hard
                  </button>
                  <button className="btn grade good" onClick={() => grade('good')}>
                    Good
                  </button>
                  <button className="btn grade easy" onClick={() => grade('easy')}>
                    Easy
                  </button>
                </div>
              )}
            </>
          )}

          {practiceKind === 'type' && (
            <>
              <textarea
                className="field area"
                rows={4}
                placeholder="Type the verse from memory…"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
              />
              {revealed && <p className="memory-text answer">{active.text}</p>}
              <div className="session-actions">
                <button className="btn ghost-outline" onClick={() => setRevealed(true)}>
                  Show answer
                </button>
                <button
                  className="btn primary"
                  disabled={!typeOk && !revealed}
                  onClick={() => grade(typeOk ? 'good' : 'hard')}
                >
                  Grade
                </button>
              </div>
            </>
          )}

          {practiceKind === 'blanks' && (
            <BlankPractice
              verse={active}
              onGrade={(ok) => grade(ok ? 'good' : 'hard')}
            />
          )}

          {active.status !== 'memorized' && (
            <button
              className="btn ghost-outline"
              onClick={() => {
                onUserChange(markMemorized(user, active.id))
                setMsg(`Memorized ${active.reference}`)
                setMode('list')
                setTab('memorized')
              }}
            >
              Mark as memorized
            </button>
          )}
          {active.translationId === 'esv' && <EsvAttribution compact />}
          <button className="btn ghost" onClick={() => setMode('list')}>
            Exit practice
          </button>
        </div>
      )}
    </div>
  )
}
