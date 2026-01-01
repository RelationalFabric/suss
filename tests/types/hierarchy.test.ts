import { describe, it, expect } from 'vitest'
import { isCAnATL, isValue, isTL, isAnTL, isAnATL, isATL } from '../../src/types/hierarchy.js'
import type { CAnATL, Value, TL, AnTL, AnATL, ATL } from '../../src/types/hierarchy.js'

describe('Type Hierarchy', () => {
  describe('TL (Tagged Literal)', () => {
    it('should identify valid TL', () => {
      const tl: TL = ['temperature', 72.5] as const
      expect(isTL(tl)).toBe(true)
    })

    it('should reject invalid TL', () => {
      expect(isTL(['tag'])).toBe(false)
      expect(isTL(['tag', 'value', 'extra'])).toBe(false)
    })
  })

  describe('AnTL (Annotated Tagged Literal)', () => {
    it('should identify valid AnTL', () => {
      const antl: AnTL = ['count', 42, { unit: 'items' }] as const
      expect(isAnTL(antl)).toBe(true)
    })
  })

  describe('CAnATL (Causal Annotated Associative Tagged Literal)', () => {
    it('should identify valid CAnATL', () => {
      const canatl: CAnATL = [
        [0, Date.now(), 0],
        'value',
        [['value', 42], {}] as const,
      ] as const

      expect(isCAnATL(canatl)).toBe(true)
    })
  })
})