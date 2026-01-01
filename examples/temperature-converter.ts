/**
 * Bidirectional Temperature Converter Example
 *
 * Demonstrates the linear relation for Celsius ↔ Fahrenheit conversion.
 * Shows Observe operations, propagation, and serialization.
 *
 * Conversion formula: F = 32 + (9/5) * C
 * In linear form: y = a + bx where a = 32, b = 9/5 = 1.8
 */

import { Map, List } from '../src/_/immutable.js'
import type { PREL } from '../src/prel/types.js'
import { createPREL, createNode, createLink } from '../src/prel/struct.js'
import { linear } from '../src/relations/standard/linear.js'
import { createInitialT } from '../src/timestamp/clock.js'

/**
 * Create a temperature conversion network
 */
export function createTemperatureNetwork(): PREL {
  const t0 = createInitialT(0, 100)

  // Create linear relation: F = 32 + 1.8 * C
  const tempRelation = linear(32, 1.8)

  // Create P-REL
  const prel = createPREL(t0)

  // Add nodes: celsius and fahrenheit
  const celsiusNode = createNode(
    { temperature: [['celsius', 25]] } as typeof prel.nodes extends Map<string, infer N> ? N['value'] : never,
    t0,
    'observed',
  )

  const fahrenheitNode = createNode(
    { temperature: [['fahrenheit', 77]] } as typeof prel.nodes extends Map<string, infer N> ? N['value'] : never,
    t0,
    'derived',
  )

  // Add nodes to P-REL
  let updatedPrel = prel
  updatedPrel = {
    ...updatedPrel,
    nodes: updatedPrel.nodes.set('celsius', celsiusNode).set('fahrenheit', fahrenheitNode),
  }

  // Add relation
  updatedPrel = {
    ...updatedPrel,
    relations: updatedPrel.relations.set('temp', tempRelation),
  }

  // Add link connecting celsius to fahrenheit
  const link = createLink(
    'node:celsius',
    'node:fahrenheit',
    'temp',
    [],
    {},
    'celsius-to-fahrenheit',
  )

  updatedPrel = {
    ...updatedPrel,
    links: updatedPrel.links.push(link),
  }

  return updatedPrel
}

/**
 * Example usage
 */
export function example(): void {
  const network = createTemperatureNetwork()

  console.log('Temperature Network Created:')
  console.log('Celsius node:', network.nodes.get('celsius'))
  console.log('Fahrenheit node:', network.nodes.get('fahrenheit'))
  console.log('Link:', network.links.get(0))
}