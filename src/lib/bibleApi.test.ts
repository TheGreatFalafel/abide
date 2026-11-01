import { afterEach, describe, expect, it, vi } from 'vitest'
import { clearPassageCache, fetchQuery, parseEsvPassage } from './bibleApi'

vi.mock('./passageStore', () => ({
  readStoredPassage: vi.fn(async () => undefined),
  writeStoredPassage: vi.fn(async () => undefined),
  clearStoredPassages: vi.fn(async () => undefined),
}))

describe('parseEsvPassage', () => {
  it('keeps every poetry line in Isaiah 53:5', () => {
    const result = parseEsvPassage(
      `Isaiah 53:5

[5] But he was pierced for our transgressions;
he was crushed for our iniquities;
upon him was the chastisement that brought us peace,
and with his wounds we are healed. (ESV)`,
      'Isaiah 53:5',
    )

    expect(result.verses).toEqual([
      {
        number: 5,
        text:
          'But he was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his wounds we are healed.',
        heading: undefined,
      },
    ])
  })

  it('appends wrapped text to the most recent verse', () => {
    const result = parseEsvPassage(
      `Psalm 1:1–2
[1] Blessed is the man [2] but his delight is in the law of the LORD,
and on his law he meditates day and night.

(ESV)`,
      'Psalm 1:1-2',
    )

    expect(result.verses.map((verse) => verse.text)).toEqual([
      'Blessed is the man',
      'but his delight is in the law of the LORD, and on his law he meditates day and night.',
    ])
  })
})

describe('fetchQuery', () => {
  afterEach(() => {
    clearPassageCache()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('dedupes concurrent identical requests and reuses memory cache', async () => {
    let resolveFetch: ((value: Response) => void) | undefined
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve
        }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const a = fetchQuery('John 3', { translation: 'web' })
    const b = fetchQuery('John 3', { translation: 'web' })

    // Allow readStoredPassage + inflight setup to reach network.
    for (let i = 0; i < 5 && !resolveFetch; i++) {
      await Promise.resolve()
    }
    expect(fetchMock).toHaveBeenCalledTimes(1)

    resolveFetch!(
      new Response(
        JSON.stringify({
          reference: 'John 3',
          translation_name: 'World English Bible',
          verses: [{ verse: 16, text: 'For God so loved the world' }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const [ra, rb] = await Promise.all([a, b])
    expect(ra.reference).toBe('John 3')
    expect(rb.verses[0]?.text).toMatch(/loved the world/i)

    const cached = await fetchQuery('John 3', { translation: 'web' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(cached.verses[0]?.number).toBe(16)
  })

  it('surfaces a clear error when the network fails with no offline copy', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down')
      }),
    )
    vi.stubGlobal('navigator', { onLine: true })

    await expect(fetchQuery('John 99', { translation: 'web' })).rejects.toThrow(/network down|Could not load/i)
  })
})
