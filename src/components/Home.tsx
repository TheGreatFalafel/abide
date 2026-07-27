'use client'

import { useEffect, useRef, useState } from 'react'
import { ACHIEVEMENTS, levelFromXp, titleForLevel, type UserState } from '../lib/types'
import type { PlanDay } from '../data/bible'
import { getTranslation } from '../data/translations'
import { Memory } from './Memory'
import { Settings } from './Settings'
import { CircleGate } from './CircleGate'
import { BibleReader } from './BibleReader'
import type { MemoryGrade } from '../lib/progress'
export type HomeView = 'path' | 'read' | 'memory' | 'circle' | 'badges' | 'settings'

const PRIMARY_TABS = [
  ['path', 'Path'],
  ['read', 'Read'],
  ['memory', 'Memory'],
] as const

const MORE_ITEMS = [
  ['circle', 'Circle'],
  ['badges', 'Badges'],
  ['settings', 'Settings'],
] as const

type Props = {
  user: UserState
  days: PlanDay[]
  onOpenLesson: (day: number) => void
  onStartMemoryQuest: () => void
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
  onStartMemoryQuest,
  onReset,
  view,
  setView,
  onUserChange,
  onMemoryReview,
}: Props) {
  const level = levelFromXp(user.xp)
  const levelTitle = titleForLevel(level.level)
  const nextDay =
    days.find((d) => !user.completedDays.includes(d.day))?.day ??
    days[days.length - 1]?.day ??
    1
  const goalPct = Math.min(100, Math.round((user.todayXp / user.dailyGoalXp) * 100))
  const streakAtRisk =
    user.streak > 0 &&
    user.lastReadDate !== new Date().toISOString().slice(0, 10)
  const translation = getTranslation(user.translationId)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const moreActive = MORE_ITEMS.some(([id]) => id === view)
  const moreLabel =
    MORE_ITEMS.find(([id]) => id === view)?.[1] ?? 'More'

  useEffect(() => {
    if (!menuOpen) return
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [menuOpen])

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
          <div className={`pill streak ${streakAtRisk ? 'risk pulse-risk' : ''}`} title="Streak">
            <span className={`flame ${streakAtRisk ? 'flame-urgent' : ''}`} aria-hidden>
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
        <div className="level-badge" title={levelTitle}>
          Lv {level.level}
        </div>
        <div className="meter">
          <div className="meter-fill" style={{ width: `${(level.into / level.need) * 100}%` }} />
        </div>
        <span className="meter-label">
          {levelTitle} · {level.into}/{level.need} XP
        </span>
      </div>

      <div className={`goal-card ${streakAtRisk ? 'at-risk' : ''} ${goalPct >= 100 ? 'goal-done' : ''}`}>
        <div className="goal-head">
          <span>Today&apos;s quest</span>
          <strong>
            {user.todayXp}/{user.dailyGoalXp} XP
          </strong>
        </div>
        <div className="meter tall">
          <div className="meter-fill gold" style={{ width: `${goalPct}%` }} />
        </div>
        <p className="muted xp-why">
          Week XP: {user.weekXp ?? 0} · fuels your Circle league. Change your daily goal size in
          Settings.
        </p>
        {streakAtRisk ? (
          <p className="nudge risk streak-banner">
            Streak on the line — a 2-min memory quest or today&apos;s reading will save it.
          </p>
        ) : user.todayXp >= user.dailyGoalXp ? (
          <p className="nudge good">Quest complete. Come back tomorrow?</p>
        ) : (
          <p className="nudge">Read, reflect, or run a quick memory quest to fill the bar.</p>
        )}
        <button type="button" className="btn primary quest-cta" onClick={onStartMemoryQuest}>
          2-min Memory Quest
        </button>
      </div>

      <nav className="tabs tabs-main">
        {PRIMARY_TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={view === id ? 'active' : ''}
            onClick={() => {
              setMenuOpen(false)
              setView(id)
            }}
          >
            {label}
          </button>
        ))}
        <div className="nav-more" ref={menuRef}>
          <button
            type="button"
            className={`nav-more-btn ${moreActive ? 'active' : ''}`}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {moreLabel}
            <span className="nav-caret" aria-hidden>
              ▾
            </span>
          </button>
          {menuOpen && (
            <div className="nav-menu" role="menu">
              {MORE_ITEMS.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="menuitem"
                  className={view === id ? 'active' : ''}
                  onClick={() => {
                    setView(id)
                    setMenuOpen(false)
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
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

      {view === 'read' && <BibleReader user={user} onUserChange={onUserChange} />}

      {view === 'memory' && (
        <Memory
          user={user}
          onUserChange={onUserChange}
          onReviewed={onMemoryReview}
          onStartQuest={onStartMemoryQuest}
        />
      )}

      {view === 'circle' && <CircleGate user={user} onUserChange={onUserChange} />}

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
