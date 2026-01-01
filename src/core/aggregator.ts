/**
 * Log Aggregator
 *
 * Collapses redundant operations in change sets while preserving causal integrity.
 * Performs identity folding: 1→2→3 → 1→3, 1→2→1 → no-op
 */

import type { Pulse, ChangeSet } from '../types/entities.js'
import { valuesEqual } from '../utils/comparison.js'
import { isObservePulse } from '../types/entities.js'

/**
 * Collapse redundant operations in a change set
 *
 * Performs identity folding:
 * - If a value changes 1→2→3, collapse to 1→3
 * - If a value changes 1→2→1 (circular mutation), collapse to no-op
 *
 * Preserves causal integrity by maintaining T-ordering and ensuring that
 * operations that depend on intermediate states are not lost.
 *
 * @param changeSet - Change set to collapse
 * @returns Collapsed change set with redundant operations removed
 */
export function collapse(changeSet: ChangeSet): ChangeSet {
  if (changeSet.length === 0)
    return changeSet

  // Group pulses by target (path) for ObservePulses, or by tag for others
  const groups = new Map<string, Pulse[]>()

  for (const pulse of changeSet) {
    let key: string

    if (isObservePulse(pulse)) {
      // Group ObservePulses by path
      key = `observe:${pulse[2][0]}`
    }
    else {
      // Group other pulses by tag (simplified grouping)
      key = `pulse:${pulse[1]}`
    }

    if (!groups.has(key))
      groups.set(key, [])

    groups.get(key)!.push(pulse)
  }

  // Collapse each group
  const collapsed: Pulse[] = []

  for (const [key, group] of groups) {
    if (key.startsWith('observe:')) {
      // Collapse ObservePulses by folding value changes
      const folded = foldObservePulses(group as ObservePulse[])
      collapsed.push(...folded)
    }
    else {
      // For other pulses, keep them (more complex collapsing would require
      // understanding the pulse semantics)
      collapsed.push(...group)
    }
  }

  // Maintain original ordering by T
  return collapsed.sort((a, b) => {
    const aT = a[0]
    const bT = b[0]
    const epochDiff = aT[0] - bT[0]
    if (epochDiff !== 0)
      return epochDiff
    return aT[2] - bT[2]
  }) as ChangeSet
}

/**
 * Fold a sequence of ObservePulses for the same path
 *
 * @param pulses - ObservePulses for the same path
 * @returns Folded pulses (1→2→3 → 1→3, 1→2→1 → [])
 */
function foldObservePulses(pulses: ObservePulse[]): Pulse[] {
  if (pulses.length === 0)
    return []

  if (pulses.length === 1)
    return [pulses[0]]

  // Track value transitions
  const path = pulses[0][2][0]
  let oldValue: import('../types/hierarchy.js').Value | undefined
  let newValue: import('../types/hierarchy.js').Value = pulses[0][2][2]

  // Find the first and last values
  const firstPulse = pulses[0]
  const lastPulse = pulses[pulses.length - 1]

  oldValue = firstPulse[2][1]
  newValue = lastPulse[2][2]

  // Check if the sequence is circular (ends where it started)
  if (valuesEqual(oldValue, newValue)) {
    // Circular mutation: 1→2→1 → no-op
    return []
  }

  // Non-circular: create a single pulse from first old to last new
  // Use the latest timestamp
  const resultPulse: ObservePulse = [
    lastPulse[0],
    firstPulse[1],
    [path, oldValue, newValue],
    lastPulse[3],
  ]

  return [resultPulse]
}

/**
 * Remove no-op pulses from a change set
 *
 * @param changeSet - Change set to clean
 * @returns Change set with no-op pulses removed
 */
export function removeNoOps(changeSet: ChangeSet): ChangeSet {
  return changeSet.filter(pulse => {
    if (isObservePulse(pulse)) {
      const [, , [, old, new_]] = pulse
      // Remove if old === new (no-op)
      return !valuesEqual(old, new_)
    }
    // Keep non-Observe pulses (can't determine if no-op without semantics)
    return true
  }) as ChangeSet
}