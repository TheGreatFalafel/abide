function dig(err: unknown): { code?: string; message: string } {
  if (!err || typeof err !== 'object') {
    return { message: String(err ?? '') }
  }
  const e = err as {
    code?: string
    message?: string
    cause?: unknown
    severity?: string
  }
  if (e.code || e.message) {
    return { code: e.code, message: e.message ?? '' }
  }
  if (e.cause) return dig(e.cause)
  return { message: String(err) }
}

/** Postgres unique_violation — safe to treat as idempotent duplicate. */
export function isUniqueViolation(err: unknown): boolean {
  const { code, message } = dig(err)
  return code === '23505' || /duplicate key|unique constraint/i.test(message)
}

/** Missing relation — usually undeployed migrations. */
export function isUndefinedTable(err: unknown): boolean {
  const { code, message } = dig(err)
  return code === '42P01' || /relation .* does not exist/i.test(message)
}

/** Missing column — usually undeployed migrations. */
export function isUndefinedColumn(err: unknown): boolean {
  const { code, message } = dig(err)
  return code === '42703' || /column .* does not exist/i.test(message)
}

export function isSchemaDriftError(err: unknown): boolean {
  return isUndefinedTable(err) || isUndefinedColumn(err)
}

export function schemaDriftMessage(): string {
  return 'Database schema is out of date. Retry in a moment; if this persists, run migrations.'
}
