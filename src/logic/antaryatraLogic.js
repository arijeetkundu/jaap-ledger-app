// ── DEV ONLY: set to override today's date for testing ──────────────────────
// Format: new Date(year, monthIndex, day, hour, minute, second)
// Remove this before merging to main.
const DEV_DATE_OVERRIDE = null
//const DEV_DATE_OVERRIDE = new Date(2025, 11, 31, 12, 0, 0) // Dec 31 2025
//const DEV_DATE_OVERRIDE = new Date(2026, 0, 5, 12, 0, 0)  // Jan 5 2026 (inside window)
//const DEV_DATE_OVERRIDE = new Date(2026, 0, 13, 22, 0, 0) // Jan 13 2026 (last hour)
//const DEV_DATE_OVERRIDE = new Date(2026, 0, 14, 1, 0, 0)  // Jan 14 2026 (expired)

function now() {
  return DEV_DATE_OVERRIDE || new Date()
}

/**
 * antaryatraLogic.js
 * Pure logic for Antaryātrā annual reflection windows.
 * All calculations use local device time — never UTC.
 */

/**
 * Returns the reflection window for a given year Y:
 *   Opens:  Dec 31 of Y at 00:00:00 local
 *   Closes: Jan 13 of Y+1 at 23:59:59 local
 */
export function getReflectionWindow(year) {
  const opens = new Date(year, 11, 31, 0, 0, 0)
  const closes = new Date(year + 1, 0, 13, 23, 59, 59)
  return { opens, closes }
}

export function isWindowOpen(year) {
  const current = now()
  const { opens, closes } = getReflectionWindow(year)
  return current >= opens && current <= closes
}

export function isWindowExpired(year) {
  const current = now()
  const { closes } = getReflectionWindow(year)
  return current > closes
}

export function isReflectionDay(year) {
  const current = now()
  return current.getFullYear() === year &&
    current.getMonth() === 11 &&
    current.getDate() === 31
}

/**
 * Returns the effective status of an antaryatra record,
 * taking expiry into account even if DB status is 'pending'.
 * 
 * @param {object|null} record  - the DB record, or null if not yet created
 * @param {number} year         - the year being evaluated
 * @returns {'pending'|'recorded'|'skipped'|'expired'}
 */
export function getEffectiveStatus(record, year) {
  if (!record) {
    return isWindowExpired(year) ? 'expired' : 'pending'
  }
  if (record.status === 'recorded' || record.status === 'skipped') {
    return record.status
  }
  // status is 'pending' or 'expired' in DB
  return isWindowExpired(year) ? 'expired' : 'pending'
}

/**
 * Returns true if the reminder text should be shown
 * under the year header for year Y.
 */
export function shouldShowReminder(record, year) {
  const status = getEffectiveStatus(record, year)
  return isWindowOpen(year) && status === 'pending'
}

/**
 * Returns true if the Antaryātrā UI should be accessible
 * for the given year (window open AND not yet recorded/skipped).
 */
export function canRecord(record, year) {
  const status = getEffectiveStatus(record, year)
  return isWindowOpen(year) && status === 'pending'
}

/**
 * Returns today's date as YYYY-MM-DD in local timezone.
 */
export function getLocalDateString() {
  const current = now()
  const y = current.getFullYear()
  const m = String(current.getMonth() + 1).padStart(2, '0')
  const d = String(current.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Returns the user's local timezone string, e.g. 'Asia/Kolkata'.
 * Falls back to 'UTC' if unavailable.
 */
export function getTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'UTC'
  }
}

/**
 * Given a list of all entries and a year,
 * returns { daysOfPractice, averagePerDay }.
 */
export function getYearStats(allEntries, year) {
  const yearEntries = allEntries.filter(e => {
    return e.date.startsWith(String(year)) && e.count > 0
  })
  const daysOfPractice = yearEntries.length
  if (daysOfPractice === 0) return { daysOfPractice: 0, averagePerDay: 0 }
  const total = yearEntries.reduce((sum, e) => sum + e.count, 0)
  const averagePerDay = Math.round(total / daysOfPractice)
  return { daysOfPractice, averagePerDay }
}