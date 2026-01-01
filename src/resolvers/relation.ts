/**
 * Relation Resolver
 *
 * Resolves opaque relation identifiers in P-REL to concrete relation functions.
 * Supports both Link Relations and Op Relations.
 */

import type { PREL, RealNode } from '../prel/types.js'
import type { Value, Meta } from '../types/hierarchy.js'
import type { Pulse } from '../types/entities.js'

/**
 * Link Relation function signature
 * Function: (srcNode, tgtNode, meta) -> [srcValue, tgtValue, meta']
 *
 * Link Relations operate on pairs of cells. They receive the complete node objects
 * as input and return values (not nodes) and updated metadata.
 */
export type LinkRelation = (
  srcNode: RealNode,
  tgtNode: RealNode,
  meta: Meta,
) => readonly [Value, Value, Meta]

/**
 * Op Relation function signature
 * Function: (prel, args, meta) -> [delta-PREL, Pulse[], meta']
 *
 * Op Relations operate on the P-REL structure itself. They modify network topology,
 * emit Pulses that update CAnATL structures, and update P-REL metadata.
 */
export type OpRelation = (
  prel: PREL,
  args: readonly Value[],
  meta: Meta,
) => readonly [PREL, readonly Pulse[], Meta]

/**
 * RealRelation: Union of LinkRelation and OpRelation
 */
export type RealRelation = LinkRelation | OpRelation

/**
 * Relation Resolver function type
 * Function: (relationId, P-REL) -> RealRelation
 *
 * @param relationId - Relation identifier
 * @param prel - P-REL structure
 * @returns RealRelation function
 */
export type RelationResolver = (relationId: string, prel: PREL) => RealRelation

/**
 * Default Relation Resolver implementation
 *
 * Looks up the relation in the P-REL relations map.
 * The relation should already be a function (LinkRelation or OpRelation).
 *
 * @param relationId - Relation identifier
 * @param prel - P-REL structure
 * @returns RealRelation function
 */
export function defaultRelationResolver(relationId: string, prel: PREL): RealRelation {
  const relation = prel.relations.get(relationId)

  if (!relation)
    throw new Error(`Relation not found: ${relationId}`)

  // In the runtime P-REL, relations are already functions
  // For serialized P-RELs, they would need to be recreated from metadata
  if (typeof relation !== 'function')
    throw new Error(`Relation ${relationId} is not a function`)

  return relation as RealRelation
}

/**
 * Create a Relation Resolver with custom relation factory
 *
 * @param factory - Function that creates relations from metadata
 * @returns Relation Resolver function
 */
export function createRelationResolver(
  factory?: (relationId: string, metadata: unknown) => RealRelation,
): RelationResolver {
  return (relationId: string, prel: PREL): RealRelation => {
    const relation = prel.relations.get(relationId)

    if (relation && typeof relation === 'function')
      return relation as RealRelation

    // If relation is not a function, try to recreate it from metadata
    if (factory && relation) {
      const recreated = factory(relationId, relation)
      if (recreated)
        return recreated
    }

    throw new Error(`Relation not found or invalid: ${relationId}`)
  }
}

/**
 * Check if a relation is a LinkRelation
 */
export function isLinkRelation(relation: RealRelation): relation is LinkRelation {
  // LinkRelation takes 3 parameters (srcNode, tgtNode, meta)
  // OpRelation takes 3 parameters (prel, args, meta) but first is PREL
  // We can't reliably distinguish at runtime, so we assume LinkRelation
  // In practice, the system knows which type to use based on context
  return relation.length === 3
}

/**
 * Check if a relation is an OpRelation
 */
export function isOpRelation(relation: RealRelation): relation is OpRelation {
  // Similar to isLinkRelation, we can't reliably distinguish
  // In practice, OpRelations are used in specific contexts
  return relation.length === 3
}