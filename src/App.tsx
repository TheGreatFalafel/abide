import { useCallback, useMemo, useState } from 'react'
import { Onboarding } from './components/Onboarding'
import { Home, type HomeView } from './components/Home'
import { ReadingSession } from './components/ReadingSession'
import { Celebration } from './components/Celebration'
import { SectionQuizSession } from './components/SectionQuiz'
import { CloudBridge } from './components/CloudBridge'
import { getPlanById } from './data/bible'
import {
  clearState,
  completeLesson,
  completeSectionQuiz,
  loadState,
  reviewMemoryVerse,
  saveState,
  startJourney,
  type MemoryGrade,
  type LessonResult,
} from './lib/progress'
import { levelFromXp, type UserState } from './lib/types'

type Screen =
  | { name: 'onboarding' }
  | { name: 'home' }
  | { name: 'lesson'; day: number }
  | { name: 'celebrate'; result: LessonResult }

const HAS_CLERK = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

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
  const [view, setView] = useState<HomeView>('path')

  const plan = getPlanById(user?.planId ?? 'year')
  const days = useMemo(() => plan.generate(), [plan.id])

  const handleCloudState = useCallback((cloud: UserState) => {
    saveState(cloud)
    setUser(cloud)
    setScreen({ name: 'home' })
  }, [])

  function handleStart(name: string, planId: string) {
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

  function handleMemoryReview(verseId: string, grade: MemoryGrade) {
    if (!user) return
    const result = reviewMemoryVerse(user, verseId, grade)
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
    HAS_CLERK ? <CloudBridge state={user} onCloudState={handleCloudState} /> : null

  if (screen.name === 'onboarding' || !user) {
    return (
      <>
        {bridge}
        <Onboarding onStart={handleStart} />
      </>
    )
  }

  if (screen.name === 'lesson') {
    const day = days.find((d) => d.day === screen.day) ?? days[0]
    if (day.kind === 'quiz') {
      return (
        <>
          {bridge}
          <SectionQuizSession
            planId={user.planId}
            quizIndex={day.quizIndex ?? 0}
            quizId={day.quizId}
            title={day.title}
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

  if (screen.name === 'celebrate') {
    const { result } = screen
    const level = levelFromXp(result.state.xp).level
    return (
      <>
        {bridge}
        <Celebration
          earnedXp={result.earnedXp}
          streak={result.state.streak}
          leveledUp={result.leveledUp}
          level={level}
          newAchievements={result.newAchievements}
          goalMet={result.state.todayXp >= result.state.dailyGoalXp}
          onContinue={() => setScreen({ name: 'home' })}
        />
      </>
    )
  }

  return (
    <>
      {bridge}
      <Home
        user={user}
        days={days}
        view={view}
        setView={setView}
        onOpenLesson={(day) => setScreen({ name: 'lesson', day })}
        onReset={handleReset}
        onUserChange={handleUserChange}
        onMemoryReview={handleMemoryReview}
      />
    </>
  )
}
