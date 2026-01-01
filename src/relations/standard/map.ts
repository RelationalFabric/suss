/**
 * Map Relation: Functional Bridge
 *
 * Bidirectional functional transformation with forward/backward functions and conflict resolver.
 * Handles cases where both nodes change in the same time-step.
 * Use case: Serializing complex objects to strings, mapping UI state to domain state
 */

import type { LinkRelation } from '../../resolvers/relation.js'
import type { RealNode } from '../../prel/types.js'
import type { Value, Meta } from '../../types/hierarchy.js'
import { valuesEqual } from '../../utils/comparison.js'

/**
 * Forward function type: src -> tgt
 */
export type ForwardFn = (src: Value) => Value

/**
 * Backward function type: tgt -> src
 */
export type BackwardFn = (tgt: Value) => Value

/**
 * Conflict resolver type: (src, tgt) -> [newSrc, newTgt]
 */
export type ConflictResolver = (src: Value, tgt: Value) => readonly [Value, Value]

/**
 * Create a map relation
 *
 * Higher-order relation that creates a bidirectional functional transformation.
 *
 * @param forward - Function that maps source to target
 * @param backward - Function that maps target to source
 * @param resolver - Optional conflict resolver for when both nodes change simultaneously
 * @returns LinkRelation that maintains the functional relationship
 */
export function map(
  forward: ForwardFn,
  backward: BackwardFn,
  resolver?: ConflictResolver,
): LinkRelation {
  return (srcNode: RealNode, tgtNode: RealNode, meta: Meta): readonly [Value, Value, Meta] => {
    const srcValue = srcNode.value
    const tgtValue = tgtNode.value

    // Determine which node changed based on state and timestamps
    const srcChanged = srcNode.asOf[0] > tgtNode.asOf[0]
      || (srcNode.asOf[0] === tgtNode.asOf[0] && srcNode.asOf[2] > tgtNode.asOf[2])
    const tgtChanged = tgtNode.asOf[0] > srcNode.asOf[0]
      || (tgtNode.asOf[0] === srcNode.asOf[0] && tgtNode.asOf[2] > srcNode.asOf[2])

    let newSrcValue: Value
    let newTgtValue: Value

    if (srcChanged && !tgtChanged) {
      // Source changed: apply forward function
      newSrcValue = srcValue
      newTgtValue = forward(srcValue)
    }
    else if (tgtChanged && !srcChanged) {
      // Target changed: apply backward function
      newSrcValue = backward(tgtValue)
      newTgtValue = tgtValue
    }
    else if (srcChanged && tgtChanged) {
      // Both changed: use conflict resolver or prefer source
      if (resolver) {
        [newSrcValue, newTgtValue] = resolver(srcValue, tgtValue)
      }
      else {
        // Default: prefer source
        newSrcValue = srcValue
        newTgtValue = forward(srcValue)
      }
    }
    else {
      // Neither changed: check if values are already consistent
      const expectedTgt = forward(srcValue)
      if (valuesEqual(tgtValue, expectedTgt)) {
        // Already consistent
        return [srcValue, tgtValue, meta] as const
      }
      // Not consistent: apply forward
      newSrcValue = srcValue
      newTgtValue = expectedTgt
    }

    return [newSrcValue, newTgtValue, meta] as const
  }
}