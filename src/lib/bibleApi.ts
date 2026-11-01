import type { PassageRef } from '../data/bible'
import { apiQuery, verseQuery } from '../data/bible'
import type { TranslationId } from '../data/translations'
import { clearStoredPassages, readStoredPassage, writeStoredPassage } from './passageStore'
import { applySectionHeadings } from './sectionHeadings'

export type Verse = {
  number: number
  text: string
  /** Section heading printed before this verse. */
  heading?: string
}

export type PassageContent = {
  reference: string
  verses: Verse[]
  translation: string
  translationId: TranslationId
  /** True when more of this chapter remains after a partial reading. */
  hasMoreInChapter?: boolean
  /** Full chapter verses for "Keep reading". */
  fullChapterVerses?: Verse[]
  /** Set when served from IndexedDB because the network was unavailable. */
  fromOfflineCache?: boolean
}

type BibleApiResponse = {
  reference?: string
  text?: string
  translation_name?: string
  verses?: { verse: number; text: string }[]
  error?: string
}

type EsvResponse = {
  query?: string
  canonical?: string
  passages?: string[]
  detail?: string
}

const cache = new Map<string, PassageContent>()
/** Deduplicate concurrent identical fetches (prevents race thrash / double network). */
const inflight = new Map<string, Promise<PassageContent>>()

export function clearPassageCache(): void {
  cache.clear()
  inflight.clear()
  void clearStoredPassages()
}

function cacheKey(translation: TranslationId, query: string): string {
  return `${translation}:${query}`
}

/** Parse ESV plain-text API output into numbered verses.
 * Poetry often continues on following lines without a new `[N]` marker —
 * those lines must append to the open verse, not be treated as headings.
 */
export function parseEsvPassage(raw: string, fallbackRef: string): PassageContent {
  const lines = raw.replace(/\r/g, '').split('\n')
  let reference = fallbackRef
  const verses: Verse[] = []
  let firstContent = true
  let pendingHeading: string | undefined

  for (const line of lines) {
    const trimmed = line.trim().replace(/\s*\(ESV\)\s*$/, '').trim()
    if (!trimmed) continue
    if (firstContent && !/\[\d+\]/.test(trimmed)) {
      reference = trimmed
      firstContent = false
      continue
    }
    firstContent = false

    const matches = [...trimmed.matchAll(/\[(\d+)\]\s*/g)]
    if (!matches.length) {
      // Continuation of the previous verse (poetry / wrapped lines).
      // With include-headings off, non-marker lines are verse text only.
      if (verses.length) {
        const last = verses[verses.length - 1]
        last.text = `${last.text} ${trimmed}`.replace(/\s+/g, ' ').trim()
      } else {
        pendingHeading = trimmed
      }
      continue
    }

    for (let i = 0; i < matches.length; i++) {
      const m = matches[i]
      const num = Number(m[1])
      const start = (m.index ?? 0) + m[0].length
      const end = i + 1 < matches.length ? (matches[i + 1].index ?? trimmed.length) : trimmed.length
      const text = trimmed
        .slice(start, end)
        .replace(/\(ESV\)\s*$/, '')
        .replace(/\s+/g, ' ')
        .trim()
      // Always open the verse — text may arrive on following poetry lines.
      verses.push({
        number: num,
        text,
        heading: i === 0 ? pendingHeading : undefined,
      })
      if (i === 0) pendingHeading = undefined
    }
  }

  const nonempty = verses.filter((v) => v.text)
  if (!nonempty.length) {
    const cleaned = raw
      .replace(/^\s*[^\n]+\n+/, '')
      .replace(/\(ESV\)/g, '')
      .replace(/\[\d+\]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    nonempty.push({ number: 1, text: cleaned || raw.trim() })
  }

  return {
    reference,
    verses: nonempty,
    translation: 'English Standard Version (ESV)',
    translationId: 'esv',
  }
}

function canUseEsvProxy(): boolean {
  // Prefer same-origin Next proxy when available (never logs/stores the key).
  return typeof window !== 'undefined' && !window.location.port.includes('5173')
}

async function fetchEsvViaProxy(query: string, apiKey: string): Promise<PassageContent> {
  const res = await fetch('/api/bible/esv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-ESV-API-Key': apiKey,
    },
    body: JSON.stringify({ query }),
  })
  if (res.status === 401 || res.status === 403) {
    throw new Error('ESV API key was rejected. Re-paste it in Settings (no extra spaces).')
  }
  if (!res.ok) {
    let message = `Could not load ESV passage (${res.status})`
    try {
      const errBody = (await res.json()) as { error?: string }
      if (errBody.error) message = errBody.error
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }
  const data = (await res.json()) as PassageContent
  return {
    reference: data.reference,
    verses: data.verses,
    translation: data.translation || 'English Standard Version (ESV)',
    translationId: 'esv',
  }
}

