import { neon } from '@neondatabase/serverless'
import { isUniqueViolation } from './dbErrors'
import {
  MAX_STREAK_FREEZES,
  STREAK_FREEZE_PRICE,
  clampStreakFreezes,
  migrateStreakFreezes,
} from './streak'

/**
 * Atomic streak-freeze purchase helpers.
 * Canonical Postgres function `purchase_streak_freeze` is installed in
 * `src/db/ensureSchema.ts` (SELECT … FOR UPDATE + ledger insert + inventory update
 * in one PL/pgSQL body so Neon HTTP does not need interactive transactions).
 */

export type AtomicFreezePurchaseResult = {
  ok: boolean
  duplicate: boolean
  error?: string
  serverGems: number
  streakFreezes: number
  freezesGranted: number
  spent: number
}

export function parseAtomicFreezePurchaseResult(raw: unknown): AtomicFreezePurchaseResult {
  const row =
    raw && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {}
  return {
    ok: row.ok === true,
    duplicate: row.duplicate === true,
    error: typeof row.error === 'string' ? row.error : undefined,
    serverGems: Math.max(0, Math.floor(Number(row.serverGems) || 0)),
    streakFreezes: clampStreakFreezes(Number(row.streakFreezes) || 0),
    freezesGranted: Math.max(0, Math.floor(Number(row.freezesGranted) || 0)),
    spent: Math.max(0, Math.floor(Number(row.spent) || 0)),
  }
}

/**
 * Call the Postgres function (one statement = one transaction with FOR UPDATE).
 * Uses Neon HTTP — no interactive client transaction required.
 */
export async function purchaseStreakFreezeAtomic(input: {
  userId: string
  eventId: string
  activityKey: string
  payload: Record<string, unknown>
  clientCreatedAt: string
  databaseUrl?: string
}): Promise<AtomicFreezePurchaseResult> {
  const url = input.databaseUrl ?? process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')

  const sql = neon(url)
  try {
    const rows = (await sql`
      SELECT purchase_streak_freeze(
        ${input.userId},
        ${input.eventId},
        ${input.activityKey},
        ${JSON.stringify(input.payload)}::jsonb,
        ${input.clientCreatedAt}::timestamptz,
        ${STREAK_FREEZE_PRICE},
        ${MAX_STREAK_FREEZES}
      ) AS result
    `) as Array<{ result: unknown }>
    return parseAtomicFreezePurchaseResult(rows[0]?.result)
  } catch (err) {
    if (isUniqueViolation(err)) {
      // Extremely defensive — function already catches unique_violation.
      return {
        ok: true,
        duplicate: true,
        serverGems: 0,
        streakFreezes: 0,
        freezesGranted: 0,
        spent: 0,
      }
    }
    throw err
  }
}

/**
 * In-memory model of the SQL function for concurrency tests.
 * A promise-chain mutex stands in for `SELECT … FOR UPDATE` on profiles.
 */
export class AtomicFreezePurchaseSimulator {
  balance: number
  freezes: number
  readonly keys = new Set<string>()
  readonly ids = new Set<string>()
  private chain: Promise<unknown> = Promise.resolve()
  /** When true, invent a failure after ledger insert to prove rollback semantics. */
  failAfterLedger = false

  constructor(balance: number, freezes: number) {
    this.balance = balance
    this.freezes = migrateStreakFreezes(freezes, freezes)
  }

  private async critical(
    eventId: string,
    activityKey: string,
  ): Promise<AtomicFreezePurchaseResult> {
    if (this.ids.has(eventId) || this.keys.has(activityKey)) {
      return {
        ok: true,
        duplicate: true,
        serverGems: this.balance,
        streakFreezes: this.freezes,
        freezesGranted: 0,
        spent: 0,
      }
    }
    if (this.freezes >= MAX_STREAK_FREEZES) {
      return {
        ok: false,
        duplicate: false,
        error: 'Streak freeze inventory is full',
        serverGems: this.balance,
        streakFreezes: this.freezes,
        freezesGranted: 0,
        spent: 0,
      }
    }
    if (this.balance < STREAK_FREEZE_PRICE) {
      return {
        ok: false,
        duplicate: false,
        error: 'Insufficient gems',
        serverGems: this.balance,
        streakFreezes: this.freezes,
        freezesGranted: 0,
        spent: 0,
      }
    }

    // Ledger + inventory are one critical section (mirrors one PG function txn).
    const nextBalance = this.balance - STREAK_FREEZE_PRICE
    const nextFreezes = this.freezes + 1
    if (this.failAfterLedger) {
      // Simulate statement abort: neither ledger key nor inventory persists.
      throw new Error('simulated failure between ledger and inventory')
    }
    this.ids.add(eventId)
    this.keys.add(activityKey)
    this.balance = nextBalance
    this.freezes = nextFreezes
    return {
      ok: true,
      duplicate: false,
      serverGems: this.balance,
      streakFreezes: this.freezes,
      freezesGranted: 1,
      spent: STREAK_FREEZE_PRICE,
    }
  }

  purchase(eventId: string, activityKey: string): Promise<AtomicFreezePurchaseResult> {
    const run = this.chain.then(() => this.critical(eventId, activityKey))
    this.chain = run.then(
      () => undefined,
      () => undefined,
    )
    return run
  }
}
