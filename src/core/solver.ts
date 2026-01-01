/**
 * Constraint Solver
 *
 * Computes operations to align two CAnATL cells according to a relation.
 * Invokes relation functions: link(srcNode, tgtNode, meta) -> [srcValue, tgtValue, meta']
 * Handles value comparison using structure-independent hashing.
 * Manages state transitions based on authority hierarchy.
 */

import type { RealNode, State } from '../prel/types.js'
import type { LinkRelation } from '../resolvers/relation.js'
import type { Value, Meta } from '../types/hierarchy.js'
import { valuesEqual } from '../utils/comparison.js'
import { transitionState, canUpdateState } from '../utils/state.js'
import { materialize } from '../utils/interpretation.js'
import type { CAnATL } from '../types/hierarchy.js'

/**
 * Solve a relation constraint between two nodes
 *
 * Computes operations to align two CAnATL cells according to a relation.
 * The relation receives full node objects but returns values.
 * The system then applies these values to the nodes.
 *
 * @param srcNode - Source node (full RealNode context)
 * @param tgtNode - Target node (full RealNode context)
 * @param relation - Link relation function
 * @param meta - Link metadata
 * @returns Tuple of [srcValue, tgtValue, updatedMeta] that satisfy the relation
 */
export function solveRelation(
  srcNode: RealNode,
  tgtNode: RealNode,
  relation: LinkRelation,
  meta: Meta,
): readonly [Value, Value, Meta] {
  // Execute the relation with full node context
  const [srcValue, tgtValue, updatedMeta] = relation(srcNode, tgtNode, meta)

  return [srcValue, tgtValue, updatedMeta] as const
}

/**
 * Check if a relation result would cause node updates
 *
 * @param node - Current node
 * @param newValue - Proposed new value from relation
 * @returns True if the new value differs from current value
 */
export function wouldUpdateNode(node: RealNode, newValue: Value): boolean {
  return !valuesEqual(node.value, newValue)
}

/**
 * Compute the new state for a node after a relation update
 *
 * @param currentNode - Current node state
 * @param newValue - Proposed new value
 * @param operationType - Type of operation (always 'link' for relations)
 * @returns New state if update is allowed, or current state
 */
export function computeNewState(
  currentNode: RealNode,
  newValue: Value,
  operationType: 'link' = 'link',
): State {
  // Check if value actually changed
  if (!wouldUpdateNode(currentNode, newValue))
    return currentNode.state

  // Check if state transition is allowed
  const proposedState = transitionState(currentNode.state, operationType)

  if (canUpdateState(currentNode.state, proposedState, operationType))
    return proposedState

  return currentNode.state
}

/**
 * Apply relation result to a node
 *
 * @param node - Current node
 * @param newValue - New value from relation
 * @param newT - New timestamp (should be > current asOf)
 * @returns Updated node with new value and state
 */
export function applyRelationResult(
  node: RealNode,
  newValue: Value,
  newT: import('../types/hierarchy.js').T,
): RealNode {
  const newState = computeNewState(node, newValue, 'link')

  return {
    value: newValue,
    state: newState,
    meta: node.meta,
    asOf: newT,
  }
}