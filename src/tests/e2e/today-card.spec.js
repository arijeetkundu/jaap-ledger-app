import { test, expect } from '@playwright/test'

// ─── DB constants — must match src/db/db.js ──────────────────────────────────
const DB_NAME = 'jaap-ledger-db'
const DB_VERSION = 3
const STORE_NAME = 'entries'

// ─── Helper: get today's date as YYYY-MM-DD ───────────────────────────────────
function getToday() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

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

test.describe('TodayCard', () => {

  test.afterEach(async ({ page }) => {
    await clearEntries(page)
  })

  // ── BEH-105 ───────────────────────────────────────────────────────────────
  test('BEH-105 | TodayCard leaves count field empty when stored count is 0', async ({ page }) => {
    const today = getToday()

    // Navigate first so DB is initialised, then seed the entry
    await page.goto('/')
    await seedEntries(page, [
      { date: today, count: 0, notes: '', updatedAt: new Date().toISOString() }
    ])

    // Reload the app so TodayCard picks up the seeded entry
    await waitForApp(page)

    // count=0 should display as empty string, not '0'
    const fieldValue = await page.locator('#jaap-count').inputValue()
    expect(fieldValue).toBe('')
  })

  // ── BEH-106 ───────────────────────────────────────────────────────────────
  test('BEH-106 | TodayCard treats non-numeric input as 0', async ({ page }) => {
    // Start with a clean DB
    await waitForApp(page)

    // Fill with non-numeric text — input[type=number] blocks .fill() for non-numeric
    // Use page.evaluate to set the value and dispatch input/change events directly
    await page.evaluate(() => {
      const input = document.querySelector('#jaap-count')
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
      nativeInputValueSetter.call(input, 'abc')
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })

    // Click Save
    await page.click('button:has-text("Save")')

    // Wait for saved confirmation
    await expect(page.locator('text=✓ Saved!')).toBeVisible({ timeout: 5000 })

    // Reload and wait for app
    await waitForApp(page)

    // The field should show empty (count stored as 0, TodayCard shows '' for count=0)
    const fieldValue = await page.locator('#jaap-count').inputValue()
    expect(fieldValue).toBe('')

    // No 'NaN' text should appear anywhere on the page
    await expect(page.locator('text=NaN')).not.toBeAttached()
  })

})
