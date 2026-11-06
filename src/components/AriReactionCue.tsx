'use client'

import {
  ariPresentationFromFeedback,
  characterEventFromFeedback,
} from '../lib/animation'
import { reactionForAnswer } from '../lib/mascot'
import { Ari } from './rive/Ari'

type Props = {
  /** Show only when an answer has been checked. */
  active: boolean
  correct: boolean
  className?: string
}

/**
 * Compact Ari reaction for quiz/game feedback.
 * Driven by CharacterEvent / animation feedback — Rive when available.
 */
export function AriReactionCue({ active, correct, className = '' }: Props) {
  if (!active) return null
  const feedback = correct
    ? ({ type: 'correct_answer' } as const)
    : ({ type: 'incorrect_answer' } as const)
  const characterEvent = characterEventFromFeedback(feedback)
  const presentation = ariPresentationFromFeedback(feedback)
  const reaction = reactionForAnswer(correct)
  return (
    <div
      className={`ari-reaction-cue ${correct ? 'good' : 'risk'} ${className}`}
      role="status"
      aria-label={`${reaction.title}: ${reaction.body}`}
    >
      <Ari
        event={characterEvent}
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
