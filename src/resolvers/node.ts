/**
 * Node Resolver
 *
 * Resolves opaque node identifiers in P-REL to concrete node implementations
 * with a standard interface.
 */

import type { PREL, RealNode, Node } from '../prel/types.js'
import type { materialize } from '../utils/interpretation.js'
import { materialize as defaultMaterialize } from '../utils/interpretation.js'
import { isRealNode } from '../prel/types.js'

/**
 * Node Resolver function type
 * Function: (nodeId, P-REL) -> RealNode
 *
 * @param nodeId - Node identifier
 * @param prel - P-REL structure
 * @returns RealNode with full node context
 */
export type NodeResolver = (nodeId: string, prel: PREL) => RealNode

/**
 * Default Node Resolver implementation
 *
 * Looks up the node in the P-REL nodes map and converts it to a RealNode.
 * Materializes the value using the default interpreter.
 *
 * @param nodeId - Node identifier
 * @param prel - P-REL structure
 * @returns RealNode
 */
export function defaultNodeResolver(nodeId: string, prel: PREL): RealNode {
  const node = prel.nodes.get(nodeId)

  if (!node)
    throw new Error(`Node not found: ${nodeId}`)

  // Materialize the ATL value to a Value
  // In Suss, we treat ATL as Value directly since ATL is a Value type
  // For a complete implementation, this would use interpretation
  const value = node.value as RealNode['value']

  return {
    value,
    state: node.lineage,
    meta: node.meta,
    asOf: node.asOf,
  }
}

/**
 * Create a Node Resolver with custom materialization
 *
 * @param materializeFn - Custom materialization function
 * @returns Node Resolver function
 */
export function createNodeResolver(
  materializeFn: typeof defaultMaterialize = defaultMaterialize,
): NodeResolver {
  return (nodeId: string, prel: PREL): RealNode => {
    const node = prel.nodes.get(nodeId)

    if (!node)
      throw new Error(`Node not found: ${nodeId}`)

    // For now, use ATL directly as Value
    // In a complete implementation, this would materialize through interpretation
    const value = node.value as RealNode['value']

    return {
      value,
      state: node.lineage,
      meta: node.meta,
      asOf: node.asOf,
    }
  }
}