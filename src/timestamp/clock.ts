/**
 * Hybrid Epoch Clock implementation
 *
 * T structure: [Epoch, SyncedWall, Idx]
 * - Epoch: Logical counter providing primary causal ordering
 * - SyncedWall: NTP-synchronized wall clock time
 * - Idx: Disambiguates concurrent events, uses fractional refinement: BaseIdx + Round / MaxRounds
 */

import type { T } from '../types/hierarchy.js'

/**
 * Create a T timestamp
 *
 * @param epoch - Logical counter
 * @param syncedWall - NTP-synchronized wall clock time
 * @param baseIdx - Base index for disambiguating concurrent events
 * @param round - Propagation round (0-based)
 * @param maxRounds - Maximum number of rounds per logical time step
 * @returns T timestamp with fractional Idx refinement
 */
export function createT(
  epoch: number,
  syncedWall: number,
  baseIdx: number,
  round: number,
  maxRounds: number,
): T {
  const idx = baseIdx + round / maxRounds
  return [epoch, syncedWall, idx] as const
}

/**
 * Increment the round in a timestamp (for internal propagation)
 *
 * @param t - Current timestamp
 * @param maxRounds - Maximum number of rounds
 * @returns New timestamp with incremented round
 */
export function incrementRound(t: T, maxRounds: number): T {
  const [epoch, syncedWall, idx] = t
  const baseIdx = Math.floor(idx)
  const round = Math.round((idx - baseIdx) * maxRounds)
  const newRound = round + 1

  if (newRound >= maxRounds)
    throw new Error(`Round ${newRound} exceeds MaxRounds ${maxRounds}`)

  return createT(epoch, syncedWall, baseIdx, newRound, maxRounds)
}

/**
 * Increment the base index (for external input/Observe Pulse)
 *
 * @param t - Current timestamp
 * @param maxRounds - Maximum number of rounds
 * @returns New timestamp with incremented base index, round reset to 0
 */
export function incrementBaseIdx(t: T, maxRounds: number): T {
  const [epoch, syncedWall, idx] = t
  const baseIdx = Math.floor(idx)
  return createT(epoch, syncedWall, baseIdx + 1, 0, maxRounds)
}

/**
 * Compare two timestamps
 *
 * @param a - First timestamp
 * @param b - Second timestamp
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareT(a: T, b: T): number {
  const [epochA, wallA, idxA] = a
  const [epochB, wallB, idxB] = b

  if (epochA < epochB)
    return -1
  if (epochA > epochB)
    return 1

  // Epochs are equal, compare Idx (fractional refinement)
  if (idxA < idxB)
    return -1
  if (idxA > idxB)
    return 1

  // Idxs are equal, compare wall time (optional tie-breaker)
  if (wallA < wallB)
    return -1
  if (wallA > wallB)
    return 1

  return 0
}

/**
 * Check if timestamp a is less than timestamp b
 */
export function isTLessThan(a: T, b: T): boolean {
  return compareT(a, b) < 0
}

/**
 * Check if timestamp a is less than or equal to timestamp b
 */
export function isTLessThanOrEqual(a: T, b: T): boolean {
  return compareT(a, b) <= 0
}

/**
 * Check if timestamp a is greater than timestamp b
 */
export function isTGreaterThan(a: T, b: T): boolean {
  return compareT(a, b) > 0
}

/**
 * Get the current wall time (milliseconds since epoch)
 */
export function getCurrentWallTime(): number {
  return Date.now()
}

/**
 * Create an initial timestamp with current wall time
 */
export function createInitialT(epoch: number = 0, maxRounds: number = 100): T {
  return createT(epoch, getCurrentWallTime(), 0, 0, maxRounds)
}