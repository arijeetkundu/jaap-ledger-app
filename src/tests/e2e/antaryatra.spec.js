import { test, expect } from '@playwright/test'

// ─── DB constants — must match src/db/db.js ──────────────────────────────────
const DB_NAME = 'jaap-ledger-db'
const DB_VERSION = 3
const STORE_NAME = 'entries'

// ─── Helper: seed IndexedDB entries ──────────────────────────────────────────
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

// ─── Helper: clear the entries store ─────────────────────────────────────────
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

// ─── Helper: clear the antaryatra store ──────────────────────────────────────
async function clearAntaryatra(page) {
  await page.evaluate(({ dbName, dbVersion }) => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, dbVersion)
      req.onerror = () => reject(req.error)
      req.onsuccess = () => {
        const db = req.result
        const tx = db.transaction('antaryatra', 'readwrite')
        tx.objectStore('antaryatra').clear()
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      }
    })
  }, { dbName: DB_NAME, dbVersion: DB_VERSION })
}

// ─── Helper: navigate to app and wait for load ───────────────────────────────
async function waitForApp(page) {
  await page.goto('/')
  await page.waitForSelector('#jaap-count', { timeout: 8000 })
}

// ─────────────────────────────────────────────────────────────────────────────

test.describe('AntaryatraPage', () => {

  test.afterEach(async ({ page }) => {
    await clearEntries(page)
    await clearAntaryatra(page)
  })

  // ── BEH-168 ───────────────────────────────────────────────────────────────
  // AntaryatraArchivePage shows years from firstEntryYear up to currentYear-1.
  // We seed entries spanning 2024 so 2024 appears in the archive list.
  // We seed an antaryatra record for 2024 with status='recorded'.
  // Then navigate: Settings → Antaryātrā → click 2024 row → AntaryatraPage.
  // Verify read-only reflection text is shown; no textarea or Save button.
  test('BEH-168 | AntaryatraPage shows read-only reflection text for a pre-recorded year', async ({ page }) => {
    // Seed entries for 2024 so the archive has at least one past year to display
    await page.goto('/')
    await seedEntries(page, [
      { date: '2024-03-10', count: 10000, notes: '', updatedAt: new Date().toISOString() },
      { date: '2024-09-20', count: 15000, notes: '', updatedAt: new Date().toISOString() }
    ])

    // Seed the antaryatra record for 2024 (status='recorded')
    await page.evaluate(({ dbName, dbVersion, record }) => {
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
    }, {
      dbName: DB_NAME,
      dbVersion: DB_VERSION,
      record: {
        year: 2024,
        status: 'recorded',
        text: 'This was a year of growth',
        recordedOn: '2024-12-31',
        timezone: 'Asia/Kolkata'
      }
    })

    // Load the app fresh so it picks up the seeded entries
    await waitForApp(page)

    // Open Settings
    await page.click('button[title="Settings"]')
    await expect(page.locator('h2:has-text("Settings")')).toBeVisible()

    // Click the Antaryātrā row in settings
    await page.click('text=Antaryātrā')

    // Archive page should open (check for back button and "Annual Reflections" label)
    await expect(page.locator('text=Annual Reflections').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('button:has-text("←")')).toBeVisible({ timeout: 3000 })

    // The archive lists past years — 2024 should appear as a row
    // The year is rendered as serif text in a div with cursor:pointer
    await expect(page.locator('text=2024').first()).toBeVisible({ timeout: 5000 })

    // Click the 2024 year row — it is a div with onClick that sets selectedYear
    await page.locator('text=2024').first().click()

    // AntaryatraPage for 2024 should slide in
    // Header shows "2024 · Inner Journey"
    await expect(page.locator('text=2024 · Inner Journey').first()).toBeVisible({ timeout: 5000 })

    // The pre-recorded reflection text should appear in the read-only block
    await expect(page.locator('text=This was a year of growth').first()).toBeVisible({ timeout: 3000 })

    // Status badge "Reflected" should appear in the header
    await expect(page.locator('text=Reflected').first()).toBeVisible({ timeout: 3000 })

    // No textarea should be visible WITHIN the AntaryatraPage itself.
    // (The TodayCard's #jaap-notes textarea is behind the overlay — we scope to the fixed
    // full-screen container at zIndex 200 which is the AntaryatraPage / archive overlay.)
    // The AntaryatraPage renders a fixed div containing "2024 · Inner Journey" in the header.
    // We identify it by locating the overlay container that contains that header text.
    const antaryatraOverlay = page.locator('div').filter({ hasText: '2024 · Inner Journey' }).last()
    await expect(antaryatraOverlay.locator('textarea')).not.toBeAttached()

    // No "Record Reflection" save button should be visible in the overlay
    await expect(antaryatraOverlay.locator('button:has-text("Record Reflection")')).not.toBeAttached()
  })

})
