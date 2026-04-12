import { test, expect } from '@playwright/test'

// ─── DB constants ─────────────────────────────────────────────────────────────
const DB_NAME = 'jaap-ledger-db'
const DB_VERSION = 3

// ─── Helper: navigate to app and wait for load ────────────────────────────────
async function waitForApp(page) {
  await page.goto('/')
  await page.waitForSelector('#jaap-count', { timeout: 8000 })
}

// ─── Helper: seed entries store ───────────────────────────────────────────────
async function seedEntries(page, entries) {
  await page.evaluate(
    ({ dbName, dbVersion, entries }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction('entries', 'readwrite')
          const store = tx.objectStore('entries')
          entries.forEach(e => store.put(e))
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      })
    },
    { dbName: DB_NAME, dbVersion: DB_VERSION, entries }
  )
}

// ─── Helper: seed antaryatra store ────────────────────────────────────────────
async function seedAntaryatra(page, record) {
  await page.evaluate(
    ({ dbName, dbVersion, record }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction('antaryatra', 'readwrite')
          tx.objectStore('antaryatra').put(record)
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      })
    },
    { dbName: DB_NAME, dbVersion: DB_VERSION, record }
  )
}

// ─── Helper: clear all stores ─────────────────────────────────────────────────
async function clearAll(page) {
  await page.evaluate(({ dbName, dbVersion }) => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, dbVersion)
      req.onerror = () => reject(req.error)
      req.onsuccess = () => {
        const db = req.result
        let done = 0
        const stores = ['entries', 'antaryatra']
        stores.forEach(storeName => {
          const tx = db.transaction(storeName, 'readwrite')
          tx.objectStore(storeName).clear()
          tx.oncomplete = () => { if (++done === stores.length) resolve() }
          tx.onerror = () => reject(tx.error)
        })
      }
    })
  }, { dbName: DB_NAME, dbVersion: DB_VERSION })
}

// ─── Entries spanning 2025 (for year stats and reminder tests) ────────────────
function entries2025(count = 5) {
  return Array.from({ length: count }, (_, i) => ({
    date: `2025-0${Math.min(i + 1, 9)}-10`,
    count: 50000,
    notes: '',
    updatedAt: new Date().toISOString()
  }))
}

// ─────────────────────────────────────────────────────────────────────────────

