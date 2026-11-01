'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ACHIEVEMENTS, levelFromXp, titleForLevel, type UserState } from '../lib/types'
import type { PlanDay } from '../data/bible'
import { Memory } from './Memory'
import { Settings } from './Settings'
import { CircleGate } from './CircleGate'
import { BibleReader } from './BibleReader'
import { Learn } from './Learn'
import { ConnectivityBanner } from './ConnectivityBanner'
import { AbideAvatar } from './AbideAvatar'
import { GuidedTour } from './GuidedTour'
import { LearningInsights } from './LearningInsights'
import { MascotBanner } from './MascotBanner'
import { Shop } from './Shop'
import { GameCenter } from './games/GameCenter'
import {
  migrateGuidedTour,
  shouldAutoShowTour,
  type TourNavView,
} from '../lib/ariTour'
import { mascotLineFor } from '../lib/mascot'
import { updateSettings } from '../lib/progress'
import type { MemoryGrade } from '../lib/progress'
import type { GameDifficulty, GameId } from '../games/types'

export type HomeView =
  | 'path'
  | 'read'
  | 'memory'
  | 'learn'
  | 'circle'
  | 'badges'
  | 'shop'
  | 'games'
  | 'settings'
  | 'insights'

type PrimaryTabId = 'path' | 'read' | 'memory' | 'games' | 'circle'

const PRIMARY_TABS: { id: PrimaryTabId; label: string; accent: string }[] = [
  { id: 'path', label: 'Path', accent: 'path' },
  { id: 'read', label: 'Read', accent: 'read' },
  { id: 'memory', label: 'Memory', accent: 'memory' },
  { id: 'games', label: 'Games', accent: 'games' },
  { id: 'circle', label: 'Circle', accent: 'circle' },
]

type Props = {
  user: UserState
  days: PlanDay[]
  onOpenLesson: (day: number) => void
  onOpenCurriculumLesson: (lessonId: string) => void
  onOpenLanguageLesson: (track: import('../data/languages').LanguageTrackId, lessonId: string) => void
  onStartMemoryQuest: () => void
  onStartGame: (gameId: GameId, difficulty: GameDifficulty) => void
  onReset: () => void
  view: HomeView
  setView: (v: HomeView) => void
  onUserChange: (user: UserState) => void
  onMemoryReview: (
    verseId: string,
    grade: MemoryGrade,
    opts?: { applySchedule?: boolean; source?: 'practice' | 'type' | 'blanks' },
  ) => void
}

function IconFlame({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 2c1.5 3.2-.2 5.2-1.6 6.6C8.8 10.2 8 11.6 8 13.5 8 16.5 10.2 19 13 19c2.5 0 4.5-1.8 4.9-4.2.3 1 .2 2-.4 2.9C16.4 19.5 14.4 21 12 21c-4 0-7-3.1-7-7 0-3.2 1.8-5.4 3.6-7.2C10.2 5.3 11.2 3.8 12 2z" />
    </svg>
  )
}

function IconGem({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M6.2 4h11.6L22 9.2 12 21 2 9.2 6.2 4zm1.4 1.5L5.3 9h3.1l1.6-3.5H7.6zm3.3 0L9.2 9h5.6l-1.7-3.5h-2.2zm5.5 0h-1.6L16.6 9h3.1l-2.3-3.5zM5.8 10.5l5.2 7.6V10.5H5.8zm7.2 0v7.6l5.2-7.6H13z" />
    </svg>
  )
}

function IconGear({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.07 7.07 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.55-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.83 14.52a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.43.34.68.22l2.39-.96c.5.39 1.04.7 1.63.94l.36 2.54c.05.24.26.42.5.42h3.84c.24 0 .45-.18.5-.42l.36-2.54c.59-.24 1.13-.55 1.63-.94l2.39.96c.25.12.54.02.68-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5z" />
    </svg>
  )
}

function IconPath({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="19" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="5" r="2.5" fill="currentColor" stroke="none" />
      <path d="M8.2 17.2 15.8 6.8" />
    </svg>
  )
}

