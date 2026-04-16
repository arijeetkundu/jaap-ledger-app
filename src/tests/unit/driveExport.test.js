import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  isDriveConnected,
  getLastExportDate,
  getDriveUserEmail,
  clearDriveAuth,
  shouldAutoExport
} from '../../logic/driveExport'

// ── Helpers ───────────────────────────────────────────────────────────────────

function setValidToken() {
  localStorage.setItem('driveAccessToken', 'fake-token-abc')
  localStorage.setItem('driveTokenExpiry', String(Date.now() + 3600 * 1000)) // 1 hour from now
}

function setExpiredToken() {
  localStorage.setItem('driveAccessToken', 'expired-token')
  localStorage.setItem('driveTokenExpiry', String(Date.now() - 1000)) // 1 second ago
}

// ── BEH-DR-001: isDriveConnected ─────────────────────────────────────────────

describe('isDriveConnected — BEH-DR-001', () => {

  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('BEH-DR-001a | returns false when no token is stored', () => {
    expect(isDriveConnected()).toBe(false)
  })

  it('BEH-DR-001b | returns true when a valid non-expired token exists', () => {
    setValidToken()
    expect(isDriveConnected()).toBe(true)
  })

  it('BEH-DR-001c | returns false when token is expired', () => {
    setExpiredToken()
    expect(isDriveConnected()).toBe(false)
  })

})

// ── BEH-DR-002: getLastExportDate ────────────────────────────────────────────

describe('getLastExportDate — BEH-DR-002', () => {

  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('BEH-DR-002a | returns null when no export has been recorded', () => {
    expect(getLastExportDate()).toBeNull()
  })

  it('BEH-DR-002b | returns the stored ISO date string', () => {
    const date = '2026-04-10T08:00:00.000Z'
    localStorage.setItem('driveLastExportDate', date)
    expect(getLastExportDate()).toBe(date)
  })

})

// ── BEH-DR-003: getDriveUserEmail ────────────────────────────────────────────

describe('getDriveUserEmail — BEH-DR-003', () => {

  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('BEH-DR-003a | returns null when no email is stored', () => {
    expect(getDriveUserEmail()).toBeNull()
  })

  it('BEH-DR-003b | returns the stored email address', () => {
    localStorage.setItem('driveUserEmail', 'user@example.com')
    expect(getDriveUserEmail()).toBe('user@example.com')
  })

})

// ── BEH-DR-004: clearDriveAuth ───────────────────────────────────────────────

describe('clearDriveAuth — BEH-DR-004', () => {

  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('BEH-DR-004 | clears all Drive-related localStorage keys', () => {
    setValidToken()
    localStorage.setItem('driveFileId', 'file-123')
    localStorage.setItem('driveLastExportDate', '2026-04-10T08:00:00.000Z')
    localStorage.setItem('driveUserEmail', 'user@example.com')

    clearDriveAuth()

    expect(localStorage.getItem('driveAccessToken')).toBeNull()
    expect(localStorage.getItem('driveTokenExpiry')).toBeNull()
    expect(localStorage.getItem('driveFileId')).toBeNull()
    expect(localStorage.getItem('driveLastExportDate')).toBeNull()
    expect(localStorage.getItem('driveUserEmail')).toBeNull()
  })

})

// ── BEH-DR-005: shouldAutoExport ─────────────────────────────────────────────

describe('shouldAutoExport — BEH-DR-005', () => {

  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('BEH-DR-005a | returns false when Drive is not connected', () => {
    expect(shouldAutoExport()).toBe(false)
  })

  it('BEH-DR-005b | returns true when connected and no export has ever been done', () => {
    setValidToken()
    // driveLastExportDate is not set
    expect(shouldAutoExport()).toBe(true)
  })

  it('BEH-DR-005c | returns false when connected and last export was less than 7 days ago', () => {
    setValidToken()
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    localStorage.setItem('driveLastExportDate', threeDaysAgo)
    expect(shouldAutoExport()).toBe(false)
  })

  it('BEH-DR-005d | returns true when connected and last export was exactly 7 days ago', () => {
    setValidToken()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    localStorage.setItem('driveLastExportDate', sevenDaysAgo)
    expect(shouldAutoExport()).toBe(true)
  })

  it('BEH-DR-005e | returns true when connected and last export was more than 7 days ago', () => {
    setValidToken()
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    localStorage.setItem('driveLastExportDate', tenDaysAgo)
    expect(shouldAutoExport()).toBe(true)
  })

})
