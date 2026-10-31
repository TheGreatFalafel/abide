import { answersMatch, normalizeAnswerText } from './progressEvents'

export type ServerTranslationId = 'web' | 'kjv' | 'esv'

type BibleApiResponse = {
  reference?: string
  text?: string
  verses?: { verse: number; text: string }[]
  error?: string
}

type EsvResponse = {
  canonical?: string
  passages?: string[]
  detail?: string
}

/** Fetch passage text server-side for challenge grading. Never logs API keys. */
export async function fetchScripturePlainText(opts: {
  bookName: string
  chapter: number
  verseStart: number
  verseEnd: number
  translationId: ServerTranslationId
  /** Device-local Crossway token — used only for this request, never stored. */
  esvApiKey?: string
}): Promise<string> {
  const { bookName, chapter, verseStart, verseEnd, translationId } = opts
  const end = verseEnd || verseStart
  const query =
    verseStart === end
      ? `${bookName} ${chapter}:${verseStart}`
      : `${bookName} ${chapter}:${verseStart}-${end}`

  if (translationId === 'esv') {
    const key = opts.esvApiKey?.trim()
    if (!key) {
      throw new Error('ESV key required for ESV challenge answers')
    }
    return fetchEsvPlain(query, key)
  }

  return fetchBibleApiPlain(query, translationId)
}

async function fetchBibleApiPlain(
  query: string,
  translation: 'web' | 'kjv',
): Promise<string> {
  const q = encodeURIComponent(query)
  const res = await fetch(`https://bible-api.com/${q}?translation=${translation}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Could not load passage (${res.status})`)
  const data = (await res.json()) as BibleApiResponse
  if (data.error || !data.verses?.length) {
    throw new Error(data.error || 'Passage not found')
  }
  return data.verses.map((v) => v.text.replace(/\n/g, ' ').trim()).join(' ')
}

async function fetchEsvPlain(query: string, apiKey: string): Promise<string> {
  const params = new URLSearchParams({
    q: query,
    'include-passage-references': 'false',
    'include-verse-numbers': 'false',
    'include-first-verse-numbers': 'false',
    'include-footnotes': 'false',
    'include-headings': 'false',
    'include-short-copyright': 'false',
  })
  const res = await fetch(`https://api.esv.org/v3/passage/text/?${params}`, {
    headers: {
      Authorization: `Token ${apiKey}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })
  if (res.status === 401 || res.status === 403) {
    throw new Error('ESV API key was rejected')
  }
  if (!res.ok) throw new Error(`ESV request failed (${res.status})`)
  const data = (await res.json()) as EsvResponse
  const passage = data.passages?.[0]
  if (!passage) throw new Error(data.detail || 'ESV passage not found')
  return passage
    .replace(/\(ESV\)/g, '')
    .replace(/\[\d+\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function gradeSelectedText(selected: string, expected: string): boolean {
  return answersMatch(selected, expected)
}

export { normalizeAnswerText }
