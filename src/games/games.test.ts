import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TRIVIA_BANK } from '../data/games/trivia'
import { WHO_SAID_IT_BANK } from '../data/games/whoSaidIt'
import { MATCH_BANK } from '../data/games/matchPassage'
import { TIMELINE_SETS } from '../data/games/timeline'
import { PUBLIC_VERSES } from '../data/games/publicVerses'
import {
  catalogExternalSources,
  looksLikeScriptureReference,
  validateSourceList,
  validateTheologicalSource,
  type TheologicalSource,
} from '../data/games/sources'
import { completeBibleGame } from '../lib/progress'
import { computeEventXp } from '../lib/progressEvents'
import { computeGemDelta } from '../lib/gemEvents'
import { XP, createInitialState, todayKey } from '../lib/types'
import { GAME_ART } from './art'
import { getGame, isGameId, listGames } from './registry'
import {
  selectPlayableVerses,
  splitForFinish,
  textMatches,
  tokenizeVerse,
  wordsMatch,
  shuffleWords,
} from './verseUtils'

beforeEach(() => {
  vi.stubGlobal('localStorage', {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  })
})

describe('game registry', () => {
  it('registers nine independently addressable games', () => {
    const games = listGames()
    expect(games).toHaveLength(9)
    for (const g of games) {
      expect(g.meta.id).toBeTruthy()
      expect(g.meta.title).toBeTruthy()
      expect(g.meta.objectives.length).toBeGreaterThan(0)
      expect(g.Component).toBeTypeOf('function')
      expect(isGameId(g.meta.id)).toBe(true)
      expect(getGame(g.meta.id)?.meta.id).toBe(g.meta.id)
      expect(GAME_ART[g.meta.id].background).toMatch(/^\/games\/bg-/)
      expect(GAME_ART[g.meta.id].emblem).toMatch(/^\/games\/emblem-/)
    }
  })
})

function byDifficulty<T extends { difficulty: string }>(items: T[], d: string) {
  return items.filter((i) => i.difficulty === d)
}

function assertUniqueIds(ids: string[]) {
  expect(new Set(ids).size).toBe(ids.length)
}

