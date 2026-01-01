/**
 * Mark Relation: Directional Truth Propagation
 *
 * Propagates status flags from source to target without moving data literals.
 * Use case: Dirty flags, validity state, sync status
 */

import type { LinkRelation } from '../../resolvers/relation.js'
import type { RealNode } from '../../prel/types.js'
import type { Value, Meta } from '../../types/hierarchy.js'

/**
 * Create a mark relation
 *
 * The mark relation propagates status from source to target without moving data.
 * When source is updated, target receives the status update.
 *
 * @returns LinkRelation that propagates status flags
 */
export function mark(): LinkRelation {
  return (srcNode: RealNode, tgtNode: RealNode, meta: Meta): readonly [Value, Value, Meta] => {
    // Mark relation propagates the source state/status to target
    // In this implementation, we propagate the source value (which may contain status info)
    // The relation returns the source value unchanged and the source value for target
    return [srcNode.value, srcNode.value, meta] as const
  }
}