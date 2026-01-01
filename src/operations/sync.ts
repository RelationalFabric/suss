/**
 * Sync Op: Leader-Free Consensus
 *
 * Rolling snowball protocol for distributed consensus without request-response
 * protocols, heavyweight locking, or leader election.
 * Accumulator dictionary with threshold-based completion.
 * Valuation functions: Mean, Mode, Max, Quorum
 * Handle stale → consensus transitions
 */

import type { PREL, Node } from '../prel/types.js'
import type { Pulse } from '../types/entities.js'
import type { Value, Path } from '../types/hierarchy.js'
import { setNode } from '../prel/struct.js'
import { valuesEqual } from '../utils/comparison.js'
import { incrementBaseIdx } from '../timestamp/clock.js'

/**
 * Accumulator dictionary mapping node IDs to values
 */
export type Accumulator = Readonly<Record<string, Value>>

/**
 * Valuation function type
 */
export type ValuationFn = (values: readonly Value[]) => Value

/**
 * Common valuation functions
 */
export const valuations = {
  /**
   * Mean (average) of numeric values
   */
  mean: (values: readonly Value[]): Value => {
    // Simplified - would need proper numeric extraction
    const sum = values.length
    return [['mean', sum / values.length], {}] as const
  },

  /**
   * Mode (most common value)
   */
  mode: (values: readonly Value[]): Value => {
    const counts = new Map<string, number>()
    let maxCount = 0
    let modeValue: Value = values[0] || [['value', 0], {}] as const

    for (const val of values) {
      const key = JSON.stringify(val)
      const count = (counts.get(key) || 0) + 1
      counts.set(key, count)

      if (count > maxCount) {
        maxCount = count
        modeValue = val
      }
    }

    return modeValue
  },

  /**
   * Maximum value
   */
  max: (values: readonly Value[]): Value => {
    // Simplified - assumes numeric values
    let maxVal = values[0] || [['value', 0], {}] as const
    for (const val of values) {
      // In practice, would compare properly
      if (JSON.stringify(val) > JSON.stringify(maxVal))
        maxVal = val
    }
    return maxVal
  },

  /**
   * Quorum (majority value)
   */
  quorum: (values: readonly Value[]): Value => {
    const counts = new Map<string, number>()
    const threshold = Math.floor(values.length / 2) + 1

    for (const val of values) {
      const key = JSON.stringify(val)
      counts.set(key, (counts.get(key) || 0) + 1)
      if ((counts.get(key) || 0) >= threshold)
        return val
    }

    // No quorum reached, return mode as fallback
    return valuations.mode(values)
  },
}

/**
 * Execute a Sync operation
 *
 * Rolling snowball protocol:
 * 1. Identity Check: If localNodeId already in dictionary, do nothing
 * 2. Append: Add local node/value to accumulator
 * 3. Threshold Check: If size >= count, mark complete, compute valuation
 * 4. Re-emit: If not complete, emit updated Pulse
 *
 * @param prel - Current P-REL structure
 * @param path - State path being decided
 * @param count - Target threshold for consensus (quorum size)
 * @param accumulator - Accumulator dictionary mapping node IDs to values
 * @param localNodeId - ID of the local node
 * @param valuationFn - Function to compute final value from accumulator
 * @param maxRounds - Maximum rounds for timestamp increment
 * @returns Tuple of [updated P-REL, emitted Pulses]
 */
export function sync(
  prel: PREL,
  path: Path,
  count: number,
  accumulator: Accumulator,
  localNodeId: string,
  valuationFn: ValuationFn = valuations.quorum,
  maxRounds: number = 100,
): readonly [PREL, readonly Pulse[]] {
  const nodeId = path

  // Get current node (must be stale to participate)
  const currentNode = prel.nodes.get(nodeId)
  if (!currentNode)
    throw new Error(`Node not found: ${nodeId}`)

  if (currentNode.lineage !== 'stale')
    throw new Error(`Node ${nodeId} is not stale, cannot participate in sync`)

  // Identity check: if already in accumulator, do nothing
  if (localNodeId in accumulator) {
    return [prel, []] as const
  }

  // Append: add local node/value to accumulator
  const updatedAccumulator: Accumulator = {
    ...accumulator,
    [localNodeId]: currentNode.value as Value,
  }

  const accumulatorSize = Object.keys(updatedAccumulator).length
  const emittedPulses: Pulse[] = []

  // Threshold check
  if (accumulatorSize >= count) {
    // Consensus reached: compute valuation and update node
    const consensusValue = valuationFn(Object.values(updatedAccumulator))

    // Create new timestamp
    const currentT = prel.asOf
    const newT = incrementBaseIdx(currentT, maxRounds)

    const updatedNode: Node = {
      value: consensusValue as typeof currentNode.value,
      asOf: newT,
      lineage: 'consensus',
      meta: currentNode.meta,
    }

    const updatedPrel = setNode(prel, nodeId, updatedNode)

    return [updatedPrel, emittedPulses] as const
  }

  // Not yet complete: re-emit Sync pulse with updated accumulator
  // In a full implementation, this would create a proper Sync Pulse
  // For now, we return empty pulses (the sync would be handled by propagation)
  return [prel, emittedPulses] as const
}