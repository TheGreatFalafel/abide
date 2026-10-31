import { getCosmetic } from '../data/cosmetics/catalog'

/**
 * Gem currency — separate from XP.
 * Earn rules are server-side; client amounts are ignored.
 */
export type GemEventType =
  | 'legacy_gem_import'
  | 'gem_lesson'
  | 'gem_curriculum'
  | 'gem_memory_review'
  | 'gem_memory_quest'
  | 'gem_section_quiz'
  | 'gem_daily_goal'
  | 'gem_achievement'
  | 'gem_bible_game'
  | 'gem_language_lesson'
  | 'gem_language_vocab'
  | 'shop_purchase'

export type GemEventInput = {
  id: string
  type: GemEventType
  payload?: Record<string, unknown>
  clientCreatedAt: string
}

export type ValidatedGemEvent = GemEventInput & {
  deltaGems: number
  activityKey: string
}

export const GEM_REWARDS = {
  lesson: 3,
  curriculum: 5,
  memoryReview: 1,
  memoryQuest: 2,
  sectionQuiz: 2,
  dailyGoal: 5,
  achievement: 10,
  bibleGame: 3,
  languageLesson: 4,
  languageVocab: 1,
} as const

/** Soft daily earn cap (purchases excluded). */
export const GEM_DAILY_EARN_CAP = 40

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const MAX_EVENT_AGE_MS = 90 * 24 * 60 * 60 * 1000
const FUTURE_SKEW_MS = 5 * 60 * 1000

const ALLOWED = new Set<GemEventType>([
  'legacy_gem_import',
  'gem_lesson',
  'gem_curriculum',
  'gem_memory_review',
  'gem_memory_quest',
  'gem_section_quiz',
  'gem_daily_goal',
  'gem_achievement',
  'gem_bible_game',
  'gem_language_lesson',
  'gem_language_vocab',
  'shop_purchase',
])

export function isGemEventType(v: unknown): v is GemEventType {
  return typeof v === 'string' && ALLOWED.has(v as GemEventType)
}

export function newGemEventId(): string {
  return crypto.randomUUID()
}

function asBool(v: unknown): boolean {
  return v === true
}

function activityKey(type: GemEventType, payload: Record<string, unknown>): string {
  const raw = typeof payload.activityKey === 'string' ? payload.activityKey.trim() : ''
  // Client/server pass fully-qualified keys (e.g. lesson:3, shop:base-scribe)
  if (raw) return raw.slice(0, 160)
  if (type === 'shop_purchase') {
    const itemId = typeof payload.itemId === 'string' ? payload.itemId : 'unknown'
    return `shop:${itemId}`
  }
  if (type === 'legacy_gem_import') return 'legacy_gem_import'
  return `${type}:${typeof payload.ref === 'string' ? payload.ref : 'once'}`
}

/** Server-side gem delta. Positive = earn, negative = spend. */
export function computeGemDelta(
  type: GemEventType,
  payload: Record<string, unknown> = {},
): number {
  switch (type) {
    case 'legacy_gem_import': {
      const seed = Number(payload.seedGems)
      if (!Number.isFinite(seed) || seed < 0) return 0
      return Math.min(Math.floor(seed), 50_000)
    }
    case 'gem_lesson':
      if (asBool(payload.alreadyCompleted)) return 0
      return GEM_REWARDS.lesson
    case 'gem_curriculum':
      if (asBool(payload.alreadyCompleted)) return 0
      if (!asBool(payload.reflection)) return 0
      return GEM_REWARDS.curriculum
    case 'gem_memory_review':
      if (!asBool(payload.applySchedule)) return 0
      if (payload.grade === 'again') return 0
      return GEM_REWARDS.memoryReview
    case 'gem_memory_quest':
      if (!asBool(payload.finished)) return 0
      return GEM_REWARDS.memoryQuest
    case 'gem_section_quiz':
      if (asBool(payload.alreadyCompleted)) return 0
      return GEM_REWARDS.sectionQuiz
    case 'gem_daily_goal':
      return GEM_REWARDS.dailyGoal
    case 'gem_achievement': {
      const id = typeof payload.achievementId === 'string' ? payload.achievementId : ''
      if (!id) return 0
      return GEM_REWARDS.achievement
    }
    case 'gem_bible_game':
      if (asBool(payload.alreadyRewarded)) return 0
      return GEM_REWARDS.bibleGame
    case 'gem_language_lesson':
      if (asBool(payload.alreadyCompleted)) return 0
      if (!asBool(payload.reflection)) return 0
      return GEM_REWARDS.languageLesson
    case 'gem_language_vocab':
      if (!asBool(payload.applySchedule)) return 0
      if (payload.grade === 'again') return 0
      return GEM_REWARDS.languageVocab
    case 'shop_purchase': {
      const itemId = typeof payload.itemId === 'string' ? payload.itemId : ''
      const item = getCosmetic(itemId)
      if (!item || item.price <= 0) return 0
      return -item.price
    }
    default:
      return 0
  }
}

