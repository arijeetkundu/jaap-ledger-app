import { getLocalToday } from './ledgerLogic'

const LAST_SHOWN_KEY = 'backupReminderLastShown'

export function isSunday() {
  const today = getLocalToday() // YYYY-MM-DD
  return new Date(today + 'T00:00:00').getDay() === 0
}

export function wasReminderShownToday() {
  return localStorage.getItem(LAST_SHOWN_KEY) === getLocalToday()
}

export function markReminderShownToday() {
  localStorage.setItem(LAST_SHOWN_KEY, getLocalToday())
}

export function shouldShowBackupReminder() {
  return isSunday() && !wasReminderShownToday()
}
