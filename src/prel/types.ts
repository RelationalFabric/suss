/**
 * P-REL (Parallel Relational Layer) types
 *
 * P-REL is the serializable blueprint containing nodes, relations, links, meta, and asOf.
 * It is independent of RaCSTS and contains only data—no executable code.
 */

import type { Map, List } from '../_/immutable.js'
import type { T, ATL, Value, Meta } from '../types/hierarchy.js'

/**
 * Node state/lineage indicating provenance and authority
 * Authority hierarchy: observed > consensus > stale > derived
 */
export type State = 'observed' | 'consensus' | 'stale' | 'derived'

/**
 * Node structure in P-REL
 * - value: ATL (tagged literals dispatch on tag for interpretation)
 * - asOf: Timestamp of last update
 * - lineage: State indicating provenance and authority
 * - meta: Metadata (ATL)
 */
export interface Node {
  readonly value: ATL
  readonly asOf: T
  readonly lineage: State
  readonly meta: ATL
}

/**
 * RealNode: Node interface for Link Relations (receives full node context)
 * In RaCSTS: value is opaque. In Suss implementation: value is ATL
 */
export interface RealNode {
  readonly value: Value
  readonly state: State
  readonly meta: Meta
  readonly asOf: T
}

/**
 * Link structure in P-REL
 * Links are stored as an array, not an object
 */
export interface Link {
  readonly srcSelector: string
  readonly tgtSelector: string
  readonly relationId: string
  readonly args: readonly Value[]
  readonly meta: Meta
  readonly label?: string
}

/**
 * Relation structure is implementation-dependent and opaque
 * For serialization, relations are recreated from metadata or relation definitions
 */
export type Relation = unknown

/**
 * P-REL (Parallel Relational Layer) structure
 * The serializable blueprint containing everything needed to resume the network
 */
export interface PREL {
  readonly nodes: Map<string, Node>
  readonly relations: Map<string, Relation>
  readonly links: List<Link>
  readonly meta: ATL
  readonly asOf: T
}

/**
 * Type guard to check if a value is a State
 */
export function isState(value: unknown): value is State {
  return (
    typeof value === 'string'
    && (value === 'observed'
      || value === 'consensus'
      || value === 'stale'
      || value === 'derived')
  )
}

/**
 * Type guard to check if a value is a Node
 */
export function isNode(value: unknown): value is Node {
  return (
    typeof value === 'object'
    && value !== null
    && 'value' in value
    && 'asOf' in value
    && 'lineage' in value
    && 'meta' in value
    && Array.isArray((value as Node).asOf)
    && (value as Node).asOf.length === 3
    && isState((value as Node).lineage)
  )
}

/**
 * Type guard to check if a value is a RealNode
 */
export function isRealNode(value: unknown): value is RealNode {
  return (
    typeof value === 'object'
    && value !== null
    && 'value' in value
    && 'state' in value
    && 'meta' in value
    && 'asOf' in value
    && isState((value as RealNode).state)
    && Array.isArray((value as RealNode).asOf)
    && (value as RealNode).asOf.length === 3
  )
}