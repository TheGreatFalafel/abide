'use client'

import { useState } from 'react'
import type { PassageRef } from '../../data/books'
import { parsePassageLabel, parsePassageList } from '../../data/planParse'
import { fetchPassage, type PassageContent } from '../../lib/bibleApi'
import type { TranslationId } from '../../data/translations'
import { EsvAttribution } from '../EsvAttribution'

type Props = {
  items: string[]
  passages?: Record<string, PassageContent | null>
  translationId: TranslationId
  esvApiKey: string
}

type ParsedItem =
  | { kind: 'passage'; label: string; refs: PassageRef[] }
  | { kind: 'youtube'; label: string; embedUrl: string; watchUrl: string }
  | { kind: 'link'; label: string; href: string }
  | { kind: 'text'; label: string }

function passageKey(ref: PassageRef): string {
  return `${ref.bookId}:${ref.chapter}:${ref.verseStart ?? ''}:${ref.verseEnd ?? ''}`
}

function formatRef(ref: PassageRef): string {
  const base = `${ref.bookName} ${ref.chapter}`
  if (ref.verseStart == null) return base
  if (ref.verseEnd == null || ref.verseEnd === ref.verseStart) return `${base}:${ref.verseStart}`
  return `${base}:${ref.verseStart}–${ref.verseEnd}`
}

function youtubeEmbed(url: string): { embedUrl: string; watchUrl: string } | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    let id = ''
    if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0] ?? ''
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (u.pathname.startsWith('/watch')) id = u.searchParams.get('v') ?? ''
      else if (u.pathname.startsWith('/embed/')) id = u.pathname.split('/')[2] ?? ''
      else if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2] ?? ''
    }
    if (!id || !/^[a-zA-Z0-9_-]{6,}$/.test(id)) return null
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    }
  } catch {
    return null
  }
}

function extractUrl(text: string): string | null {
  const m = text.match(/https?:\/\/[^\s)]+/i)
  return m?.[0]?.replace(/[.,;:]+$/, '') ?? null
}

/** Prefer an explicit "Supporting passage: …" prefix, else try parsing the whole line. */
function parseStudyItem(raw: string): ParsedItem {
  const label = raw.trim()
  const url = extractUrl(label)
  if (url) {
    const yt = youtubeEmbed(url)
    if (yt) return { kind: 'youtube', label, ...yt }
    return { kind: 'link', label, href: url }
  }

  const support = label.match(/^Supporting passage:\s*(.+)$/i)
  const candidate = (support?.[1] ?? label).trim()

  // Semicolon lists of refs (common in furtherStudy).
  if (/;/.test(candidate) || candidate.length <= 100) {
    const listRefs = parsePassageList(candidate)
    if (listRefs.length) return { kind: 'passage', label, refs: listRefs }
  }

  const single = parsePassageLabel(candidate)
  if (single.length) return { kind: 'passage', label, refs: single }

  // Pull embedded "Book N:N–N" refs out of longer further-study lines.
  const embeddedRe =
    /\b((?:[1-3]\s)?[A-Za-z]+(?:\s[A-Za-z]+)?)\s+(\d+:\d+(?:[-–]\d+(?::\d+)?)?|\d+(?:[-–]\d+)?)\b/g
  const embeddedRefs: PassageRef[] = []
  const seen = new Set<string>()
  for (const m of label.matchAll(embeddedRe)) {
    const refs = parsePassageLabel(`${m[1]} ${m[2]}`)
    for (const ref of refs) {
      const key = passageKey(ref)
      if (!seen.has(key)) {
        seen.add(key)
        embeddedRefs.push(ref)
      }
    }
  }
  if (embeddedRefs.length) return { kind: 'passage', label, refs: embeddedRefs }
  return { kind: 'text', label }
}

