/**
 * Type hierarchy for RaCSTS (Relational and Causal State Transition System)
 *
 * This module defines the complete nested type system following the "Russian Doll" pattern,
 * where each layer adds structure while preserving serializability.
 */

/**
 * Base type for all serializable JavaScript values
 */
export type Literal = unknown

/**
 * Semantic label for a value, used for type discrimination and protocol dispatch
 */
export type Tag = string

/**
 * Path identifier for addressing cells in the network
 */
export type Path = string

/**
 * Logical timestamp for causal ordering
 * Structure: [Epoch, SyncedWall, Idx]
 * - Epoch: Logical counter providing primary causal ordering
 * - SyncedWall: NTP-synchronized wall clock time
 * - Idx: Disambiguates concurrent events, uses fractional refinement: BaseIdx + Round / MaxRounds
 */
export type T = readonly [Epoch: number, SyncedWall: number, Idx: number]

/**
 * Tagged Literal: A literal value with a semantic tag
 * Format: [Tag, Literal]
 */
export type TL = readonly [Tag, Literal]

/**
 * Associative Tagged Literal: Recursive associative structure
 * Dictionary values can be ATL (nested dictionaries), TL (tagged literals), or arrays of TL
 */
export type ATL = { readonly [key: string]: ATL | TL | readonly TL[] }

/**
 * Annotations: Metadata represented as an associative structure
 */
export type Annotations = ATL

/**
 * Annotated Tagged Literal: A tagged literal with metadata attached
 * Format: [Tag, Literal, Annotations]
 */
export type AnTL = readonly [Tag, Literal, Annotations]

/**
 * Annotated Associative Tagged Literal: An associative structure with metadata
 * Format: [ATL, Annotations]
 */
export type AnATL = readonly [ATL, Annotations]

/**
 * Value: Union of annotated types
 * This is the type of "a value" in the system—any serializable data with optional semantic tags and annotations
 */
export type Value = AnATL | AnTL

/**
 * Meta: Optional metadata (no preservation guarantees through serialization)
 */
export type Meta = ATL

/**
 * CAnATL (Causal Annotated Associative Tagged Literal): The fundamental cell type in RaCSTS
 * Format: [T, Tag, Value, Meta?]
 * - T: Logical timestamp for causal ordering
 * - Tag: Semantic label for the cell's interpretation
 * - Value: The current authoritative state (materialized through interpretation)
 * - Meta: Optional metadata (no preservation guarantees)
 *
 * CAnATL is the properly basic data structure for a cell. Everything in a propagator network
 * is ultimately built from CAnATLs. Cells contain only authoritative state—there is no
 * node-level history, window, frame, or context.
 */
export type CAnATL = readonly [
  T,
  Tag,
  Value,
  Meta?,
]

/**
 * Type guard to check if a value is a TL
 */
export function isTL(value: unknown): value is TL {
  return (
    Array.isArray(value)
    && value.length === 2
    && typeof value[0] === 'string'
  )
}

/**
 * Type guard to check if a value is an AnTL
 */
export function isAnTL(value: unknown): value is AnTL {
  return (
    Array.isArray(value)
    && value.length === 3
    && typeof value[0] === 'string'
    && typeof value[2] === 'object'
    && value[2] !== null
  )
}

/**
 * Type guard to check if a value is an AnATL
 */
export function isAnATL(value: unknown): value is AnATL {
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
 * Type guard to check if a value is a Value
 */
export function isValue(value: unknown): value is Value {
  return isAnTL(value) || isAnATL(value)
}

/**
 * Type guard to check if a value is a CAnATL
 */
export function isCAnATL(value: unknown): value is CAnATL {
  return (
    Array.isArray(value)
    && (value.length === 3 || value.length === 4)
    && Array.isArray(value[0])
    && value[0].length === 3
    && typeof value[0][0] === 'number'
    && typeof value[0][1] === 'number'
    && typeof value[0][2] === 'number'
    && typeof value[1] === 'string'
    && isValue(value[2])
  )
}

/**
 * Type guard to check if a value is an ATL
 */
export function isATL(value: unknown): value is ATL {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false

  // Check if all values are either ATL, TL, or TL[]
  for (const v of Object.values(value)) {
    if (!isATL(v) && !isTL(v) && !(Array.isArray(v) && v.every(isTL)))
      return false
  }

  return true
}