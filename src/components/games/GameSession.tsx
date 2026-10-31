'use client'

import { getGame } from '../../games/registry'
import type { GameDifficulty, GameId, GamePlayResult } from '../../games/types'
import type { UserState } from '../../lib/types'

type Props = {
  gameId: GameId
  difficulty: GameDifficulty
  user: UserState
  onComplete: (play: GamePlayResult) => void
  onBack: () => void
}

export function GameSession({ gameId, difficulty, user, onComplete, onBack }: Props) {
  const def = getGame(gameId)
  if (!def) {
    return (
      <div className="screen session">
        <p className="muted center">Game not found.</p>
        <button type="button" className="btn primary" onClick={onBack}>
          Back
        </button>
      </div>
    )
  }
  const { Component } = def
  return (
    <Component user={user} difficulty={difficulty} onComplete={onComplete} onBack={onBack} />
  )
}
