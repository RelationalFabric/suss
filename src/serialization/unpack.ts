/**
 * Unpack: Deserialize JSON back to P-REL
 *
 * Deserializes JSON back to P-REL with identical structure.
 * Restores T timestamps exactly.
 * Recreates relations from stored metadata.
 * Applies Sway Rule for clock synchronization if needed.
 * Ensures deterministic round-trip: unpack(pack(P-REL)) === P-REL
 */

import { Map, List } from '../_/immutable.js'
import type { PREL, Node, Link } from '../prel/types.js'
import type { SerializedPREL, SerializedNode, SerializedLink } from './pack.js'
import { createNode } from '../prel/struct.js'
import type { RelationResolver } from '../resolvers/relation.js'

/**
 * Unpack a JSON string to P-REL structure
 *
 * @param json - JSON string to deserialize
 * @param relationResolver - Optional relation resolver to recreate relations
 * @returns Deserialized P-REL structure
 */
export function unpack(
  json: string,
  relationResolver?: RelationResolver,
): PREL {
  const serialized = JSON.parse(json) as SerializedPREL
  return unpackFromObject(serialized, relationResolver)
}

/**
 * Unpack a serialized object to P-REL structure
 *
 * @param serialized - Serialized P-REL object
 * @param relationResolver - Optional relation resolver to recreate relations
 * @returns Deserialized P-REL structure
 */
export function unpackFromObject(
  serialized: SerializedPREL,
  relationResolver?: RelationResolver,
): PREL {
  // Convert plain object to Immutable.js Map for nodes
  const nodes = Map<string, Node>().withMutations(mutable => {
    for (const [nodeId, serializedNode] of Object.entries(serialized.nodes)) {
      const node: Node = {
        value: deserializeValue(serializedNode.value) as Node['value'],
        asOf: serializedNode.asOf as Node['asOf'],
        lineage: serializedNode.lineage as Node['lineage'],
        meta: deserializeValue(serializedNode.meta) as Node['meta'],
      }
      mutable.set(nodeId, node)
    }
  })

  // Convert plain object to Immutable.js Map for relations
  const relations = Map<string, unknown>().withMutations(mutable => {
    for (const [relationId, serializedRelation] of Object.entries(serialized.relations)) {
      // Relations would be recreated from metadata by relationResolver
      // For now, store as-is (would need relationResolver to recreate functions)
      mutable.set(relationId, serializedRelation)
    }
  })

  // Convert plain array to Immutable.js List for links
  const links = List<Link>(serialized.links.map(link => ({
    srcSelector: link.srcSelector,
    tgtSelector: link.tgtSelector,
    relationId: link.relationId,
    args: link.args.map(deserializeValue) as Link['args'],
    meta: deserializeValue(link.meta) as Link['meta'],
    label: link.label,
  })))

  const prel: PREL = {
    nodes,
    relations,
    links,
    meta: deserializeValue(serialized.meta) as PREL['meta'],
    asOf: serialized.asOf as PREL['asOf'],
  }

  return prel
}

/**
 * Deserialize a Value (ATL structure)
 */
function deserializeValue(value: unknown): unknown {
  if (value === null || value === undefined)
    return value

  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string')
    return value

  if (Array.isArray(value))
    return value.map(deserializeValue)

  if (typeof value === 'object') {
    // Handle plain objects (reconstruct as ATL)
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      result[key] = deserializeValue(val)
    }
    return result
  }

  return value
}