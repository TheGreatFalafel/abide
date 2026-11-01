import { useEffect, useMemo, useRef, useState } from 'react'
import { TMS_SERIES, TMS_VERSES, tmsRefLabel, type TmsVerse } from '../data/tms'
import { fetchVerseRange, passageToPlainText } from '../lib/bibleApi'
import { sameScriptureRef } from '../lib/memoryIds'
import {
  addMemoryVerse,
  dueMemoryVerses,
  makeMemoryId,
  markMemorized,
  memoryDashboardStats,
  memorizedVerses,
  removeMemoryVerse,
  scoreMemoryQuiz,
  selectQuizCard,
  type MemoryGrade,
} from '../lib/progress'
import { cardIsDue as isDueNow } from '../lib/memorySelect'
import {
  CURRENT_MEMORY_TEXT_VERSION,
  isMastered,
  type MemoryVerse,
  type UserState,
} from '../lib/types'
import { EsvAttribution } from './EsvAttribution'
import { BlankPractice } from './BlankPractice'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
  onReviewed: (
    verseId: string,
    grade: MemoryGrade,
    opts?: { applySchedule?: boolean; source?: 'practice' | 'type' | 'blanks' },
  ) => void
  onStartQuest?: () => void
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
  translationId = user.translationId,
): Promise<{ reference: string; text: string }> {
  const end = seed.verseEnd ?? seed.verseStart
  const primary = await fetchVerseRange(seed.bookName, seed.chapter, seed.verseStart, end, {
    translation: translationId,
    esvApiKey: user.esvApiKey,
  })
  let text = passageToPlainText(primary)
  let reference = primary.reference

  if (seed.extraVerses?.length) {
    const extras: string[] = []
    for (const n of seed.extraVerses) {
      const extra = await fetchVerseRange(seed.bookName, seed.chapter, n, n, {
        translation: translationId,
        esvApiKey: user.esvApiKey,
      })
      extras.push(passageToPlainText(extra))
    }
    text = `${text} ${extras.join(' ')}`
    reference = tmsRefLabel(seed)
  }

  return { reference, text }
}

async function fetchSavedMemoryText(
  verse: MemoryVerse,
  user: UserState,
): Promise<string> {
  const seed = TMS_VERSES.find((candidate) => {
    const end = candidate.verseEnd ?? candidate.verseStart
    return sameScriptureRef(
      {
        bookId: candidate.bookId,
        chapter: candidate.chapter,
        verseStart: candidate.verseStart,
        verseEnd: end,
      },
      verse,
    )
  })
  if (seed) {
    return (await fetchTmsText(seed, user, verse.translationId)).text
  }
  const content = await fetchVerseRange(
    verse.bookName,
    verse.chapter,
    verse.verseStart,
    verse.verseEnd,
    { translation: verse.translationId, esvApiKey: user.esvApiKey },
  )
  return passageToPlainText(content)
}

