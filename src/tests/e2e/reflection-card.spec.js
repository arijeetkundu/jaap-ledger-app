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

// ─── Helper: clear all entries ───────────────────────────────────────────────
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

// ─── Helper: navigate to app and wait for load ───────────────────────────────
async function waitForApp(page) {
  await page.goto('/')
  await page.waitForSelector('#jaap-count', { timeout: 8000 })
}

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Reflection Card', () => {

  test.afterEach(async ({ page }) => {
    await clearEntries(page)
  })

  // ── SS-RC-001 ─────────────────────────────────────────────────────────────
  test('SS-RC-001 | Current-year total displayed correctly in Indian format', async ({ page }) => {
    const currentYear = new Date().getFullYear()

    await page.goto('/')
    await seedEntries(page, [
      { date: `${currentYear}-01-10`, count: 100000, notes: '', updatedAt: new Date().toISOString() },
      { date: `${currentYear}-02-10`, count: 100000, notes: '', updatedAt: new Date().toISOString() },
      { date: `${currentYear}-03-10`, count: 100000, notes: '', updatedAt: new Date().toISOString() },
    ])

    await waitForApp(page)

    // The Reflection Card must display "3,00,000" as the year total
    await expect(page.locator('text=3,00,000').first()).toBeVisible()
  })

  // ── SS-RC-002 ─────────────────────────────────────────────────────────────
  test('SS-RC-002 | No prediction section when DB is empty — no "at this pace" text and no NaN', async ({ page }) => {
    await waitForApp(page)

    // Prediction line must not appear
    await expect(page.locator('text=/at this pace/i')).not.toBeAttached()
    await expect(page.locator('text=/At current pace/')).not.toBeAttached()

    // No NaN should appear anywhere in the page
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).not.toContain('NaN')
  })

  // ── SS-RC-003 ─────────────────────────────────────────────────────────────
  test('SS-RC-003 | Progress bar width capped at 100% when total count exceeds 1 crore', async ({ page }) => {
    await page.goto('/')
    // Seed a total of 15,000,000 — well past the 1 crore (10,000,000) milestone
    await seedEntries(page, [
      { date: '2024-01-01', count: 15000000, notes: '', updatedAt: new Date().toISOString() },
    ])

    await waitForApp(page)

    // Get the computed width of the progress fill bar
    const widthPct = await page.evaluate(() => {
      const fill = document.querySelector('.progress-fill')
      if (!fill) return null
      const style = window.getComputedStyle(fill)
      // width is set inline as a percentage string e.g. "100%"
      return fill.style.width
    })

    expect(widthPct).not.toBeNull()
    // Parse percentage value — must not exceed 100
    const value = parseFloat(widthPct)
    expect(value).toBeLessThanOrEqual(100)
  })

})