async function fetchEsvDirect(query: string, apiKey: string): Promise<PassageContent> {
  const params = new URLSearchParams({
    q: query,
    'include-passage-references': 'true',
    'include-verse-numbers': 'true',
    'include-first-verse-numbers': 'true',
    'include-footnotes': 'false',
    'include-footnote-body': 'false',
    'include-headings': 'false',
    'indent-poetry': 'false',
    'include-short-copyright': 'true',
    'include-selahs': 'false',
  })

  let res: Response
  try {
    res = await fetch(`https://api.esv.org/v3/passage/text/?${params.toString()}`, {
      headers: {
        Authorization: `Token ${apiKey}`,
        Accept: 'application/json',
      },
    })
  } catch {
    throw new Error(
      'Could not reach api.esv.org. Check your internet connection, then try again.',
    )
  }

  if (res.status === 401 || res.status === 403) {
    throw new Error('ESV API key was rejected. Re-paste it in Settings (no extra spaces).')
  }
  if (!res.ok) {
    throw new Error(`Could not load ESV passage (${res.status})`)
  }

  const data = (await res.json()) as EsvResponse
  const passage = data.passages?.[0]
  if (!passage) {
    throw new Error(data.detail || 'ESV passage not found')
  }
  return parseEsvPassage(passage, data.canonical || query)
}

async function fetchEsv(query: string, apiKey: string): Promise<PassageContent> {
  if (canUseEsvProxy()) {
    try {
      return await fetchEsvViaProxy(query, apiKey)
    } catch (err) {
      // Fall back to direct Crossway call (Vite / proxy unavailable)
      if (err instanceof Error && /rejected/i.test(err.message)) throw err
    }
  }
  return fetchEsvDirect(query, apiKey)
}

async function fetchBibleApi(
  query: string,
  translation: 'web' | 'kjv',
): Promise<PassageContent> {
  const q = encodeURIComponent(query)
  const res = await fetch(`https://bible-api.com/${q}?translation=${translation}`)
  if (!res.ok) throw new Error(`Could not load ${query}`)
  const data = (await res.json()) as BibleApiResponse
  if (data.error || !data.verses?.length) {
    throw new Error(data.error || 'Passage not found')
  }
  return {
    reference: data.reference || query,
    translation: data.translation_name || translation.toUpperCase(),
    translationId: translation,
    verses: data.verses.map((v) => ({
      number: v.verse,
      text: v.text.replace(/\n/g, ' ').trim(),
    })),
  }
}

export type FetchOptions = {
  translation: TranslationId
  esvApiKey?: string
}

function withStandardHeadings(
  bookName: string,
  chapter: number,
  content: PassageContent,
): PassageContent {
  return {
    ...content,
    verses: applySectionHeadings(bookName, chapter, content.verses),
  }
}

function sliceChapter(
  content: PassageContent,
  verseStart?: number,
  verseEnd?: number,
  heading?: string,
): PassageContent {
  if (!verseStart && !verseEnd) return content
  const start = verseStart ?? content.verses[0]?.number ?? 1
  const end = verseEnd ?? content.verses[content.verses.length - 1]?.number ?? start
  const sliced = content.verses.filter((v) => v.number >= start && v.number <= end)
  const hasMore = content.verses.some((v) => v.number > end)
  const label =
    heading ||
    (verseEnd
      ? `${content.reference}:${start}–${end}`
      : `${content.reference}:${start}–`)
  return {
    ...content,
    reference: heading ? `${content.reference} · ${heading}` : label,
    verses: sliced.map((v, i) =>
      i === 0 && heading ? { ...v, heading } : v,
    ),
    hasMoreInChapter: hasMore,
    fullChapterVerses: content.verses,
  }
}

