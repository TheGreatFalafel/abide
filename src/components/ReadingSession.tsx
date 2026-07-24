'use client'

import { useEffect, useState } from 'react'
import { nextChapterRef, type PlanDay, type PassageRef } from '../data/bible'
import { fetchPassage, type PassageContent, type Verse } from '../lib/bibleApi'
import { reflectionForDay } from '../lib/reflections'
import type { TranslationId } from '../data/translations'
import { addMemoryVerse } from '../lib/progress'
import type { UserState } from '../lib/types'
import { EsvAttribution } from './EsvAttribution'
import { ESV_SITE } from '../data/esvCopyright'
import { CommentaryPanel } from './CommentaryPanel'

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
  const [refs, setRefs] = useState<PassageRef[]>(day.passages)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passageIndex, setPassageIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [memoryNote, setMemoryNote] = useState<string | null>(null)
  const [activeVerse, setActiveVerse] = useState<Verse | null>(null)
  const [extraMode, setExtraMode] = useState(false)
  const reflection = reflectionForDay(day.day)

  const translation = user.translationId
  const esvApiKey = user.esvApiKey

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setPassageIndex(0)
    setRefs(day.passages)
    setExtraMode(false)
    setActiveVerse(null)
    Promise.all(
      day.passages.map((p) => fetchPassage(p, { translation, esvApiKey })),
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
  const currentRef = refs[passageIndex]
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

  async function keepReading() {
    if (!current || !currentRef) return

    if (current.hasMoreInChapter && current.fullChapterVerses) {
      const next: PassageContent = {
        ...current,
        reference: current.reference.replace(/ \(first half\)/, '') + ' (rest of chapter)',
        verses: current.fullChapterVerses.slice(
          current.verses.length,
          current.fullChapterVerses.length,
        ),
        hasMoreInChapter: false,
      }
      const nextPassages = [...passages]
      nextPassages[passageIndex] = {
        ...current,
        verses: current.fullChapterVerses,
        reference: current.reference.replace(/ \(first half\)/, ''),
        hasMoreInChapter: false,
      }
      // Show rest by expanding in place
      setPassages(nextPassages)
      setMemoryNote('Showing the rest of this chapter.')
      void next
      return
    }

    const nextRef = nextChapterRef({
      bookId: currentRef.bookId,
      bookName: currentRef.bookName,
      chapter: currentRef.chapter,
    })
    if (!nextRef) {
      setMemoryNote('You have reached the end of Revelation.')
      return
    }
    setLoading(true)
    try {
      const content = await fetchPassage(nextRef, { translation, esvApiKey })
      setRefs((prev) => [...prev, nextRef])
      setPassages((prev) => [...prev, content])
      setPassageIndex((i) => i + 1)
      setExtraMode(true)
      setMemoryNote(`Keep reading · ${nextRef.bookName} ${nextRef.chapter}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load next chapter')
    } finally {
      setLoading(false)
    }
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
          {!loading && !error && current && currentRef && (
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
                  <div key={v.number}>
                    {v.heading && <h3 className="section-heading">{v.heading}</h3>}
                    <p className="verse-line">
                      <button
                        type="button"
                        className="verse-mem"
                        title="Open commentary / save"
                        onClick={() => setActiveVerse(v)}
                      >
                        <sup>{v.number}</sup>
                      </button>
                      <button
                        type="button"
                        className="verse-text-btn"
                        onClick={() => setActiveVerse(v)}
                      >
                        {v.text}
                      </button>
                    </p>
                  </div>
                ))}
              </article>
              {current.translationId === 'esv' && (
                <p className="esv-mark">(ESV)</p>
              )}
              {current.translationId === 'esv' && <EsvAttribution compact />}
              <p className="muted mem-hint">
                Tap a verse for Matthew Henry or Tyndale study notes, or to save it for memory.
                Section headings mark the usual breaks in the chapter.
              </p>

              {activeVerse && (
                <CommentaryPanel
                  bookId={currentRef.bookId}
                  bookName={currentRef.bookName}
                  chapter={currentRef.chapter}
                  verse={activeVerse.number}
                  verseText={activeVerse.text}
                  onClose={() => setActiveVerse(null)}
                  onSaveMemory={() => {
                    saveVerseToMemory(activeVerse.number)
                    setActiveVerse(null)
                  }}
                />
              )}

              <div className="session-actions stack-actions">
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
                <button className="btn ghost-outline" onClick={keepReading}>
                  Keep reading
                </button>
                {extraMode && lastPassage && (
                  <p className="muted center">Extra context — finish when you are ready.</p>
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
