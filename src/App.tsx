import { useCallback, useMemo, useState } from 'react'
import { Onboarding } from './components/Onboarding'
import { Home, type HomeView } from './components/Home'
import { ReadingSession } from './components/ReadingSession'
import { Celebration } from './components/Celebration'
import { SectionQuizSession } from './components/SectionQuiz'
import { MemoryQuest } from './components/MemoryQuest'
import { CurriculumLessonSession } from './components/CurriculumLesson'
import { LanguageLessonSession } from './components/languages/LanguageLessonSession'
import { GameSession } from './components/games/GameSession'
import type { LanguageTrackId } from './data/languages'
import { CloudBridge } from './components/CloudBridge'
import { PwaRegister } from './components/PwaRegister'
import { getPlanById, type PassageRef } from './data/bible'
import {
  clearState,
  completeBibleGame,
  completeLesson,
  completeSectionQuiz,
  loadState,
  migrateUserState,
  reviewMemoryVerse,
  saveState,
  startJourney,
  type MemoryGrade,
  type LessonResult,
} from './lib/progress'
import { isClerkConfigured } from './lib/clerk'
import { levelFromXp, type UserState } from './lib/types'
import type { GameDifficulty, GameId } from './games/types'

type Screen =
  | { name: 'onboarding' }
  | { name: 'home' }
  | { name: 'lesson'; day: number }
  | { name: 'curriculumLesson'; lessonId: string }
  | { name: 'languageLesson'; track: LanguageTrackId; lessonId: string }
  | { name: 'memoryQuest' }
  | { name: 'bibleGame'; gameId: GameId; difficulty: GameDifficulty }
  | {
      name: 'chapterQuiz'
      quizId: string
      passages: PassageRef[]
      coverage: string
      readingResult: LessonResult
    }
  | { name: 'celebrate'; result: LessonResult & { gemsAwarded?: number } }

const HAS_CLERK = isClerkConfigured()
const CHAPTER_QUIZ_EVERY = 7

function boot(): { user: UserState | null; screen: Screen } {
  const user = loadState()
  return {
    user,
    screen: user ? { name: 'home' } : { name: 'onboarding' },
  }
}