test.describe('AntaryatraPage — clock mocked to Dec 31', () => {

  test.afterEach(async ({ page }) => {
    await clearAll(page)
  })

  // ── BEH-113 ──────────────────────────────────────────────────────────────
  test('BEH-113 | Ledger year header opens AntaryatraPage on 800ms long-press during window', async ({ page }) => {
    // Seed 2025 entries so the 2025 year group appears in the Ledger
    await page.goto('/')
    await seedEntries(page, entries2025())

    // Set clock to Dec 31 2025 and reload so canRecord returns true
    await page.clock.install({ time: new Date('2025-12-31T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Find the 2025 year header and simulate an 800ms+ long-press
    await page.evaluate(() => {
      const allDivs = document.querySelectorAll('div')
      for (const div of allDivs) {
        if ((div.style.userSelect === 'none' || div.style.cursor === 'pointer')) {
          const spans = div.querySelectorAll('span')
          for (const span of spans) {
            if (span.textContent.trim() === '2025') {
              div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
              return
            }
          }
        }
      }
    })

    // Wait 900ms for the long-press timer to fire
    await page.waitForTimeout(900)

    // Release
    await page.evaluate(() => {
      const allDivs = document.querySelectorAll('div')
      for (const div of allDivs) {
        if ((div.style.userSelect === 'none' || div.style.cursor === 'pointer')) {
          const spans = div.querySelectorAll('span')
          for (const span of spans) {
            if (span.textContent.trim() === '2025') {
              div.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
              return
            }
          }
        }
      }
    })

    // AntaryatraPage should now be visible (zIndex 200 overlay)
    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=2025 · Inner Journey')).toBeVisible()
  })

  // ── BEH-114 ──────────────────────────────────────────────────────────────
  test('BEH-114 | Ledger shows Antaryatra reminder banner on Dec 31 with no record', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())

    await page.clock.install({ time: new Date('2025-12-31T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // The reminder "Reflect on 2025 →" should appear under the 2025 year header
    await expect(page.locator('text=/Reflect on 2025/')).toBeVisible({ timeout: 3000 })
  })

  // ── BEH-160 ──────────────────────────────────────────────────────────────
  test('BEH-160 | AntaryatraPage shows year stats (days of practice, avg/day) when opened', async ({ page }) => {
    // Seed 5 entries of 50,000 each for 2025
    await page.goto('/')
    await seedEntries(page, entries2025(5))

    await page.clock.install({ time: new Date('2025-12-31T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Open via long-press on year header
    await page.evaluate(() => {
      const allDivs = document.querySelectorAll('div')
      for (const div of allDivs) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') {
              div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
              return
            }
          }
        }
      }
    })
    await page.waitForTimeout(900)
    await page.evaluate(() => {
      const allDivs = document.querySelectorAll('div')
      for (const div of allDivs) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') {
              div.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
              return
            }
          }
        }
      }
    })

    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })

    // Year stats section must show "Days of Practice" and "Avg Jaap / Day"
    await expect(page.locator('text=Days of Practice')).toBeVisible()
    await expect(page.locator('text=Avg Jaap / Day')).toBeVisible()

    // 5 days of practice → shows "5"
    await expect(page.locator('text=5').first()).toBeVisible()
  })

  // ── BEH-161 ──────────────────────────────────────────────────────────────
  test('BEH-161 | AntaryatraPage shows reflection textarea and Save button when window open and pending', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())

    await page.clock.install({ time: new Date('2025-12-31T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Open via long-press
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); return }
          }
        }
      }
    })
    await page.waitForTimeout(900)
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); return }
          }
        }
      }
    })

    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })

    // Textarea for writing reflection must be visible
    await expect(page.locator('textarea').first()).toBeVisible()

    // "Record Reflection" save button must be visible
    await expect(page.locator('button:has-text("Record Reflection")')).toBeVisible()
  })

  // ── BEH-162 ──────────────────────────────────────────────────────────────
  test('BEH-162 | AntaryatraPage Save button is disabled when textarea is empty', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())

    await page.clock.install({ time: new Date('2025-12-31T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Open via long-press
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); return }
          }
        }
      }
    })
    await page.waitForTimeout(900)
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); return }
          }
        }
      }
    })

    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })

    // Textarea starts empty — Save button must be disabled
    const saveBtn = page.locator('button:has-text("Record Reflection")')
    await expect(saveBtn).toBeDisabled()
  })

  // ── BEH-163 ──────────────────────────────────────────────────────────────
  test('BEH-163 | AntaryatraPage saves reflection with status=recorded and persists', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())

    await page.clock.install({ time: new Date('2025-12-31T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Open via long-press
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); return }
          }
        }
      }
    })
    await page.waitForTimeout(900)
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); return }
          }
        }
      }
    })

    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })

    // Type reflection text — target by placeholder to avoid ambiguity with TodayCard notes textarea
    await page.locator('textarea[placeholder*="What did this year"]').fill('This was a year of quiet deepening.')

    // Save button now enabled — click it
    await page.locator('button:has-text("Record Reflection")').click()

    // Saved confirmation message appears
    await expect(page.locator('text=Reflection recorded.')).toBeVisible({ timeout: 3000 })

    // Verify the record was actually written to IndexedDB
    const saved = await page.evaluate(({ dbName, dbVersion }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onsuccess = () => {
          const tx = req.result.transaction('antaryatra', 'readonly')
          const getReq = tx.objectStore('antaryatra').get(2025)
          getReq.onsuccess = () => resolve(getReq.result)
          getReq.onerror = () => reject(getReq.error)
        }
      })
    }, { dbName: DB_NAME, dbVersion: DB_VERSION })

    expect(saved).not.toBeNull()
    expect(saved.status).toBe('recorded')
    expect(saved.text).toBe('This was a year of quiet deepening.')
    expect(saved.recordedOn).toBe('2025-12-31')
  })

  // ── BEH-164 ──────────────────────────────────────────────────────────────
  test('BEH-164 | AntaryatraPage auto-closes 2 seconds after successful save', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())

    await page.clock.install({ time: new Date('2025-12-31T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Open via long-press
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); return }
          }
        }
      }
    })
    await page.waitForTimeout(900)
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); return }
          }
        }
      }
    })

    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })

    // Type and save — target by placeholder to avoid ambiguity with TodayCard notes textarea
    await page.locator('textarea[placeholder*="What did this year"]').fill('A year of reflection.')
    await page.locator('button:has-text("Record Reflection")').click()
    await expect(page.locator('text=Reflection recorded.')).toBeVisible({ timeout: 3000 })

    // After 2 seconds the page should auto-close — AntaryatraPage overlay gone
    await expect(page.locator('text=Antaryātrā').first()).not.toBeVisible({ timeout: 4000 })

    // Main app (Today Card) should be visible again
    await expect(page.locator('#jaap-count')).toBeVisible()
  })

  // ── BEH-165 ──────────────────────────────────────────────────────────────
  test('BEH-165 | AntaryatraPage shows Skip button when recording', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())

    await page.clock.install({ time: new Date('2025-12-31T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Open via long-press
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); return }
          }
        }
      }
    })
    await page.waitForTimeout(900)
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); return }
          }
        }
      }
    })

    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })

    // Skip button must be visible
    await expect(page.locator("button:has-text(\"Skip this year's reflection\")")).toBeVisible()
  })

  // ── BEH-166 ──────────────────────────────────────────────────────────────
  test('BEH-166 | AntaryatraPage shows skip confirmation dialog before committing', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())

    await page.clock.install({ time: new Date('2025-12-31T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Open via long-press
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); return }
          }
        }
      }
    })
    await page.waitForTimeout(900)
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); return }
          }
        }
      }
    })

    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })

    // Click Skip
    await page.locator("button:has-text(\"Skip this year's reflection\")").click()

    // Confirmation dialog must appear
    await expect(page.locator('text=Skipping will close this window permanently')).toBeVisible()
    await expect(page.locator('button:has-text("Skip Reflection")')).toBeVisible()
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible()
  })

  // ── BEH-167 ──────────────────────────────────────────────────────────────
  test('BEH-167 | AntaryatraPage saves skip record with status=skipped and closes', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())

    await page.clock.install({ time: new Date('2025-12-31T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Open via long-press
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); return }
          }
        }
      }
    })
    await page.waitForTimeout(900)
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') { div.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); return }
          }
        }
      }
    })

    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })

    // Click Skip → confirm
    await page.locator("button:has-text(\"Skip this year's reflection\")").click()
    await page.locator('button:has-text("Skip Reflection")').click()

    // AntaryatraPage closes — main app visible
    await expect(page.locator('#jaap-count')).toBeVisible({ timeout: 3000 })

    // Verify the skip record was written to IndexedDB
    const saved = await page.evaluate(({ dbName, dbVersion }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onsuccess = () => {
          const tx = req.result.transaction('antaryatra', 'readonly')
          const getReq = tx.objectStore('antaryatra').get(2025)
          getReq.onsuccess = () => resolve(getReq.result)
          getReq.onerror = () => reject(getReq.error)
        }
      })
    }, { dbName: DB_NAME, dbVersion: DB_VERSION })

    expect(saved).not.toBeNull()
    expect(saved.status).toBe('skipped')
  })

  // ── BEH-169 ──────────────────────────────────────────────────────────────
  test('BEH-169 | AntaryatraPage shows skipped notice when opened for a skipped year', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())
    await seedAntaryatra(page, {
      year: 2025, status: 'skipped', text: '',
      recordedOn: '2025-12-31', timezone: 'Asia/Kolkata'
    })

    // Use Jan 5 2026 — window still open, record already skipped
    await page.clock.install({ time: new Date('2026-01-05T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // canRecord returns false for a skipped record, so long-press won't open the page.
    // Navigate via Settings → Archive instead (same pattern as BEH-171)
    await page.click('button[title="Settings"]')
    await expect(page.locator('h2:has-text("Settings")')).toBeVisible()
    await page.locator('text=Annual Reflections').first().click()
    await page.locator('text=2025').first().click()

    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })

    // Skipped notice must be visible
    await expect(page.locator("text=This year's reflection was not recorded.")).toBeVisible()
    // Status badge "Skipped" in header
    await expect(page.locator('text=Skipped').first()).toBeVisible()
  })

  // ── BEH-170 ──────────────────────────────────────────────────────────────
  test('BEH-170 | AntaryatraPage shows window-passed notice when no record and window expired', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())
    // No antaryatra record for 2025

    // Jan 14 2026 — window has now closed
    await page.clock.install({ time: new Date('2026-01-14T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Open via long-press (canRecord is false, but the page still opens from the Ledger)
    // Since canRecord is false, the long-press won't open AntaryatraPage from the year header.
    // Navigate via Settings → Archive instead
    await page.click('button[title="Settings"]')
    await expect(page.locator('h2:has-text("Settings")')).toBeVisible()
    await page.locator('text=Annual Reflections').first().click()
    // Archive page header shows "Antaryātrā" title with "Annual Reflections" subtitle — not "Antaryātrā Archive"
    await expect(page.locator('button:has-text("←")')).toBeVisible({ timeout: 3000 })

    // Click 2025 row in the archive
    await page.locator('text=2025').first().click()

    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })

    // "Window has passed" notice
    await expect(page.locator('text=The reflection window for 2025 has passed.')).toBeVisible()
  })

  // ── BEH-171 ──────────────────────────────────────────────────────────────
  test('BEH-171 | AntaryatraPage shows Reflected status label in header for a recorded year', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())
    await seedAntaryatra(page, {
      year: 2025, status: 'recorded',
      text: 'A year of growth.',
      recordedOn: '2025-12-31', timezone: 'Asia/Kolkata'
    })

    // Jan 5 2026 — window still open, record already saved
    await page.clock.install({ time: new Date('2026-01-05T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Open via Archive navigation
    await page.click('button[title="Settings"]')
    await expect(page.locator('h2:has-text("Settings")')).toBeVisible()
    await page.locator('text=Annual Reflections').first().click()
    await page.locator('text=2025').first().click()

    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })

    // "Reflected" status label must appear in the header area
    await expect(page.locator('text=Reflected').first()).toBeVisible()
  })

})

