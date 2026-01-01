/**
 * Model entities that bridge the formal type hierarchy with operational semantics
 */

import type { T, Tag, Path, Value, Meta } from './hierarchy.js'

/**
 * Operation arguments - array of Values
 */
export type Args = readonly Value[]

/**
 * Observe tag identifier
 */
export type ObserveTag = string

/**
 * Pulse: An operation that updates a cell
 * Format: [T, Tag, Args, Meta?]
 * - T: Logical timestamp
 * - Tag: Operation identifier
 * - Args: Operation-specific parameters
 * - Meta: Optional metadata
 */
export type Pulse = readonly [T, Tag, Args, Meta?]

/**
 * ObservePulse: The fundamental operation for introducing external entropy
 * Format: [T, ObserveTag, [Path, Old, New], Meta?]
 *
 * This single construct is both the event (what was observed) and the operation (what is proposed).
 * Compare-and-swap semantics are intrinsic—the Pulse is accepted only if the cell's current
 * value equals Old, otherwise it triggers an amnesiac event or refinement (e.g., Sync).
 */
export type ObservePulse = readonly [
  T,
  ObserveTag,
  readonly [Path, Old: Value, New: Value],
  Meta?,
]

/**
 * Change Set: A collection of operations applied to cells
 * Used by toolkit primitives for adding operations, collapsing redundant operations,
 * materializing values, and computing constraint alignments.
 */
export type ChangeSet = readonly Pulse[]

/**
 * Cell: A CAnATL structure representing a single cell in the network
 */
export type Cell = import('./hierarchy.js').CAnATL

/**
 * Type guard to check if a Pulse is an ObservePulse
 */
export function isObservePulse(pulse: Pulse): pulse is ObservePulse {
  return (
    pulse.length >= 3
    && Array.isArray(pulse[2])
    && pulse[2].length === 3
    && typeof pulse[2][0] === 'string'
  )
}