import { describe, it, expect } from 'vitest'
import {
  getCurrentMilestone,
  getMilestoneProgress,
  getMilestoneHistory,
  predictNextMilestone
} from '../../logic/milestoneLogic'

// 1 Crore = 10,000,000
const CRORE = 10000000

describe('getCurrentMilestone', () => {

  it('should return 1 Crore as next milestone when total is 0', () => {
    expect(getCurrentMilestone(0)).toEqual({
      current: 0,
      next: 1,
      nextTotal: CRORE
    })
  })

  it('should return correct milestone bracket mid-crore', () => {
    expect(getCurrentMilestone(55152389)).toEqual({
      current: 5,
      next: 6,
      nextTotal: 6 * CRORE
    })
  })

  it('should return correct milestone when exactly on a crore', () => {
    expect(getCurrentMilestone(CRORE)).toEqual({
      current: 1,
      next: 2,
      nextTotal: 2 * CRORE
    })
  })

  it('should handle large totals correctly', () => {
    expect(getCurrentMilestone(32500000)).toEqual({
      current: 3,
      next: 4,
      nextTotal: 4 * CRORE
    })
  })

})

describe('getMilestoneProgress', () => {

  it('should return 0% when total is 0', () => {
    expect(getMilestoneProgress(0)).toBe(0)
  })

  it('should return 50% when halfway through a crore', () => {
    expect(getMilestoneProgress(5000000)).toBe(50)
  })

  it('should return correct % mid-crore', () => {
    // 55,152,389 → 5 crores done, 5,152,389 into 6th crore
    // 5,152,389 / 10,000,000 * 100 = 51.52389%
    expect(getMilestoneProgress(55152389)).toBeCloseTo(51.52, 1)
  })

  it('should return 0% when exactly on a crore boundary', () => {
    expect(getMilestoneProgress(CRORE)).toBe(0)
  })

})

describe('getMilestoneHistory', () => {

  it('should return empty array when no milestones crossed', () => {
    const entries = [
      { date: '2026-01-01', count: 500000 },
      { date: '2026-01-02', count: 500000 },
    ]
    expect(getMilestoneHistory(entries)).toEqual([])
  })

  it('should return first crore milestone with correct date', () => {
    const entries = [
      { date: '2023-01-01', count: 9500000 },
      { date: '2023-01-02', count: 600000 },
      { date: '2023-01-03', count: 500000 },
    ]
    const history = getMilestoneHistory(entries)
    expect(history).toHaveLength(1)
    expect(history[0]).toEqual({
      crore: 1,
      date: '2023-01-02',
      daysSincePrevious: null
    })
  })

it('should return gap days between consecutive milestones', () => {
    const entries = [
      { date: '2023-01-01', count: 9500000 },
      { date: '2023-01-02', count: 600000 }, // crosses 1 crore (total: 10,100,000)
      { date: '2023-06-01', count: 500000 },  // total: 10,600,000
      { date: '2023-06-02', count: 9600000 }, // crosses 2 crore (total: 20,200,000)
    ]
    const history = getMilestoneHistory(entries)
    expect(history).toHaveLength(2)
    expect(history[1].crore).toBe(2)
    expect(history[1].daysSincePrevious).toBeGreaterThan(0)
  })

})

describe('predictNextMilestone', () => {

  it('should return null when there are no entries', () => {
    expect(predictNextMilestone(0, [])).toBeNull()
  })

  it('should predict correctly based on 30-day average', () => {
    // Create 30 entries of 10,000 per day
    const entries = Array.from({ length: 30 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      count: 10000
    }))
    // Total = 300,000. Next milestone = 1 Crore
    // Remaining = 10,000,000 - 300,000 = 9,700,000
    // At 10,000/day = 970 days
    const result = predictNextMilestone(300000, entries)
    expect(result.averagePerDay).toBe(10000)
    expect(result.predictedDate).toBeDefined()
    expect(result.daysRemaining).toBe(970)
  })

  it('should return null when average is zero', () => {
    const entries = Array.from({ length: 30 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      count: 0
    }))
    expect(predictNextMilestone(0, entries)).toBeNull()
  })

})