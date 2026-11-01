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
  /** Free reading in Bible Reader — history only, never awards XP. */
  | 'reading_session'

export type ProgressEventInput = {
  id: string
  type: ProgressEventType
  /** Opaque activity metadata — never trusted for XP math alone. */
  payload?: Record<string, unknown>
  clientCreatedAt: string
}

export type ValidatedProgressEvent = ProgressEventInput & {
  awardedXp: number
  /**
   * Server-derived semantic idempotency key (null = no uniqueness beyond PK).
   * Never trust a client-supplied activityKey as authority.
   */
  activityKey: string | null
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
  'reading_session',
])

export function isProgressEventType(value: unknown): value is ProgressEventType {
  return typeof value === 'string' && ALLOWED.has(value as ProgressEventType)
}

export function newProgressEventId(): string {
  return crypto.randomUUID()
}

/**
 * Stable reading-session key: book + chapter + UTC day + translation.
 * Same logical sync from two devices shares this key; different translations
 * or days remain distinct. Same-day revisits of the same passage collapse
 * (client cannot share a per-sitting id across devices before first sync).
 */
export function readingSessionActivityKey(opts: {
  bookId: string
  chapter: number
  day: string
  translationId: string
}): string | null {
  const book = opts.bookId.trim().toLowerCase().slice(0, 40)
  const chapter = Math.floor(Number(opts.chapter))
  const day = opts.day.trim().slice(0, 10)
  const tr = opts.translationId.trim().toLowerCase().slice(0, 16) || 'web'
  if (!book || !/^[a-z0-9_-]+$/i.test(book)) return null
  if (!Number.isFinite(chapter) || chapter < 1 || chapter > 200) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null
  return `read:${book}:${chapter}:${day}:${tr}`.slice(0, 160)
}

/** UUID-shaped id derived from a seed so dual-device syncs collide on PK. */
export function deterministicProgressEventId(seed: string): string {
  let h1 = 2166136261 >>> 0
  let h2 = 2166136261 >>> 0
  const a = seed
  const b = `abide:${seed}`
  for (let i = 0; i < a.length; i++) {
    h1 ^= a.charCodeAt(i)
    h1 = Math.imul(h1, 16777619) >>> 0
  }
  for (let i = 0; i < b.length; i++) {
    h2 ^= b.charCodeAt(i)
    h2 = Math.imul(h2, 16777619) >>> 0
  }
  const hex = (
    h1.toString(16).padStart(8, '0') +
    h2.toString(16).padStart(8, '0') +
    (h1 ^ h2).toString(16).padStart(8, '0') +
    ((h2 ^ 0xa5a5a5a5) >>> 0).toString(16).padStart(8, '0')
  ).slice(0, 32)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`
}

/** Resolve server activity key from type + payload + client time (UTC day). */
export function resolveProgressActivityKey(
  type: ProgressEventType,
  payload: Record<string, unknown>,
  clientCreatedAtIso: string,
): string | null {
  if (type !== 'reading_session') return null
  const bookId = typeof payload.bookId === 'string' ? payload.bookId : ''
  const chapter = Number(payload.chapter)
  const translationId =
    typeof payload.translationId === 'string' ? payload.translationId : 'web'
  // Day from validated clientCreatedAt (offline delayed sync), not wall clock.
  const day = clientCreatedAtIso.slice(0, 10)
  return readingSessionActivityKey({ bookId, chapter, day, translationId })
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
    case 'reading_session':
      // Analytics-only — reading XP comes from lesson_complete / plan flow.
      return 0
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

  const clientCreatedAtIso = new Date(created).toISOString()

  if (e.type === 'reading_session') {
    const bookId = typeof payload.bookId === 'string' ? payload.bookId.trim() : ''
    const chapter = Math.floor(Number(payload.chapter))
    if (!bookId || !Number.isFinite(chapter) || chapter < 1) {
      return { ok: false, error: { id, error: 'reading_session requires bookId and chapter' } }
    }
  }

  const awardedXp = computeEventXp(e.type, payload)
  if (e.type !== 'legacy_import' && e.type !== 'memory_quiz' && awardedXp < 0) {
    return { ok: false, error: { id, error: 'Invalid award' } }
  }

  // Server-derived key only — ignore client activityKey claims.
  const activityKey = resolveProgressActivityKey(e.type, payload, clientCreatedAtIso)

  return {
    ok: true,
    event: {
      id,
      type: e.type,
      payload,
      clientCreatedAt: clientCreatedAtIso,
      awardedXp,
      activityKey,
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
  const seenActivity = new Set<string>()

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
    if (result.event.activityKey) {
      if (seenActivity.has(result.event.activityKey)) {
        rejected.push({
          id: result.event.id,
          error: 'Duplicate activity key in batch',
        })
        continue
      }
      seenActivity.add(result.event.activityKey)
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
