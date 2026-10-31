'use client'

import { useState } from 'react'
import { listGames } from '../../games/registry'
import type { GameDifficulty, GameId } from '../../games/types'
import { todayKey, type UserState } from '../../lib/types'
import { MascotBanner } from '../MascotBanner'
import { mascotLineFor } from '../../lib/mascot'

type Props = {
  user: UserState
  onPlay: (gameId: GameId, difficulty: GameDifficulty) => void
}

const DIFFS: { id: GameDifficulty; label: string }[] = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
]

export function GameCenter({ user, onPlay }: Props) {
  const [difficulty, setDifficulty] = useState<GameDifficulty>('beginner')
  const games = listGames()
  const today = todayKey()
  const stats = user.gameStats

  return (
    <div className="game-center">
      <header className="game-center-head">
        <h2>Game Center</h2>
        <p className="muted">
          Practice Scripture and biblical literacy. XP and gems award once per game per day —
          replays stay free for practice.
        </p>
      </header>

      <MascotBanner line={mascotLineFor('games', user)} compact />

      <div className="game-stats-row" aria-label="Game progress">
        <span>
          Played <strong>{stats?.gamesPlayed ?? 0}</strong>
        </span>
        <span>
          Unique <strong>{stats?.completedGameIds?.length ?? 0}</strong>
        </span>
        <span>
          Perfect <strong>{stats?.perfectGames ?? 0}</strong>
        </span>
      </div>

      <fieldset className="diff-picker">
        <legend className="muted">Difficulty</legend>
        <div className="shop-filters" role="radiogroup" aria-label="Game difficulty">
          {DIFFS.map((d) => (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={difficulty === d.id}
              className={difficulty === d.id ? 'active' : ''}
              onClick={() => setDifficulty(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </fieldset>

      <ul className="game-catalog">
        {games.map(({ meta }) => {
          const rewardedToday = stats?.lastRewardDateByGame?.[meta.id] === today
          const played = stats?.completedGameIds?.includes(meta.id)
          return (
            <li key={meta.id} className="game-card">
              <div>
                <strong>{meta.title}</strong>
                <p>{meta.blurb}</p>
                <p className="muted tiny">
                  ~{meta.estimatedMinutes} min · {meta.objectives[0]}
                  {rewardedToday ? ' · Rewards claimed today' : played ? ' · Replay ready' : ''}
                </p>
              </div>
              <button
                type="button"
                className="btn primary"
                onClick={() => onPlay(meta.id, difficulty)}
              >
                {rewardedToday ? 'Practice' : 'Play'}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
