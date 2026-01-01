/**
 * Reduce Relation: N→1 Aggregation
 *
 * Aggregates information from source array into compact target.
 * Inherently directional—cannot "un-reduce" without extra information.
 * Requires Gather Links for multi-source collection.
 * Use case: Computing hash of object from all fields, total of shopping cart, validity of form
 */

import type { LinkRelation } from '../../resolvers/relation.js'
import type { RealNode } from '../../prel/types.js'
import type { Value, Meta } from '../../types/hierarchy.js'

/**
 * Reducer function type: (accumulator, value) -> accumulator
 */
export type ReducerFn = (accumulator: Value, value: Value) => Value

/**
 * Initial value for reduction
 */
export type InitialValue = Value

/**
 * Create a reduce relation
 *
 * Higher-order relation that aggregates multiple source values into a single target.
 * Note: This is a simplified single-source version. For multi-source reduction,
 * use Gather Links to collect sources first.
 *
 * @param reducer - Function that combines accumulator and value
 * @param initial - Initial value for reduction
 * @returns LinkRelation that aggregates source to target
 */
export function reduce(
  reducer: ReducerFn,
  initial: InitialValue,
): LinkRelation {
  return (srcNode: RealNode, tgtNode: RealNode, meta: Meta): readonly [Value, Value, Meta] => {
    const srcValue = srcNode.value
    const tgtValue = tgtNode.value

    // Reduce source value with current target as accumulator
    // For multi-source, this would be called with all sources
    const newTgtValue = reducer(tgtValue || initial, srcValue)

    // Source value unchanged (reduction is directional)
    return [srcValue, newTgtValue, meta] as const
  }
}

/**
 * Common reducer functions
 */
export const reducers = {
  /**
   * Sum reducer (for numeric values)
   */
  sum: (acc: Value, val: Value): Value => {
    const accNum = extractNumber(acc)
    const valNum = extractNumber(val)
    return [['sum', accNum + valNum], {}] as const
  },

  /**
   * Count reducer
   */
  count: (acc: Value, _val: Value): Value => {
    const accNum = extractNumber(acc)
    return [['count', accNum + 1], {}] as const
  },
}

/**
 * Extract a number from a Value (simplified)
 */
function extractNumber(value: Value): number {
  if (Array.isArray(value)) {
    if (value.length === 3 && typeof value[1] === 'number')
      return value[1]
    if (value.length === 2 && typeof value[1] === 'number')
      return value[1]
  }
  return 0
}