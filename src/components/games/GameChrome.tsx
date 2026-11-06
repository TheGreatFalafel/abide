'use client'

import { GAME_ART } from '../../games/art'
import type { GameId } from '../../games/types'

type Props = {
  gameId: GameId
  title: string
  stepLabel: string
  onBack: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}

export function GameChrome({ gameId, title, stepLabel, onBack, children, footer }: Props) {
  return (
    <div
      className="screen session game-session"
      data-game={gameId}
      style={{ ['--game-bg' as string]: `url(${GAME_ART[gameId].background})` }}
    >
      <header className="session-top game-top">
        <button type="button" className="btn ghost" onClick={onBack}>
          ← Games
        </button>
        <div>
          <p className="brand sm">Abide</p>
          <h1>{title}</h1>
          <p className="muted">{stepLabel}</p>
        </div>
      </header>
      <div className="game-body">{children}</div>
      {footer ? <div className="game-footer">{footer}</div> : null}
    </div>
  )
}
