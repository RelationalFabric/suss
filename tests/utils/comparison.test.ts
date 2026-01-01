import { describe, it, expect } from 'vitest'
import { hashValue, valuesEqual } from '../../src/utils/comparison.js'
import type { Value } from '../../src/types/hierarchy.js'

describe('Value Comparison', () => {
  it('should hash identical values the same', () => {
    const value1: Value = [['value', 42], {}] as const
    const value2: Value = [['value', 42], {}] as const

    expect(hashValue(value1)).toBe(hashValue(value2))
  })

  it('should hash different values differently', () => {
    const value1: Value = [['value', 42], {}] as const
    const value2: Value = [['value', 43], {}] as const

    expect(hashValue(value1)).not.toBe(hashValue(value2))
  })

  it('should detect equal values', () => {
    const value1: Value = [['value', 42], {}] as const
    const value2: Value = [['value', 42], {}] as const

    expect(valuesEqual(value1, value2)).toBe(true)
  })
})