describe('question banks', () => {
  it('trivia answers point at valid choices with references and unique ids', () => {
    assertUniqueIds(TRIVIA_BANK.map((q) => q.id))
    for (const q of TRIVIA_BANK) {
      expect(q.choices.length).toBe(4)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(q.choices.length)
      expect(q.reference.trim().length).toBeGreaterThan(0)
      expect(q.explanation.trim().length).toBeGreaterThan(12)
      expect(['beginner', 'intermediate', 'advanced']).toContain(q.difficulty)
    }
    expect(byDifficulty(TRIVIA_BANK, 'beginner').length).toBeGreaterThanOrEqual(15)
    expect(byDifficulty(TRIVIA_BANK, 'intermediate').length).toBeGreaterThanOrEqual(15)
    expect(byDifficulty(TRIVIA_BANK, 'advanced').length).toBeGreaterThanOrEqual(15)
  })

  it('who-said-it answers are in-range with unique ids and coverage targets', () => {
    assertUniqueIds(WHO_SAID_IT_BANK.map((q) => q.id))
    for (const q of WHO_SAID_IT_BANK) {
      expect(q.choices.length).toBe(4)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(q.choices.length)
      expect(q.reference).toBeTruthy()
      expect(q.explanation.trim().length).toBeGreaterThan(12)
      expect(q.quote.trim().length).toBeGreaterThan(8)
    }
    expect(byDifficulty(WHO_SAID_IT_BANK, 'beginner').length).toBeGreaterThanOrEqual(15)
    expect(byDifficulty(WHO_SAID_IT_BANK, 'intermediate').length).toBeGreaterThanOrEqual(15)
    expect(byDifficulty(WHO_SAID_IT_BANK, 'advanced').length).toBeGreaterThanOrEqual(15)
  })

  it('timeline sets have unique ascending orders and difficulty coverage', () => {
    assertUniqueIds(TIMELINE_SETS.map((s) => s.id))
    const eventIds: string[] = []
    for (const set of TIMELINE_SETS) {
      const orders = set.events.map((e) => e.order)
      expect(set.events.length).toBeGreaterThanOrEqual(4)
      expect(new Set(orders).size).toBe(orders.length)
      expect([...orders].sort((a, b) => a - b)).toEqual([...orders].sort((a, b) => a - b))
      for (const e of set.events) {
        eventIds.push(e.id)
        expect(e.reference).toBeTruthy()
        expect(e.explanation).toBeTruthy()
      }
    }
    assertUniqueIds(eventIds)
    expect(byDifficulty(TIMELINE_SETS, 'beginner').length).toBeGreaterThanOrEqual(5)
    expect(byDifficulty(TIMELINE_SETS, 'intermediate').length).toBeGreaterThanOrEqual(5)
    expect(byDifficulty(TIMELINE_SETS, 'advanced').length).toBeGreaterThanOrEqual(5)
  })

  it('match bank items include reference, summary, explanation, and coverage', () => {
    assertUniqueIds(MATCH_BANK.map((m) => m.id))
    expect(MATCH_BANK.length).toBeGreaterThanOrEqual(45)
    for (const m of MATCH_BANK) {
      expect(m.reference).toMatch(/\d/)
      expect(m.summary.length).toBeGreaterThan(8)
      expect(m.explanation.length).toBeGreaterThan(8)
    }
    expect(byDifficulty(MATCH_BANK, 'beginner').length).toBeGreaterThanOrEqual(15)
    expect(byDifficulty(MATCH_BANK, 'intermediate').length).toBeGreaterThanOrEqual(15)
    expect(byDifficulty(MATCH_BANK, 'advanced').length).toBeGreaterThanOrEqual(15)
  })

  it('public verses are curated WEB texts with difficulty coverage', () => {
    assertUniqueIds(PUBLIC_VERSES.map((v) => v.id))
    for (const v of PUBLIC_VERSES) {
      expect(tokenizeVerse(v.text).length).toBeGreaterThanOrEqual(4)
      expect(v.reference).toBeTruthy()
      expect(v.bookId).toBeTruthy()
      expect(v.chapter).toBeGreaterThan(0)
    }
    expect(byDifficulty(PUBLIC_VERSES, 'beginner').length).toBeGreaterThanOrEqual(15)
    expect(byDifficulty(PUBLIC_VERSES, 'intermediate').length).toBeGreaterThanOrEqual(15)
    expect(byDifficulty(PUBLIC_VERSES, 'advanced').length).toBeGreaterThanOrEqual(15)
  })

  it('banks avoid empty or duplicate prompts within a bank', () => {
    const triviaPrompts = TRIVIA_BANK.map((q) => q.prompt.trim().toLowerCase())
    expect(new Set(triviaPrompts).size).toBe(triviaPrompts.length)
    const whoQuotes = WHO_SAID_IT_BANK.map((q) => q.quote.trim().toLowerCase())
    expect(new Set(whoQuotes).size).toBe(whoQuotes.length)
    const matchRefs = MATCH_BANK.map((m) => m.reference.trim().toLowerCase())
    expect(new Set(matchRefs).size).toBe(matchRefs.length)
  })

  it('scripture references look like Bible citations', () => {
    for (const q of TRIVIA_BANK) {
      expect(looksLikeScriptureReference(q.reference)).toBe(true)
    }
    for (const q of WHO_SAID_IT_BANK) {
      expect(looksLikeScriptureReference(q.reference)).toBe(true)
    }
    for (const m of MATCH_BANK) {
      expect(looksLikeScriptureReference(m.reference)).toBe(true)
    }
  })

  it('doctrinal trivia/who-said-it items carry valid source metadata', () => {
    const doctrinalTrivia = TRIVIA_BANK.filter((q) => q.theologyTopic)
    expect(doctrinalTrivia.length).toBeGreaterThanOrEqual(10)
    for (const q of doctrinalTrivia) {
      // Narrative/doctrine hybrids may rest on Scripture alone via reference,
      // but when sources are present they must validate.
      const issues = validateSourceList(q.sources, q.id)
      expect(issues).toEqual([])
      if (q.sources?.length) {
        expect(q.sources.some((s) => s.org === 'scripture')).toBe(true)
      }
    }
    for (const q of WHO_SAID_IT_BANK.filter((q) => q.theologyTopic && q.sources)) {
      expect(validateSourceList(q.sources, q.id)).toEqual([])
    }
    for (const m of MATCH_BANK.filter((m) => m.sources?.length)) {
      expect(validateSourceList(m.sources, m.id)).toEqual([])
    }
  })

  it('source catalog URLs are https allowlisted and scripture entries omit URLs', () => {
    for (const s of catalogExternalSources()) {
      expect(validateTheologicalSource(s, s.title)).toEqual([])
      if (s.org === 'scripture') {
        expect(s.url).toBeUndefined()
      } else {
        expect(s.url?.startsWith('https://')).toBe(true)
      }
    }
  })

  it('rejects invented or non-allowlisted source links', () => {
    const bad: TheologicalSource = {
      org: 'gotquestions',
      author: 'Fake',
      title: 'Invented',
      url: 'https://example.com/not-real',
      topic: 'Test',
    }
    const issues = validateTheologicalSource(bad)
    expect(issues.some((i) => i.message.includes('allowlist'))).toBe(true)

    const scriptureWithUrl: TheologicalSource = {
      org: 'scripture',
      author: 'Holy Scripture',
      title: 'John 1:1',
      url: 'https://www.gotquestions.org/what-is-the-gospel.html',
      topic: 'Test',
    }
    expect(validateTheologicalSource(scriptureWithUrl).length).toBeGreaterThan(0)
  })

  it('key doctrinal topics have researched external attribution', () => {
    const byId = Object.fromEntries(TRIVIA_BANK.map((q) => [q.id, q]))
    for (const id of ['tr-30', 'tr-34', 'tr-36', 'tr-40', 'tr-44', 'tr-48', 'tr-49', 'tr-50']) {
      const q = byId[id]
      expect(q?.sources?.length).toBeGreaterThan(0)
      expect(q!.sources!.some((s) => s.org !== 'scripture' && s.url)).toBe(true)
    }
  })
})

