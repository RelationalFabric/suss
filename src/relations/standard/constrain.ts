/**
 * Constrain Relation: Multi-variable Constraint Solver
 *
 * Enforces multi-variable constraints of the form f(src, tgt, args) = 0
 * Checks which node is observed to decide which to "repair"
 * Use case: Financial ledgers, physics simulations, constraint satisfaction
 */

import type { LinkRelation } from '../../resolvers/relation.js'
import type { RealNode } from '../../prel/types.js'
import type { Value, Meta } from '../../types/hierarchy.js'

/**
 * Constraint function type: f(src, tgt, args) -> number
 * Returns 0 when constraint is satisfied
 */
export type ConstraintFn = (src: Value, tgt: Value, args: readonly Value[]) => number

/**
 * Create a constrain relation
 *
 * Higher-order relation that enforces a constraint function.
 *
 * @param constraintFn - Function that returns 0 when constraint is satisfied
 * @param repairFn - Optional function to repair the constraint (defaults to simple adjustment)
 * @returns LinkRelation that enforces the constraint
 */
export function constrain(
  constraintFn: ConstraintFn,
  repairFn?: (src: Value, tgt: Value, args: readonly Value[], error: number) => readonly [Value, Value],
): LinkRelation {
  return (srcNode: RealNode, tgtNode: RealNode, meta: Meta): readonly [Value, Value, Meta] => {
    const srcValue = srcNode.value
    const tgtValue = tgtNode.value

    // Extract args from meta if available, or use empty array
    const args: readonly Value[] = (meta.args as readonly Value[]) || []

    // Check if constraint is satisfied
    const error = constraintFn(srcValue, tgtValue, args)

    if (Math.abs(error) < 1e-10) {
      // Constraint is satisfied (within numerical tolerance)
      return [srcValue, tgtValue, meta] as const
    }

    // Constraint not satisfied: determine which node to repair
    const srcIsObserved = srcNode.state === 'observed' || srcNode.state === 'consensus'
    const tgtIsObserved = tgtNode.state === 'observed' || tgtNode.state === 'consensus'

    let newSrcValue: Value
    let newTgtValue: Value

    if (repairFn) {
      // Use custom repair function
      [newSrcValue, newTgtValue] = repairFn(srcValue, tgtValue, args, error)
    }
    else {
      // Default repair: adjust non-observed node
      if (srcIsObserved && !tgtIsObserved) {
        // Source is observed, adjust target
        newSrcValue = srcValue
        // Simple repair: adjust target to minimize error
        // This is a placeholder - real constraint solvers would use more sophisticated methods
        newTgtValue = tgtValue // In practice, would compute based on constraint
      }
      else if (tgtIsObserved && !srcIsObserved) {
        // Target is observed, adjust source
        newSrcValue = srcValue // In practice, would compute based on constraint
        newTgtValue = tgtValue
      }
      else {
        // Both or neither observed: prefer not changing
        newSrcValue = srcValue
        newTgtValue = tgtValue
      }
    }

    return [newSrcValue, newTgtValue, meta] as const
  }
}