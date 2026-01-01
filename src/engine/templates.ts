/**
 * Template Links
 *
 * On-demand template expansion with pattern matching and variable substitution.
 * Templates use pattern-based selectors to define propagation rules for entire
 * families of nodes, enabling compact graph representation.
 */

import type { Link } from '../prel/types.js'
import type { PREL } from '../prel/types.js'
import { extractTemplateVars } from './selectors.js'

/**
 * Expand a template link into concrete links
 *
 * Templates use pattern selectors (wildcards, constraints) instead of exact IDs.
 * They expand on-demand when propagation encounters matching nodes.
 *
 * @param template - Template link
 * @param prel - P-REL structure
 * @returns Array of concrete links expanded from template
 */
export function expandTemplate(template: Link, prel: PREL): Link[] {
  const expanded: Link[] = []

  // Parse source selector pattern
  const srcPattern = template.srcSelector
  const tgtPattern = template.tgtSelector

  // Find all nodes matching source pattern
  const srcMatches: string[] = []
  for (const nodeId of prel.nodes.keys()) {
    if (matchesPattern(srcPattern, nodeId)) {
      srcMatches.push(nodeId)
    }
  }

  // For each source match, create a concrete link
  for (const srcId of srcMatches) {
    // Extract template variables
    const vars = extractTemplateVars(tgtPattern, srcId)

    // Substitute variables in target selector
    let tgtSelector = tgtPattern
    for (const [varName, varValue] of Object.entries(vars)) {
      tgtSelector = tgtSelector.replace(`{{${varName}}}`, varValue)
    }

    // If target pattern still has variables or wildcards, expand to matches
    const tgtMatches = prel.nodes.keySeq().filter(id => matchesPattern(tgtSelector, id))

    for (const tgtId of tgtMatches) {
      expanded.push({
        ...template,
        srcSelector: `node:${srcId}`,
        tgtSelector: `node:${tgtId}`,
      })
    }
  }

  return expanded
}

/**
 * Check if a pattern matches a node ID
 *
 * @param pattern - Pattern string (may contain wildcards or template variables)
 * @param nodeId - Node ID to check
 * @returns True if pattern matches
 */
function matchesPattern(pattern: string, nodeId: string): boolean {
  // Remove type prefix if present
  const withoutType = pattern.replace(/^(node|link|rel):/, '')

  // Handle wildcards
  if (withoutType.includes('*')) {
    const prefix = withoutType.replace('*', '')
    return nodeId.startsWith(prefix)
  }

  // Handle template variables (simple case: {{id}})
  if (withoutType.includes('{{id}}')) {
    const prefix = withoutType.split('{{id}}')[0]
    return nodeId.startsWith(prefix)
  }

  // Exact match
  return withoutType === nodeId
}

/**
 * Substitute template variables in a string
 *
 * @param template - Template string with variables like {{id}}, {{field}}
 * @param context - Context object with variable values
 * @returns String with variables substituted
 */
export function substituteVars(template: string, context: Record<string, string>): string {
  let result = template

  for (const [varName, varValue] of Object.entries(context)) {
    result = result.replace(`{{${varName}}}`, varValue)
  }

  return result
}