// ─────────────────────────────────────────────────────────────────────────────

test.describe('AntaryatraArchivePage — with multi-year data', () => {

  test.afterEach(async ({ page }) => {
    await clearAll(page)
  })

  // ── BEH-172 ──────────────────────────────────────────────────────────────
  test('BEH-172 | AntaryatraArchivePage lists years from first entry year to current-1', async ({ page }) => {
    await page.goto('/')

    // Seed entries spanning 2024 and 2025
    await seedEntries(page, [
      { date: '2024-06-01', count: 10000, notes: '', updatedAt: new Date().toISOString() },
      { date: '2025-03-10', count: 10000, notes: '', updatedAt: new Date().toISOString() },
    ])

    // Set clock to 2026 so 2024 and 2025 are both "past" years
    await page.clock.install({ time: new Date('2026-04-11T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    await page.click('button[title="Settings"]')
    await expect(page.locator('h2:has-text("Settings")')).toBeVisible()
    await page.locator('text=Annual Reflections').first().click()

    // Both 2024 and 2025 must appear as archive year rows
    await expect(page.locator('text=2025').first()).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=2024').first()).toBeVisible()
    // 2026 must NOT appear as a clickable year row in the archive list
    // (Archive only shows currentYear-1 and below; ledger spans in DOM use <span> not <div>)
    // The archive year rows render the year as a standalone <div> element.
    // Scope to visible archive content: none of the visible year rows should read "2026"
    await expect(page.locator('[style*="font-serif"]').filter({ hasText: /^2026$/ })).not.toBeVisible()
  })

  // ── BEH-173 ──────────────────────────────────────────────────────────────
  test('BEH-173 | AntaryatraArchivePage shows empty-archive message before first full year', async ({ page }) => {
    await page.goto('/')
    // Seed entries only in current year — no past years
    const currentYear = new Date().getFullYear()
    await seedEntries(page, [
      { date: `${currentYear}-01-01`, count: 10000, notes: '', updatedAt: new Date().toISOString() }
    ])

    await waitForApp(page)

    await page.click('button[title="Settings"]')
    await expect(page.locator('h2:has-text("Settings")')).toBeVisible()
    await page.locator('text=Annual Reflections').first().click()

    // No past years → empty archive message
    await expect(
      page.locator('text=/archive will appear|no past years|first full year/i').first()
    ).toBeVisible({ timeout: 3000 })
  })

  // ── BEH-174 ──────────────────────────────────────────────────────────────
  test('BEH-174 | AntaryatraArchivePage shows correct status labels per year', async ({ page }) => {
    await page.goto('/')

    await seedEntries(page, [
      { date: '2023-06-01', count: 10000, notes: '', updatedAt: new Date().toISOString() },
      { date: '2024-06-01', count: 10000, notes: '', updatedAt: new Date().toISOString() },
      { date: '2025-06-01', count: 10000, notes: '', updatedAt: new Date().toISOString() },
    ])
    // 2023 = recorded, 2024 = skipped, 2025 = no record
    await seedAntaryatra(page, { year: 2023, status: 'recorded', text: 'test', recordedOn: '2023-12-31', timezone: 'Asia/Kolkata' })
    await seedAntaryatra(page, { year: 2024, status: 'skipped', text: '', recordedOn: '2024-12-31', timezone: 'Asia/Kolkata' })

    await page.clock.install({ time: new Date('2026-04-11T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    await page.click('button[title="Settings"]')
    await page.locator('text=Annual Reflections').first().click()

    await expect(page.locator('text=Reflected').first()).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=Skipped').first()).toBeVisible()
    await expect(page.locator('text=Not Recorded').first()).toBeVisible()
  })

  // ── BEH-175 ──────────────────────────────────────────────────────────────
  test('BEH-175 | AntaryatraArchivePage shows days-of-practice and avg/day per year', async ({ page }) => {
    await page.goto('/')

    // 3 entries for 2025 at 50,000 each → 3 days, avg 50,000
    await seedEntries(page, [
      { date: '2025-01-10', count: 50000, notes: '', updatedAt: new Date().toISOString() },
      { date: '2025-02-10', count: 50000, notes: '', updatedAt: new Date().toISOString() },
      { date: '2025-03-10', count: 50000, notes: '', updatedAt: new Date().toISOString() },
    ])

    await page.clock.install({ time: new Date('2026-04-11T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    await page.click('button[title="Settings"]')
    await page.locator('text=Annual Reflections').first().click()

    // Archive must show stats for 2025 row: "3" days and "50,000" avg
    await expect(page.locator('text=3').first()).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=50,000').first()).toBeVisible()
  })

  // ── BEH-176 ──────────────────────────────────────────────────────────────
  test('BEH-176 | AntaryatraArchivePage navigates to AntaryatraPage when year row clicked', async ({ page }) => {
    await page.goto('/')

    await seedEntries(page, [
      { date: '2025-06-01', count: 10000, notes: '', updatedAt: new Date().toISOString() },
    ])
    await seedAntaryatra(page, {
      year: 2025, status: 'recorded', text: 'A meaningful year.',
      recordedOn: '2025-12-31', timezone: 'Asia/Kolkata'
    })

    await page.clock.install({ time: new Date('2026-04-11T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    await page.click('button[title="Settings"]')
    await page.locator('text=Annual Reflections').first().click()

    // Click 2025 row
    await page.locator('text=2025').first().click()

    // AntaryatraPage for 2025 should open
    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=2025 · Inner Journey')).toBeVisible()
    await expect(page.locator('text=A meaningful year.')).toBeVisible()
  })

})

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Reflection window — boundary conditions', () => {

  test.afterEach(async ({ page }) => {
    await clearAll(page)
  })

  // ── BEH-177 ──────────────────────────────────────────────────────────────
  test('BEH-177 | Jan 13 23:59 — window still open, recording is possible', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())

    // One minute before window closes — canRecord must still be true
    await page.clock.install({ time: new Date('2026-01-13T23:59:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // 2025 is a prior year when clock is 2026 — expand it first (short click, not long-press)
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') {
              div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
              setTimeout(() => div.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })), 50)
              return
            }
          }
        }
      }
    })
    await page.waitForTimeout(300)

    // Long-press to open AntaryatraPage
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') {
              div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
              return
            }
          }
        }
      }
    })
    await page.waitForTimeout(900)
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') {
              div.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
              return
            }
          }
        }
      }
    })

    // Window still open — reflection textarea must be present (recording available)
    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })
    await expect(page.locator('textarea[placeholder*="What did this year"]')).toBeVisible()
  })

  // ── BEH-178 ──────────────────────────────────────────────────────────────
  test('BEH-178 | Jan 14 00:01 — window expired, page is read-only, no reminder shown', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())

    // One minute after window closes — canRecord must be false
    await page.clock.install({ time: new Date('2026-01-14T00:01:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Reminder banner must NOT appear (window is closed)
    await expect(page.locator('text=Reflect on 2025 →')).not.toBeAttached()

    // Navigate via Archive (long-press is disabled when canRecord = false)
    await page.click('button[title="Settings"]')
    await expect(page.locator('h2:has-text("Settings")')).toBeVisible()
    await page.locator('text=Annual Reflections').first().click()
    await page.locator('text=2025').first().click()

    // AntaryatraPage opens in read-only mode — expired notice, no textarea
    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=The reflection window for 2025 has passed.')).toBeVisible()
    // Reflection textarea must not exist in the AntaryatraPage (read-only, no recording UI)
    await expect(page.locator('textarea[placeholder*="What did this year"]')).not.toBeAttached()
  })

})

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Reminder banner click-through', () => {

  test.afterEach(async ({ page }) => {
    await clearAll(page)
  })

  // ── BEH-179 ──────────────────────────────────────────────────────────────
  test('BEH-179 | Clicking reminder banner opens AntaryatraPage', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())

    await page.clock.install({ time: new Date('2025-12-31T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Reminder banner must be visible under the 2025 year header
    await expect(page.locator('text=Reflect on 2025 →')).toBeVisible({ timeout: 3000 })

    // Click the banner — this is the direct click path (separate from long-press)
    await page.locator('text=Reflect on 2025 →').click()

    // AntaryatraPage must open with recording UI available
    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=2025 · Inner Journey')).toBeVisible()
    await expect(page.locator('textarea[placeholder*="What did this year"]')).toBeVisible()
  })

})

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Mobile touch long-press', () => {

  test.afterEach(async ({ page }) => {
    await clearAll(page)
  })

  // ── BEH-180 ──────────────────────────────────────────────────────────────
  test('BEH-180 | Touch long-press on year header opens AntaryatraPage (mobile path)', async ({ page }) => {
    await page.goto('/')
    await seedEntries(page, entries2025())

    await page.clock.install({ time: new Date('2025-12-31T12:00:00') })
    await page.goto('/')
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Dispatch touchstart on the 2025 year header (fires onTouchStart handler in Ledger)
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') {
              div.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }))
              return
            }
          }
        }
      }
    })

    // Hold for 900ms — the 800ms long-press timer fires, sets isLongPress = true
    await page.waitForTimeout(900)

    // Dispatch touchend — because isLongPress is true, onToggle is NOT called
    await page.evaluate(() => {
      for (const div of document.querySelectorAll('div')) {
        if (div.style.cursor === 'pointer' || div.style.userSelect === 'none') {
          for (const span of div.querySelectorAll('span')) {
            if (span.textContent.trim() === '2025') {
              div.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true }))
              return
            }
          }
        }
      }
    })

    // AntaryatraPage should open — proving the touch handler path works
    await expect(page.locator('text=Antaryātrā').first()).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=2025 · Inner Journey')).toBeVisible()
  })

})
