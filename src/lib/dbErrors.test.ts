import { describe, expect, it } from 'vitest'
import {
  isSchemaDriftError,
  isUniqueViolation,
  isUndefinedColumn,
  isUndefinedTable,
} from './dbErrors'

describe('dbErrors', () => {
  it('detects unique violations by code or message', () => {
    expect(isUniqueViolation({ code: '23505', message: 'duplicate' })).toBe(true)
    expect(isUniqueViolation(new Error('duplicate key value violates unique constraint'))).toBe(
      true,
    )
    expect(isUniqueViolation({ code: '42P01', message: 'missing' })).toBe(false)
  })

  it('detects missing tables and columns', () => {
    expect(isUndefinedTable({ code: '42P01', message: 'relation "x" does not exist' })).toBe(true)
    expect(isUndefinedColumn({ code: '42703', message: 'column "gems" does not exist' })).toBe(
      true,
    )
    expect(isSchemaDriftError({ code: '42P01' })).toBe(true)
    expect(isSchemaDriftError({ code: '23505' })).toBe(false)
  })
})
