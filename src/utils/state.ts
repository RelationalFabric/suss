/**
 * State management utilities
 *
 * Manages authority hierarchy and state transitions for nodes.
 * Authority hierarchy: observed > consensus > stale > derived
 */

import type { State } from '../prel/types.js'

/**
 * Operation type that triggers state transitions
 */
export type OperationType = 'observe' | 'sync' | 'link' | 'reject'

/**
 * Authority hierarchy values (higher number = higher authority)
 */
const AUTHORITY_LEVELS: Record<State, number> = {
  observed: 4,
  consensus: 3,
  stale: 2,
  derived: 1,
}

/**
 * Check if a state transition is allowed based on authority hierarchy
 *
 * State transitions follow authority rules:
 * - Op Relations always win (→ observed)
 * - Sync Op can update stale (→ consensus)
 * - Link Relations can update derived (→ derived)
 * - Observe rejection → stale
 *
 * @param current - Current state
 * @param proposed - Proposed new state
 * @param operation - Operation type triggering the transition
 * @returns True if transition is allowed
 */
export function canUpdateState(
  current: State,
  proposed: State,
  operation: OperationType,
): boolean {
  // Observe operations always succeed and set to observed
  if (operation === 'observe')
    return true

  // Reject operations always set to stale
  if (operation === 'reject')
    return true

  // Sync operations can only update stale nodes to consensus
  if (operation === 'sync')
    return current === 'stale' && proposed === 'consensus'

  // Link operations (relations) can update derived nodes
  if (operation === 'link')
    return proposed === 'derived' && AUTHORITY_LEVELS[proposed] <= AUTHORITY_LEVELS[current]

  // Default: only allow transitions that maintain or increase authority
  return AUTHORITY_LEVELS[proposed] >= AUTHORITY_LEVELS[current]
}

/**
 * Transition state based on operation type
 *
 * @param current - Current state
 * @param operation - Operation type
 * @returns New state after transition
 */
export function transitionState(current: State, operation: OperationType): State {
  switch (operation) {
    case 'observe':
      return 'observed'
    case 'reject':
      return 'stale'
    case 'sync':
      // Sync can only transition stale to consensus
      return current === 'stale' ? 'consensus' : current
    case 'link':
      // Link relations set to derived, but can't override observed/consensus
      if (current === 'observed' || current === 'consensus')
        return current
      return 'derived'
    default:
      return current
  }
}

/**
 * Check if a state has higher or equal authority than another
 *
 * @param state - State to check
 * @param other - State to compare against
 * @returns True if state has higher or equal authority
 */
export function hasAuthority(state: State, other: State): boolean {
  return AUTHORITY_LEVELS[state] >= AUTHORITY_LEVELS[other]
}

/**
 * Get the authority level of a state
 *
 * @param state - State
 * @returns Authority level (higher = more authoritative)
 */
export function getAuthorityLevel(state: State): number {
  return AUTHORITY_LEVELS[state]
}