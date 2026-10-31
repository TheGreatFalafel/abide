import { NextResponse } from 'next/server'
import { parseEsvPassage } from '@/lib/bibleApi'

/**
 * Same-origin ESV proxy. The personal Crossway key is accepted only for this
 * request (Authorization header or X-ESV-API-Key) and is never logged or stored.
 */
export async function POST(req: Request) {
  let body: { query?: string }
  try {
    body = (await req.json()) as { query?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const query = typeof body.query === 'string' ? body.query.trim() : ''
  if (!query || query.length > 200) {
    return NextResponse.json({ error: 'query required (max 200 chars)' }, { status: 400 })
  }
  // Restrict to passage-like queries — no open proxy
  if (/^https?:/i.test(query) || query.includes('\n')) {
    return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
  }

  const auth = req.headers.get('authorization') || ''
  const headerKey = req.headers.get('x-esv-api-key') || ''
  const tokenFromAuth = auth.toLowerCase().startsWith('token ')
    ? auth.slice(6).trim()
    : ''
  const apiKey = (headerKey || tokenFromAuth).trim()
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ESV API key required in Authorization or X-ESV-API-Key' },
      { status: 401 },
    )
  }

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
    res = await fetch(`https://api.esv.org/v3/passage/text/?${params}`, {
      headers: {
        Authorization: `Token ${apiKey}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })
  } catch {
    return NextResponse.json({ error: 'Could not reach Crossway ESV API' }, { status: 502 })
  }

  if (res.status === 401 || res.status === 403) {
    return NextResponse.json({ error: 'ESV API key was rejected' }, { status: 403 })
  }
  if (!res.ok) {
    return NextResponse.json(
      { error: `ESV request failed (${res.status})` },
      { status: 502 },
    )
  }

  const data = (await res.json()) as {
    query?: string
    canonical?: string
    passages?: string[]
    detail?: string
  }
  const passage = data.passages?.[0]
  if (!passage) {
    return NextResponse.json({ error: data.detail || 'Passage not found' }, { status: 404 })
  }

  const content = parseEsvPassage(passage, data.canonical || query)
  return NextResponse.json({
    reference: content.reference,
    translation: content.translation,
    translationId: 'esv',
    verses: content.verses,
  })
}
