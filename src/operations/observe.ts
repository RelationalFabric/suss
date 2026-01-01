/**
 * Observe Operation
 *
 * The fundamental operation for introducing external entropy into the network.
 * Compare-and-swap semantics: accept only if Cur == Old.
 * Handle Observe rejection → transition to stale state.
 * Trigger Sync Op when stale state is reached.
 */

import type { PREL, Node } from '../prel/types.js'
import type { ObservePulse, Pulse } from '../types/entities.js'
import type { Value } from '../types/hierarchy.js'
import { setNode, type PREL as PRELType } from '../prel/struct.js'
import { materialize } from '../utils/interpretation.js'
import { valuesEqual } from '../utils/comparison.js'
import { transitionState } from '../utils/state.js'
import { incrementBaseIdx, compareT, isTGreaterThan } from '../timestamp/clock.js'

/**
 * Execute an Observe operation
 *
 * Compare-and-swap semantics are intrinsic—the Pulse is accepted only if
 * the cell's current value equals Old, otherwise it triggers an amnesiac
 * event or refinement (e.g., Sync).
 *
 * @param prel - Current P-REL structure
 * @param pulse - ObservePulse to execute
 * @param nodeResolver - Node resolver function
 * @param maxRounds - Maximum rounds for timestamp increment
 * @returns Tuple of [updated P-REL, emitted Pulses]
 */
export function observe(
  prel: PRELType,
  pulse: ObservePulse,
  nodeResolver?: (nodeId: string, prel: PRELType) => { value: Value; asOf: import('../types/hierarchy.js').T },
  maxRounds: number = 100,
): readonly [PRELType, readonly Pulse[]] {
  const [, , [path, oldValue, newValue], meta] = pulse
  const nodeId = path

  // Get current node
  const currentNode = prel.nodes.get(nodeId)
  if (!currentNode)
    throw new Error(`Node not found: ${nodeId}`)

  // Materialize current value for comparison
  // In Suss, we use ATL directly as Value
  const currentValue = currentNode.value as Value

  // Compare-and-swap check
  const casSuccess = valuesEqual(currentValue, oldValue)

  let updatedNode: Node
  let emittedPulses: Pulse[] = []

  if (casSuccess) {
    // CAS succeeded: accept the update
    // Advance timestamp (increment base index for external input)
    const newT = incrementBaseIdx(pulse[0], maxRounds)

    updatedNode = {
      value: newValue as typeof currentNode.value,
      asOf: newT,
      lineage: 'observed',
      meta: meta || currentNode.meta,
    }

    // No pulses emitted (update accepted)
  }
  else {
    // CAS failed: reject the update, transition to stale
    const newT = incrementBaseIdx(pulse[0], maxRounds)

    updatedNode = {
      value: currentNode.value,
      asOf: newT,
      lineage: 'stale',
      meta: currentNode.meta,
    }

    // Emit Sync pulse to seek consensus
    // In a full implementation, this would create a proper SyncOp
    // For now, we'll emit an empty array (Sync would be handled separately)
    emittedPulses = []
  }

  const updatedPrel = setNode(prel, nodeId, updatedNode)

  return [updatedPrel, emittedPulses] as const
}