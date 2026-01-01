/**
 * P-REL structure construction and manipulation utilities
 */

import { Map, List } from '../_/immutable.js'
import type { PREL, Node, Link } from './types.js'
import type { T, ATL } from '../types/hierarchy.js'

/**
 * Create an empty P-REL structure
 */
export function createPREL(asOf: T): PREL {
  return {
    nodes: Map<string, Node>(),
    relations: Map<string, unknown>(),
    links: List<Link>(),
    meta: {},
    asOf,
  }
}

/**
 * Create a Node structure
 */
export function createNode(
  value: ATL,
  asOf: T,
  lineage: PREL['nodes'] extends Map<string, infer N> ? N['lineage'] : never = 'derived',
  meta: ATL = {},
): Node {
  return {
    value,
    asOf,
    lineage,
    meta,
  }
}

/**
 * Create a Link structure
 */
export function createLink(
  srcSelector: string,
  tgtSelector: string,
  relationId: string,
  args: readonly unknown[] = [],
  meta: ATL = {},
  label?: string,
): Link {
  return {
    srcSelector,
    tgtSelector,
    relationId,
    args: args as readonly import('../types/hierarchy.js').Value[],
    meta,
    label,
  }
}

/**
 * Update a node in P-REL
 */
export function setNode(prel: PREL, nodeId: string, node: Node): PREL {
  return {
    ...prel,
    nodes: prel.nodes.set(nodeId, node),
  }
}

/**
 * Update multiple nodes in P-REL
 */
export function setNodes(prel: PREL, nodes: Map<string, Node>): PREL {
  return {
    ...prel,
    nodes: prel.nodes.merge(nodes),
  }
}

/**
 * Remove a node from P-REL
 */
export function removeNode(prel: PREL, nodeId: string): PREL {
  return {
    ...prel,
    nodes: prel.nodes.delete(nodeId),
  }
}

/**
 * Add a link to P-REL
 */
export function addLink(prel: PREL, link: Link): PREL {
  return {
    ...prel,
    links: prel.links.push(link),
  }
}

/**
 * Remove a link from P-REL by index
 */
export function removeLink(prel: PREL, index: number): PREL {
  return {
    ...prel,
    links: prel.links.delete(index),
  }
}

/**
 * Update a relation in P-REL
 */
export function setRelation(prel: PREL, relationId: string, relation: unknown): PREL {
  return {
    ...prel,
    relations: prel.relations.set(relationId, relation),
  }
}

/**
 * Update P-REL metadata
 */
export function setMeta(prel: PREL, meta: ATL): PREL {
  return {
    ...prel,
    meta,
  }
}

/**
 * Update P-REL asOf timestamp
 */
export function setAsOf(prel: PREL, asOf: T): PREL {
  return {
    ...prel,
    asOf,
  }
}