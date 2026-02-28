const CRORE = 10000000

export function getCurrentMilestone(totalCount) {
  const currentCrore = Math.floor(totalCount / CRORE)
  return {
    current: currentCrore,
    next: currentCrore + 1,
    nextTotal: (currentCrore + 1) * CRORE
  }
}

export function getMilestoneProgress(totalCount) {
  const remainder = totalCount % CRORE
  return (remainder / CRORE) * 100
}

export function getMilestoneHistory(entries) {
  const history = []
  let runningTotal = 0
  let currentCrore = 0

  for (const entry of entries) {
    runningTotal += entry.count

    const newCrore = Math.floor(runningTotal / CRORE)

    if (newCrore > currentCrore) {
      for (let c = currentCrore + 1; c <= newCrore; c++) {
        const previous = history[history.length - 1]
        let daysSincePrevious = null

        if (previous) {
          const prevDate = new Date(previous.date)
          const thisDate = new Date(entry.date)
          const diffMs = thisDate - prevDate
          daysSincePrevious = Math.round(diffMs / (1000 * 60 * 60 * 24))
        }

        history.push({
          crore: c,
          date: entry.date,
          daysSincePrevious
        })
      }
      currentCrore = newCrore
    }
  }

  return history
}

export function predictNextMilestone(totalCount, entries) {
  if (!entries || entries.length === 0) return null

  // Get last 30 days of entries that have a count
  const recentEntries = entries
    .filter(e => e.count > 0)
    .slice(-30)

  if (recentEntries.length === 0) return null

  const totalRecent = recentEntries.reduce((sum, e) => sum + e.count, 0)
  const averagePerDay = Math.round(totalRecent / recentEntries.length)

  if (averagePerDay === 0) return null

  const nextMilestone = (Math.floor(totalCount / CRORE) + 1) * CRORE
  const remaining = nextMilestone - totalCount
  const daysRemaining = Math.ceil(remaining / averagePerDay)

  const predictedDate = new Date()
  predictedDate.setDate(predictedDate.getDate() + daysRemaining)
  const predictedDateStr = predictedDate.toISOString().split('T')[0]

  return {
    averagePerDay,
    daysRemaining,
    predictedDate: predictedDateStr,
    basedOnDays: recentEntries.length
  }
}