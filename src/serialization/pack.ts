/**
 * Pack: Serialize P-REL to JSON
 *
 * Serializes P-REL structure to JSON format.
 * Preserves: nodes (with ATL values), links array, relations (as metadata), meta, asOf
 * Serializes T as [Epoch, SyncedWall, Idx] (with fractional Idx)
 * Handles recursive ATL structures and Immutable.js collections
 */

import type { PREL } from '../prel/types.js'
import type { Map, List } from '../_/immutable.js'

/**
 * Serialized P-REL structure (JSON-compatible)
 */
export interface SerializedPREL {
  readonly nodes: Record<string, SerializedNode>
  readonly relations: Record<string, unknown>
  readonly links: readonly SerializedLink[]
  readonly meta: unknown
  readonly asOf: readonly [number, number, number]
}

/**
 * Serialized Node
 */
export interface SerializedNode {
  readonly value: unknown
  readonly asOf: readonly [number, number, number]
  readonly lineage: string
  readonly meta: unknown
}

/**
 * Serialized Link
 */
export interface SerializedLink {
  readonly srcSelector: string
  readonly tgtSelector: string
  readonly relationId: string
  readonly args: readonly unknown[]
  readonly meta: unknown
  readonly label?: string
}

/**
 * Pack a P-REL structure to JSON string
 *
 * @param prel - P-REL structure to serialize
 * @returns JSON string representation
 */
export function pack(prel: PREL): string {
  const serialized = packToObject(prel)
  return JSON.stringify(serialized, null, 2)
}

/**
 * Pack a P-REL structure to a serializable object
 *
 * @param prel - P-REL structure to serialize
 * @returns Serializable object
 */
export function packToObject(prel: PREL): SerializedPREL {
  // Convert Immutable.js Map to plain object
  const nodes: Record<string, SerializedNode> = {}
  for (const [nodeId, node] of prel.nodes) {
    nodes[nodeId] = {
      value: serializeValue(node.value),
      asOf: node.asOf as readonly [number, number, number],
      lineage: node.lineage,
      meta: serializeValue(node.meta),
    }
  }

  // Convert relations Map to plain object
  // Relations are stored as metadata (function definitions, etc.)
  const relations: Record<string, unknown> = {}
  for (const [relationId, relation] of prel.relations) {
    // Store relation metadata (functions can't be serialized directly)
    // In practice, this would store relation definitions
    relations[relationId] = serializeRelation(relation)
  }

  // Convert Immutable.js List to plain array
  const links: SerializedLink[] = prel.links.map(link => ({
    srcSelector: link.srcSelector,
    tgtSelector: link.tgtSelector,
    relationId: link.relationId,
    args: link.args.map(serializeValue),
    meta: serializeValue(link.meta),
    label: link.label,
  })).toArray()

  return {
    nodes,
    relations,
    links,
    meta: serializeValue(prel.meta),
    asOf: prel.asOf as readonly [number, number, number],
  }
}

/**
 * Serialize a Value (ATL structure)
 */
function serializeValue(value: unknown): unknown {
  if (value === null || value === undefined)
    return value

  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string')
    return value

  if (Array.isArray(value))
    return value.map(serializeValue)

  if (typeof value === 'object') {
    // Handle Immutable.js collections
    if ('toJS' in value && typeof (value as { toJS: () => unknown }).toJS === 'function') {
      return (value as { toJS: () => unknown }).toJS()
    }

    // Handle plain objects
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      result[key] = serializeValue(val)
    }
    return result
  }

  return value
}

/**
 * Serialize a relation (function metadata)
 *
 * Relations are stored as metadata since functions can't be serialized.
 * On unpack, they would be recreated from this metadata.
 */
function serializeRelation(relation: unknown): unknown {
  // For functions, we can't serialize them directly
  // Store as metadata that can be used to recreate them
  if (typeof relation === 'function') {
    // Store function name or definition as string
    return {
      type: 'function',
      name: relation.name || 'anonymous',
      // In practice, would store relation definition or parameters
    }
  }

  return relation
}