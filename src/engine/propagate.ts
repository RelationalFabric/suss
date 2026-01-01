/**
 * Propagation Engine
 *
 * Main propagation logic implementing the Selection → Reconciliation → Quiescence model.
 * Matches Pulses to Link Relations, executes relations, and detects quiescence.
 */

import type { PREL, RealNode, Link } from '../prel/types.js'
import type { Pulse } from '../types/entities.js'
import { solveRelation, applyRelationResult, wouldUpdateNode } from '../core/solver.js'
import { defaultNodeResolver, type NodeResolver } from '../resolvers/node.js'
import { defaultRelationResolver, type RelationResolver } from '../resolvers/relation.js'
import { resolveSelector, matchSelector } from './selectors.js'
import { expandTemplate } from './templates.js'
import { incrementRound, compareT, isTGreaterThan } from '../timestamp/clock.js'
import { setNode } from '../prel/struct.js'

/**
 * Propagation result
 */
export interface PropagationResult {
  readonly prel: PREL
  readonly quiescent: boolean
  readonly round: number
  readonly updatedNodes: readonly string[]
}

/**
 * Propagate changes through the network until quiescence
 *
 * @param prel - Current P-REL structure
 * @param pulses - Initial pulses to propagate
 * @param maxRounds - Maximum number of propagation rounds
 * @param nodeResolver - Node resolver function
 * @param relationResolver - Relation resolver function
 * @returns Propagation result with updated P-REL and quiescence status
 */
export function propagate(
  prel: PREL,
  pulses: readonly Pulse[],
  maxRounds: number = 100,
  nodeResolver: NodeResolver = defaultNodeResolver,
  relationResolver: RelationResolver = defaultRelationResolver,
): PropagationResult {
  let currentPrel = prel
  let round = 0
  let updatedNodes = new Set<string>()

  // Track which nodes were updated by initial pulses
  for (const pulse of pulses) {
    if (pulse.length >= 3 && Array.isArray(pulse[2]) && typeof pulse[2][0] === 'string') {
      // Assume ObservePulse format for path extraction
      const path = pulse[2][0] as string
      updatedNodes.add(path)
    }
  }

  while (round < maxRounds) {
    const roundStartPrel = currentPrel
    const roundUpdatedNodes = new Set<string>()

    // Selection phase: Find all links where src-selector matches updated nodes
    const linksToExecute: Link[] = []

    for (const link of currentPrel.links) {
      // Check if source selector matches any updated node
      const srcMatches = resolveSelector(link.srcSelector, currentPrel, nodeResolver)

      if (srcMatches.length > 0) {
        // Check if any source match corresponds to an updated node
        let shouldExecute = false
        for (const srcNode of srcMatches) {
          // Find node ID for this RealNode (simplified - would need reverse lookup)
          for (const [nodeId, node] of currentPrel.nodes) {
            if (node.asOf === srcNode.asOf && matchSelector(link.srcSelector, nodeId, node)) {
              if (updatedNodes.has(nodeId)) {
                shouldExecute = true
                break
              }
            }
          }
          if (shouldExecute)
            break
        }

        if (shouldExecute)
          linksToExecute.push(link)
      }
    }

    // Reconciliation phase: Execute all matched relations
    for (const link of linksToExecute) {
      try {
        // Resolve source and target nodes
        const srcNodes = resolveSelector(link.srcSelector, currentPrel, nodeResolver)
        const tgtNodes = resolveSelector(link.tgtSelector, currentPrel, nodeResolver)

        if (srcNodes.length === 0 || tgtNodes.length === 0)
          continue

        // For simplicity, handle 1→1 links
        // Multi-source links would require Gather Links
        const srcNode = srcNodes[0]
        const tgtNode = tgtNodes[0]

        // Resolve relation
        const relation = relationResolver(link.relationId, currentPrel)

        // Execute relation
        const [srcValue, tgtValue, updatedMeta] = solveRelation(
          srcNode,
          tgtNode,
          relation as import('../resolvers/relation.js').LinkRelation,
          link.meta,
        )

        // Compute new timestamp by incrementing round from target node's current timestamp
        // This ensures each node has its own timestamp progression
        const newT = incrementRound(tgtNode.asOf, maxRounds)

        // Critical monotonicity check: only update if T_new > T_current
        // This is the fundamental guarantee of RaCSTS - nodes only advance forward in time
        if (!isTGreaterThan(newT, tgtNode.asOf)) {
          // Timestamp didn't advance - skip this update
          continue
        }

        // Update target node if value changed
        // Find target node ID
        for (const [nodeId, node] of currentPrel.nodes) {
          if (node.asOf === tgtNode.asOf) {
            const newTgtNode = applyRelationResult(
              tgtNode,
              tgtValue,
              newT,
            )

            // Only update if value actually changed (checked in applyRelationResult)
            if (wouldUpdateNode(tgtNode, tgtValue)) {
              currentPrel = setNode(currentPrel, nodeId, {
                value: tgtValue as typeof node.value,
                asOf: newTgtNode.asOf,
                lineage: newTgtNode.state,
                meta: updatedMeta || node.meta,
              })

              roundUpdatedNodes.add(nodeId)
            }
            break
          }
        }
      }
      catch (error) {
        // Log error but continue propagation
        console.warn(`Error executing link ${link.relationId}:`, error)
      }
    }

    // Check for quiescence
    if (roundUpdatedNodes.size === 0) {
      // No nodes updated this round: quiescence reached
      return {
        prel: currentPrel,
        quiescent: true,
        round,
        updatedNodes: Array.from(updatedNodes),
      }
    }

    // Update tracking for next round
    updatedNodes = roundUpdatedNodes
    round++
  }

  // MaxRounds reached without quiescence
  return {
    prel: currentPrel,
    quiescent: false,
    round,
    updatedNodes: Array.from(updatedNodes),
  }
}