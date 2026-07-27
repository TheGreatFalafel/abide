import { useEffect, useState, type CSSProperties } from 'react'
import { ACHIEVEMENTS, titleForLevel, type AchievementId } from '../lib/types'

type Props = {
  earnedXp: number
  streak: number
  leveledUp: boolean
  level: number
  newAchievements: AchievementId[]
  goalMet: boolean
  onContinue: () => void
}

function useCountUp(target: number, active: boolean, ms = 700) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    setValue(0)
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, active, ms])
  return value
}

export function Celebration({
  earnedXp,
  streak,
  leveledUp,
  level,
  newAchievements,
  goalMet,
  onContinue,
}: Props) {
  const [show, setShow] = useState(false)
  const [stage, setStage] = useState(0)
  const xpShown = useCountUp(earnedXp, show)

  useEffect(() => {
    const t = requestAnimationFrame(() => setShow(true))
    const timers = [
      window.setTimeout(() => setStage(1), 280),
      window.setTimeout(() => setStage(2), 650),
      window.setTimeout(() => setStage(3), 1000),
    ]
    return () => {
      cancelAnimationFrame(t)
      timers.forEach(clearTimeout)
    }
  }, [])

  const badges = newAchievements
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter(Boolean)

  const confetti = Array.from({ length: 18 }, (_, i) => i)

  return (
    <div className={`screen celebration ${show ? 'show' : ''} ${leveledUp ? 'leveled' : ''}`}>
      <div className="burst" aria-hidden />
      <div className="confetti" aria-hidden>
        {confetti.map((i) => (
          <span key={i} className={`confetti-bit bit-${i % 6}`} style={{ '--i': i } as CSSProperties} />
        ))}
      </div>
      <p className="brand">Abide</p>
      <h1 className={`cele-title ${stage >= 0 ? 'in' : ''}`}>
        {leveledUp ? 'Level up!' : goalMet ? 'Daily goal!' : 'Lesson complete'}
      </h1>
      <div className={`xp-pop ${stage >= 1 ? 'in' : ''}`}>+{xpShown} XP</div>
      <div className={`cele-stats ${stage >= 2 ? 'in' : ''}`}>
        <div className="cele-stat streak-stat">
          <span>Streak</span>
          <strong>
            <span className="flame-bounce" aria-hidden>
              🔥
            </span>{' '}
            {streak}
          </strong>
        </div>
        {leveledUp && (
          <div className="level-up">
            <span>New title</span>
            <strong>
              Lv {level} · {titleForLevel(level)}
            </strong>
          </div>
        )}
        {goalMet && (
          <div className="cele-stat">
            <span>Daily goal</span>
            <strong>Crushed ✓</strong>
          </div>
        )}
      </div>
      {badges.length > 0 && stage >= 3 && (
        <div className="new-badges">
          <p>New badges unlocked</p>
          {badges.map((b) => (
            <div key={b!.id} className="badge owned pop">
              <span className="badge-icon">{b!.icon}</span>
              <strong>{b!.title}</strong>
            </div>
          ))}
        </div>
      )}
      <button className="btn primary cele-cta" onClick={onContinue}>
        Keep going
      </button>
      <p className="muted center cele-nudge">
        {streak >= 7
          ? 'A week of abiding — come back tomorrow.'
          : "Tomorrow's waiting. Don't break the streak."}
      </p>
    </div>
  )
}
