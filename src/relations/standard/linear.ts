/**
 * Linear Relation: Bidirectional Numeric Constraint
 *
 * Solves linear relationships of the form y = a + bx
 * If source changes, solves for target; if target changes, performs inverse to update source.
 * Use case: Unit conversions (Celsius ↔ Fahrenheit), layout engines (width ↔ column span)
 */

import type { LinkRelation } from '../../resolvers/relation.js'
import type { RealNode } from '../../prel/types.js'
import type { Value, Meta } from '../../types/hierarchy.js'

/**
 * Create a linear relation
 *
 * Higher-order relation that returns a LinkRelation for the linear equation y = a + bx
 *
 * @param a - Intercept (y = a when x = 0)
 * @param b - Slope (rate of change)
 * @returns LinkRelation that maintains y = a + bx
 *
 * @example
 * ```typescript
 * // Celsius to Fahrenheit: F = 32 + (9/5) * C
 * const tempRelation = linear(32, 1.8)
 * ```
 */
export function linear(a: number, b: number): LinkRelation {
  return (srcNode: RealNode, tgtNode: RealNode, meta: Meta): readonly [Value, Value, Meta] => {
    // Extract numeric values from source and target
    const srcValue = extractNumber(srcNode.value)
    const tgtValue = extractNumber(tgtNode.value)

    // Determine which node changed based on state
    // Observed/consensus nodes typically act as anchors
    const srcIsAnchor = srcNode.state === 'observed' || srcNode.state === 'consensus'
    const tgtIsAnchor = tgtNode.state === 'observed' || tgtNode.state === 'consensus'

    let newSrcValue: number
    let newTgtValue: number

    if (srcIsAnchor && !tgtIsAnchor) {
      // Source is anchor: compute target from source
      // y = a + b * x
      newSrcValue = srcValue
      newTgtValue = a + b * srcValue
    }
    else if (tgtIsAnchor && !srcIsAnchor) {
      // Target is anchor: compute source from target (inverse)
      // x = (y - a) / b
      if (b === 0)
        throw new Error('Cannot invert linear relation with b = 0')

      newSrcValue = (tgtValue - a) / b
      newTgtValue = tgtValue
    }
    else {
      // Both or neither are anchors: prefer source as anchor
      newSrcValue = srcValue
      newTgtValue = a + b * srcValue
    }

    // Convert back to Value format
    // For simplicity, we'll use tagged literals
    const newSrcVal: Value = [['value', newSrcValue], {}] as const
    const newTgtVal: Value = [['value', newTgtValue], {}] as const

    return [newSrcVal, newTgtVal, meta] as const
  }
}

/**
 * Extract a number from a Value
 * Simple extraction for numeric values
 */
function extractNumber(value: Value): number {
  // Handle different Value formats
  // For AnTL: [Tag, Literal, Annotations]
  // For AnATL: [ATL, Annotations]

  if (Array.isArray(value)) {
    if (value.length === 3) {
      // AnTL format
      const literal = value[1]
      if (typeof literal === 'number')
        return literal
    }
    else if (value.length === 2 && typeof value[0] === 'object') {
      // AnATL format - try to extract from ATL
      const atl = value[0] as Record<string, unknown>
      const numericKey = Object.keys(atl).find(key => typeof atl[key] === 'number')
      if (numericKey)
        return atl[numericKey] as number
    }
  }

  throw new Error(`Cannot extract number from value: ${JSON.stringify(value)}`)
}