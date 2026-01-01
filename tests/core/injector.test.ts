import { describe, it, expect } from 'vitest'
import { addPulse, canAddPulse } from '../../src/core/injector.js'
import { createT } from '../../src/timestamp/clock.js'
import type { Pulse } from '../../src/types/entities.js'

describe('Monotonic Injector', () => {
  it('should add pulse to empty change set', () => {
    const pulse: Pulse = [
      createT(0, Date.now(), 0, 0, 100),
      'test',
      [],
    ] as const

    const result = addPulse([], pulse)
    expect(result.length).toBe(1)
    expect(result[0]).toBe(pulse)
  })

  it('should maintain T-ordering when adding pulses', () => {
    const t1 = createT(0, Date.now(), 0, 0, 100)
    const t2 = createT(0, Date.now(), 1, 0, 100)

    const pulse1: Pulse = [t1, 'test1', []] as const
    const pulse2: Pulse = [t2, 'test2', []] as const

    const result = addPulse([pulse1], pulse2)
    expect(result[0][0]).toBe(t1)
    expect(result[1][0]).toBe(t2)
  })

  it('should check if pulse can be added', () => {
    const t1 = createT(0, Date.now(), 0, 0, 100)
    const t2 = createT(0, Date.now(), 1, 0, 100)

    const pulse1: Pulse = [t1, 'test1', []] as const
    const pulse2: Pulse = [t2, 'test2', []] as const

    expect(canAddPulse([pulse1], pulse2)).toBe(true)
    expect(canAddPulse([pulse2], pulse1)).toBe(false)
  })
})