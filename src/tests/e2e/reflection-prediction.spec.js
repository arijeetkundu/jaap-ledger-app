import { test, expect } from '@playwright/test'

// ─── DB_NAME / STORE_NAME must match src/db/db.js ────────────────────────────
const DB_NAME = 'jaap-ledger-db'
const DB_VERSION = 3
const STORE_NAME = 'entries'

// ─── Helper: seed IndexedDB with a batch of entries ──────────────────────────
async function seedEntries(page, entries) {
  await page.evaluate(
    ({ dbName, dbVersion, storeName, entries }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction(storeName, 'readwrite')
          const store = tx.objectStore(storeName)
          entries.forEach(e => store.put(e))
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      })
    },
    { dbName: DB_NAME, dbVersion: DB_VERSION, storeName: STORE_NAME, entries }
  )
}

// ─── Helper: clear all entries from IndexedDB ────────────────────────────────
async function clearEntries(page) {
  await page.evaluate(
    ({ dbName, dbVersion, storeName }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction(storeName, 'readwrite')
          tx.objectStore(storeName).clear()
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      })
    },
    { dbName: DB_NAME, dbVersion: DB_VERSION, storeName: STORE_NAME }
  )
}

// ─── Helper: build a date range array ────────────────────────────────────────
// Returns entries with consecutive dates starting from startDate
function makeEntries(startDate, count, countPerDay) {
  const entries = []
  const d = new Date(startDate)
  for (let i = 0; i < count; i++) {
    entries.push({
      date: d.toISOString().split('T')[0],
      count: countPerDay,
      notes: '',
      updatedAt: new Date().toISOString()
    })
    d.setDate(d.getDate() + 1)
  }
  return entries
}

// ─── Helper: navigate to app and wait for load ───────────────────────────────
async function waitForApp(page) {
  await page.goto('/')
  await page.waitForSelector('#jaap-count', { timeout: 8000 })
}

