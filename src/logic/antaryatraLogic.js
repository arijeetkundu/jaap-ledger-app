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
  const opens = new Date(year, 11, 31, 0, 0, 0)       // Dec 31, Y
  const closes = new Date(year + 1, 0, 13, 23, 59, 59) // Jan 13, Y+1
  return { opens, closes }
}

/**
 * Returns true if today is within the reflection window for year Y.
 */
export function isWindowOpen(year) {
  const now = new Date()
  const { opens, closes } = getReflectionWindow(year)
  return now >= opens && now <= closes
}

/**
 * Returns true if the reflection window for year Y has expired
 * (i.e. we are past Jan 13 of Y+1).
 */
export function isWindowExpired(year) {
  const now = new Date()
  const { closes } = getReflectionWindow(year)
  return now > closes
}

/**
 * Returns true if today is Dec 31 of the given year (local time).
 */
export function isReflectionDay(year) {
  const now = new Date()
  return now.getFullYear() === year &&
    now.getMonth() === 11 &&
    now.getDate() === 31
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
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
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