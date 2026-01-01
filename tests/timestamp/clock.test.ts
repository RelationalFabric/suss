import { describe, it, expect } from 'vitest'
import {
  createT,
  incrementRound,
  incrementBaseIdx,
  compareT,
  isTGreaterThan,
  createInitialT,
} from '../../src/timestamp/clock.js'

describe('Hybrid Epoch Clock', () => {
  describe('createT', () => {
    it('should create timestamp with fractional Idx', () => {
      const t = createT(5, 1704067200, 42, 3, 100)
      expect(t[0]).toBe(5) // Epoch
      expect(t[1]).toBe(1704067200) // SyncedWall
      expect(t[2]).toBe(42.03) // Idx = 42 + 3/100
    })
  })

  describe('incrementRound', () => {
    it('should increment round in fractional Idx', () => {
      const t = createT(5, 1704067200, 42, 0, 100)
      const t2 = incrementRound(t, 100)
      expect(t2[2]).toBe(42.01)
    })
  })

  describe('incrementBaseIdx', () => {
    it('should increment base index and reset round', () => {
      const t = createT(5, 1704067200, 42, 5, 100)
      const t2 = incrementBaseIdx(t, 100)
      expect(t2[2]).toBe(43.0)
    })
  })

  describe('compareT', () => {
    it('should compare timestamps correctly', () => {
      const t1 = createT(5, 1704067200, 42, 0, 100)
      const t2 = createT(5, 1704067200, 43, 0, 100)

      expect(compareT(t1, t2)).toBe(-1)
      expect(compareT(t2, t1)).toBe(1)
      expect(compareT(t1, t1)).toBe(0)
    })
  })

  describe('isTGreaterThan', () => {
    it('should correctly identify greater timestamps', () => {
      const t1 = createT(5, 1704067200, 42, 0, 100)
      const t2 = createT(5, 1704067200, 43, 0, 100)

      expect(isTGreaterThan(t2, t1)).toBe(true)
      expect(isTGreaterThan(t1, t2)).toBe(false)
    })
  })
})