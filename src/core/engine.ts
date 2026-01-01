/**
 * Execution Engine (Interpretation)
 *
 * Projects a CAnATL through an interpretation function to materialize a Value.
 * The interpretation is the "microcode" of the cell—it defines how the CAnATL
 * structure becomes a concrete value.
 */

import type { CAnATL, Value } from '../types/hierarchy.js'
import { materialize, type Interpreter } from '../utils/interpretation.js'

/**
 * Materialize a Value from a CAnATL through interpretation
 *
 * This is the fundamental way to observe the state of the system.
 * Each cell is an "Interpretation VM"—it processes operations through its
 * interpretation to produce its current value.
 *
 * @param canatl - CAnATL to materialize
 * @param interpreter - Interpreter function (defaults to defaultInterpreter)
 * @returns Materialized Value
 */
export function execute(canatl: CAnATL, interpreter?: Interpreter): Value {
  return materialize(canatl, interpreter)
}

/**
 * Batch materialize multiple CAnATLs
 *
 * @param canatls - Array of CAnATLs to materialize
 * @param interpreter - Interpreter function
 * @returns Array of materialized Values
 */
export function executeMany(
  canatls: readonly CAnATL[],
  interpreter?: Interpreter,
): Value[] {
  return canatls.map(canatl => execute(canatl, interpreter))
}