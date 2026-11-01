'use client'

import { reactionForAnswer } from '../lib/mascot'
import { AriMark } from './AriMark'

type Props = {
  /** Show only when an answer has been checked. */
  active: boolean
  correct: boolean
  className?: string
}

/**
 * Compact Ari reaction for quiz/game feedback.
 * Intentional and contextual — only renders while `active`.
 */
export function AriReactionCue({ active, correct, className = '' }: Props) {
  if (!active) return null
  const reaction = reactionForAnswer(correct)
  return (
    <div
      className={`ari-reaction-cue ${correct ? 'good' : 'risk'} ${className}`}
      role="status"
      aria-label={`${reaction.title}: ${reaction.body}`}
    >
      <AriMark
        expression={reaction.expression}
        pose={reaction.pose}
        size={40}
        animate
        motion="react"
      />
      <div>
        <strong>{reaction.title}</strong>
        <p>{reaction.body}</p>
      </div>
    </div>
  )
}