function PassagePreview({
  refs,
  cached,
  translationId,
  esvApiKey,
  open,
  onOpenChange,
}: {
  refs: PassageRef[]
  cached?: Record<string, PassageContent | null>
  translationId: TranslationId
  esvApiKey: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState<PassageContent[]>([])

  async function ensureLoaded() {
    setError(null)
    const fromCache = refs
      .map((r) => cached?.[passageKey(r)] ?? null)
      .filter((c): c is PassageContent => Boolean(c?.verses?.length))
    if (fromCache.length === refs.length) {
      setLoaded(fromCache)
      return
    }
    setLoading(true)
    try {
      const results = await Promise.all(
        refs.map((r) =>
          fetchPassage(r, { translation: translationId, esvApiKey }).catch((err) => {
            throw err instanceof Error ? err : new Error('Could not load Scripture')
          }),
        ),
      )
      const nonempty = results.filter((r) => r.verses?.length)
      if (!nonempty.length) throw new Error('Passage returned no verses')
      setLoaded(nonempty)
    } catch (err) {
      setLoaded([])
      setError(err instanceof Error ? err.message : 'Could not load Scripture')
    } finally {
      setLoading(false)
    }
  }

  async function toggle() {
    if (open) {
      onOpenChange(false)
      return
    }
    onOpenChange(true)
    await ensureLoaded()
  }

  return (
    <div className="study-passage">
      <div className="study-passage-refs">
        {refs.map((ref) => (
          <button
            key={passageKey(ref)}
            type="button"
            className="study-ref-chip"
            onClick={() => void toggle()}
            aria-expanded={open}
          >
            {formatRef(ref)}
          </button>
        ))}
      </div>
      {open ? (
        <div className="study-passage-body">
          {loading ? <p className="muted">Loading Scripture…</p> : null}
          {error ? (
            <div className="nudge risk" role="alert">
              <p>{error}</p>
              <button type="button" className="btn ghost sm" onClick={() => void ensureLoaded()}>
                Retry
              </button>
            </div>
          ) : null}
          {loaded.map((p) => (
            <article key={p.reference} className="passage-card compact">
              <h4>{p.reference}</h4>
              {p.verses.map((v) => (
                <p key={v.number}>
                  <sup>{v.number}</sup> {v.text}
                </p>
              ))}
            </article>
          ))}
          {translationId === 'esv' && loaded.length ? <EsvAttribution compact /> : null}
          <button type="button" className="btn ghost sm" onClick={() => onOpenChange(false)}>
            Hide verses
          </button>
        </div>
      ) : null}
    </div>
  )
}

function StudyItemRow({
  raw,
  passages,
  translationId,
  esvApiKey,
}: {
  raw: string
  passages?: Record<string, PassageContent | null>
  translationId: TranslationId
  esvApiKey: string
}) {
  const item = parseStudyItem(raw)
  const [open, setOpen] = useState(false)

  return (
    <li className="study-resource-item">
      {item.kind === 'passage' ? (
        <>
          <p className="study-resource-label">{item.label}</p>
          <PassagePreview
            refs={item.refs}
            cached={passages}
            translationId={translationId}
            esvApiKey={esvApiKey}
            open={open}
            onOpenChange={setOpen}
          />
        </>
      ) : null}
      {item.kind === 'youtube' ? (
        <>
          <p className="study-resource-label">
            {item.label.replace(item.watchUrl, '').trim() || 'Video resource'}
          </p>
          <div className="study-embed">
            <iframe
              title="Study video"
              src={item.embedUrl}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <p className="muted tiny">
            <a href={item.watchUrl} target="_blank" rel="noopener noreferrer">
              Open on YouTube
            </a>
            {' · '}
            Public embeds only; if embedding is blocked, use the link.
          </p>
        </>
      ) : null}
      {item.kind === 'link' ? (
        <p>
          <a href={item.href} target="_blank" rel="noopener noreferrer">
            {item.label.includes(item.href) ? item.label : `${item.label} →`}
          </a>
        </p>
      ) : null}
      {item.kind === 'text' ? <p>{item.label}</p> : null}
    </li>
  )
}

export function StudyResourceList({ items, passages, translationId, esvApiKey }: Props) {
  if (!items.length) return null
  return (
    <ul className="study-resource-list">
      {items.map((raw) => (
        <StudyItemRow
          key={raw}
          raw={raw}
          passages={passages}
          translationId={translationId}
          esvApiKey={esvApiKey}
        />
      ))}
    </ul>
  )
}
