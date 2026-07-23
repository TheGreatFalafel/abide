import { ACHIEVEMENTS, levelFromXp, type UserState } from '../lib/types'
import type { PlanDay } from '../data/bible'
import { getTranslation } from '../data/translations'
import { Memory } from './Memory'
import { Settings } from './Settings'
import { CircleGate } from './CircleGate'
import type { MemoryGrade } from '../lib/progress'

export type HomeView = 'path' | 'memory' | 'circle' | 'badges' | 'settings'

type Props = {
  user: UserState
  days: PlanDay[]
  onOpenLesson: (day: number) => void
  onReset: () => void
  view: HomeView
  setView: (v: HomeView) => void
  onUserChange: (user: UserState) => void
  onMemoryReview: (verseId: string, grade: MemoryGrade) => void
}

export function Home({
  user,
  days,
  onOpenLesson,
  onReset,
  view,
  setView,
  onUserChange,
  onMemoryReview,
}: Props) {
  const level = levelFromXp(user.xp)
  const nextDay =
    days.find((d) => !user.completedDays.includes(d.day))?.day ??
    days[days.length - 1]?.day ??
    1
  const goalPct = Math.min(100, Math.round((user.todayXp / user.dailyGoalXp) * 100))
  const streakAtRisk =
    user.streak > 0 &&
    user.lastReadDate !== new Date().toISOString().slice(0, 10)
  const translation = getTranslation(user.translationId)

  const visible = days.slice(
    Math.max(0, nextDay - 4),
    Math.min(days.length, nextDay + 8),
  )

  return (
    <div className="screen home">
      <header className="topbar">
        <div>
          <p className="brand sm">Abide</p>
          <p className="hello">Hi, {user.name}</p>
        </div>
        <div className="stat-pills">
          <div className="pill" title="Translation">
            <strong>{translation.short}</strong>
          </div>
          <div className={`pill streak ${streakAtRisk ? 'risk' : ''}`} title="Streak">
            <span className="flame" aria-hidden>
              🔥
            </span>
            <strong>{user.streak}</strong>
          </div>
          <div className="pill xp" title="XP">
            <span aria-hidden>✦</span>
            <strong>{user.xp}</strong>
          </div>
        </div>
      </header>

      <div className="level-row">
        <div className="level-badge">Lv {level.level}</div>
        <div className="meter">
          <div className="meter-fill" style={{ width: `${(level.into / level.need) * 100}%` }} />
        </div>
        <span className="meter-label">
          {level.into}/{level.need} XP
        </span>
      </div>

      <div className="goal-card">
        <div className="goal-head">
          <span>Daily goal</span>
          <strong>
            {user.todayXp}/{user.dailyGoalXp} XP
          </strong>
        </div>
        <div className="meter tall">
          <div className="meter-fill gold" style={{ width: `${goalPct}%` }} />
        </div>
        {streakAtRisk ? (
          <p className="nudge risk">Your streak needs you today — keep it alive.</p>
        ) : user.todayXp >= user.dailyGoalXp ? (
          <p className="nudge good">Goal crushed. Come back tomorrow?</p>
        ) : (
          <p className="nudge">Read or review a memory verse to keep the flame going.</p>
        )}
      </div>

      <nav className="tabs tabs-5">
        {(
          [
            ['path', 'Path'],
            ['memory', 'Memory'],
            ['circle', 'Circle'],
            ['badges', 'Badges'],
            ['settings', 'Settings'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            className={view === id ? 'active' : ''}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {view === 'path' && (
        <div className="path">
          {visible.map((day, i) => {
            const done = user.completedDays.includes(day.day)
            const current = day.day === nextDay
            const locked = day.day > nextDay
            const offset = i % 2 === 0 ? -1 : 1
            return (
              <div
                key={day.day}
                className="path-row"
                style={{ ['--offset' as string]: offset }}
              >
                <button
                  type="button"
                  className={`node ${done ? 'done' : ''} ${current ? 'current' : ''} ${locked ? 'locked' : ''} ${day.kind === 'quiz' ? 'quiz' : ''}`}
                  disabled={locked}
                  onClick={() => onOpenLesson(day.day)}
                  aria-label={`Day ${day.day}: ${day.title}`}
                >
                  {done ? '✓' : current ? (day.kind === 'quiz' ? '?' : '▶') : day.kind === 'quiz' ? '?' : day.day}
                </button>
                <div className={`node-meta ${current ? 'focus' : ''}`}>
                  <strong>
                    {day.kind === 'quiz' ? 'Quiz' : `Day ${day.day}`}
                    {day.sectionLabel ? ` · ${day.sectionLabel}` : ''}
                  </strong>
                  <span>{day.title}</span>
                </div>
              </div>
            )
          })}
          <button className="btn primary sticky-cta" onClick={() => onOpenLesson(nextDay)}>
            {user.completedDays.includes(nextDay) ? 'Review today' : 'Continue'}
          </button>
        </div>
      )}

      {view === 'memory' && (
        <Memory user={user} onUserChange={onUserChange} onReviewed={onMemoryReview} />
      )}

      {view === 'circle' && <CircleGate />}

      {view === 'badges' && (
        <div className="badges">
          {ACHIEVEMENTS.map((a) => {
            const owned = user.achievements.includes(a.id)
            return (
              <div key={a.id} className={`badge ${owned ? 'owned' : 'locked'}`}>
                <span className="badge-icon">{a.icon}</span>
                <div>
                  <strong>{a.title}</strong>
                  <p>{a.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {view === 'settings' && (
        <Settings user={user} onUserChange={onUserChange} onReset={onReset} />
      )}
    </div>
  )
}