function IconBook({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function IconBrain({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2a3.5 3.5 0 0 0-3.4 4.1A3.5 3.5 0 0 0 4 9.5V12a3 3 0 0 0 2 2.8V18a2 2 0 0 0 2 2h2v-8.5A3.5 3.5 0 0 0 9.5 2z" />
      <path d="M14.5 2a3.5 3.5 0 0 1 3.4 4.1A3.5 3.5 0 0 1 20 9.5V12a3 3 0 0 1-2 2.8V18a2 2 0 0 1-2 2h-2v-8.5A3.5 3.5 0 0 1 14.5 2z" />
    </svg>
  )
}

function IconGames({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="12" rx="3" />
      <path d="M6 13h4M8 11v4M15 12h.01M18 14h.01" />
    </svg>
  )
}

function IconCircle({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.5" />
      <path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" />
      <path d="M13.2 14.2c1.1-.5 2.4-.7 3.8-.4 2 .4 3.5 1.7 4 3.7" />
    </svg>
  )
}

const TAB_ICONS: Record<PrimaryTabId, (p: { className?: string }) => ReactNode> = {
  path: IconPath,
  read: IconBook,
  memory: IconBrain,
  games: IconGames,
  circle: IconCircle,
}

function BadgesPanel({ user }: { user: UserState }) {
  return (
    <div className="badges">
      <p className="muted">
        Achievements unlock once from validated progress — they cannot be farmed by repeating the
        same action.
      </p>
      {ACHIEVEMENTS.map((a) => {
        const owned = user.achievements.includes(a.id)
        return (
          <div key={a.id} className={`badge ${owned ? 'owned' : 'locked'}`}>
            <span className="badge-icon" aria-hidden>
              {a.icon}
            </span>
            <div>
              <strong>{a.title}</strong>
              <p>{a.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Home({
  user,
  days,
  onOpenLesson,
  onOpenCurriculumLesson,
  onOpenLanguageLesson,
  onStartMemoryQuest,
  onStartGame,
  onReset,
  view,
  setView,
  onUserChange,
  onMemoryReview,
}: Props) {
  const guidedTour = migrateGuidedTour(user.guidedTour, {
    hasProgress:
      user.xp > 0 ||
      user.completedDays.length > 0 ||
      Boolean(user.lastReadDate) ||
      user.memoryVerses.length > 0,
  })
  const [tourReplay, setTourReplay] = useState(false)
  const tourOpen = tourReplay || shouldAutoShowTour(guidedTour)

  function finishTour() {
    setTourReplay(false)
    onUserChange(
      updateSettings(user, {
        guidedTour: { completed: true },
      }),
    )
  }
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
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const [contentKey, setContentKey] = useState(view)

  useEffect(() => {
    setContentKey(view)
  }, [view])

  // Tab / view switches remount main content; also reset window scroll.
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [contentKey])

  useEffect(() => {
    if (!profileOpen) return
    function onDoc(e: MouseEvent | TouchEvent) {
      if (!profileRef.current?.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('touchstart', onDoc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('touchstart', onDoc)
    }
  }, [profileOpen])

  const visible = days.slice(
    Math.max(0, nextDay - 4),
    Math.min(days.length, nextDay + 8),
  )

  const primaryActive = PRIMARY_TABS.some((t) => t.id === view)

  function go(next: HomeView) {
    setProfileOpen(false)
    setView(next)
  }

  return (
    <div className={`screen home home-view-${primaryActive ? view : 'secondary'}`}>
      <ConnectivityBanner />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="topbar">
        <div className="topbar-identity">
          <button
            type="button"
            className="brand-hit"
            onClick={() => go('path')}
            aria-label="Abide home — Path"
          >
            <p className="brand sm">Abide</p>
          </button>
          <p className="hello">Hi, {user.name}</p>
        </div>
        <div className="topbar-actions">
          <div
            className={`pill streak ${streakAtRisk ? 'risk pulse-risk' : ''}`}
            title="Streak"
            aria-label={`Streak ${user.streak} days`}
          >
            <IconFlame className={`flame flame-icon ${streakAtRisk ? 'flame-urgent' : ''}`} />
            <strong>{user.streak}</strong>
          </div>
          <div className="pill gems" title="Gems" aria-label={`${user.gems ?? 0} gems`}>
            <IconGem className="gem-icon" />
            <strong>{user.gems ?? 0}</strong>
          </div>
          <div className="topbar-profile" ref={profileRef}>
            <button
              type="button"
              className="avatar-hit"
              onClick={() => setProfileOpen((o) => !o)}
              aria-label="Profile menu"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <AbideAvatar user={user} size="sm" />
            </button>
            {profileOpen && (
              <div className="profile-menu" role="menu">
                <button type="button" role="menuitem" onClick={() => go('shop')}>
                  Avatar shop
                </button>
                <button type="button" role="menuitem" onClick={() => go('insights')}>
                  Learning Insights
                </button>
                <button type="button" role="menuitem" onClick={() => go('badges')}>
                  Badges
                </button>
                <button type="button" role="menuitem" onClick={() => go('learn')}>
                  Learn
                </button>
                <button type="button" role="menuitem" onClick={() => go('settings')}>
                  Settings
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className={`icon-btn ${view === 'settings' ? 'active' : ''}`}
            onClick={() => go('settings')}
            aria-label="Settings"
            title="Settings"
          >
            <IconGear />
          </button>
        </div>
      </header>

      <nav className="tabs tabs-main tabs-responsive" aria-label="Primary">
        {PRIMARY_TABS.map(({ id, label, accent }) => {
          const Icon = TAB_ICONS[id]
          const active = view === id
          return (
            <button
              key={id}
              type="button"
              className={`tab-btn tab-${accent} ${active ? 'active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => go(id)}
            >
              <Icon className="tab-icon" />
              <span className="tab-label">{label}</span>
            </button>
          )
        })}
      </nav>

      <main id="main-content" className="home-main" key={contentKey}>
        {view === 'path' && (
          <div className="path-dashboard">
            {!tourOpen && <MascotBanner line={mascotLineFor('home', user)} compact />}

            <div className="level-row" aria-label={`Level ${level.level}, ${levelTitle}`}>
              <div className="level-badge" title={levelTitle}>
                Lv {level.level}
              </div>
              <div
                className="meter"
                role="progressbar"
                aria-valuenow={level.into}
                aria-valuemin={0}
                aria-valuemax={level.need}
              >
                <div
                  className="meter-fill"
                  style={{ width: `${(level.into / level.need) * 100}%` }}
                />
              </div>
              <span className="meter-label">
                {levelTitle} · {level.into}/{level.need} XP
              </span>
            </div>

            <div
              className={`goal-card ${streakAtRisk ? 'at-risk' : ''} ${goalPct >= 100 ? 'goal-done' : ''}`}
            >
              <div className="goal-head">
                <span>Today&apos;s quest</span>
                <strong>
                  {user.todayXp}/{user.dailyGoalXp} XP
                </strong>
              </div>
              <div
                className="meter tall"
                role="progressbar"
                aria-valuenow={user.todayXp}
                aria-valuemin={0}
                aria-valuemax={user.dailyGoalXp}
              >
                <div className="meter-fill gold" style={{ width: `${goalPct}%` }} />
              </div>
              <p className="muted xp-why">
                Week XP: {user.weekXp ?? 0} · fuels your Circle league. Change your daily goal size
                in Settings.
              </p>
              {streakAtRisk ? (
                <p className="nudge risk streak-banner">
                  Streak on the line — a 2-min memory quest or today&apos;s reading will save it.
                </p>
              ) : user.todayXp >= user.dailyGoalXp ? (
                <p className="nudge good">Quest complete. Come back tomorrow?</p>
              ) : (
                <p className="nudge">
                  Read, reflect, or run a quick memory quest to fill the bar.
                </p>
              )}
              <div className="goal-actions">
                <button
                  type="button"
                  className="btn primary quest-cta"
                  onClick={() => onOpenLesson(nextDay)}
                >
                  Continue path
                </button>
                <button
                  type="button"
                  className="btn ghost quest-cta"
                  onClick={onStartMemoryQuest}
                >
                  2-min Memory Quest
                </button>
              </div>
            </div>

            <div className="path-secondary" aria-label="More destinations">
              <button type="button" className="path-chip path-chip-learn" onClick={() => go('learn')}>
                Learn
                <span className="muted">Theology · Greek · Hebrew</span>
              </button>
              <button type="button" className="path-chip" onClick={() => go('insights')}>
                Insights
                <span className="muted">Progress · trends</span>
              </button>
              <button type="button" className="path-chip" onClick={() => go('shop')}>
                Shop
                <span className="muted">Avatar · gems</span>
              </button>
              <button type="button" className="path-chip" onClick={() => go('badges')}>
                Badges
                <span className="muted">{user.achievements.length} earned</span>
              </button>
            </div>

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
                      aria-label={`Day ${day.day}: ${day.title}${done ? ', completed' : current ? ', current' : locked ? ', locked' : ''}`}
                    >
                      {done
                        ? '✓'
                        : current
                          ? day.kind === 'quiz'
                            ? '?'
                            : '▶'
                          : day.kind === 'quiz'
                            ? '?'
                            : day.day}
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
              <button
                type="button"
                className="btn primary sticky-cta"
                onClick={() => onOpenLesson(nextDay)}
              >
                {user.completedDays.includes(nextDay) ? 'Review today' : 'Continue'}
              </button>
            </div>
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

        {view === 'learn' && (
          <Learn
            user={user}
            onOpenLesson={onOpenCurriculumLesson}
            onOpenLanguageLesson={onOpenLanguageLesson}
          />
        )}

        {view === 'circle' && <CircleGate user={user} onUserChange={onUserChange} />}

        {view === 'badges' && <BadgesPanel user={user} />}

        {view === 'insights' && <LearningInsights user={user} />}

        {view === 'shop' && <Shop user={user} onUserChange={onUserChange} />}

        {view === 'games' && <GameCenter user={user} onPlay={onStartGame} />}

        {view === 'settings' && (
          <Settings
            user={user}
            onUserChange={onUserChange}
            onReset={onReset}
            onOpenBadges={() => go('badges')}
            onOpenInsights={() => go('insights')}
            onReplayTour={() => {
              setTourReplay(true)
              go('path')
            }}
          />
        )}
      </main>

      <GuidedTour
        open={tourOpen}
        onNavigate={(v: TourNavView) => go(v)}
        onComplete={finishTour}
        onFinishGoRead={() => go('read')}
      />
    </div>
  )
}
