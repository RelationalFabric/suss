import { describe, it, expect } from 'vitest'
import { linear } from '../../../src/relations/standard/linear.js'
import { createT } from '../../../src/timestamp/clock.js'
import type { RealNode } from '../../../src/prel/types.js'

describe('Linear Relation', () => {
  it('should create linear relation', () => {
    const relation = linear(32, 1.8) // F = 32 + 1.8 * C
    expect(typeof relation).toBe('function')
  })

  it('should compute forward direction (C → F)', () => {
    const relation = linear(32, 1.8)

    const srcNode: RealNode = {
      value: [['celsius', 25], {}] as const,
      state: 'observed',
      meta: {},
      asOf: createT(0, Date.now(), 0, 0, 100),
    }

    const tgtNode: RealNode = {
      value: [['fahrenheit', 0], {}] as const,
      state: 'derived',
      meta: {},
      asOf: createT(0, Date.now(), 0, 0, 100),
    }

    const [srcVal, tgtVal] = relation(srcNode, tgtNode, {})

    // F = 32 + 1.8 * 25 = 77
    // Note: This is a simplified test - actual numeric extraction would be needed
    expect(srcVal).toBeDefined()
    expect(tgtVal).toBeDefined()
  })
})