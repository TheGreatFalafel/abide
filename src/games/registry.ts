import { BibleTrivia } from '../components/games/BibleTrivia'
import { BiblicalTimeline } from '../components/games/BiblicalTimeline'
import { FinishTheVerse } from '../components/games/FinishTheVerse'
import { MatchThePassage } from '../components/games/MatchThePassage'
import { ScriptureScramble } from '../components/games/ScriptureScramble'
import { WhoSaidIt } from '../components/games/WhoSaidIt'
import type { GameDefinition, GameId } from './types'

/**
 * Modular game registry — add a game by appending a definition.
 * App / Game Center look up by id; no per-game switch statements required.
 */
export const GAME_REGISTRY: GameDefinition[] = [
  {
    meta: {
      id: 'scripture-scramble',
      title: 'Scripture Scramble',
      blurb: 'Rebuild a verse from shuffled words.',
      objectives: [
        'Strengthen word-order recall',
        'Practice with your translation when available',
      ],
      estimatedMinutes: 4,
      difficulties: ['beginner', 'intermediate', 'advanced'],
      usesMemoryVerses: true,
    },
    Component: ScriptureScramble,
  },
  {
    meta: {
      id: 'finish-the-verse',
      title: 'Finish the Verse',
      blurb: 'Complete the missing ending of a verse.',
      objectives: [
        'Train productive recall',
        'Use translation-specific wording',
      ],
      estimatedMinutes: 4,
      difficulties: ['beginner', 'intermediate', 'advanced'],
      usesMemoryVerses: true,
    },
    Component: FinishTheVerse,
  },
  {
    meta: {
      id: 'bible-trivia',
      title: 'Bible Trivia',
      blurb: 'People, events, books, places, and concepts.',
      objectives: [
        'Reinforce biblical literacy',
        'Anchor facts to Scripture references',
      ],
      estimatedMinutes: 5,
      difficulties: ['beginner', 'intermediate', 'advanced'],
    },
    Component: BibleTrivia,
  },
  {
    meta: {
      id: 'who-said-it',
      title: 'Who Said It?',
      blurb: 'Identify who spoke a biblical statement.',
      objectives: [
        'Connect speakers to passages',
        'Learn context with each answer',
      ],
      estimatedMinutes: 5,
      difficulties: ['beginner', 'intermediate', 'advanced'],
    },
    Component: WhoSaidIt,
  },
  {
    meta: {
      id: 'biblical-timeline',
      title: 'Biblical Timeline',
      blurb: 'Order key events in narrative sequence.',
      objectives: [
        'Build redemptive-historical awareness',
        'See how events relate chronologically',
      ],
      estimatedMinutes: 4,
      difficulties: ['beginner', 'intermediate', 'advanced'],
    },
    Component: BiblicalTimeline,
  },
  {
    meta: {
      id: 'match-the-passage',
      title: 'Match the Passage',
      blurb: 'Pair references with accurate summaries.',
      objectives: [
        'Link citations to content',
        'Distinguish clear biblical facts',
      ],
      estimatedMinutes: 4,
      difficulties: ['beginner', 'intermediate', 'advanced'],
    },
    Component: MatchThePassage,
  },
]

export function getGame(id: GameId): GameDefinition | undefined {
  return GAME_REGISTRY.find((g) => g.meta.id === id)
}

export function listGames(): GameDefinition[] {
  return GAME_REGISTRY
}

export function isGameId(value: string): value is GameId {
  return GAME_REGISTRY.some((g) => g.meta.id === value)
}
