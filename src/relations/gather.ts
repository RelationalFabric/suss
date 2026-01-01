/**
 * Gather Links Support
 *
 * Enables N→1 and N→M link patterns by collecting multiple sources.
 * Structure: ([src₁, src₂, ..., srcₙ], tgt, args, meta)
 */

import type { RealNode } from '../prel/types.js'
import type { LinkRelation } from '../resolvers/relation.js'
import type { Value, Meta } from '../types/hierarchy.js'

/**
 * Multi-source link relation signature
 * Takes an array of source nodes, target node, and metadata
 */
export type GatherLinkRelation = (
  sources: readonly RealNode[],
  target: RealNode,
  meta: Meta,
) => readonly [Value[], Value, Meta]

/**
 * Convert a standard LinkRelation to work with gathered sources
 *
 * @param relation - Standard LinkRelation (1→1)
 * @returns GatherLinkRelation that applies relation to each source
 */
export function gather(relation: LinkRelation): GatherLinkRelation {
  return (
    sources: readonly RealNode[],
    target: RealNode,
    meta: Meta,
  ): readonly [Value[], Value, Meta] => {
    // Apply relation to each source-target pair
    const sourceUpdates: Value[] = []
    let targetValue = target.value
    let updatedMeta = meta

    for (const source of sources) {
      const [srcVal, tgtVal, meta_] = relation(source, target, updatedMeta)
      sourceUpdates.push(srcVal)
      targetValue = tgtVal
      updatedMeta = meta_
    }

    return [sourceUpdates, targetValue, updatedMeta] as const
  }
}