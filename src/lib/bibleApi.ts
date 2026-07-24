import type { PassageRef } from '../data/bible'
import { apiQuery, verseQuery } from '../data/bible'
import type { TranslationId } from '../data/translations'
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

export function clearPassageCache(): void {
  cache.clear()
}

function cacheKey(translation: TranslationId, query: string): string {
  return `${translation}:${query}`
}

function parseEsvPassage(raw: string, fallbackRef: string): PassageContent {
  const lines = raw.replace(/\r/g, '').split('\n')
  let reference = fallbackRef
  const verses: Verse[] = []
  let firstContent = true
  let pendingHeading: string | undefined

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed === '(ESV)') continue
    if (firstContent && !/\[\d+\]/.test(trimmed)) {
      reference = trimmed
      firstContent = false
      continue
    }
    firstContent = false

    const matches = [...trimmed.matchAll(/\[(\d+)\]\s*/g)]
    if (!matches.length) {
      // Section heading (or other non-verse line)
      pendingHeading = trimmed
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
      if (text) {
        verses.push({
          number: num,
          text,
          heading: i === 0 ? pendingHeading : undefined,
        })
        if (i === 0) pendingHeading = undefined
      }
    }
  }

  if (!verses.length) {
    const cleaned = raw
      .replace(/^\s*[^\n]+\n+/, '')
      .replace(/\(ESV\)/g, '')
      .replace(/\[\d+\]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    verses.push({ number: 1, text: cleaned || raw.trim() })
  }

  return {
    reference,
    verses,
    translation: 'English Standard Version (ESV)',
    translationId: 'esv',
  }
}

async function fetchEsv(query: string, apiKey: string): Promise<PassageContent> {
  const params = new URLSearchParams({
    q: query,
    'include-passage-references': 'true',
    'include-verse-numbers': 'true',
    'include-first-verse-numbers': 'true',
    'include-footnotes': 'false',
    'include-footnote-body': 'false',
    'include-headings': 'true',
    'include-short-copyright': 'true',
    'include-selahs': 'false',
  })

  // Call Crossway directly — their API allows browser CORS with Authorization.
  // Avoids the local Vite proxy, which was failing with "Failed to fetch" / 502.
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
    let detail = ''
    try {
      const errBody = (await res.json()) as { detail?: string }
      detail = errBody.detail ? `: ${errBody.detail}` : ''
    } catch {
      /* ignore */
    }
    throw new Error(`Could not load ESV passage (${res.status})${detail}`)
  }

  const data = (await res.json()) as EsvResponse
  const passage = data.passages?.[0]
  if (!passage) {
    throw new Error(data.detail || 'ESV passage not found')
  }
  return parseEsvPassage(passage, data.canonical || query)
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

export async function fetchQuery(
  query: string,
  opts: FetchOptions,
): Promise<PassageContent> {
  const key = cacheKey(opts.translation, query)
  const hit = cache.get(key)
  if (hit) return hit

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
  return content
}

export function testEsvConnection(apiKey: string): Promise<{ ok: boolean; message: string }> {
  const key = apiKey.trim()
  if (!key) return Promise.resolve({ ok: false, message: 'Paste your API key first.' })
  return fetch('https://api.esv.org/v3/passage/text/?q=John+3:16&include-footnotes=false', {
    headers: {
      Authorization: `Token ${key}`,
      Accept: 'application/json',
    },
  })
    .then(async (res) => {
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
    .catch(() => ({
      ok: false,
      message: 'Could not reach api.esv.org from this browser.',
    }))
}

export function passageToPlainText(content: PassageContent): string {
  return content.verses.map((v) => v.text).join(' ')
}