export function Memory({ user, onUserChange, onReviewed, onStartQuest }: Props) {
  const stats = useMemo(() => memoryDashboardStats(user), [user])
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
  const [scheduleActive, setScheduleActive] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const [typed, setTyped] = useState('')
  const [practiceKind, setPracticeKind] = useState<'reveal' | 'type' | 'blanks'>('reveal')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [tmsSeries, setTmsSeries] = useState<(typeof TMS_SERIES)[number]['id']>('A')
  const [quizCard, setQuizCard] = useState<MemoryVerse | null>(null)
  const [quizExclude, setQuizExclude] = useState<string[]>([])
  const [quizChoices, setQuizChoices] = useState<string[]>([])
  const [quizPick, setQuizPick] = useState<number | null>(null)
  const [quizResult, setQuizResult] = useState<string | null>(null)
  const latestUser = useRef(user)
  const auditStarted = useRef(new Set<string>())
  const mounted = useRef(true)
  latestUser.current = user

  useEffect(() => {
    setRevealed(false)
    setTyped('')
  }, [active, practiceKind])

  useEffect(
    () => () => {
      mounted.current = false
    },
    [],
  )

  useEffect(() => {
    if (!user.esvApiKey?.trim()) return
    const stale = user.memoryVerses.filter(
      (v) =>
        v.translationId === 'esv' &&
        (v.textVersion ?? 0) < CURRENT_MEMORY_TEXT_VERSION &&
        !auditStarted.current.has(v.id),
    )
    if (!stale.length) return
    stale.forEach((v) => auditStarted.current.add(v.id))

    void (async () => {
      const verified = new Map<string, string>()
      for (const verse of stale) {
        try {
          verified.set(verse.id, await fetchSavedMemoryText(verse, latestUser.current))
        } catch {
          // Keep this verse unversioned so a later app session can retry.
        }
      }
      if (!mounted.current || !verified.size) return

      const current = latestUser.current
      let repaired = 0
      const memoryVerses = current.memoryVerses.map((verse) => {
        const text = verified.get(verse.id)
        if (text == null) return verse
        if (text !== verse.text) repaired += 1
        return {
          ...verse,
          text,
          textVersion: CURRENT_MEMORY_TEXT_VERSION,
        }
      })
      onUserChange({ ...current, memoryVerses })
      if (repaired > 0) {
        setMsg(`Repaired incomplete text in ${repaired} saved verse${repaired === 1 ? '' : 's'}`)
      }
    })()
  }, [user.memoryVerses, user.esvApiKey, onUserChange])

  async function addTms(seed: TmsVerse) {
    setAdding(true)
    setAddError(null)
    try {
      const { reference, text } = await fetchTmsText(seed, user)
      const end = seed.verseEnd ?? seed.verseStart
      const result = addMemoryVerse(user, {
        id: makeMemoryId(seed.bookId, seed.chapter, seed.verseStart, end, user.translationId),
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
      setMsg(result.added ? `Added ${reference} (${user.translationId.toUpperCase()})` : 'Already in your bank for this translation')
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
        const id = makeMemoryId(
          seed.bookId,
          seed.chapter,
          seed.verseStart,
          end,
          state.translationId,
        )
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

  function startPractice(
    verse?: MemoryVerse,
    prefer: 'learning' | 'memorized' = 'learning',
    forceExtra = false,
  ) {
    const pool = prefer === 'memorized' ? dueMemorized : dueLearn
    const target = verse ?? pool[0] ?? (prefer === 'memorized' ? mastered[0] : learning[0])
    if (!target) {
      setMsg(prefer === 'memorized' ? 'Mark some verses memorized first' : 'Add a verse first')
      return
    }
    const due = !forceExtra && isDueNow(target)
    setScheduleActive(due)
    setActive(target)
    setMode('practice')
    if (!due) {
      setMsg('Extra practice — this won’t change your review schedule')
    }
  }

  function grade(g: MemoryGrade, source: 'practice' | 'type' | 'blanks' = 'practice') {
    if (!active) return
    onReviewed(active.id, g, { applySchedule: scheduleActive, source })
    setMsg(
      !scheduleActive
        ? 'Logged as extra practice'
        : g === 'again'
          ? 'We’ll bring that one back soon'
          : 'Nice — scheduled with FSRS',
    )
    setActive(null)
    setMode('list')
  }

  function startQuiz() {
    if (mastered.length < 1) {
      setMsg('Memorize at least one verse to unlock the quiz')
      return
    }
    const answer = selectQuizCard(user, new Date(), quizExclude)
    if (!answer) {
      setQuizExclude([])
      const again = selectQuizCard(user, new Date(), [])
      if (!again) return
      prepareQuiz(again)
      return
    }
    prepareQuiz(answer)
  }

  function prepareQuiz(answer: MemoryVerse) {
    setQuizCard(answer)
    const distractors = mastered
      .filter((v) => v.id !== answer.id)
      .sort((a, b) => a.fsrs.stability - b.fsrs.stability)
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
    if (quizPick === null || !quizCard) return
    const ok = quizChoices[quizPick] === quizCard.text
    const result = scoreMemoryQuiz(user, ok, {
      verseId: quizCard.id,
      updateSchedule: true,
    })
    onUserChange(result.state)
    setQuizExclude((prev) => [...prev, quizCard.id].slice(-12))
    setQuizResult(ok ? `Correct! +${result.earnedXp} XP` : `Not quite — ${quizCard.reference}`)
  }

  const typeOk =
    active &&
    typed.trim().length > 0 &&
    normalizeForCompare(typed).includes(
      normalizeForCompare(active.text).slice(0, Math.min(40, active.text.length)),
    )

  const tmsPack = TMS_VERSES.filter((v) => v.seriesId === tmsSeries)
  const sessionProgress =
    stats.dueCount === 0
      ? 100
      : Math.min(
          100,
          Math.round((stats.reviewedToday / Math.max(1, stats.dueCount + stats.reviewedToday)) * 100),
        )

  return (
    <div className="memory">
      <div className="memory-head">
        <div>
          <h2>Scripture memory</h2>
          <p className="muted">
            {stats.dueCount} due · {stats.newCount} new · {stats.reviewedToday} reviewed today ·{' '}
            {stats.upcoming7Days} due in 7 days
          </p>
        </div>
        {onStartQuest && (
          <button type="button" className="btn primary" onClick={onStartQuest}>
            2-min quest
          </button>
        )}
      </div>

      <div className="memory-stats" aria-label="Review workload">
        <div className="memory-stat">
          <strong>{stats.dueCount}</strong>
          <span>Due</span>
        </div>
        <div className="memory-stat">
          <strong>{stats.newCount}</strong>
          <span>New</span>
        </div>
        <div className="memory-stat">
          <strong>{stats.learningCount}</strong>
          <span>Learning</span>
        </div>
        <div className="memory-stat">
          <strong>{stats.memorizedCount}</strong>
          <span>Memorized</span>
        </div>
        <div className="memory-stat">
          <strong>{sessionProgress}%</strong>
          <span>Today</span>
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
              disabled={!dueLearn.length && !learning.length}
            >
              Practice due ({dueLearn.length})
            </button>
          </div>
          {!learning.length && (
            <p className="muted">Add verses from the TMS Pack tab, or tap a verse number while reading.</p>
          )}
          {learning.map((v) => (
            <div key={v.id} className="memory-card">
              <div>
                <strong>{v.reference}</strong>
                <span className="memory-meta">
                  {' '}
                  · {(v.translationId || 'web').toUpperCase()}
                  {v.topic ? ` · ${v.topic}` : ''}
                  {isDueNow(v) ? ' · Due' : ''}
                </span>
                <p className="memory-preview">{v.text}</p>
                <span className="memory-meta">Next: {v.nextReview}</span>
              </div>
              <div className="memory-card-actions">
                <button
                  className="btn tiny"
                  onClick={() => startPractice(v, 'learning', !isDueNow(v))}
                >
                  {isDueNow(v) ? 'Review' : 'Practice'}
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
              Retention review ({dueMemorized.length})
            </button>
            <button className="btn tiny ghost-outline" onClick={startQuiz} disabled={!mastered.length}>
              Start quiz
            </button>
          </div>
          <p className="muted">
            Memorized verses return on an FSRS schedule. Due today: {dueMemorized.length}.
          </p>
          {!mastered.length && (
            <p className="muted">When a verse is solid, tap Memorized on a learning card.</p>
          )}
          {mastered.map((v) => (
            <div key={v.id} className="memory-card mastered">
              <div>
                <strong>{v.reference}</strong>
                <span className="memory-meta"> · {(v.translationId || 'web').toUpperCase()}</span>
                <p className="memory-preview">{v.text}</p>
                <span className="memory-meta">
                  Retention · next {v.nextReview}
                  {isMastered(v) ? ' · ✓' : ''}
                </span>
              </div>
              <div className="memory-card-actions">
                <button
                  className="btn tiny"
                  onClick={() => startPractice(v, 'memorized', !isDueNow(v))}
                >
                  {isDueNow(v) ? 'Review' : 'Practice'}
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
            current translation ({user.translationId.toUpperCase()}). Same verse in another
            translation is a separate card. TMS © The Navigators.
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
              const id = makeMemoryId(
                s.bookId,
                s.chapter,
                s.verseStart,
                end,
                user.translationId,
              )
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
            Prioritizes overdue and weaker memorized verses — not a random shuffle of favorites.
          </p>
          <button className="btn primary" onClick={startQuiz} disabled={mastered.length < 1}>
            Start memory quiz
          </button>
        </div>
      )}

      {mode === 'quiz' && quizCard && (
        <div className="memory-practice enter">
          <p className="eyebrow">Memory quiz · FSRS</p>
          <h3>{quizCard.reference}</h3>
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
                {c}
              </button>
            ))}
          </div>
          {quizResult && <p className="nudge good">{quizResult}</p>}
          {quizCard.translationId === 'esv' && <EsvAttribution compact />}
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
            {scheduleActive ? 'Scheduled review' : 'Extra practice'} ·{' '}
            {active.status === 'memorized' ? 'Retention' : 'Learning'} · {active.reference} ·{' '}
            {active.translationId.toUpperCase()}
          </p>

          {practiceKind === 'reveal' && (
            <>
              <p className={`memory-text ${revealed ? '' : 'hidden-text'}`}>
                {revealed ? active.text : 'Say it aloud, then reveal and grade honestly.'}
              </p>
              {!revealed ? (
                <button className="btn primary" onClick={() => setRevealed(true)}>
                  Reveal
                </button>
              ) : (
                <div className="grade-row">
                  <button className="btn grade again" onClick={() => grade('again', 'practice')}>
                    Again
                  </button>
                  <button className="btn grade hard" onClick={() => grade('hard', 'practice')}>
                    Hard
                  </button>
                  <button className="btn grade good" onClick={() => grade('good', 'practice')}>
                    Good
                  </button>
                  <button className="btn grade easy" onClick={() => grade('easy', 'practice')}>
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
                  onClick={() =>
                    grade(typeOk ? 'good' : revealed ? 'again' : 'hard', 'type')
                  }
                >
                  Grade
                </button>
              </div>
            </>
          )}

          {practiceKind === 'blanks' && (
            <BlankPractice
              verse={active}
              onGrade={(ok) => grade(ok ? 'good' : 'again', 'blanks')}
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
