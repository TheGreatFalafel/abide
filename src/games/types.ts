import type { ComponentType } from 'react'
import type { UserState } from '../lib/types'

export type GameId =
  | 'scripture-scramble'
  | 'finish-the-verse'
  | 'bible-trivia'
  | 'who-said-it'
  | 'biblical-timeline'
  | 'match-the-passage'

export type GameDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type GameMeta = {
  id: GameId
  title: string
  blurb: string
  objectives: string[]
  estimatedMinutes: number
  difficulties: GameDifficulty[]
  /** Needs memory-bank verse text when true; falls back to curated WEB verses */
  usesMemoryVerses?: boolean
}

export type GameRoundResult = {
  correct: boolean
  reference?: string
  explanation?: string
}

export type GamePlayResult = {
  gameId: GameId
  difficulty: GameDifficulty
  correct: number
  total: number
  /** Stable key for anti-farming within the day */
  sessionKey: string
}

export type GameSessionProps = {
  user: UserState
  difficulty: GameDifficulty
  onComplete: (play: GamePlayResult) => void
  onBack: () => void
}

export type GameDefinition = {
  meta: GameMeta
  Component: ComponentType<GameSessionProps>
}
