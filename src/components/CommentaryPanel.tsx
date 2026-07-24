'use client'

import { useEffect, useState } from 'react'
import {
  COMMENTARIES,
  commentaryForVerse,
  fetchChapterCommentary,
  type CommentaryId,
} from '../lib/commentary'

type Props = {
  bookId: string
  bookName: string
  chapter: number
  verse: number
  verseText: string
  onClose: () => void
  onSaveMemory: () => void
}

const LAST_KEY = 'abide-commentary-id'

export function CommentaryPanel({
  bookId,
  bookName,
  chapter,
  verse,
  verseText,
  onClose,
  onSaveMemory,
}: Props) {
  const [commentaryId, setCommentaryId] = useState<CommentaryId>(() => {
    if (typeof window === 'undefined') return 'matthew-henry'
    const saved = window.localStorage.getItem(LAST_KEY) as CommentaryId | null
    return COMMENTARIES.some((c) => c.id === saved) ? saved! : 'matthew-henry'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [body, setBody] = useState<string | null>(null)
  const [source, setSource] = useState('')
  const [fromVerse, setFromVerse] = useState<number | null>(null)

  useEffect(() => {
    window.localStorage.setItem(LAST_KEY, commentaryId)
  }, [commentaryId])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setBody(null)
    fetchChapterCommentary(commentaryId, bookId, chapter)
      .then((chapterData) => {
        if (cancelled) return
        const match = commentaryForVerse(chapterData, verse)
        setSource(chapterData.name)
        if (!match) {
          setError('No commentary notes for this verse.')
          setFromVerse(null)
        } else {
          setBody(match.text)
          setFromVerse(match.fromVerse || null)
        }
        setLoading(false)
      })
      .catch((err: Error) => {
        if (cancelled) return
        setError(err.message || 'Could not load commentary')
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [commentaryId, bookId, chapter, verse])

  const meta = COMMENTARIES.find((c) => c.id === commentaryId)

  return (
    <div className="commentary-sheet" role="dialog" aria-label="Verse commentary">
      <div className="commentary-head">
        <div>
          <p className="eyebrow">Commentary</p>
          <strong>
            {bookName} {chapter}:{verse}
          </strong>
        </div>
        <button type="button" className="btn tiny ghost-outline" onClick={onClose}>
          Close
        </button>
      </div>

      <p className="commentary-verse">“{verseText}”</p>

      <div className="commentary-switch">
        {COMMENTARIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`bank-chip ${commentaryId === c.id ? 'active' : ''}`}
            onClick={() => setCommentaryId(c.id)}
          >
            {c.short}
          </button>
        ))}
      </div>

      {meta && (
        <p className="memory-meta">
          {meta.name} · {meta.license} · {meta.note}
        </p>
      )}

      {loading && <p className="muted">Loading notes…</p>}
      {error && <p className="nudge risk">{error}</p>}
      {!loading && !error && body && (
        <div className="commentary-body">
          {fromVerse && fromVerse !== verse && (
            <p className="muted">
              Notes begin at v.{fromVerse} (covers this passage).
            </p>
          )}
          {body.split(/\n\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <p className="muted">Source: {source} via bible.helloao.org</p>
        </div>
      )}

      <div className="session-actions">
        <button type="button" className="btn ghost-outline" onClick={onSaveMemory}>
          Save to memory
        </button>
        <button type="button" className="btn primary" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  )
}
