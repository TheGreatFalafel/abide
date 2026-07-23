import { useEffect, useState } from 'react'
import { ACHIEVEMENTS, type AchievementId } from '../lib/types'

type Props = {
  earnedXp: number
  streak: number
  leveledUp: boolean
  level: number
  newAchievements: AchievementId[]
  goalMet: boolean
  onContinue: () => void
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
  useEffect(() => {
    const t = requestAnimationFrame(() => setShow(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const badges = newAchievements
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter(Boolean)

  return (
    <div className={`screen celebration ${show ? 'show' : ''}`}>
      <div className="burst" aria-hidden />
      <p className="brand">Abide</p>
      <h1 className="cele-title">Lesson complete</h1>
      <div className="xp-pop">+{earnedXp} XP</div>
      <div className="cele-stats">
        <div>
          <span>Streak</span>
          <strong>🔥 {streak}</strong>
        </div>
        {leveledUp && (
          <div className="level-up">
            <span>Level up</span>
            <strong>Lv {level}</strong>
          </div>
        )}
        {goalMet && (
          <div>
            <span>Daily goal</span>
            <strong>Done ✓</strong>
          </div>
        )}
      </div>
      {badges.length > 0 && (
        <div className="new-badges">
          <p>New badges</p>
          {badges.map((b) => (
            <div key={b!.id} className="badge owned pop">
              <span className="badge-icon">{b!.icon}</span>
              <strong>{b!.title}</strong>
            </div>
          ))}
        </div>
      )}
      <button className="btn primary" onClick={onContinue}>
        Back to path
      </button>
      <p className="muted center cele-nudge">
        Tomorrow&apos;s waiting. Don&apos;t break the streak.
      </p>
    </div>
  )
}