// ─── Helper: compute a date N days from today as "D MMM YYYY" ────────────────
// Used instead of hardcoded dates so tests don't break as calendar days advance
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function daysFromToday(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

// ─────────────────────────────────────────────────────────────────────────────
// HAPPY PATH
// ─────────────────────────────────────────────────────────────────────────────

test.describe('RP Happy Path', () => {

  test.afterEach(async ({ page }) => {
    await clearEntries(page)
  })

  test('RP-001 | Both prediction lines visible when ≥ 30 non-zero YTD entries exist', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, makeEntries('2026-01-01', 35, 50000))
    await waitForApp(page)

    const primary = page.locator('text=/At current pace/')
    const ytd = page.locator('text=/At your 2026 pace/')
    await expect(primary).toBeVisible()
    await expect(ytd).toBeVisible()

    // Primary must appear above YTD in the DOM
    const primaryBox = await primary.boundingBox()
    const ytdBox = await ytd.boundingBox()
    expect(primaryBox.y).toBeLessThan(ytdBox.y)
  })

  test('RP-002 | Primary prediction shows correct label, Indian number format, and D MMM YYYY date', async ({ page }) => {
    await page.goto('/')
    // 30 entries × 50,000 = total 1,500,000; lifetime = 9,950,000; remaining = 50,000
    // ceil(50,000 ÷ 50,000) = 1 day → predicted = today + 1
    await seedEntries(page, makeEntries('2026-01-01', 30, 50000))
    await seedEntries(page, [{ date: '2025-01-01', count: 8450000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    const primary = page.locator('text=/At current pace/')
    await expect(primary).toContainText('50,000/day')
    await expect(primary).toContainText(daysFromToday(1))
    await expect(primary).not.toContainText(/\d{4}-\d{2}-\d{2}/)
  })

  test('RP-003 | YTD prediction shows correct label, Indian number format, and D MMM YYYY date', async ({ page }) => {
    await page.goto('/')
    // 30 entries × 51,200; lifetime = 9,974,800; remaining = 25,200
    // ceil(25,200 ÷ 51,200) = 1 → predicted = today + 1
    await seedEntries(page, makeEntries('2026-01-01', 30, 51200))
    await seedEntries(page, [{ date: '2025-01-01', count: 8438800, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    const ytd = page.locator('text=/At your 2026 pace/')
    await expect(ytd).toContainText('51,200/day')
    await expect(ytd).toContainText(daysFromToday(1))
    await expect(ytd).not.toContainText(/\d{4}-\d{2}-\d{2}/)
  })

  test('RP-004 | YTD average = total YTD count ÷ non-zero entry count (Method B)', async ({ page }) => {
    await page.goto('/')
    // 30 entries × 51,200 = 1,536,000 ÷ 30 = 51,200/day
    await seedEntries(page, makeEntries('2026-01-01', 30, 51200))
    await seedEntries(page, [{ date: '2025-01-01', count: 7464000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At your 2026 pace/')).toContainText('51,200/day')
  })

  test('RP-005 | YTD predicted date = today + ceil(remaining ÷ YTD average)', async ({ page }) => {
    await page.goto('/')
    // 30 entries × 51,200; lifetime = 9,488,000; remaining = 512,000
    // ceil(512,000 ÷ 51,200) = 10 → predicted = today + 10
    await seedEntries(page, makeEntries('2026-01-01', 30, 51200))
    await seedEntries(page, [{ date: '2025-01-01', count: 7952000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At your 2026 pace/')).toContainText(daysFromToday(10))
  })

})

// ─────────────────────────────────────────────────────────────────────────────
// BOUNDARY VALUE ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────

test.describe('RP Boundary Value Analysis', () => {

  test.afterEach(async ({ page }) => {
    await clearEntries(page)
  })

  test('RP-006 | Exactly 29 non-zero YTD entries — YTD prediction absent', async ({ page }) => {
    await page.goto('/')
    // 1 prior-year entry (for primary) + 29 current-year entries (below threshold)
    await seedEntries(page, [{ date: '2025-12-31', count: 50000, notes: '', updatedAt: new Date().toISOString() }])
    await seedEntries(page, makeEntries('2026-01-01', 29, 50000))
    await seedEntries(page, [{ date: '2024-01-01', count: 8420000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At current pace/')).toBeVisible()
    await expect(page.locator('text=/At your 2026 pace/')).not.toBeAttached()
  })

  test('RP-007 | Exactly 30 non-zero YTD entries — YTD prediction appears', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, makeEntries('2026-01-01', 30, 50000))
    await seedEntries(page, [{ date: '2025-01-01', count: 7500000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At your 2026 pace/')).toBeVisible()
  })

  test('RP-008 | Exactly 31 non-zero YTD entries — YTD prediction remains (threshold is a floor)', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, makeEntries('2026-01-01', 31, 50000))
    await seedEntries(page, [{ date: '2025-01-01', count: 7450000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At your 2026 pace/')).toBeVisible()
  })

  test('RP-009 | Saving 30th entry live — YTD appears without page reload', async ({ page }) => {
    await page.goto('/')
    // Pre-seed 28 entries (below threshold)
    await seedEntries(page, makeEntries('2026-01-01', 28, 50000))
    await seedEntries(page, [{ date: '2025-01-01', count: 7600000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    // Confirm YTD absent at 28 entries
    await expect(page.locator('text=/At your 2026 pace/')).not.toBeAttached()

    // Save today's entry (29th)
    await page.fill('#jaap-count', '50000')
    await page.click('button:has-text("Save")')
    await page.waitForSelector('button:has-text("Saved")')
    await expect(page.locator('text=/At your 2026 pace/')).not.toBeAttached()

    // Seed one more past entry to reach 30 (simulates adding via Ledger)
    await seedEntries(page, [{ date: '2026-02-01', count: 50000, notes: '', updatedAt: new Date().toISOString() }])

    // Trigger a re-render by saving today's entry again with updated count
    await page.fill('#jaap-count', '50000')
    await page.click('button:has-text("Save")')
    await page.waitForSelector('button:has-text("Saved")')

    // YTD must now appear — without page reload
    await expect(page.locator('text=/At your 2026 pace/')).toBeVisible()
  })

})

// ─────────────────────────────────────────────────────────────────────────────
// NEGATIVE TESTING
// ─────────────────────────────────────────────────────────────────────────────

test.describe('RP Negative', () => {

  test.afterEach(async ({ page }) => {
    await clearEntries(page)
  })

  test('RP-010 | 1 January — YTD prediction absent (zero current-year entries)', async ({ page }) => {
    await page.clock.setFixedTime('2027-01-01T10:00:00')
    await page.goto('/')
    // 30 prior-year entries for primary
    await seedEntries(page, makeEntries('2026-11-01', 30, 50000))
    await seedEntries(page, [{ date: '2025-01-01', count: 7500000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At current pace/')).toBeVisible()
    await expect(page.locator('text=/At your 2027 pace/')).not.toBeAttached()
  })

  test('RP-011 | All current-year entries have count = 0 — YTD prediction absent', async ({ page }) => {
    await page.goto('/')
    // 30 prior-year non-zero entries (for primary) + 35 current-year zero-count entries
    await seedEntries(page, makeEntries('2025-11-01', 30, 50000))
    await seedEntries(page, makeEntries('2026-01-01', 35, 0))
    await seedEntries(page, [{ date: '2024-01-01', count: 7500000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At current pace/')).toBeVisible()
    await expect(page.locator('text=/At your 2026 pace/')).not.toBeAttached()
  })

  test('RP-012 | Mix of zero and non-zero YTD entries — only non-zero counted toward threshold', async ({ page }) => {
    await page.goto('/')
    // 10 prior-year entries + 20 current-year non-zero + 30 current-year zero = 20 effective YTD
    await seedEntries(page, makeEntries('2025-12-01', 10, 50000))
    await seedEntries(page, makeEntries('2026-01-01', 20, 50000))
    await seedEntries(page, makeEntries('2026-02-01', 30, 0))
    await seedEntries(page, [{ date: '2024-01-01', count: 7500000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At your 2026 pace/')).not.toBeAttached()
  })

  test('RP-013 | New user with 29 non-zero entries since first entry — YTD absent', async ({ page }) => {
    await page.goto('/')
    // No prior-year entries; 29 entries from mid-year start
    await seedEntries(page, makeEntries('2026-03-13', 29, 50000))
    await waitForApp(page)

    await expect(page.locator('text=/At your 2026 pace/')).not.toBeAttached()
  })

  test('RP-014 | 200 prior-year entries — YTD absent when only 5 current-year entries exist', async ({ page }) => {
    await page.goto('/')
    // 200 prior-year entries + only 5 current-year entries (far below threshold)
    await seedEntries(page, makeEntries('2024-01-01', 200, 50000))
    await seedEntries(page, makeEntries('2026-01-01', 5, 50000))
    await waitForApp(page)

    await expect(page.locator('text=/At current pace/')).toBeVisible()
    await expect(page.locator('text=/At your 2026 pace/')).not.toBeAttached()
  })

})

// ─────────────────────────────────────────────────────────────────────────────
// STATE-BASED
// ─────────────────────────────────────────────────────────────────────────────

test.describe('RP State', () => {

  test.afterEach(async ({ page }) => {
    await clearEntries(page)
  })

  test('RP-015 | Primary prediction only — YTD below threshold, no blank space', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, makeEntries('2025-12-15', 5, 50000))
    await seedEntries(page, makeEntries('2026-01-01', 15, 50000))
    await seedEntries(page, [{ date: '2024-01-01', count: 7750000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At current pace/')).toBeVisible()
    await expect(page.locator('text=/At your 2026 pace/')).not.toBeAttached()
  })

  test('RP-016 | Both predictions visible with different dates — mid-year user with varied pace', async ({ page }) => {
    await page.goto('/')
    // 30 entries × 40,000 (Jan) + 30 entries × 60,000 (Feb–Mar)
    // Primary avg = 60,000/day; YTD avg = 50,000/day → different predicted dates
    await seedEntries(page, makeEntries('2026-01-01', 30, 40000))
    await seedEntries(page, makeEntries('2026-02-01', 30, 60000))
    await seedEntries(page, [{ date: '2025-01-01', count: 7000000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At current pace/')).toContainText('60,000/day')
    await expect(page.locator('text=/At your 2026 pace/')).toContainText('50,000/day')

    // The two lines must show different dates (primary is faster → earlier date)
    const primaryText = await page.locator('text=/At current pace/').textContent()
    const ytdText = await page.locator('text=/At your 2026 pace/').textContent()
    expect(primaryText).not.toEqual(ytdText)
  })

  test('RP-017 | New year — YTD resets, primary continues (1 Feb 2027)', async ({ page }) => {
    await page.clock.setFixedTime('2027-02-01T10:00:00')
    await page.goto('/')
    await seedEntries(page, makeEntries('2026-12-01', 30, 50000))
    await seedEntries(page, [{ date: '2025-01-01', count: 7500000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At current pace/')).toBeVisible()
    await expect(page.locator('text=/At your 2027 pace/')).not.toBeAttached()
  })

  test('RP-018 | New user — YTD appears on their 30th entry day (not from 1 Jan)', async ({ page }) => {
    await page.goto('/')
    // New user — no prior-year entries; 30 entries starting mid-year
    await seedEntries(page, makeEntries('2026-03-01', 30, 50000))
    await waitForApp(page)

    await expect(page.locator('text=/At your 2026 pace/')).toBeVisible()
    // YTD avg = total ÷ 30 non-zero entries = 50,000/day (NOT divided by calendar days since 1 Jan)
    await expect(page.locator('text=/At your 2026 pace/')).toContainText('50,000/day')
  })

  test('RP-019 | YTD average recalculates after a new entry is saved', async ({ page }) => {
    await page.goto('/')
    // 30 entries × 50,000; lifetime = 9,000,000; remaining = 1,000,000
    // YTD avg = 50,000/day → ceil(1,000,000 ÷ 50,000) = 20 → predicted = today + 20
    await seedEntries(page, makeEntries('2026-01-01', 30, 50000))
    await seedEntries(page, [{ date: '2025-01-01', count: 7500000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At your 2026 pace/')).toContainText(daysFromToday(20))

    // Save 80,000 today — new total = 1,580,000 ÷ 31 entries = 50,968/day
    // remaining = 920,000; ceil(920,000 ÷ 50,968) = 19 → predicted = today + 19
    await page.fill('#jaap-count', '80000')
    await page.click('button:has-text("Save")')
    await page.waitForSelector('button:has-text("Saved")')

    await expect(page.locator('text=/At your 2026 pace/')).toContainText(daysFromToday(19))
  })

})

// ─────────────────────────────────────────────────────────────────────────────
// REGRESSION
// ─────────────────────────────────────────────────────────────────────────────

test.describe('RP Regression', () => {

  test.afterEach(async ({ page }) => {
    await clearEntries(page)
  })

  test('RP-020 | Existing primary prediction is unchanged after YTD feature is added', async ({ page }) => {
    await page.goto('/')
    // Same data as the existing predictNextMilestone unit test baseline
    // 30 entries × 10,000; lifetime = 300,000; avg must be 10,000/day
    await seedEntries(page, makeEntries('2026-01-01', 30, 10000))
    await waitForApp(page)

    await expect(page.locator('text=/At current pace/')).toContainText('10,000/day')
  })

  test('RP-021 | Primary prediction shows normally when YTD threshold is not met', async ({ page }) => {
    await page.goto('/')
    // 30 prior-year entries (primary shows) + 10 current-year entries (YTD absent)
    await seedEntries(page, makeEntries('2025-12-01', 30, 50000))
    await seedEntries(page, makeEntries('2026-01-01', 10, 50000))
    await seedEntries(page, [{ date: '2024-01-01', count: 7500000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At current pace/')).toBeVisible()
    await expect(page.locator('text=/At current pace/')).toContainText('50,000/day')
    await expect(page.locator('text=/At your 2026 pace/')).not.toBeAttached()
  })

  test('RP-023 | Primary prediction reflects only the 30 most recent entries — prior year does not bleed in', async ({ page }) => {
    await page.goto('/')
    // 100 prior-year entries × 1,000 + 30 current-year entries × 50,000
    // Primary avg must be 50,000/day (last 30 only) — NOT blended ~12,308/day
    await seedEntries(page, makeEntries('2024-01-01', 100, 1000))
    await seedEntries(page, makeEntries('2026-01-01', 30, 50000))
    await waitForApp(page)

    await expect(page.locator('text=/At current pace/')).toContainText('50,000/day')
    await expect(page.locator('text=/At current pace/')).not.toContainText('1,000/day')
  })

})

// ─────────────────────────────────────────────────────────────────────────────
// UI / UX
// ─────────────────────────────────────────────────────────────────────────────

test.describe('RP UI/UX', () => {

  test.afterEach(async ({ page }) => {
    await clearEntries(page)
  })

  test('RP-024 | Primary label text is verbatim correct (wording, punctuation, format)', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, makeEntries('2026-01-01', 30, 60000))
    await seedEntries(page, [{ date: '2025-01-01', count: 7200000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    const primary = page.locator('text=/At current pace/')
    await expect(primary).toContainText('At current pace (30-day avg: 60,000/day):')
    // Verify no variation in wording
    await expect(primary).not.toContainText('At your current pace')
    await expect(primary).not.toContainText('30-day average')
  })

  test('RP-025 | YTD label text is verbatim correct (wording, year, punctuation)', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, makeEntries('2026-01-01', 30, 60000))
    await seedEntries(page, [{ date: '2025-01-01', count: 7200000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    const ytd = page.locator('text=/At your 2026 pace/')
    await expect(ytd).toContainText('At your 2026 pace (60,000/day YTD):')
    await expect(ytd).not.toContainText('At current 2026 pace')
  })

  test('RP-026 | Primary average of 100,000/day displays in Indian format (1,00,000/day)', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, makeEntries('2026-01-01', 30, 100000))
    await seedEntries(page, [{ date: '2025-01-01', count: 6000000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At current pace/')).toContainText('1,00,000/day')
    await expect(page.locator('text=/At current pace/')).not.toContainText('100,000/day')
  })

  test('RP-027 | YTD average of 100,000/day displays in Indian format (1,00,000/day)', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, makeEntries('2026-01-01', 30, 100000))
    await seedEntries(page, [{ date: '2025-01-01', count: 6000000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At your 2026 pace/')).toContainText('1,00,000/day')
    await expect(page.locator('text=/At your 2026 pace/')).not.toContainText('100,000/day')
  })

  test('RP-028 | Primary date displays as D MMM YYYY — not ISO format', async ({ page }) => {
    await page.goto('/')
    // 30 entries × 50,000; lifetime = 9,900,000; remaining = 100,000
    // ceil(100,000 ÷ 50,000) = 2 → predicted = today + 2
    await seedEntries(page, makeEntries('2026-01-01', 30, 50000))
    await seedEntries(page, [{ date: '2025-01-01', count: 8400000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At current pace/')).toContainText(daysFromToday(2))
    await expect(page.locator('text=/At current pace/')).not.toContainText(/\d{4}-\d{2}-\d{2}/)
  })

  test('RP-029 | YTD date displays as D MMM YYYY — not ISO format', async ({ page }) => {
    await page.goto('/')
    // 30 entries × 50,000; lifetime = 9,900,000; remaining = 100,000
    // ceil(100,000 ÷ 50,000) = 2 → predicted = today + 2
    await seedEntries(page, makeEntries('2026-01-01', 30, 50000))
    await seedEntries(page, [{ date: '2025-01-01', count: 8400000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At your 2026 pace/')).toContainText(daysFromToday(2))
    await expect(page.locator('text=/At your 2026 pace/')).not.toContainText(/\d{4}-\d{2}-\d{2}/)
  })

  test('RP-030 | No blank space or empty div when YTD is absent', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, makeEntries('2026-01-01', 20, 50000))
    await seedEntries(page, [{ date: '2025-01-01', count: 8000000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    // YTD element must not be in the DOM at all — not just hidden
    await expect(page.locator('text=/At your 2026 pace/')).not.toBeAttached()
  })

  test('RP-031 | Both lines render separately even when predicted dates are identical', async ({ page }) => {
    await page.goto('/')
    // Same 30 entries used for both primary and YTD → same avg → same predicted date
    await seedEntries(page, makeEntries('2026-01-01', 30, 50000))
    await seedEntries(page, [{ date: '2025-01-01', count: 8450000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    // Both lines visible with distinct labels
    await expect(page.locator('text=/At current pace/')).toBeVisible()
    await expect(page.locator('text=/At your 2026 pace/')).toBeVisible()

    // Both contain the same date but with different label prefixes
    const primaryText = await page.locator('text=/At current pace/').textContent()
    const ytdText = await page.locator('text=/At your 2026 pace/').textContent()
    expect(primaryText).toContain('At current pace')
    expect(ytdText).toContain('At your 2026 pace')
  })

  test('RP-032 | Year in YTD label updates to 2027 in 2027', async ({ page }) => {
    await page.clock.setFixedTime('2027-04-01T10:00:00')
    await page.goto('/')
    await seedEntries(page, makeEntries('2027-01-01', 30, 50000))
    await seedEntries(page, [{ date: '2026-01-01', count: 7500000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At your 2027 pace/')).toBeVisible()
    await expect(page.locator('text=/At your 2026 pace/')).not.toBeAttached()
  })

})

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRATION
// ─────────────────────────────────────────────────────────────────────────────

test.describe('RP Integration', () => {

  test.afterEach(async ({ page }) => {
    await clearEntries(page)
  })

  test('RP-033 | Saving Today Card entry recalculates YTD prediction — without page reload', async ({ page }) => {
    await page.goto('/')
    // 30 entries × 50,000; lifetime = 9,000,000; remaining = 1,000,000
    // YTD avg = 50,000 → ceil(1,000,000 ÷ 50,000) = 20 → predicted = today + 20
    await seedEntries(page, makeEntries('2026-01-01', 30, 50000))
    await seedEntries(page, [{ date: '2025-01-01', count: 7500000, notes: '', updatedAt: new Date().toISOString() }])
    await waitForApp(page)

    await expect(page.locator('text=/At your 2026 pace/')).toContainText(daysFromToday(20))

    // Save 100,000 today → new YTD total = 1,600,000 ÷ 31 entries = 51,613/day
    // remaining = 900,000; ceil(900,000 ÷ 51,613) = 18 → predicted = today + 18
    await page.fill('#jaap-count', '100000')
    await page.click('button:has-text("Save")')
    await page.waitForSelector('button:has-text("Saved")')

    await expect(page.locator('text=/At your 2026 pace/')).toContainText(daysFromToday(18))
  })

  test('RP-034 | Prior year entries have zero effect on YTD average', async ({ page }) => {
    await page.goto('/')
    // 100 prior-year × 100,000 + 30 current-year × 50,000
    // YTD avg must be 50,000/day — NOT 88,462/day (blended)
    await seedEntries(page, makeEntries('2025-01-01', 100, 100000))
    await seedEntries(page, makeEntries('2026-01-01', 30, 50000))
    await waitForApp(page)

    await expect(page.locator('text=/At your 2026 pace/')).toContainText('50,000/day')
    await expect(page.locator('text=/At your 2026 pace/')).not.toContainText('88,462/day')
    await expect(page.locator('text=/At your 2026 pace/')).not.toContainText('1,00,000/day')
  })

  test('RP-036 | Milestone progress bar and history are unaffected by YTD prediction addition', async ({ page }) => {
    await page.goto('/')
    // 1 prior-year entry × 9,500,000 + 30 current-year entries × 50,000 = 11,000,000 total
    // Milestone crossed: 1 Crore; progress toward 2 Crore = 10.0%
    await seedEntries(page, [{ date: '2025-01-01', count: 9500000, notes: '', updatedAt: new Date().toISOString() }])
    await seedEntries(page, makeEntries('2026-01-01', 30, 50000))
    await waitForApp(page)

    // Progress bar and percentage intact
    await expect(page.locator('text=2 Crore')).toBeVisible()
    await expect(page.locator('text=10.0%')).toBeVisible()

    // Both prediction lines present
    await expect(page.locator('text=/At current pace/')).toBeVisible()
    await expect(page.locator('text=/At your 2026 pace/')).toBeVisible()

    // Milestone history intact
    await expect(page.locator('text=1 Crore').first()).toBeVisible()
  })

})
