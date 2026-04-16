import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  isSunday,
  wasReminderShownToday,
  markReminderShownToday,
  shouldShowBackupReminder
} from '../../logic/backupReminder'

// Mock getLocalToday so we control what "today" is in tests
vi.mock('../../logic/ledgerLogic', () => ({
  getLocalToday: vi.fn()
}))

import { getLocalToday } from '../../logic/ledgerLogic'

// ── BEH-BR-001: isSunday ─────────────────────────────────────────────────────

describe('isSunday — BEH-BR-001', () => {

  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('BEH-BR-001a | returns true when today is a Sunday', () => {
    getLocalToday.mockReturnValue('2026-04-19') // known Sunday
    expect(isSunday()).toBe(true)
  })

  it('BEH-BR-001b | returns false when today is a Monday', () => {
    getLocalToday.mockReturnValue('2026-04-20') // Monday
    expect(isSunday()).toBe(false)
  })

  it('BEH-BR-001c | returns false when today is a Thursday', () => {
    getLocalToday.mockReturnValue('2026-04-16') // Thursday
    expect(isSunday()).toBe(false)
  })

  it('BEH-BR-001d | returns false when today is a Saturday', () => {
    getLocalToday.mockReturnValue('2026-04-18') // Saturday
    expect(isSunday()).toBe(false)
  })

})

// ── BEH-BR-002: wasReminderShownToday ────────────────────────────────────────

describe('wasReminderShownToday — BEH-BR-002', () => {

  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('BEH-BR-002a | returns false when reminder has never been shown', () => {
    getLocalToday.mockReturnValue('2026-04-19')
    expect(wasReminderShownToday()).toBe(false)
  })

  it('BEH-BR-002b | returns true when reminder was already shown today', () => {
    getLocalToday.mockReturnValue('2026-04-19')
    localStorage.setItem('backupReminderLastShown', '2026-04-19')
    expect(wasReminderShownToday()).toBe(true)
  })

  it('BEH-BR-002c | returns false when reminder was shown on a previous day', () => {
    getLocalToday.mockReturnValue('2026-04-19')
    localStorage.setItem('backupReminderLastShown', '2026-04-12') // last Sunday
    expect(wasReminderShownToday()).toBe(false)
  })

})

// ── BEH-BR-003: markReminderShownToday ───────────────────────────────────────

describe('markReminderShownToday — BEH-BR-003', () => {

  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('BEH-BR-003 | stores today\'s date in localStorage', () => {
    getLocalToday.mockReturnValue('2026-04-19')
    markReminderShownToday()
    expect(localStorage.getItem('backupReminderLastShown')).toBe('2026-04-19')
  })

})

// ── BEH-BR-004: shouldShowBackupReminder ─────────────────────────────────────

describe('shouldShowBackupReminder — BEH-BR-004', () => {

  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('BEH-BR-004a | returns true on Sunday when reminder not yet shown today', () => {
    getLocalToday.mockReturnValue('2026-04-19') // Sunday
    expect(shouldShowBackupReminder()).toBe(true)
  })

  it('BEH-BR-004b | returns false on Sunday when reminder already shown today', () => {
    getLocalToday.mockReturnValue('2026-04-19') // Sunday
    localStorage.setItem('backupReminderLastShown', '2026-04-19')
    expect(shouldShowBackupReminder()).toBe(false)
  })

  it('BEH-BR-004c | returns false on a weekday even if reminder not shown', () => {
    getLocalToday.mockReturnValue('2026-04-16') // Thursday
    expect(shouldShowBackupReminder()).toBe(false)
  })

  it('BEH-BR-004d | returns false on Saturday even if reminder not shown', () => {
    getLocalToday.mockReturnValue('2026-04-18') // Saturday
    expect(shouldShowBackupReminder()).toBe(false)
  })

  it('BEH-BR-004e | returns true again the following Sunday after prior dismissal', () => {
    getLocalToday.mockReturnValue('2026-04-19') // Sunday
    localStorage.setItem('backupReminderLastShown', '2026-04-12') // last Sunday
    expect(shouldShowBackupReminder()).toBe(true)
  })

})
