import {
  computeEventXp,
  validateProgressEvent,
  type ValidatedProgressEvent,
} from './progressEvents'
import { commitProgressEvents } from './serverProgress'

export { commitProgressEvents }

/** Build a validated XP event for a server-verified correct challenge answer. */
export function validateAndBuildChallengeXpEvent(
  submissionId: string,
  now = new Date(),
): ValidatedProgressEvent | null {
  const result = validateProgressEvent(
    {
      id: submissionId,
      type: 'challenge_correct',
      clientCreatedAt: now.toISOString(),
      payload: { correct: true },
    },
    now,
  )
  if (!result.ok) return null
  // Ensure award matches server table
  return {
    ...result.event,
    awardedXp: computeEventXp('challenge_correct', { correct: true }),
  }
}
