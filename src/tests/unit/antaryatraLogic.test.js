import { vi } from 'vitest'
import {
  getReflectionWindow,
  isWindowOpen,
  isWindowExpired,
  isReflectionDay,
  getEffectiveStatus,
  shouldShowReminder,
  canRecord,
  getYearStats,
  getLocalDateString,
  getTimezone
} from '../../logic/antaryatraLogic'

describe('getReflectionWindow', () => {
  it('opens on Dec 31 of the given year', () => {
    const { opens } = getReflectionWindow(2024)
    expect(opens.getFullYear()).toBe(2024)
    expect(opens.getMonth()).toBe(11) // December
    expect(opens.getDate()).toBe(31)
  })

  it('closes on Jan 13 of the following year', () => {
    const { closes } = getReflectionWindow(2024)
    expect(closes.getFullYear()).toBe(2025)
    expect(closes.getMonth()).toBe(0) // January
    expect(closes.getDate()).toBe(13)
  })
})

describe('isWindowOpen', () => {
  afterEach(() => vi.useRealTimers())

  it('returns true on Dec 31', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 11, 31, 12, 0, 0))
    expect(isWindowOpen(2024)).toBe(true)
  })

  it('returns true on Jan 5 within window', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 5, 12, 0, 0))
    expect(isWindowOpen(2024)).toBe(true)
  })

  it('returns true on Jan 13 (last day)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 13, 23, 0, 0))
    expect(isWindowOpen(2024)).toBe(true)
  })

  it('returns false on Jan 14 (expired)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 14, 0, 0, 0))
    expect(isWindowOpen(2024)).toBe(false)
  })

  it('returns false before Dec 31', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 11, 30, 23, 59, 0))
    expect(isWindowOpen(2024)).toBe(false)
  })
})

describe('isWindowExpired', () => {
  afterEach(() => vi.useRealTimers())

  it('returns false during the window', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 5, 12, 0, 0))
    expect(isWindowExpired(2024)).toBe(false)
  })

  it('returns true after Jan 13', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 14, 0, 0, 1))
    expect(isWindowExpired(2024)).toBe(true)
  })
})

describe('isReflectionDay', () => {
  afterEach(() => vi.useRealTimers())

  it('returns true on Dec 31 of the year', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 11, 31, 10, 0, 0))
    expect(isReflectionDay(2024)).toBe(true)
  })

  it('returns false on any other day', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 11, 30, 10, 0, 0))
    expect(isReflectionDay(2024)).toBe(false)
  })
})

describe('getEffectiveStatus', () => {
  afterEach(() => vi.useRealTimers())

  it('returns expired for null record after window closes', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 14, 0, 0, 1))
    expect(getEffectiveStatus(null, 2024)).toBe('expired')
  })

  it('returns pending for null record during window', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 11, 31, 12, 0, 0))
    expect(getEffectiveStatus(null, 2024)).toBe('pending')
  })

  it('returns recorded regardless of window', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 5, 1))
    expect(getEffectiveStatus({ status: 'recorded' }, 2024)).toBe('recorded')
  })

  it('returns skipped regardless of window', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 5, 1))
    expect(getEffectiveStatus({ status: 'skipped' }, 2024)).toBe('skipped')
  })
})

describe('shouldShowReminder', () => {
  afterEach(() => vi.useRealTimers())

  it('returns true during window with pending record', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 11, 31, 12, 0, 0))
    expect(shouldShowReminder(null, 2024)).toBe(true)
  })

  it('returns false if already recorded', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 11, 31, 12, 0, 0))
    expect(shouldShowReminder({ status: 'recorded' }, 2024)).toBe(false)
  })

  it('returns false if already skipped', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 11, 31, 12, 0, 0))
    expect(shouldShowReminder({ status: 'skipped' }, 2024)).toBe(false)
  })

  it('returns false after window expires', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 14, 1, 0, 0))
    expect(shouldShowReminder(null, 2024)).toBe(false)
  })
})

