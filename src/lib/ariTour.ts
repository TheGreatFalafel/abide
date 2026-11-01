import type { AriExpression } from './mascot'
import { MASCOT_NAME } from './mascot'

/** Persisted tour prefs — syncs with cloud via UserState. */
export type GuidedTourState = {
  /** True after Skip or Finish — never auto-reopen (unless Settings replay). */
  completed: boolean
}

export const DEFAULT_GUIDED_TOUR: GuidedTourState = {
  completed: false,
}

/** Views the tour may navigate — subset of HomeView. */
export type TourNavView = 'path' | 'read' | 'memory' | 'games' | 'circle' | 'learn'

export type TourStepId =
  | 'welcome'
  | 'path'
  | 'read'
  | 'memory'
  | 'games'
  | 'circle'
  | 'learn'
  | 'finish'

export type TourStep = {
  id: TourStepId
  /** Navigate Home to this view while the step is active. */
  view: TourNavView
  expression: AriExpression
  title: string
  body: string
  /** Short hint for the primary action label. */
  actionHint: string
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    view: 'path',
    expression: 'welcome',
    title: `Hi — I’m ${MASCOT_NAME}`,
    body: 'A quick tour of Abide’s main places. Skip anytime — you can replay this from Settings.',
    actionHint: 'See Path',
  },
  {
    id: 'path',
    view: 'path',
    expression: 'encouraging',
    title: 'Path',
    body: 'Your daily progress, XP goal, and streak live here. Continue your reading plan when you’re ready.',
    actionHint: 'Next: Read',
  },
  {
    id: 'read',
    view: 'read',
    expression: 'thinking',
    title: 'Read',
    body: 'Open Scripture and follow your plan. Steady reading is the heart of Abide.',
    actionHint: 'Next: Memory',
  },
  {
    id: 'memory',
    view: 'memory',
    expression: 'encouraging',
    title: 'Memory',
    body: 'Hide verses in your heart with spaced review. Start small — one verse grows into many.',
    actionHint: 'Next: Games',
  },
  {
    id: 'games',
    view: 'games',
    expression: 'celebrating',
    title: 'Games',
    body: 'Practice biblical knowledge playfully. Rewards are light — understanding is the goal.',
    actionHint: 'Next: Circle',
  },
  {
    id: 'circle',
    view: 'circle',
    expression: 'proud',
    title: 'Circle',
    body: 'Walk with friends: weekly league, shared challenges, and gentle accountability.',
    actionHint: 'Next: Learn',
  },
  {
    id: 'learn',
    view: 'learn',
    expression: 'thinking',
    title: 'Learn',
    body: 'Theology, Biblical Greek, and Biblical Hebrew — deeper study beside your reading.',
    actionHint: 'Almost done',
  },
  {
    id: 'finish',
    view: 'path',
    expression: 'proud',
    title: 'You’re ready',
    body: 'Start with Scripture — open Read and take today’s portion. I’ll cheer quiet faithfulness.',
    actionHint: 'Begin reading',
  },
]

export function migrateGuidedTour(
  raw: Partial<GuidedTourState> | null | undefined,
  opts?: { hasProgress?: boolean },
): GuidedTourState {
  if (raw && typeof raw === 'object' && typeof raw.completed === 'boolean') {
    return { completed: raw.completed }
  }
  // Legacy accounts without the field: don't force the tour mid-journey.
  if (opts?.hasProgress) return { completed: true }
  return { ...DEFAULT_GUIDED_TOUR }
}

/** Completed if either device finished — never reopen a completed tour on merge. */
export function mergeGuidedTour(
  local: GuidedTourState,
  cloud: GuidedTourState,
): GuidedTourState {
  return {
    completed: Boolean(local.completed || cloud.completed),
  }
}

export function completeGuidedTour(state: GuidedTourState): GuidedTourState {
  return { completed: true }
}

export function shouldAutoShowTour(tour: GuidedTourState): boolean {
  return !tour.completed
}
