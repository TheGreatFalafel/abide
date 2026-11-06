import type { GameId } from './types'

export type GameArt = {
  background: string
  emblem: string
}

/** Storybook Warmth plates. Backgrounds sit behind play; emblems mark Game Center cards. */
export const GAME_ART: Record<GameId, GameArt> = {
  'scripture-scramble': {
    background: '/games/bg-scripture-scramble.jpg',
    emblem: '/games/emblem-scripture-scramble.jpg',
  },
  'finish-the-verse': {
    background: '/games/bg-finish-the-verse.jpg',
    emblem: '/games/emblem-finish-the-verse.jpg',
  },
  'bible-trivia': {
    background: '/games/bg-bible-trivia.jpg',
    emblem: '/games/emblem-bible-trivia.jpg',
  },
  'who-said-it': {
    background: '/games/bg-who-said-it.jpg',
    emblem: '/games/emblem-who-said-it.jpg',
  },
  'biblical-timeline': {
    background: '/games/bg-biblical-timeline.jpg',
    emblem: '/games/emblem-biblical-timeline.jpg',
  },
  'match-the-passage': {
    background: '/games/bg-match-the-passage.jpg',
    emblem: '/games/emblem-match-the-passage.jpg',
  },
  // Placeholder plates until dedicated Storybook Warmth art exists for new games
  'doctrine-challenge': {
    background: '/games/bg-bible-trivia.jpg',
    emblem: '/games/emblem-bible-trivia.jpg',
  },
  'biblical-geography': {
    background: '/games/bg-biblical-timeline.jpg',
    emblem: '/games/emblem-biblical-timeline.jpg',
  },
  'book-of-the-bible-challenge': {
    background: '/games/bg-match-the-passage.jpg',
    emblem: '/games/emblem-match-the-passage.jpg',
  },
}
