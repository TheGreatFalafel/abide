import type {
  ContentLevel,
  CurriculumDifficulty,
  CurriculumObjectives,
} from './types'

export const CURRICULUM_DIFFICULTY_ORDER: CurriculumDifficulty[] = [
  'beginner',
  'intermediate',
  'advanced',
]

export const CURRICULUM_DIFFICULTY_LABELS: Record<CurriculumDifficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const CURRICULUM_DIFFICULTY_BLURBS: Record<CurriculumDifficulty, string> = {
  beginner: 'Recall and understand. Plain language, one idea at a time.',
  intermediate: 'Explain and connect. Compare positions and use basic terms.',
  advanced: 'Analyze and defend. Historical theology, nuance, and objections.',
}

export function isCurriculumDifficulty(v: unknown): v is CurriculumDifficulty {
  return v === 'beginner' || v === 'intermediate' || v === 'advanced'
}

export function normalizeLearnDifficulty(v: unknown): CurriculumDifficulty {
  return isCurriculumDifficulty(v) ? v : 'beginner'
}

function rank(level: CurriculumDifficulty): number {
  return CURRICULUM_DIFFICULTY_ORDER.indexOf(level)
}

/** Content at `all` or at/below the learner’s level is shown inline. */
export function contentVisibleInline(
  level: ContentLevel | undefined,
  learner: CurriculumDifficulty,
): boolean {
  if (level == null || level === 'all') return true
  return rank(level) <= rank(learner)
}

/** Higher-than-learner content becomes optional Go Deeper. */
export function contentIsGoDeeper(
  level: ContentLevel | undefined,
  learner: CurriculumDifficulty,
): boolean {
  if (level == null || level === 'all') return false
  return rank(level) > rank(learner)
}

export function nextDifficulty(
  learner: CurriculumDifficulty,
): CurriculumDifficulty | null {
  const i = rank(learner)
  if (i < 0 || i >= CURRICULUM_DIFFICULTY_ORDER.length - 1) return null
  return CURRICULUM_DIFFICULTY_ORDER[i + 1]
}

/** Question with no difficulty counts as available at every level. */
export function questionMatchesDifficulty(
  difficulty: CurriculumDifficulty | undefined,
  learner: CurriculumDifficulty,
  opts?: { includeChallengeUp?: boolean },
): boolean {
  if (difficulty == null) return true
  if (rank(difficulty) <= rank(learner)) return true
  if (opts?.includeChallengeUp) {
    const up = nextDifficulty(learner)
    return up != null && difficulty === up
  }
  return false
}

export function objectivesForDifficulty(
  objectives: CurriculumObjectives,
  learner: CurriculumDifficulty,
): string[] {
  if (Array.isArray(objectives)) return objectives
  const tier = objectives[learner] ?? []
  if (tier.length) return tier
  return [
    ...objectives.beginner,
    ...objectives.intermediate,
    ...objectives.advanced,
  ].filter(Boolean)
}

export function hasTieredObjectives(
  objectives: CurriculumObjectives,
): objectives is Exclude<CurriculumObjectives, string[]> {
  return !Array.isArray(objectives)
}

/** Fisher–Yates shuffle; remaps zero-based answer index. */
export function shuffleMcChoices<T extends { choices: string[]; answer: number }>(
  q: T,
  random: () => number = Math.random,
): T {
  const indexed = q.choices.map((choice, i) => ({ choice, i }))
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const tmp = indexed[i]
    indexed[i] = indexed[j]
    indexed[j] = tmp
  }
  const answer = indexed.findIndex((row) => row.i === q.answer)
  return {
    ...q,
    choices: indexed.map((row) => row.choice),
    answer: answer < 0 ? q.answer : answer,
  }
}
