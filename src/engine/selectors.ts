/**
 * Selector Resolution
 *
 * Parses and matches selector syntax.
 * Supports wildcards (node:sensor:*), metadata constraints (node:meta.dirty),
 * template variables ({{id}}), and pattern-based link expansion.
 */

import type { PREL, Node } from '../prel/types.js'
import type { RealNode } from '../prel/types.js'
import { defaultNodeResolver, type NodeResolver } from '../resolvers/node.js'

/**
 * Parsed selector AST
 */
export interface SelectorAST {
  readonly type: 'node' | 'link' | 'rel'
  readonly pattern: string
  readonly isWildcard: boolean
  readonly constraints?: readonly Constraint[]
}

/**
 * Constraint from selector
 */
export interface Constraint {
  readonly type: 'meta' | 'equality' | 'wildcard'
  readonly path?: string
  readonly value?: string
}

/**
 * Parse a selector string into an AST
 *
 * Selector format: `type:pattern` where type is `node`, `link`, or `rel`
 * Pattern can be exact ID, wildcard (`*`), or constraint expression
 *
 * @param selector - Selector string
 * @returns Parsed selector AST
 */
export function parseSelector(selector: string): SelectorAST {
  const [typeStr, ...patternParts] = selector.split(':')
  const pattern = patternParts.join(':')

  const type = typeStr as 'node' | 'link' | 'rel'
  if (type !== 'node' && type !== 'link' && type !== 'rel')
    throw new Error(`Invalid selector type: ${typeStr}`)

  const isWildcard = pattern.includes('*')

  // Parse constraints
  const constraints = parseConstraints(pattern)

  return {
    type,
    pattern,
    isWildcard,
    constraints: constraints.length > 0 ? constraints : undefined,
  }
}

/**
 * Parse constraints from a pattern
 */
function parseConstraints(pattern: string): Constraint[] {
  const constraints: Constraint[] = []

  // Check for wildcard
  if (pattern.includes('*')) {
    constraints.push({ type: 'wildcard' })
  }

  // Check for metadata path (e.g., meta.dirty)
  if (pattern.includes('meta.')) {
    const metaMatch = pattern.match(/meta\.([\w]+)/)
    if (metaMatch) {
      constraints.push({
        type: 'meta',
        path: metaMatch[1],
      })
    }
  }

  // Check for equality constraint (e.g., type="value")
  const equalityMatch = pattern.match(/(\w+)="([^"]+)"/)
  if (equalityMatch) {
    constraints.push({
      type: 'equality',
      path: equalityMatch[1],
      value: equalityMatch[2],
    })
  }

  return constraints
}

/**
 * Match a selector against a node
 *
 * @param selector - Selector string
 * @param nodeId - Node ID to check
 * @param node - Node to check
 * @returns True if selector matches the node
 */
export function matchSelector(selector: string, nodeId: string, node: Node): boolean {
  const ast = parseSelector(selector)

  if (ast.type !== 'node')
    return false

  // Exact match
  if (!ast.isWildcard && ast.pattern === nodeId)
    return true

  // Wildcard match
  if (ast.isWildcard) {
    const patternPrefix = ast.pattern.replace('*', '')
    if (nodeId.startsWith(patternPrefix))
      return true
  }

  // Constraint matching
  if (ast.constraints) {
    for (const constraint of ast.constraints) {
      if (!matchesConstraint(constraint, nodeId, node))
        return false
    }
    return true
  }

  return false
}

/**
 * Check if a node matches a constraint
 */
function matchesConstraint(constraint: Constraint, nodeId: string, node: Node): boolean {
  switch (constraint.type) {
    case 'wildcard':
      // Already handled in pattern matching
      return true

    case 'meta':
      if (!constraint.path)
        return false
      // Check if node meta has the constraint path
      return constraint.path in node.meta

    case 'equality':
      if (!constraint.path || !constraint.value)
        return false
      // Check if node has property matching constraint
      // This would need more sophisticated checking for nested paths
      return (node.meta as Record<string, unknown>)[constraint.path] === constraint.value

    default:
      return false
  }
}

/**
 * Resolve a selector to matching nodes in P-REL
 *
 * @param selector - Selector string
 * @param prel - P-REL structure
 * @param nodeResolver - Node resolver function
 * @returns Array of RealNodes matching the selector
 */
export function resolveSelector(
  selector: string,
  prel: PREL,
  nodeResolver: NodeResolver = defaultNodeResolver,
): RealNode[] {
  const ast = parseSelector(selector)

  if (ast.type !== 'node')
    throw new Error(`Selector type ${ast.type} not yet supported`)

  const matches: RealNode[] = []

  for (const [nodeId, node] of prel.nodes) {
    if (matchSelector(selector, nodeId, node)) {
      const realNode = nodeResolver(nodeId, prel)
      matches.push(realNode)
    }
  }

  return matches
}

/**
 * Extract template variables from a pattern
 *
 * @param pattern - Pattern string (e.g., "node:real:{{id}}")
 * @returns Map of variable names to extracted values from a match
 */
export function extractTemplateVars(pattern: string, match: string): Record<string, string> {
  const vars: Record<string, string> = {}

  // Simple implementation: extract {{id}} variable
  const idMatch = pattern.match(/\{\{id\}\}/)
  if (idMatch) {
    // Extract ID from match
    // This is simplified - would need proper pattern matching
    const prefix = pattern.split('{{id}}')[0]
    if (match.startsWith(prefix)) {
      vars.id = match.slice(prefix.length)
    }
  }

  return vars
}