import { XP } from './types'

/** Client-generated, globally unique event ids (UUIDs). */
export type ProgressEventType =
  | 'legacy_import'
  | 'lesson_complete'
  | 'section_quiz'
  | 'memory_review'
  | 'memory_quiz'
  | 'memory_quest'
  | 'challenge_correct'
  | 'curriculum_lesson'
  | 'bible_game'
  | 'language_lesson'
  | 'language_vocab_review'

export type ProgressEventInput = {
  id: string
  type: ProgressEventType
  /** Opaque activity metadata — never trusted for XP math alone. */
  payload?: Record<string, unknown>
  clientCreatedAt: string
}

export type ValidatedProgressEvent = ProgressEventInput & {
  awardedXp: number
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const MAX_EVENT_AGE_MS = 90 * 24 * 60 * 60 * 1000
const FUTURE_SKEW_MS = 5 * 60 * 1000

const ALLOWED = new Set<ProgressEventType>([
  'legacy_import',
  'lesson_complete',
  'section_quiz',
  'memory_review',
  'memory_quiz',
  'memory_quest',
  'challenge_correct',
  'curriculum_lesson',
  'bible_game',
  'language_lesson',
  'language_vocab_review',
])

export function isProgressEventType(value: unknown): value is ProgressEventType {
  return typeof value === 'string' && ALLOWED.has(value as ProgressEventType)
}

export function newProgressEventId(): string {
  return crypto.randomUUID()
}

function asBool(v: unknown): boolean {
  return v === true
}

function asGrade(v: unknown): 'again' | 'hard' | 'good' | 'easy' | null {
  return v === 'again' || v === 'hard' || v === 'good' || v === 'easy' ? v : null
}

/** Server-side XP award from event type + payload (client amounts ignored). */
export function computeEventXp(
  type: ProgressEventType,
  payload: Record<string, unknown> = {},
): number {
  switch (type) {
    case 'legacy_import': {
      const seed = Number(payload.seedXp)
      if (!Number.isFinite(seed) || seed < 0) return 0
      return Math.min(Math.floor(seed), 1_000_000)
    }
    case 'lesson_complete': {
      const already = asBool(payload.alreadyCompleted)
      let earned = already ? Math.floor(XP.lesson / 2) : XP.lesson
      if (asBool(payload.reflection)) earned += XP.reflection
      if (asBool(payload.streakBonus)) earned += XP.streakBonus
      if (asBool(payload.perfectDay) && !already) earned += XP.perfectDay
      return Math.min(earned, 50)
    }
    case 'section_quiz': {
      const already = asBool(payload.alreadyCompleted)
      let earned = already ? 5 : XP.sectionQuiz
      const correct = Number(payload.correctMc) || 0
      const total = Number(payload.totalMc) || 0
      if (total > 0) {
        earned += Math.round((Math.min(correct, total) / total) * 15)
      }
      return Math.min(earned, 40)
    }
    case 'memory_review': {
      if (!asBool(payload.applySchedule)) return XP.memoryExtraPractice
      const grade = asGrade(payload.grade)
      if (!grade || grade === 'again') return 0
      if (grade === 'hard') return XP.memoryHard
      if (grade === 'easy') return XP.memoryEasy
      return XP.memoryGood
    }
    case 'memory_quiz':
      return asBool(payload.correct) ? XP.memoryQuiz : XP.memoryQuizWrong
    case 'memory_quest': {
      const correctCount = Math.max(0, Math.min(5, Math.floor(Number(payload.correctCount) || 0)))
      const finished = asBool(payload.finished)
      return Math.min(
        correctCount * XP.memoryQuestCorrect + (finished ? XP.memoryQuest : 0),
        15,
      )
    }
    case 'challenge_correct':
      // Board points are separate; token XP for a verified correct answer
      return XP.memoryQuiz
    case 'bible_game': {
      if (asBool(payload.alreadyRewarded)) return 0
      const total = Math.max(1, Math.floor(Number(payload.total) || 0))
      const correct = Math.max(0, Math.min(total, Math.floor(Number(payload.correct) || 0)))
      const accuracy = correct / total
      return Math.min(
        XP.bibleGame + Math.round(accuracy * XP.bibleGameAccuracy),
        20,
      )
    }
    case 'curriculum_lesson': {
      if (asBool(payload.alreadyCompleted)) return 0
      if (!asBool(payload.reflection)) return 0
      const totalMc = Math.max(0, Math.floor(Number(payload.totalMc) || 0))
      if (totalMc < 1) return 0
      const correctMc = Math.max(0, Math.min(totalMc, Math.floor(Number(payload.correctMc) || 0)))
      let earned = XP.curriculumLesson + XP.curriculumReflection
      earned += Math.round((correctMc / totalMc) * XP.curriculumQuizBonus)
      return Math.min(earned, 40)
    }
    case 'language_lesson': {
      if (asBool(payload.alreadyCompleted)) return 0
      if (!asBool(payload.reflection)) return 0
      const total = Math.max(0, Math.floor(Number(payload.total) || 0))
      if (total < 1) return 0
      const correct = Math.max(0, Math.min(total, Math.floor(Number(payload.correct) || 0)))
      let earned = XP.languageLesson
      earned += Math.round((correct / total) * XP.languageLessonQuizBonus)
      return Math.min(earned, 30)
    }
    case 'language_vocab_review': {
      if (!asBool(payload.applySchedule)) return 0
      if (payload.grade === 'again') return 0
      return XP.languageVocabReview
    }
    default:
      return 0
  }
}

export type EventValidationError = {
  id?: string
  error: string
}

/**
 * Validate a single progression event. Pure — no DB.
 * Rejects forged types, bad ids, and impossible timestamps.
 */
export function validateProgressEvent(
  raw: unknown,
  now = new Date(),
): { ok: true; event: ValidatedProgressEvent } | { ok: false; error: EventValidationError } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: { error: 'Invalid event' } }
  }
  const e = raw as Record<string, unknown>
  const id = typeof e.id === 'string' ? e.id.trim() : ''
  if (!isProgressEventType(e.type)) {
    return { ok: false, error: { id, error: 'Unknown event type' } }
  }
  const legacyIdOk = e.type === 'legacy_import' && id.startsWith('legacy:')
  if (!id || (!UUID_RE.test(id) && !legacyIdOk)) {
    return { ok: false, error: { id, error: 'Event id must be a UUID' } }
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

  // Reject client-supplied award amounts sneaking in as authority
  if ('awardedXp' in e || 'xp' in payload) {
    // Ignore — server recomputes; do not fail solely for extra fields
  }

  const awardedXp = computeEventXp(e.type, payload)
  if (e.type !== 'legacy_import' && e.type !== 'memory_quiz' && awardedXp < 0) {
    return { ok: false, error: { id, error: 'Invalid award' } }
  }

  return {
    ok: true,
    event: {
      id,
      type: e.type,
      payload,
      clientCreatedAt: new Date(created).toISOString(),
      awardedXp,
    },
  }
}

export function validateProgressEventBatch(
  events: unknown[],
  now = new Date(),
): {
  accepted: ValidatedProgressEvent[]
  rejected: EventValidationError[]
} {
  const accepted: ValidatedProgressEvent[] = []
  const rejected: EventValidationError[] = []
  const seen = new Set<string>()

  if (!Array.isArray(events)) {
    return { accepted, rejected: [{ error: 'events must be an array' }] }
  }
  if (events.length > 100) {
    return { accepted, rejected: [{ error: 'Max 100 events per batch' }] }
  }

  for (const raw of events) {
    const result = validateProgressEvent(raw, now)
    if (!result.ok) {
      rejected.push(result.error)
      continue
    }
    if (seen.has(result.event.id)) {
      rejected.push({ id: result.event.id, error: 'Duplicate id in batch' })
      continue
    }
    seen.add(result.event.id)
    accepted.push(result.event)
  }

  return { accepted, rejected }
}

/** Normalize scripture text for challenge answer comparison. */
export function normalizeAnswerText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function answersMatch(selected: string, expected: string): boolean {
  const a = normalizeAnswerText(selected)
  const b = normalizeAnswerText(expected)
  if (!a || !b) return false
  return a === b || a.includes(b) || b.includes(a)
}
