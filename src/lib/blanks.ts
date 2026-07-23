export type BlankToken =
  | { kind: 'text'; value: string }
  | { kind: 'blank'; id: number; answer: string; display: string }

export type BlankPuzzle = {
  tokens: BlankToken[]
  blankIds: number[]
  /** Scrambled answers for the word bank */
  bank: string[]
  blankCount: number
  difficultyLabel: string
}

/** How hard blanks should be based on learning progress. */
export function blankDifficulty(opts: {
  repetitions: number
  intervalDays: number
  status: 'learning' | 'memorized'
}): { ratio: number; label: string } {
  if (opts.status === 'memorized' || opts.intervalDays >= 21) {
    return { ratio: 0.75, label: 'Deep recall' }
  }
  if (opts.repetitions >= 6) return { ratio: 0.65, label: 'Hard' }
  if (opts.repetitions >= 4) return { ratio: 0.5, label: 'Solid' }
  if (opts.repetitions >= 2) return { ratio: 0.35, label: 'Building' }
  return { ratio: 0.2, label: 'Gentle' }
}

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Build a blanks puzzle. `seed` changes which words are blanked each session.
 */
export function buildBlankPuzzle(
  text: string,
  opts: {
    seed: number
    repetitions: number
    intervalDays: number
    status: 'learning' | 'memorized'
  },
): BlankPuzzle {
  const rand = mulberry32(opts.seed)
  const { ratio, label } = blankDifficulty(opts)

  const parts = text.split(/(\s+)/)
  const contentIdx: number[] = []
  for (let i = 0; i < parts.length; i++) {
    if (/[A-Za-z']{3,}/.test(parts[i])) contentIdx.push(i)
  }

  const take = Math.max(
    1,
    Math.min(contentIdx.length, Math.round(contentIdx.length * ratio)),
  )
  const chosen = shuffle(contentIdx, rand).slice(0, take).sort((a, b) => a - b)

  const blankSet = new Set(chosen)
  const tokens: BlankToken[] = []
  const answers: string[] = []
  let blankId = 0

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (blankSet.has(i)) {
      const clean = part.replace(/[^A-Za-z']/g, '')
      const punct = part.replace(/[A-Za-z']/g, '')
      tokens.push({
        kind: 'blank',
        id: blankId,
        answer: clean,
        display: punct ? `______${punct}` : '______',
      })
      answers.push(clean)
      blankId += 1
    } else {
      tokens.push({ kind: 'text', value: part })
    }
  }

  return {
    tokens,
    blankIds: answers.map((_, i) => i),
    bank: shuffle(answers, rand),
    blankCount: answers.length,
    difficultyLabel: label,
  }
}

export function normalizeWord(s: string): string {
  return s.toLowerCase().replace(/[^a-z']/g, '')
}
