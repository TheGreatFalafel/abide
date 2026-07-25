'use client'

import { useEffect, useState } from 'react'
import { BOOKS, type BibleBook } from '../data/bible'
import { fetchPassage, type PassageContent, type Verse } from '../lib/bibleApi'
import { addMemoryVerse } from '../lib/progress'
import type { UserState } from '../lib/types'
import { EsvAttribution } from './EsvAttribution'
import { ESV_SITE } from '../data/esvCopyright'
import { CommentaryPanel } from './CommentaryPanel'
import { ListenButton } from './ListenButton'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
}

export function BibleReader({ user, onUserChange }: Props) {
  const [bookId, setBookId] = useState('john')
  const [chapter, setChapter] = useState(1)
  const [content, setContent] = useState<PassageContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [picker, setPicker] = useState<'book' | 'chapter' | null>(null)
  const [activeVerse, setActiveVerse] = useState<Verse | null>(null)

  const book = BOOKS.find((b) => b.id === bookId) ?? BOOKS[42]

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setContent(null)
    setActiveVerse(null)
    fetchPassage(
      { bookId: book.id, bookName: book.name, chapter },
      { translation: user.translationId, esvApiKey: user.esvApiKey },
    )
      .then((data) => {
        if (!cancelled) {
          setContent(data)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message || 'Could not load chapter')
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [book.id, book.name, chapter, user.translationId, user.esvApiKey])

  function goBook(next: BibleBook) {
    setBookId(next.id)
    setChapter(1)
    setPicker(null)
  }

  function goRandom(scope: 'all' | 'OT' | 'NT') {
    const pool =
      scope === 'all'
        ? BOOKS
        : BOOKS.filter((b) => b.testament === scope)
    const book = pool[Math.floor(Math.random() * pool.length)]
    const ch = 1 + Math.floor(Math.random() * book.chapters)
    setBookId(book.id)
    setChapter(ch)
    setPicker(null)
    setNote(
      scope === 'all'
        ? `Random · ${book.name} ${ch}`
        : `Random ${scope} · ${book.name} ${ch}`,
    )
  }

  function prevChapter() {
    if (chapter > 1) {
      setChapter((c) => c - 1)
      return
    }
    const idx = BOOKS.findIndex((b) => b.id === book.id)
    if (idx > 0) {
      const prev = BOOKS[idx - 1]
      setBookId(prev.id)
      setChapter(prev.chapters)
    }
  }

  function nextChapter() {
    if (chapter < book.chapters) {
      setChapter((c) => c + 1)
      return
    }
    const idx = BOOKS.findIndex((b) => b.id === book.id)
    if (idx < BOOKS.length - 1) {
      setBookId(BOOKS[idx + 1].id)
      setChapter(1)
    }
  }

  function saveVerse(verseNum: number) {
    if (!content) return
    const verse = content.verses.find((v) => v.number === verseNum)
    if (!verse) return
    const result = addMemoryVerse(user, {
      reference: `${book.name} ${chapter}:${verseNum}`,
      text: verse.text,
      bookName: book.name,
      bookId: book.id,
      chapter,
      verseStart: verseNum,
      verseEnd: verseNum,
      translationId: content.translationId,
    })
    onUserChange(result.state)
    setNote(
      result.added
        ? `Saved ${book.name} ${chapter}:${verseNum} to memory`
        : 'Already in your memory bank',
    )
  }

  return (
    <div className="bible-reader">
      <div className="reader-nav">
        <button type="button" className="btn tiny ghost-outline" onClick={() => setPicker('book')}>
          {book.name}
        </button>
        <button
          type="button"
          className="btn tiny ghost-outline"
          onClick={() => setPicker(picker === 'chapter' ? null : 'chapter')}
        >
          Ch {chapter}
        </button>
        <span className="memory-meta">{user.translationId.toUpperCase()}</span>
      </div>

      <div className="random-row">
        <button type="button" className="btn tiny ghost-outline" onClick={() => goRandom('all')}>
          Random
        </button>
        <button type="button" className="btn tiny ghost-outline" onClick={() => goRandom('OT')}>
          Random OT
        </button>
        <button type="button" className="btn tiny ghost-outline" onClick={() => goRandom('NT')}>
          Random NT
        </button>
      </div>

      {picker === 'book' && (
        <div className="book-picker enter">
          <p className="muted">Old Testament</p>
          <div className="book-grid">
            {BOOKS.filter((b) => b.testament === 'OT').map((b) => (
              <button
                key={b.id}
                type="button"
                className={`book-chip ${b.id === bookId ? 'selected' : ''}`}
                onClick={() => goBook(b)}
              >
                {b.name}
              </button>
            ))}
          </div>
          <p className="muted">New Testament</p>
          <div className="book-grid">
            {BOOKS.filter((b) => b.testament === 'NT').map((b) => (
              <button
                key={b.id}
                type="button"
                className={`book-chip ${b.id === bookId ? 'selected' : ''}`}
                onClick={() => goBook(b)}
              >
                {b.name}
              </button>
            ))}
          </div>
          <button className="btn ghost" onClick={() => setPicker(null)}>
            Close
          </button>
        </div>
      )}

      {picker === 'chapter' && (
        <div className="book-picker enter">
          <div className="chapter-grid">
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map((c) => (
              <button
                key={c}
                type="button"
                className={`chapter-chip ${c === chapter ? 'selected' : ''}`}
                onClick={() => {
                  setChapter(c)
                  setPicker(null)
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="reader enter">
        {loading && <p className="muted center">Loading…</p>}
        {error && (
          <div className="error-box">
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && content && (
          <>
            <h2 className="passage-ref">{content.reference}</h2>
            <p className="translation">
              {content.translationId === 'esv' ? (
                <>
                  ESV ·{' '}
                  <a href={ESV_SITE} target="_blank" rel="noreferrer">
                    www.esv.org
                  </a>
                </>
              ) : (
                content.translation
              )}
            </p>
            {note && <p className="nudge good">{note}</p>}
            <article className="verses">
              {content.verses.map((v) => (
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
            {content.translationId === 'esv' && (
              <>
                <p className="esv-mark">(ESV)</p>
                <EsvAttribution compact />
              </>
            )}
            <p className="muted mem-hint">
              Tap a verse for Matthew Henry or Tyndale notes. Section headings show standard
              chapter breaks in every translation.
            </p>
            <ListenButton
              text={
                content
                  ? [
                      content.reference,
                      ...content.verses.flatMap((v) =>
                        v.heading ? [v.heading, v.text] : [v.text],
                      ),
                    ].join('. ')
                  : ''
              }
            />

            {activeVerse && (
              <CommentaryPanel
                bookId={book.id}
                bookName={book.name}
                chapter={chapter}
                verse={activeVerse.number}
                verseText={activeVerse.text}
                onClose={() => setActiveVerse(null)}
                onSaveMemory={() => {
                  saveVerse(activeVerse.number)
                  setActiveVerse(null)
                }}
              />
            )}
          </>
        )}
      </div>

      <div className="session-actions sticky-reader">
        <button className="btn ghost-outline" onClick={prevChapter}>
          Previous
        </button>
        <button className="btn primary" onClick={nextChapter}>
          Keep reading
        </button>
      </div>
    </div>
  )
}
