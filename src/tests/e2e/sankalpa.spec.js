import { test, expect } from '@playwright/test'

// ─── DB constants — must match src/db/db.js ──────────────────────────────────
const DB_NAME = 'jaap-ledger-db'
const DB_VERSION = 3

// ─── Helper: clear the sankalpa store ────────────────────────────────────────
async function clearSankalpa(page) {
  await page.evaluate(({ dbName, dbVersion }) => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, dbVersion)
      req.onerror = () => reject(req.error)
      req.onsuccess = () => {
        const db = req.result
        const tx = db.transaction('sankalpa', 'readwrite')
        tx.objectStore('sankalpa').clear()
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      }
    })
  }, { dbName: DB_NAME, dbVersion: DB_VERSION })
}

// ─── Helper: read the sankalpa 'primary' record directly from IndexedDB ──────
async function getSankalpaRecord(page) {
  return page.evaluate(({ dbName, dbVersion }) => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, dbVersion)
      req.onerror = () => reject(req.error)
      req.onsuccess = () => {
        const db = req.result
        const tx = db.transaction('sankalpa', 'readonly')
        const r = tx.objectStore('sankalpa').get('primary')
        r.onsuccess = () => resolve(r.result || null)
        r.onerror = () => reject(r.error)
      }
    })
  }, { dbName: DB_NAME, dbVersion: DB_VERSION })
}

// ─── Helper: navigate to app and wait for load ───────────────────────────────
async function waitForApp(page) {
  await page.goto('/')
  await page.waitForSelector('#jaap-count', { timeout: 8000 })
}

// ─── Helper: navigate to Sankalpa page via Settings ──────────────────────────
async function openSankalpaPage(page) {
  await page.click('button[title="Settings"]')
  await expect(page.locator('h2:has-text("Settings")')).toBeVisible()
  await page.click('text=Sankalpa')
  await expect(page.locator('text=It is not a goal')).toBeVisible({ timeout: 5000 })
}

// ─── Sankalpa-specific textarea selector (not the TodayCard notes textarea) ──
// The Sankalpa textarea has a specific placeholder with "May every jaap" text
const SANKALPA_TEXTAREA = 'textarea[placeholder*="May every jaap"]'

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Sankalpa', () => {

  test.beforeEach(async ({ page }) => {
    // Always start with a clean sankalpa state
    await page.goto('/')
    await clearSankalpa(page)
  })

  // ── SS-SK-001 ─────────────────────────────────────────────────────────────
  test('SS-SK-001 | Establish button is disabled when textarea is empty', async ({ page }) => {
    await waitForApp(page)
    await openSankalpaPage(page)

    // Ensure the Sankalpa textarea is empty (use specific selector to avoid strict mode violation)
    const sankalpaTa = page.locator(SANKALPA_TEXTAREA)
    await expect(sankalpaTa).toBeVisible({ timeout: 3000 })
    await sankalpaTa.fill('')

    // The Establish Sankalpa button must be disabled when text is empty
    const establishBtn = page.locator('button:has-text("Establish Sankalpa")')
    await expect(establishBtn).toBeVisible()
    await expect(establishBtn).toBeDisabled()
  })

  // ── SS-SK-002 ─────────────────────────────────────────────────────────────
  test('SS-SK-002 | Rewrite flow — warning dialog shown, then edit form appears', async ({ page }) => {
    await waitForApp(page)
    await openSankalpaPage(page)

    // First save a sankalpa
    await page.locator(SANKALPA_TEXTAREA).fill('Original sankalpa text for rewrite test')
    await page.click('button:has-text("Establish Sankalpa")')
    await expect(page.locator('text=Sankalpa recorded')).toBeVisible({ timeout: 5000 })

    // After save, page enters view mode — Re-affirm button should appear
    const reaffirmBtn = page.locator('button:has-text("Re-affirm Sankalpa")')
    await expect(reaffirmBtn).toBeVisible({ timeout: 5000 })
    await reaffirmBtn.click()

    // Warning dialog must appear
    await expect(
      page.locator('text=Rewriting a Sankalpa should be done with care')
    ).toBeVisible({ timeout: 3000 })

    // Click "Rewrite Sankalpa" in the warning dialog
    // There are two "Rewrite Sankalpa" buttons — one in the warning, one in edit mode
    // At this point only the warning one is visible
    await page.locator('button:has-text("Rewrite Sankalpa")').first().click()

    // After confirming, edit form must appear — the sankalpa-specific textarea appears
    await expect(
      page.locator(SANKALPA_TEXTAREA)
    ).toBeVisible({ timeout: 3000 })
  })

  // ── SS-SK-003 ─────────────────────────────────────────────────────────────
  test('SS-SK-003 | Rewrite preserves original sankalpa date in IndexedDB', async ({ page }) => {
    await waitForApp(page)
    await openSankalpaPage(page)

    // Save initial sankalpa
    await page.locator(SANKALPA_TEXTAREA).fill('First sankalpa — original date should be preserved')
    await page.click('button:has-text("Establish Sankalpa")')
    await expect(page.locator('text=Sankalpa recorded')).toBeVisible({ timeout: 5000 })

    // Read the original date from IndexedDB before rewrite
    const originalRecord = await getSankalpaRecord(page)
    expect(originalRecord).not.toBeNull()
    const originalDate = originalRecord.date

    // Perform rewrite
    const reaffirmBtn = page.locator('button:has-text("Re-affirm Sankalpa")')
    await expect(reaffirmBtn).toBeVisible({ timeout: 5000 })
    await reaffirmBtn.click()

    // Confirm rewrite in warning dialog
    await page.locator('button:has-text("Rewrite Sankalpa")').first().click()

    // Edit mode — fill new text and save
    await page.locator(SANKALPA_TEXTAREA).fill('Rewritten sankalpa text — date should remain unchanged')
    await page.locator('button:has-text("Rewrite Sankalpa")').click()

    await expect(page.locator('text=Sankalpa recorded')).toBeVisible({ timeout: 5000 })

    // Read the record again from IndexedDB and verify date is unchanged
    const updatedRecord = await getSankalpaRecord(page)
    expect(updatedRecord).not.toBeNull()
    expect(updatedRecord.date).toBe(originalDate)

    // Also verify the "Date of Sankalpa" label is visible on screen
    await expect(
      page.locator('text=/Date of Sankalpa/i').first()
    ).toBeVisible()
  })

})