describe('getYearStats', () => {
  const entries = [
    { date: '2024-01-01', count: 10000 },
    { date: '2024-01-02', count: 20000 },
    { date: '2024-01-03', count: 0 },    // should not count
    { date: '2023-12-31', count: 15000 }, // different year
  ]

  it('counts only days with count > 0', () => {
    const { daysOfPractice } = getYearStats(entries, 2024)
    expect(daysOfPractice).toBe(2)
  })

  it('calculates correct average', () => {
    const { averagePerDay } = getYearStats(entries, 2024)
    expect(averagePerDay).toBe(15000)
  })

  it('returns zeros for a year with no entries', () => {
    const { daysOfPractice, averagePerDay } = getYearStats(entries, 2022)
    expect(daysOfPractice).toBe(0)
    expect(averagePerDay).toBe(0)
  })
})

// ── BEH-062: getEffectiveStatus — pending record + expired window ─────────────

describe('getEffectiveStatus — BEH-062', () => {
  afterEach(() => vi.useRealTimers())

  it('BEH-062 | returns "expired" when DB record has status="pending" and window has closed (Jan 14)', () => {
    vi.useFakeTimers()
    // Jan 14 of year+1 — window closed on Jan 13 23:59:59
    vi.setSystemTime(new Date(2025, 0, 14, 1, 0, 0))
    const record = { status: 'pending' }
    expect(getEffectiveStatus(record, 2024)).toBe('expired')
  })
})

// ── BEH-067/068/069: canRecord ────────────────────────────────────────────────

describe('canRecord — BEH-067/068/069', () => {
  afterEach(() => vi.useRealTimers())

  it('BEH-067 | returns true when window is open and record is null (Dec 31)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 11, 31, 12, 0, 0)) // Dec 31 2025
    expect(canRecord(null, 2025)).toBe(true)
  })

  it('BEH-068 | returns false when window is closed (Jan 14 of year+1)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 14, 1, 0, 0)) // Jan 14 2026
    expect(canRecord(null, 2025)).toBe(false)
  })

  it('BEH-069 | returns false when record status is "recorded"', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 11, 31, 12, 0, 0)) // inside window
    expect(canRecord({ status: 'recorded' }, 2025)).toBe(false)
  })

  it('BEH-069 | returns false when record status is "skipped"', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 11, 31, 12, 0, 0)) // inside window
    expect(canRecord({ status: 'skipped' }, 2025)).toBe(false)
  })
})

// ── BEH-070: getLocalDateString ───────────────────────────────────────────────

describe('getLocalDateString — BEH-070', () => {
  it('BEH-070 | returns today as a YYYY-MM-DD string', () => {
    const result = getLocalDateString()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

// ── BEH-071: getTimezone ──────────────────────────────────────────────────────

describe('getTimezone — BEH-071', () => {
  it('BEH-071 | returns a non-empty string (IANA timezone or "UTC")', () => {
    const result = getTimezone()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

// ── BEH-075: getYearStats — explicitly excludes entries from other years ──────

describe('getYearStats — BEH-075', () => {
  it('BEH-075 | daysOfPractice and totalCount only count entries for the requested year', () => {
    const entries = [
      ...Array.from({ length: 5 }, (_, i) => ({
        date: `2023-0${i + 1}-15`,
        count: 100000
      })),
      ...Array.from({ length: 3 }, (_, i) => ({
        date: `2024-0${i + 1}-15`,
        count: 50000
      }))
    ]

    const stats2024 = getYearStats(entries, 2024)
    expect(stats2024.daysOfPractice).toBe(3)

    // Verify total via averagePerDay (total = averagePerDay * daysOfPractice)
    // 3 entries × 50000 = 150000, avg = 50000
    expect(stats2024.averagePerDay).toBe(50000)
    // daysOfPractice must NOT be 8 (all entries combined)
    expect(stats2024.daysOfPractice).not.toBe(8)
  })
})