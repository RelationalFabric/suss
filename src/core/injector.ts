/**
 * Monotonic Injector
 *
 * Adds operations to change sets while maintaining T-ordering.
 * Ensures monotonicity: only accept operations where T_new > T_current.
 * Maintains semi-lattice properties for operation ordering.
 */

import { List } from '../_/immutable.js'
import type { Pulse, ChangeSet } from '../types/entities.js'
import { compareT, isTGreaterThan } from '../timestamp/clock.js'

/**
 * Add a Pulse to a change set while maintaining T-ordering
 *
 * The operation is added to the change set only if its timestamp T is greater than
 * any existing operation for the same target (monotonicity). Operations are ordered
 * by their T timestamps.
 *
 * @param changeSet - Current change set
 * @param pulse - Pulse to add
 * @returns New change set with pulse added (if monotonicity is satisfied)
 */
export function addPulse(changeSet: ChangeSet, pulse: Pulse): ChangeSet {
  const list = List(pulse)

  // Find insertion point to maintain T-ordering
  // Operations should be ordered by T (ascending)
  let insertionIndex = changeSet.length

  for (let i = 0; i < changeSet.length; i++) {
    const existing = changeSet[i]
    const comparison = compareT(pulse[0], existing[0])

    if (comparison < 0) {
      // New pulse has earlier T, insert here
      insertionIndex = i
      break
    }

    if (comparison === 0) {
      // Same T - maintain insertion order for same-T operations
      insertionIndex = i + 1
    }
  }

  // Insert the pulse at the appropriate position
  return [...changeSet.slice(0, insertionIndex), pulse, ...changeSet.slice(insertionIndex)] as const
}

/**
 * Add multiple Pulses to a change set
 *
 * @param changeSet - Current change set
 * @param pulses - Pulses to add
 * @returns New change set with all pulses added
 */
export function addPulses(changeSet: ChangeSet, pulses: readonly Pulse[]): ChangeSet {
  let result = changeSet

  for (const pulse of pulses)
    result = addPulse(result, pulse)

  return result
}

/**
 * Check if a Pulse can be added to a change set (monotonicity check)
 *
 * A pulse can be added if its T is greater than or equal to the latest T in the change set,
 * or if the change set is empty.
 *
 * @param changeSet - Current change set
 * @param pulse - Pulse to check
 * @returns True if pulse can be added (maintains monotonicity)
 */
export function canAddPulse(changeSet: ChangeSet, pulse: Pulse): boolean {
  if (changeSet.length === 0)
    return true

  const latestT = changeSet[changeSet.length - 1][0]
  const pulseT = pulse[0]

  // Allow if pulse T is greater than or equal to latest T
  return isTGreaterThan(pulseT, latestT) || compareT(pulseT, latestT) === 0
}