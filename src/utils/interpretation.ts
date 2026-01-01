/**
 * Interpretation utilities
 *
 * Interpretation functions project a CAnATL through an interpretation function
 * to materialize a Value. Each cell is an "Interpretation VM"—it processes
 * operations through its interpretation to produce its current value.
 */

import type { CAnATL, Value, Tag } from '../types/hierarchy.js'

/**
 * Interpreter function type
 */
export type Interpreter = (canatl: CAnATL) => Value

/**
 * Default interpreter: extracts Value from CAnATL
 *
 * The default interpretation simply returns the Value component (third element)
 * of the CAnATL structure.
 *
 * @param canatl - CAnATL to interpret
 * @returns Materialized Value
 */
export function defaultInterpreter(canatl: CAnATL): Value {
  return canatl[2]
}

/**
 * Create a tag-based interpreter with custom dispatch logic
 *
 * @param dispatch - Map of tags to interpreter functions
 * @param fallback - Fallback interpreter (defaults to defaultInterpreter)
 * @returns Interpreter function that dispatches based on tag
 */
export function createInterpreter(
  dispatch: Record<Tag, (canatl: CAnATL) => Value>,
  fallback: Interpreter = defaultInterpreter,
): Interpreter {
  return (canatl: CAnATL) => {
    const tag = canatl[1]
    const interpreter = dispatch[tag] ?? fallback
    return interpreter(canatl)
  }
}

/**
 * Materialize a Value from a CAnATL using an interpreter
 *
 * @param canatl - CAnATL to materialize
 * @param interpreter - Interpreter function (defaults to defaultInterpreter)
 * @returns Materialized Value
 */
export function materialize(
  canatl: CAnATL,
  interpreter: Interpreter = defaultInterpreter,
): Value {
  return interpreter(canatl)
}