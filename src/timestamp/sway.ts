/**
 * Sway Rule implementation for ensuring linearizability
 *
 * The Sway Rule ensures strict monotonicity when receiving remote timestamps.
 * It updates the local clock to maintain strict monotonicity and total ordering.
 */

import type { T } from '../types/hierarchy.js'

/**
 * Apply the Sway Rule to update local timestamp based on remote timestamp
 *
 * The Sway Rule:
 * - If T_local < T_remote: Epoch_local = Epoch_remote + 1
 * - Else: Epoch_local = max(Epoch_local, Epoch_remote) + 1
 *
 * This ensures:
 * - Strict monotonicity: Timestamps always advance, never regress
 * - Total ordering: Any two timestamps can be compared unambiguously
 * - Clock-drift resilience: System remains causal even if physical clocks are hours apart
 *
 * @param localT - Current local timestamp
 * @param remoteT - Remote timestamp received
 * @returns Updated local timestamp with Epoch advanced appropriately
 */
export function applySwayRule(localT: T, remoteT: T): T {
  const [epochLocal, wallLocal, idxLocal] = localT
  const [epochRemote, wallRemote, idxRemote] = remoteT

  // Compare timestamps to determine if local is behind remote
  const isLocalBehind = epochLocal < epochRemote
    || (epochLocal === epochRemote && idxLocal < idxRemote)
    || (epochLocal === epochRemote && idxLocal === idxRemote && wallLocal < wallRemote)

  let newEpoch: number

  if (isLocalBehind) {
    // Local is behind remote: advance to remote epoch + 1
    newEpoch = epochRemote + 1
  }
  else {
    // Local is ahead or equal: advance to max + 1
    newEpoch = Math.max(epochLocal, epochRemote) + 1
  }

  // Preserve local wall time and idx (they remain valid for local operations)
  // The epoch advancement ensures monotonicity
  return [newEpoch, wallLocal, idxLocal] as const
}

/**
 * Check if applying Sway Rule would advance the local timestamp
 *
 * @param localT - Current local timestamp
 * @param remoteT - Remote timestamp
 * @returns True if Sway Rule would advance the local timestamp
 */
export function wouldSwayRuleAdvance(localT: T, remoteT: T): boolean {
  const [epochLocal] = localT
  const [epochRemote] = remoteT

  const newEpoch = epochLocal < epochRemote
    ? epochRemote + 1
    : Math.max(epochLocal, epochRemote) + 1

  return newEpoch > epochLocal
}