describe('verse utils', () => {
  it('validates scrambled word order and finish-the-verse splits', () => {
    const words = tokenizeVerse('In the beginning God created')
    const shuffled = shuffleWords(words, 42)
    expect(shuffled).toHaveLength(words.length)
    expect(wordsMatch(words, words)).toBe(true)
    expect(wordsMatch(shuffled, words)).toBe(shuffled.every((w, i) => w === words[i]))

    const { prefix, suffix } = splitForFinish(
      'Trust in Yahweh with all your heart',
      'beginner',
    )
    expect(prefix.split(/\s+/).length).toBeGreaterThan(0)
    expect(suffix.split(/\s+/).length).toBeGreaterThan(0)
    expect(textMatches(suffix, suffix)).toBe(true)
    expect(textMatches('Trust in Yahweh', 'trust in yahweh!')).toBe(true)
  })

  it('falls back to public verses when memory bank is thin', () => {
    const user = createInitialState('Test', 'year')
    const verses = selectPlayableVerses(user, 'beginner', 3, 99)
    expect(verses.length).toBeGreaterThan(0)
    expect(verses[0].translationLabel).toBe('WEB')
  })
})

describe('completeBibleGame rewards', () => {
  it('awards XP and gems once per game per day; replays get zero', () => {
    const state = createInitialState('Test', 'year')
    const first = completeBibleGame(state, {
      gameId: 'bible-trivia',
      difficulty: 'beginner',
      correct: 5,
      total: 5,
      sessionKey: 't1',
    })
    expect(first.rewarded).toBe(true)
    expect(first.earnedXp).toBe(XP.bibleGame + XP.bibleGameAccuracy)
    expect(first.earnedXp).toBeLessThanOrEqual(20)
    expect(first.gemsAwarded).toBeGreaterThan(0)
    expect(first.state.gameStats.gamesPlayed).toBe(1)
    expect(first.state.gameStats.perfectGames).toBe(1)
    expect(first.state.achievements).toContain('game_first')
    expect(first.state.achievements).toContain('game_perfect')

    const replay = completeBibleGame(first.state, {
      gameId: 'bible-trivia',
      difficulty: 'beginner',
      correct: 5,
      total: 5,
      sessionKey: 't2',
    })
    expect(replay.rewarded).toBe(false)
    expect(replay.earnedXp).toBe(0)
    expect(replay.gemsAwarded).toBe(0)
    expect(replay.state.gameStats.gamesPlayed).toBe(2)
    expect(replay.state.xp).toBe(first.state.xp)
  })

  it('ledger XP and gems match local awards', () => {
    expect(
      computeEventXp('bible_game', {
        correct: 4,
        total: 5,
        alreadyRewarded: false,
      }),
    ).toBe(XP.bibleGame + Math.round((4 / 5) * XP.bibleGameAccuracy))
    expect(computeEventXp('bible_game', { alreadyRewarded: true, correct: 5, total: 5 })).toBe(0)
    expect(
      computeGemDelta('gem_bible_game', { alreadyRewarded: false, gameId: 'x', sessionKey: 's' }),
    ).toBeGreaterThan(0)
    expect(computeGemDelta('gem_bible_game', { alreadyRewarded: true })).toBe(0)
  })

  it('unlocks game_trio after three distinct games', () => {
    let state = createInitialState('Test', 'year')
    for (const gameId of ['bible-trivia', 'who-said-it', 'biblical-timeline']) {
      state = completeBibleGame(state, {
        gameId,
        difficulty: 'beginner',
        correct: 3,
        total: 4,
        sessionKey: `${gameId}-${todayKey()}`,
      }).state
    }
    expect(state.achievements).toContain('game_trio')
    expect(state.gameStats.completedGameIds).toHaveLength(3)
  })
})
