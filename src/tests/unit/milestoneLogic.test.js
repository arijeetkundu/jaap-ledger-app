import {
  getCurrentMilestone,
  getMilestoneProgress,
  getMilestoneHistory,
  predictNextMilestone,
  predictNextMilestoneYTD
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

// ── BEH-012: getMilestoneHistory — single entry crossing multiple crores ─────

describe('getMilestoneHistory — BEH-012', () => {

  it('BEH-012 | single entry with count=25,000,000 produces 2 history records with correct fields', () => {
    const entries = [
      { date: '2024-06-15', count: 25000000 }
    ]
    const history = getMilestoneHistory(entries)

    expect(history).toHaveLength(2)

    // First milestone (crore=1): no previous, so daysSincePrevious is null
    expect(history[0].crore).toBe(1)
    expect(history[0].date).toBe('2024-06-15')
    expect(history[0].daysSincePrevious).toBeNull()

    // Second milestone (crore=2): same date as crore=1, so daysSincePrevious=0
    expect(history[1].crore).toBe(2)
    expect(history[1].date).toBe('2024-06-15')
    expect(history[1].daysSincePrevious).toBe(0)
  })

})

// ── BEH-014: predictNextMilestone — returns null when entries is null ─────────

describe('predictNextMilestone — BEH-014', () => {

  it('BEH-014 | returns null without throwing when entries argument is null', () => {
    expect(() => predictNextMilestone(0, null)).not.toThrow()
    expect(predictNextMilestone(0, null)).toBeNull()
  })

})

// ── BEH-018: predictNextMilestone — predictedDate is YYYY-MM-DD string ───────

describe('predictNextMilestone — BEH-018', () => {

  it('BEH-018 | predictedDate matches YYYY-MM-DD format and does not contain T', () => {
    const entries = Array.from({ length: 30 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      count: 50000
    }))
    const result = predictNextMilestone(0, entries)
    expect(result).not.toBeNull()
    expect(result.predictedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(result.predictedDate).not.toContain('T')
  })

})

// ── BEH-025: predictNextMilestoneYTD — returns null when entries is null ─────

describe('predictNextMilestoneYTD — BEH-025', () => {

  it('BEH-025 | returns null when entries argument is null', () => {
    expect(() => predictNextMilestoneYTD(0, null, 2026)).not.toThrow()
    expect(predictNextMilestoneYTD(0, null, 2026)).toBeNull()
  })

})

// ── RP-035: predictNextMilestoneYTD ─────────────────────────────────────────
// These 6 tests define the contract for the new function.
// All will fail (Red) until predictNextMilestoneYTD is implemented.

describe('predictNextMilestoneYTD', () => {

  const YEAR = 2026

  it('RP-035 T1 | should return null when there are no current-year entries', () => {
    // 30 prior-year entries — none in 2026
    const entries = Array.from({ length: 30 }, (_, i) => ({
      date: `2025-01-${String(i + 1).padStart(2, '0')}`,
      count: 50000
    }))
    expect(predictNextMilestoneYTD(9000000, entries, YEAR)).toBeNull()
  })

  it('RP-035 T2 | should return null when fewer than 30 non-zero entries exist in current year (29 entries)', () => {
    const entries = Array.from({ length: 29 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      count: 50000
    }))
    expect(predictNextMilestoneYTD(9000000, entries, YEAR)).toBeNull()
  })

  it('RP-035 T3 | should return a result when exactly 30 non-zero entries exist in current year', () => {
    const entries = Array.from({ length: 30 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      count: 50000
    }))
    expect(predictNextMilestoneYTD(9000000, entries, YEAR)).not.toBeNull()
  })

  it('RP-035 T4 | should continue returning a result when 31 entries exist — threshold is a floor not exact', () => {
    const entries = Array.from({ length: 31 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      count: 50000
    }))
    expect(predictNextMilestoneYTD(9000000, entries, YEAR)).not.toBeNull()
  })

  it('RP-035 T5 | should calculate YTD average as total ÷ non-zero entry count (Method B)', () => {
    // 30 entries × 51,200 = 1,536,000 ÷ 30 = 51,200/day exactly
    const entries = Array.from({ length: 30 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      count: 51200
    }))
    const result = predictNextMilestoneYTD(9000000, entries, YEAR)
    expect(result.averagePerDay).toBe(51200)
  })

  it('RP-035 T6 | should exclude prior-year entries from the YTD average', () => {
    // 30 prior-year entries × 100,000 + 30 current-year entries × 50,000
    // YTD avg must be 50,000 — NOT 75,000 (blended) and NOT 100,000 (prior year pace)
    const priorYear = Array.from({ length: 30 }, (_, i) => ({
      date: `2025-01-${String(i + 1).padStart(2, '0')}`,
      count: 100000
    }))
    const currentYear = Array.from({ length: 30 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      count: 50000
    }))
    const result = predictNextMilestoneYTD(11500000, [...priorYear, ...currentYear], YEAR)
    expect(result.averagePerDay).toBe(50000)
  })

})