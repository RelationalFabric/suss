/**
 * Value comparison utilities
 *
 * Provides structure-independent hashing and equality checks for Values.
 * Used to determine if relation returned value differs from current value.
 */

import type { Value, ATL, TL, AnTL, AnATL } from '../types/hierarchy.js'

/**
 * Calculate a canonical hash for a Value
 *
 * This creates a deterministic hash that can be used for comparison.
 * For production use, consider using a proper hash library, but for
 * this reference implementation, we use JSON.stringify for canonicalization.
 *
 * @param value - Value to hash
 * @returns Canonical hash string
 */
export function hashValue(value: Value): string {
  return JSON.stringify(canonicalizeValue(value))
}

/**
 * Canonicalize a Value for comparison
 *
 * Converts a Value to a canonical JSON representation for comparison.
 *
 * @param value - Value to canonicalize
 * @returns Canonical representation
 */
export function canonicalizeValue(value: Value): unknown {
  if (isAnTL(value)) {
    return ['AnTL', value[0], canonicalizeUnknown(value[1]), canonicalizeATL(value[2])]
  }

  if (isAnATL(value)) {
    return ['AnATL', canonicalizeATL(value[0]), canonicalizeATL(value[1])]
  }

  return value
}

/**
 * Canonicalize an ATL structure
 */
function canonicalizeATL(atl: ATL): unknown {
  const result: Record<string, unknown> = {}

  // Sort keys for deterministic ordering
  const keys = Object.keys(atl).sort()

  for (const key of keys) {
    const val = atl[key]

    if (Array.isArray(val)) {
      // Array of TL
      result[key] = val.map(tl => ['TL', tl[0], canonicalizeUnknown(tl[1])])
    }
    else if (isTL(val)) {
      result[key] = ['TL', val[0], canonicalizeUnknown(val[1])]
    }
    else if (typeof val === 'object' && val !== null) {
      // Nested ATL
      result[key] = canonicalizeATL(val as ATL)
    }
    else {
      result[key] = canonicalizeUnknown(val)
    }
  }

  return result
}

/**
 * Canonicalize an unknown value
 */
function canonicalizeUnknown(value: unknown): unknown {
  if (value === null || value === undefined)
    return value

  if (typeof value === 'object' && !Array.isArray(value))
    return canonicalizeATL(value as ATL)

  if (Array.isArray(value))
    return value.map(canonicalizeUnknown)

  return value
}

/**
 * Check if two Values are equal using structure-independent comparison
 *
 * @param a - First value
 * @param b - Second value
 * @returns True if values are equal
 */
export function valuesEqual(a: Value, b: Value): boolean {
  return hashValue(a) === hashValue(b)
}

/**
 * Type guard for AnTL
 */
function isAnTL(value: unknown): value is AnTL {
  return (
    Array.isArray(value)
    && value.length === 3
    && typeof value[0] === 'string'
  )
}

/**
 * Type guard for AnATL
 */
function isAnATL(value: unknown): value is AnATL {
  return (
    Array.isArray(value)
    && value.length === 2
    && typeof value[0] === 'object'
    && value[0] !== null
    && typeof value[1] === 'object'
    && value[1] !== null
  )
}

/**
 * Type guard for TL
 */
function isTL(value: unknown): value is TL {
  return (
    Array.isArray(value)
    && value.length === 2
    && typeof value[0] === 'string'
  )
}