export type GemValidationError = { id?: string; error: string }

export function validateGemEvent(
  raw: unknown,
  now = new Date(),
): { ok: true; event: ValidatedGemEvent } | { ok: false; error: GemValidationError } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: { error: 'Invalid gem event' } }
  }
  const e = raw as Record<string, unknown>
  const id = typeof e.id === 'string' ? e.id.trim() : ''
  if (!isGemEventType(e.type)) {
    return { ok: false, error: { id, error: 'Unknown gem event type' } }
  }
  const legacyOk = e.type === 'legacy_gem_import' && id.startsWith('legacy-gem:')
  if (!id || (!UUID_RE.test(id) && !legacyOk)) {
    return { ok: false, error: { id, error: 'Gem event id must be a UUID' } }
  }
  const clientCreatedAt = typeof e.clientCreatedAt === 'string' ? e.clientCreatedAt : ''
  const created = Date.parse(clientCreatedAt)
  if (!Number.isFinite(created)) {
    return { ok: false, error: { id, error: 'Invalid clientCreatedAt' } }
  }
  if (created > now.getTime() + FUTURE_SKEW_MS) {
    return { ok: false, error: { id, error: 'Event timestamp is in the future' } }
  }
  if (now.getTime() - created > MAX_EVENT_AGE_MS) {
    return { ok: false, error: { id, error: 'Event is too old' } }
  }

  const payload =
    e.payload && typeof e.payload === 'object' && !Array.isArray(e.payload)
      ? (e.payload as Record<string, unknown>)
      : {}

  const deltaGems = computeGemDelta(e.type, payload)
  if (e.type === 'shop_purchase' && deltaGems >= 0) {
    return { ok: false, error: { id, error: 'Invalid shop item' } }
  }
  if (e.type !== 'shop_purchase' && e.type !== 'legacy_gem_import' && deltaGems < 0) {
    return { ok: false, error: { id, error: 'Invalid gem award' } }
  }

  return {
    ok: true,
    event: {
      id,
      type: e.type,
      payload,
      clientCreatedAt: new Date(created).toISOString(),
      deltaGems,
      activityKey: activityKey(e.type, payload),
    },
  }
}

export function validateGemEventBatch(
  events: unknown[],
  now = new Date(),
): { accepted: ValidatedGemEvent[]; rejected: GemValidationError[] } {
  const accepted: ValidatedGemEvent[] = []
  const rejected: GemValidationError[] = []
  const seen = new Set<string>()
  const seenActivity = new Set<string>()

  if (!Array.isArray(events)) {
    return { accepted, rejected: [{ error: 'events must be an array' }] }
  }
  if (events.length > 100) {
    return { accepted, rejected: [{ error: 'Max 100 gem events per batch' }] }
  }

  for (const raw of events) {
    const result = validateGemEvent(raw, now)
    if (!result.ok) {
      rejected.push(result.error)
      continue
    }
    if (seen.has(result.event.id)) {
      rejected.push({ id: result.event.id, error: 'Duplicate id in batch' })
      continue
    }
    // Purchases may repeat different items; earn keys must be unique in-batch
    if (result.event.deltaGems > 0 && seenActivity.has(result.event.activityKey)) {
      rejected.push({ id: result.event.id, error: 'Duplicate activity in batch' })
      continue
    }
    seen.add(result.event.id)
    if (result.event.deltaGems > 0) seenActivity.add(result.event.activityKey)
    accepted.push(result.event)
  }

  return { accepted, rejected }
}