export async function fetchPassage(
  ref: PassageRef,
  opts: FetchOptions,
): Promise<PassageContent> {
  const query = apiQuery(ref)
  const raw = await fetchQuery(query, opts)
  const content = withStandardHeadings(ref.bookName, ref.chapter, raw)

  if (ref.verseStart != null || ref.verseEnd != null || ref.heading) {
    return sliceChapter(content, ref.verseStart, ref.verseEnd, ref.heading)
  }

  if (!ref.part) return content

  const mid = Math.max(1, Math.ceil(content.verses.length / 2))
  if (ref.part === 'a') {
    return {
      ...content,
      reference: `${content.reference} (first half)`,
      verses: content.verses.slice(0, mid),
      hasMoreInChapter: true,
      fullChapterVerses: content.verses,
    }
  }
  return {
    ...content,
    reference: `${content.reference} (second half)`,
    verses: content.verses.slice(mid),
    hasMoreInChapter: false,
    fullChapterVerses: content.verses,
  }
}

export async function fetchVerseRange(
  bookName: string,
  chapter: number,
  verseStart: number,
  verseEnd: number | undefined,
  opts: FetchOptions,
): Promise<PassageContent> {
  const query = verseQuery(bookName, chapter, verseStart, verseEnd)
  return fetchQuery(query, opts)
}

async function fetchQueryNetwork(
  query: string,
  opts: FetchOptions,
  stored: PassageContent | undefined,
): Promise<PassageContent> {
  const key = cacheKey(opts.translation, query)
  try {
    let content: PassageContent
    if (opts.translation === 'esv') {
      if (!opts.esvApiKey?.trim()) {
        throw new Error(
          'ESV needs a free API key from api.esv.org — add it in Settings, or switch to WEB/KJV.',
        )
      }
      content = await fetchEsv(query, opts.esvApiKey.trim())
    } else {
      content = await fetchBibleApi(query, opts.translation)
    }

    cache.set(key, content)
    void writeStoredPassage(key, content)
    return content
  } catch (err) {
    if (stored) {
      return { ...stored, fromOfflineCache: true }
    }
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new Error(
        'You are offline and this passage is not saved on this device yet. Open it once while online to read offline later.',
      )
    }
    throw err
  }
}

export async function fetchQuery(
  query: string,
  opts: FetchOptions,
): Promise<PassageContent> {
  const key = cacheKey(opts.translation, query)
  const hit = cache.get(key)
  if (hit) return hit

  const pending = inflight.get(key)
  if (pending) return pending

  const work = (async () => {
    const stored = await readStoredPassage(key)
    if (stored) {
      cache.set(key, stored)
      // Prefer network refresh when online; fall through on failure
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        return { ...stored, fromOfflineCache: true }
      }
    }
    return fetchQueryNetwork(query, opts, stored ?? undefined)
  })()

  inflight.set(key, work)
  try {
    return await work
  } finally {
    inflight.delete(key)
  }
}

export function testEsvConnection(apiKey: string): Promise<{ ok: boolean; message: string }> {
  const key = apiKey.trim()
  if (!key) return Promise.resolve({ ok: false, message: 'Paste your API key first.' })

  const viaProxy = canUseEsvProxy()
    ? fetch('/api/bible/esv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-ESV-API-Key': key,
        },
        body: JSON.stringify({ query: 'John 3:16' }),
      }).then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          return { ok: false, message: 'Key rejected by Crossway. Double-check the token.' }
        }
        if (!res.ok) {
          return { ok: false, message: `ESV proxy returned ${res.status}.` }
        }
        return { ok: true, message: 'Connected — John 3:16 loaded from ESV (proxied).' }
      })
    : null

  const direct = () =>
    fetch('https://api.esv.org/v3/passage/text/?q=John+3:16&include-footnotes=false', {
      headers: {
        Authorization: `Token ${key}`,
        Accept: 'application/json',
      },
    }).then(async (res) => {
      if (res.status === 401 || res.status === 403) {
        return { ok: false, message: 'Key rejected by Crossway. Double-check the token.' }
      }
      if (!res.ok) {
        return { ok: false, message: `Crossway returned ${res.status}.` }
      }
      const data = (await res.json()) as EsvResponse
      if (!data.passages?.[0]) {
        return { ok: false, message: 'Connected, but no passage text came back.' }
      }
      return { ok: true, message: 'Connected — John 3:16 loaded from ESV.' }
    })

  return (viaProxy ?? direct())
    .catch(() => direct())
    .catch(() => ({
      ok: false,
      message: 'Could not reach the ESV API from this browser.',
    }))
}

export function passageToPlainText(content: PassageContent): string {
  return content.verses.map((v) => v.text).join(' ')
}
