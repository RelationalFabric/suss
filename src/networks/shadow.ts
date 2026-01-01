/**
 * Shadow Object Propagator
 *
 * Built-in network for shadow object models.
 * Demonstrates sparse encoding - only essential state is serialized.
 * Bridges imperative JavaScript with propagator model.
 */

import type { PREL } from '../prel/types.js'
import { createPREL, createNode } from '../prel/struct.js'
import { createInitialT } from '../timestamp/clock.js'
import { Map } from '../_/immutable.js'

/**
 * Create a shadow network from a JavaScript object
 *
 * @param obj - JavaScript object to convert to network
 * @returns P-REL structure representing the object
 */
export function createShadowNetwork(obj: Record<string, unknown>): PREL {
  const t0 = createInitialT(0, 100)
  const prel = createPREL(t0)

  // Convert object properties to nodes
  let nodes = prel.nodes

  for (const [key, value] of Object.entries(obj)) {
    const node = createNode(
      { value: [[key, value]] } as typeof prel.nodes extends Map<string, infer N> ? N['value'] : never,
      t0,
      'observed',
    )
    nodes = nodes.set(key, node)
  }

  return {
    ...prel,
    nodes,
  }
}

/**
 * Sync from shadow network back to JavaScript object
 *
 * @param prel - Shadow network P-REL
 * @returns JavaScript object reconstructed from network
 */
export function syncFromShadow(prel: PREL): Record<string, unknown> {
  const obj: Record<string, unknown> = {}

  for (const [nodeId, node] of prel.nodes) {
    // Extract value from ATL structure
    const atl = node.value
    if (typeof atl === 'object' && atl !== null && 'value' in atl) {
      const valueArray = (atl as { value: unknown }).value
      if (Array.isArray(valueArray) && valueArray.length > 0) {
        const [, literal] = valueArray[0] as [string, unknown]
        obj[nodeId] = literal
      }
    }
  }

  return obj
}