import { describe, it, expect } from 'vitest'
import { pack, unpack } from '../../src/serialization/index.js'
import { createPREL } from '../../src/prel/struct.js'
import { createInitialT } from '../../src/timestamp/clock.js'

describe('Pack/Unpack', () => {
  it('should serialize and deserialize empty P-REL', () => {
    const t0 = createInitialT(0, 100)
    const prel = createPREL(t0)

    const json = pack(prel)
    const restored = unpack(json)

    expect(restored.asOf).toEqual(prel.asOf)
    expect(restored.nodes.size).toBe(0)
    expect(restored.links.size).toBe(0)
  })

  it('should preserve nodes through serialization', () => {
    const t0 = createInitialT(0, 100)
    const prel = createPREL(t0)

    // Add a node
    const node = {
      value: { test: [['value', 42]] },
      asOf: t0,
      lineage: 'observed' as const,
      meta: {},
    }

    const prelWithNode = {
      ...prel,
      nodes: prel.nodes.set('test-node', node),
    }

    const json = pack(prelWithNode)
    const restored = unpack(json)

    expect(restored.nodes.has('test-node')).toBe(true)
    const restoredNode = restored.nodes.get('test-node')
    expect(restoredNode?.lineage).toBe('observed')
  })
})