'use client'

import { ariPresentationFromFeedback } from '../lib/animation'
import { reactionForAnswer } from '../lib/mascot'
import { AriRive } from './AriRive'

type Props = {
  /** Show only when an answer has been checked. */
  active: boolean
  correct: boolean
  className?: string
}

/**
 * Compact Ari reaction for quiz/game feedback.
 * Driven by animation feedback events — Rive when available.
 */
export function AriReactionCue({ active, correct, className = '' }: Props) {
  if (!active) return null
  const event = correct
    ? ({ type: 'correct_answer' } as const)
    : ({ type: 'incorrect_answer' } as const)
  const presentation = ariPresentationFromFeedback(event)
  const reaction = reactionForAnswer(correct)
  return (
    <div
      className={`ari-reaction-cue ${correct ? 'good' : 'risk'} ${className}`}
      role="status"
      aria-label={`${reaction.title}: ${reaction.body}`}
    >
      <AriRive
        characterState={presentation.state}
        size={48}
        fallbackProps={{
          expression: presentation.expression,
          pose: presentation.pose,
          motion: presentation.motion,
          animate: presentation.animate,
        }}
      />
      <div>
        <strong>{reaction.title}</strong>
        <p>{reaction.body}</p>
      </div>
    </div>
  )
}
