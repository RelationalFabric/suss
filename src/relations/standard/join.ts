/**
 * Join Relation: N→M Relational Knitting
 *
 * Connects nodes by shared keys or references.
 * Preserves relational structure while maintaining integrity.
 * Requires Gather Links for multi-source collection.
 * Use case: Foreign-key-like integrity between collections, maintaining joined views
 */

import type { LinkRelation } from '../../resolvers/relation.js'
import type { RealNode } from '../../prel/types.js'
import type { Value, Meta } from '../../types/hierarchy.js'

/**
 * Key extraction function: Value -> key
 */
export type KeyFn = (value: Value) => string

/**
 * Join function: (sourceValue, targetValue, key) -> [newSourceValue, newTargetValue]
 */
export type JoinFn = (
  sourceValue: Value,
  targetValue: Value,
  key: string,
) => readonly [Value, Value]

/**
 * Create a join relation
 *
 * Higher-order relation that connects nodes by shared keys.
 * Note: This is a simplified single-source version. For multi-source joins,
 * use Gather Links to collect sources first.
 *
 * @param keyFn - Function that extracts a key from a value
 * @param joinFn - Function that performs the join operation
 * @returns LinkRelation that maintains the join relationship
 */
export function join(
  keyFn: KeyFn,
  joinFn?: JoinFn,
): LinkRelation {
  return (srcNode: RealNode, tgtNode: RealNode, meta: Meta): readonly [Value, Value, Meta] => {
    const srcValue = srcNode.value
    const tgtValue = tgtNode.value

    const key = keyFn(srcValue)

    if (joinFn) {
      // Use custom join function
      const [newSrcValue, newTgtValue] = joinFn(srcValue, tgtValue, key)
      return [newSrcValue, newTgtValue, meta] as const
    }

    // Default join: if keys match, propagate source to target
    const tgtKey = keyFn(tgtValue)
    if (key === tgtKey) {
      // Keys match: maintain relationship
      return [srcValue, srcValue, meta] as const
    }

    // Keys don't match: no change
    return [srcValue, tgtValue, meta] as const
  }
}