export default function App() {
  const initial = useMemo(() => boot(), [])
  const [user, setUser] = useState<UserState | null>(initial.user)
  const [screen, setScreen] = useState<Screen>(initial.screen)
  const [view, setView] = useState<HomeView>(() => {
    if (typeof window === 'undefined') return 'read'
    const q = new URLSearchParams(window.location.search).get('view')
    const allowed: HomeView[] = [
      'path',
      'read',
      'memory',
      'learn',
      'circle',
      'badges',
      'shop',
      'games',
      'settings',
    ]
    return allowed.includes(q as HomeView) ? (q as HomeView) : 'read'
  })

  const plan = getPlanById(user?.planId ?? 'year', user?.customPlans ?? [])
  const days = useMemo(() => plan.generate(), [plan.id, user?.customPlans])
  const hasPathQuizzes = useMemo(() => days.some((d) => d.kind === 'quiz'), [days])

  const handleCloudState = useCallback((cloud: UserState) => {
    const next = migrateUserState(cloud)
    saveState(next)
    setUser(next)
    setScreen((s) => (s.name === 'onboarding' ? { name: 'home' } : s))
  }, [])

  function handleStart(name: string, planId: string) {
    // Don't wipe account progress (including ESV key) if cloud already restored a profile
    if (user && (user.esvApiKey?.trim() || user.xp > 0 || user.completedDays.length > 0)) {
      const next = {
        ...user,
        name: name.trim() || user.name,
        planId: user.planId || planId,
      }
      saveState(next)
      setUser(next)
      setScreen({ name: 'home' })
      return
    }
    const next = startJourney(name, planId)
    setUser(next)
    setScreen({ name: 'home' })
  }

  function handleComplete(day: number, reflection: boolean) {
    if (!user) return
    const result = completeLesson(user, day, {
      reflection,
      planTotalDays: days.length,
    })
    setUser(result.state)

    // Plans without path quiz nodes get a chapter check every N reading days
    if (!hasPathQuizzes) {
      const completedReads = result.state.completedDays.filter((id) => {
        const d = days.find((x) => x.day === id)
        return !d || d.kind === 'read'
      }).length
      if (completedReads > 0 && completedReads % CHAPTER_QUIZ_EVERY === 0) {
        const recent = days
          .filter((d) => d.kind === 'read' && result.state.completedDays.includes(d.day))
          .slice(-CHAPTER_QUIZ_EVERY)
        const passages = recent.flatMap((d) => d.passages)
        const quizNum = Math.floor(completedReads / CHAPTER_QUIZ_EVERY)
        const quizId = `chapter-check-${quizNum}`
        if (!result.state.completedQuizzes.includes(quizId) && passages.length) {
          setScreen({
            name: 'chapterQuiz',
            quizId,
            passages,
            coverage: recent.map((d) => d.title).slice(0, 4).join(' · '),
            readingResult: result,
          })
          return
        }
      }
    }

    setScreen({ name: 'celebrate', result })
  }

  function handleQuizComplete(
    day: number,
    quizId: string,
    score: { correctMc: number; totalMc: number },
  ) {
    if (!user) return
    const result = completeSectionQuiz(user, day, quizId, {
      planTotalDays: days.length,
      correctMc: score.correctMc,
      totalMc: score.totalMc,
    })
    setUser(result.state)
    setScreen({ name: 'celebrate', result })
  }

  function handleMemoryReview(
    verseId: string,
    grade: MemoryGrade,
    opts?: { applySchedule?: boolean; source?: 'practice' | 'type' | 'blanks' },
  ) {
    if (!user) return
    const result = reviewMemoryVerse(user, verseId, grade, opts)
    setUser(result.state)
  }

  function handleUserChange(next: UserState) {
    saveState(next)
    setUser(next)
  }

  function handleReset() {
    if (!confirm('Reset your Abide journey on this device?')) return
    clearState()
    setUser(null)
    setScreen({ name: 'onboarding' })
  }

  const bridge =
    HAS_CLERK ? (
      <CloudBridge
        key={user ? `sync-${user.createdAt}` : 'sync-anon'}
        state={user}
        onCloudState={handleCloudState}
      />
    ) : null

  const pwa = <PwaRegister user={user} />

  if (screen.name === 'onboarding' || !user) {
    return (
      <>
        {pwa}
        {bridge}
        <Onboarding onStart={handleStart} />
      </>
    )
  }

  if (screen.name === 'chapterQuiz') {
    return (
      <>
        {pwa}
        {bridge}
        <SectionQuizSession
          planId={user.planId}
          quizIndex={0}
          quizId={screen.quizId}
          title="Chapter check"
          coverage={screen.coverage}
          priorPassages={screen.passages}
          onBack={() => setScreen({ name: 'celebrate', result: screen.readingResult })}
          onComplete={(score) =>
            handleQuizComplete(screen.readingResult.state.completedDays.at(-1) ?? 1, screen.quizId, score)
          }
        />
      </>
    )
  }

  if (screen.name === 'lesson') {
    const day = days.find((d) => d.day === screen.day) ?? days[0]
    if (day.kind === 'quiz') {
      const quizDay = day.day
      const priorDays = days
        .filter((d) => d.kind === 'read' && d.day < quizDay)
        .slice(-12)
      const priorPassages = priorDays.flatMap((d) => d.passages)
      const coverage =
        priorDays.length > 0
          ? priorDays.map((d) => d.title).slice(0, 6).join(' · ') +
            (priorDays.length > 6 ? '…' : '')
          : day.sectionLabel || 'From the start of your path'
      return (
        <>
          {pwa}
          {bridge}
          <SectionQuizSession
            planId={user.planId}
            quizIndex={day.quizIndex ?? 0}
            quizId={day.quizId}
            title={day.title}
            coverage={coverage}
            priorPassages={priorPassages}
            onBack={() => setScreen({ name: 'home' })}
            onComplete={(score) =>
              handleQuizComplete(day.day, day.quizId ?? `quiz-${day.day}`, score)
            }
          />
        </>
      )
    }
    return (
      <>
        {pwa}
        {bridge}
        <ReadingSession
          day={day}
          user={user}
          onUserChange={handleUserChange}
          onBack={() => setScreen({ name: 'home' })}
          onComplete={(reflection) => handleComplete(day.day, reflection)}
        />
      </>
    )
  }

  if (screen.name === 'curriculumLesson') {
    return (
      <>
        {pwa}
        {bridge}
        <CurriculumLessonSession
          lessonId={screen.lessonId}
          user={user}
          onUserChange={handleUserChange}
          onBack={() => {
            setView('learn')
            setScreen({ name: 'home' })
          }}
          onComplete={(result) => {
            setView('learn')
            setScreen({ name: 'celebrate', result })
          }}
        />
      </>
    )
  }

  if (screen.name === 'languageLesson') {
    return (
      <>
        {pwa}
        {bridge}
        <LanguageLessonSession
          track={screen.track}
          lessonId={screen.lessonId}
          user={user}
          onUserChange={handleUserChange}
          onBack={() => {
            setView('learn')
            setScreen({ name: 'home' })
          }}
          onComplete={(result) => {
            setView('learn')
            setScreen({ name: 'celebrate', result })
          }}
        />
      </>
    )
  }

  if (screen.name === 'memoryQuest') {
    return (
      <>
        {pwa}
        {bridge}
        <MemoryQuest
          user={user}
          onUserChange={handleUserChange}
          onBack={() => setScreen({ name: 'home' })}
          onGoMemory={() => {
            setView('memory')
            setScreen({ name: 'home' })
          }}
          onComplete={(result) => setScreen({ name: 'celebrate', result })}
        />
      </>
    )
  }

  if (screen.name === 'bibleGame') {
    return (
      <>
        {pwa}
        {bridge}
        <GameSession
          gameId={screen.gameId}
          difficulty={screen.difficulty}
          user={user}
          onBack={() => {
            setView('games')
            setScreen({ name: 'home' })
          }}
          onComplete={(play) => {
            const result = completeBibleGame(user, play)
            setUser(result.state)
            setView('games')
            setScreen({ name: 'celebrate', result })
          }}
        />
      </>
    )
  }

  if (screen.name === 'celebrate') {
    const { result } = screen
    const level = levelFromXp(result.state.xp).level
    return (
      <>
        {pwa}
        {bridge}
        <Celebration
          earnedXp={result.earnedXp}
          gemsAwarded={'gemsAwarded' in result ? result.gemsAwarded : undefined}
          streak={result.state.streak}
          leveledUp={result.leveledUp}
          level={level}
          newAchievements={result.newAchievements}
          goalMet={result.state.todayXp >= result.state.dailyGoalXp}
          user={result.state}
          onContinue={() => setScreen({ name: 'home' })}
        />
      </>
    )
  }

  return (
    <>
      {pwa}
      {bridge}
      <Home
        user={user}
        days={days}
        view={view}
        setView={setView}
        onOpenLesson={(day) => setScreen({ name: 'lesson', day })}
        onOpenCurriculumLesson={(lessonId) =>
          setScreen({ name: 'curriculumLesson', lessonId })
        }
        onOpenLanguageLesson={(track, lessonId) =>
          setScreen({ name: 'languageLesson', track, lessonId })
        }
        onStartMemoryQuest={() => setScreen({ name: 'memoryQuest' })}
        onStartGame={(gameId, difficulty) =>
          setScreen({ name: 'bibleGame', gameId, difficulty })
        }
        onReset={handleReset}
        onUserChange={handleUserChange}
        onMemoryReview={handleMemoryReview}
      />
    </>
  )
}
