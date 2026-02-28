export function getLocalToday() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isSunday(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getDay() === 0
}

export function fillMissingDates(entries, today) {
  // Build a map of existing entries by date for quick lookup
  const entryMap = {}
  for (const entry of entries) {
    entryMap[entry.date] = {
      ...entry,
      isEmpty: false
    }
  }

  // Calculate the 7-day window
  const [ty, tm, td] = today.split('-').map(Number)
  const todayDate = new Date(ty, tm - 1, td)
  const sevenDaysAgo = new Date(ty, tm - 1, td)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

// Fill in any missing dates within the 7-day window
  const current = new Date(sevenDaysAgo.getFullYear(),
    sevenDaysAgo.getMonth(), sevenDaysAgo.getDate())
  while (current <= todayDate) {
    const y = current.getFullYear()
    const m = String(current.getMonth() + 1).padStart(2, '0')
    const d = String(current.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${d}`
    if (!entryMap[dateStr]) {
      entryMap[dateStr] = {
        date: dateStr,
        count: 0,
        notes: '',
        isEmpty: true
      }
    }
    current.setDate(current.getDate() + 1)
  }

  // Combine auto-filled dates with all existing entries
  const allEntries = { ...entryMap }

  // Add any existing entries older than 7 days that are already in the DB
  for (const entry of entries) {
    if (!allEntries[entry.date]) {
      allEntries[entry.date] = {
        ...entry,
        isEmpty: false
      }
    }
  }

  // Convert to array and sort descending (newest first)
  return Object.values(allEntries).sort((a, b) =>
    b.date.localeCompare(a.date)
  )
}

export function groupEntriesByYear(entries) {
  const yearMap = {}

  for (const entry of entries) {
    const year = parseInt(entry.date.split('-')[0])
    if (!yearMap[year]) {
      yearMap[year] = {
        year,
        yearTotal: 0,
        entries: []
      }
    }
    yearMap[year].yearTotal += entry.count
    yearMap[year].entries.push(entry)
  }

  // Sort years descending
  return Object.values(yearMap).sort((a, b) => b.year - a.year)
}