import { describe, it, expect, beforeEach } from 'vitest'
import {
  fillMissingDates,
  isSunday,
  groupEntriesByYear
} from '../../logic/ledgerLogic'
import {
  fillMissingDates,
  isSunday,
  groupEntriesByYear,
  getLocalToday
} from '../../logic/ledgerLogic'

// Helper to get a date string N days ago from a reference date
function daysAgo(n, from = '2026-02-27') {
  const date = new Date(from)
  date.setDate(date.getDate() - n)
  return date.toISOString().split('T')[0]
}

describe('isSunday', () => {

  it('should return true for a known Sunday', () => {
    expect(isSunday('2026-02-22')).toBe(true) // Feb 22 2026 is a Sunday
  })

  it('should return false for a known Monday', () => {
    expect(isSunday('2026-02-23')).toBe(false) // Feb 23 2026 is a Monday
  })

  it('should return false for a Saturday', () => {
    expect(isSunday('2026-02-28')).toBe(false) // Feb 28 2026 is a Saturday
  })

})

describe('fillMissingDates', () => {

  it('should always include today even if no entries exist', () => {
    const today = '2026-02-27'
    const result = fillMissingDates([], today)
    const dates = result.map(e => e.date)
    expect(dates).toContain(today)
  })

  it('should fill in missing days within last 7 days', () => {
    const today = '2026-02-27'
    const entries = [
      { date: '2026-02-27', count: 65000, notes: '' },
      { date: '2026-02-24', count: 70000, notes: '' },
    ]
    const result = fillMissingDates(entries, today)
    const dates = result.map(e => e.date)

    // Missing days within 7 days should be filled
    expect(dates).toContain('2026-02-26') // missing → should appear
    expect(dates).toContain('2026-02-25') // missing → should appear
  })

  it('should not fill dates older than 7 days', () => {
    const today = '2026-02-27'
    const entries = [
      { date: '2026-02-27', count: 65000, notes: '' },
    ]
    const result = fillMissingDates(entries, today)
    const dates = result.map(e => e.date)

    // Older than 7 days should NOT be auto-filled
    expect(dates).not.toContain('2026-02-19')
    expect(dates).not.toContain('2026-02-18')
  })

  it('should mark filled dates as empty with zero count', () => {
    const today = '2026-02-27'
    const entries = [
      { date: '2026-02-27', count: 65000, notes: '' },
    ]
    const result = fillMissingDates(entries, today)
    const missingDay = result.find(e => e.date === '2026-02-26')

    expect(missingDay).toBeDefined()
    expect(missingDay.count).toBe(0)
    expect(missingDay.notes).toBe('')
    expect(missingDay.isEmpty).toBe(true)
  })

  it('should preserve existing entry data', () => {
    const today = '2026-02-27'
    const entries = [
      { date: '2026-02-27', count: 65000, notes: 'Good session' },
    ]
    const result = fillMissingDates(entries, today)
    const todayEntry = result.find(e => e.date === today)

    expect(todayEntry.count).toBe(65000)
    expect(todayEntry.notes).toBe('Good session')
    expect(todayEntry.isEmpty).toBe(false)
  })

  it('should return entries in descending date order', () => {
    const today = '2026-02-27'
    const entries = [
      { date: '2026-02-24', count: 70000, notes: '' },
      { date: '2026-02-27', count: 65000, notes: '' },
    ]
    const result = fillMissingDates(entries, today)
    const dates = result.map(e => e.date)

// Should be newest first
    expect(dates[0]).toBe('2026-02-27')
// String comparison works for ISO dates (YYYY-MM-DD) - later dates are alphabetically greater
    expect(dates[dates.length - 1] <= dates[0]).toBe(true)
  })

})

describe('groupEntriesByYear', () => {

  it('should group entries by year correctly', () => {
    const entries = [
      { date: '2026-02-27', count: 65000, notes: '' },
      { date: '2026-01-15', count: 70000, notes: '' },
      { date: '2025-12-31', count: 60000, notes: '' },
      { date: '2025-06-01', count: 55000, notes: '' },
    ]
    const result = groupEntriesByYear(entries)

    expect(result).toHaveLength(2)
    expect(result[0].year).toBe(2026)
    expect(result[1].year).toBe(2025)
  })

  it('should calculate yearly cumulative total correctly', () => {
    const entries = [
      { date: '2026-02-27', count: 65000, notes: '' },
      { date: '2026-01-15', count: 70000, notes: '' },
      { date: '2025-12-31', count: 60000, notes: '' },
    ]
    const result = groupEntriesByYear(entries)

    expect(result[0].yearTotal).toBe(135000) // 65000 + 70000
    expect(result[1].yearTotal).toBe(60000)
  })

  it('should place entries under the correct year', () => {
    const entries = [
      { date: '2026-02-27', count: 65000, notes: '' },
      { date: '2025-12-31', count: 60000, notes: '' },
    ]
    const result = groupEntriesByYear(entries)

    expect(result[0].entries).toHaveLength(1)
    expect(result[0].entries[0].date).toBe('2026-02-27')
    expect(result[1].entries[0].date).toBe('2025-12-31')
  })

  it('should return years in descending order', () => {
    const entries = [
      { date: '2024-06-01', count: 50000, notes: '' },
      { date: '2026-02-27', count: 65000, notes: '' },
      { date: '2025-12-31', count: 60000, notes: '' },
    ]
    const result = groupEntriesByYear(entries)

    expect(result[0].year).toBe(2026)
    expect(result[1].year).toBe(2025)
    expect(result[2].year).toBe(2024)
  })

describe('getLocalToday', () => {
  it('should return a valid YYYY-MM-DD date string', () => {
    const today = getLocalToday()
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('should return todays local date', () => {
    const today = getLocalToday()
    const now = new Date()
    expect(today.startsWith(String(now.getFullYear()))).toBe(true)
  })
})

})