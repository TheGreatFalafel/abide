import { useEffect, useState } from 'react'
import type { PlanDay } from '../data/bible'
import { fetchPassage, type PassageContent } from '../lib/bibleApi'
import { reflectionForDay } from '../lib/reflections'
import type { TranslationId } from '../data/translations'
import { addMemoryVerse } from '../lib/progress'
import type { UserState } from '../lib/types'
import { EsvAttribution } from './EsvAttribution'
import { ESV_SITE } from '../data/esvCopyright'

type Props = {
  day: PlanDay
  user: UserState
  onUserChange: (user: UserState) => void
  onComplete: (reflectionDone: boolean) => void
  onBack: () => void
}

export function ReadingSession({ day, user, onUserChange, onComplete, onBack }: Props) {
  const [phase, setPhase] = useState<'read' | 'reflect'>('read')
  const [passages, setPassages] = useState<PassageContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passageIndex, setPassageIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [memoryNote, setMemoryNote] = useState<string | null>(null)
  const reflection = reflectionForDay(day.day)

  const translation = user.translationId
  const esvApiKey = user.esvApiKey

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setPassageIndex(0)
    Promise.all(
      day.passages.map((p) =>
        fetchPassage(p, { translation, esvApiKey }),
      ),
    )
      .then((data) => {
        if (!cancelled) {
          setPassages(data)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message || 'Could not load reading')
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [day, translation, esvApiKey])

  const current = passages[passageIndex]
  const currentRef = day.passages[passageIndex]
  const lastPassage = passageIndex >= passages.length - 1

  function saveVerseToMemory(verseNum: number) {
    if (!current || !currentRef) return
    const verse = current.verses.find((v) => v.number === verseNum)
    if (!verse) return
    const result = addMemoryVerse(user, {
      reference: `${currentRef.bookName} ${currentRef.chapter}:${verseNum}`,
      text: verse.text,
      bookName: currentRef.bookName,
      bookId: currentRef.bookId,
      chapter: currentRef.chapter,
      verseStart: verseNum,
      verseEnd: verseNum,
      translationId: current.translationId as TranslationId,
    })
    onUserChange(result.state)
    setMemoryNote(
      result.added
        ? `Saved ${currentRef.bookName} ${currentRef.chapter}:${verseNum} to memory`
        : 'Already in your memory bank',
    )
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
            Day {day.day} · {day.title}
          </strong>
        </div>
        <div className="session-progress">
          {phase === 'read'
            ? `${passageIndex + 1}/${Math.max(passages.length, 1)}`
            : '♥'}
        </div>
      </header>

      {phase === 'read' && (
        <div className="reader enter">
          {loading && <p className="muted center">Gathering the passage…</p>}
          {error && (
            <div className="error-box">
              <p>{error}</p>
              {translation === 'esv' ? (
                <p className="muted">
                  Confirm your key under Settings → Connect ESV, and that ESV is selected.
                  Or temporarily switch to WEB/KJV.
                </p>
              ) : (
                <p className="muted">Check your connection, then try again.</p>
              )}
              <button className="btn primary" onClick={onBack}>
                Back to path
              </button>
            </div>
          )}
          {!loading && !error && current && (
            <>
              <h2 className="passage-ref">{current.reference}</h2>
              <p className="translation">
                {current.translationId === 'esv' ? (
                  <>
                    ESV ·{' '}
                    <a href={ESV_SITE} target="_blank" rel="noreferrer">
                      www.esv.org
                    </a>
                  </>
                ) : (
                  current.translation
                )}
              </p>
              {memoryNote && <p className="nudge good">{memoryNote}</p>}
              <article className="verses">
                {current.verses.map((v) => (
                  <p key={v.number} className="verse-line">
                    <button
                      type="button"
                      className="verse-mem"
                      title="Save to scripture memory"
                      onClick={() => saveVerseToMemory(v.number)}
                    >
                      <sup>{v.number}</sup>
                    </button>
                    {v.text}
                  </p>
                ))}
              </article>
              {current.translationId === 'esv' && (
                <p className="esv-mark">(ESV)</p>
              )}
              {current.translationId === 'esv' && <EsvAttribution compact />}
              <p className="muted mem-hint">Tap a verse number to save it for memory practice.</p>
              <div className="session-actions">
                {passageIndex > 0 && (
                  <button
                    className="btn ghost"
                    onClick={() => setPassageIndex((i) => i - 1)}
                  >
                    Previous
                  </button>
                )}
                {!lastPassage ? (
                  <button
                    className="btn primary"
                    onClick={() => setPassageIndex((i) => i + 1)}
                  >
                    Next chapter
                  </button>
                ) : (
                  <button className="btn primary" onClick={() => setPhase('reflect')}>
                    Heart check
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {phase === 'reflect' && (
        <div className="reflect enter">
          <p className="eyebrow">+10 XP bonus</p>
          <h2>{reflection.prompt}</h2>
          <div className="options">
            {reflection.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                className={`option ${picked === i ? 'selected' : ''}`}
                onClick={() => setPicked(i)}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            className="btn primary"
            disabled={picked === null}
            onClick={() => onComplete(true)}
          >
            Finish lesson
          </button>
          <button className="btn ghost" onClick={() => onComplete(false)}>
            Skip reflection
          </button>
        </div>
      )}
    </div>
  )
}
