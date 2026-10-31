import { publicVersesForDifficulty, type PublicVerse } from '../data/games/publicVerses'
import type { MemoryVerse, UserState } from '../lib/types'
import { normalizeAnswerText } from '../lib/progressEvents'
import type { GameDifficulty } from './types'

export type PlayableVerse = {
  id: string
  reference: string
  text: string
  translationLabel: string
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

export function shuffleWords(words: string[], seed: number): string[] {
  const rand = mulberry32(seed)
  const a = [...words]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function tokenizeVerse(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

export function wordsMatch(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  return a.every((w, i) => normalizeAnswerText(w) === normalizeAnswerText(b[i]))
}

export function textMatches(a: string, b: string): boolean {
  return normalizeAnswerText(a) === normalizeAnswerText(b)
}

/** Split verse into shown prefix + hidden suffix by difficulty. */
export function splitForFinish(
  text: string,
  difficulty: GameDifficulty,
): { prefix: string; suffix: string; words: string[] } {
  const words = tokenizeVerse(text)
  if (words.length < 3) {
    return { prefix: words[0] ?? '', suffix: words.slice(1).join(' '), words }
  }
  const keep =
    difficulty === 'beginner'
      ? Math.ceil(words.length * 0.55)
      : difficulty === 'intermediate'
        ? Math.ceil(words.length * 0.4)
        : Math.ceil(words.length * 0.28)
  const cut = Math.max(1, Math.min(words.length - 1, keep))
  return {
    prefix: words.slice(0, cut).join(' '),
    suffix: words.slice(cut).join(' '),
    words,
  }
}

function fromMemory(v: MemoryVerse): PlayableVerse {
  return {
    id: v.id,
    reference: v.reference,
    text: v.text.trim(),
    translationLabel: v.translationId.toUpperCase(),
  }
}

function fromPublic(v: PublicVerse): PlayableVerse {
  return {
    id: v.id,
    reference: v.reference,
    text: v.text.trim(),
    translationLabel: 'WEB',
  }
}

/** Prefer user's memory verses; fall back to curated WEB verses. */
export function selectPlayableVerses(
  user: UserState,
  difficulty: GameDifficulty,
  count: number,
  seed = Date.now(),
): PlayableVerse[] {
  const mem = user.memoryVerses
    .filter((v) => v.text?.trim().split(/\s+/).length >= 4)
    .map(fromMemory)
  const pool = mem.length >= 2 ? mem : publicVersesForDifficulty(difficulty).map(fromPublic)
  const rand = mulberry32(seed)
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
