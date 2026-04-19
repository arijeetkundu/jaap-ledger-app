import { test, expect } from '@playwright/test'

// Sunday date used across all tests — 19 April 2026
const SUNDAY = new Date('2026-04-19T09:00:00')
const SUNDAY_STR = '2026-04-19'

// ── Helper: load app with clock set to a Sunday ───────────────────────────────
async function loadOnSunday(page) {
  await page.clock.setSystemTime(SUNDAY)
  await page.addInitScript(() => localStorage.removeItem('backupReminderLastShown'))
  await page.goto('/')
  await page.waitForSelector('#jaap-count', { timeout: 8000 })
}

// ── Helper: load app on a weekday (Thursday) ──────────────────────────────────
async function loadOnThursday(page) {
  await page.clock.setSystemTime(new Date('2026-04-16T09:00:00'))
  await page.addInitScript(() => localStorage.removeItem('backupReminderLastShown'))
  await page.goto('/')
  await page.waitForSelector('#jaap-count', { timeout: 8000 })
}

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Sunday Backup Reminder', () => {

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('backupReminderLastShown')).catch(() => {})
  })

  // ── BEH-BR-E01 ───────────────────────────────────────────────────────────
  test('BEH-BR-E01 | Modal appears on Sunday when not yet shown today', async ({ page }) => {
    await loadOnSunday(page)
    await expect(page.locator('text=Jai Siya Ram. It is Sunday.')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=What has been chanted with devotion')).toBeVisible()
  })

  // ── BEH-BR-E02 ───────────────────────────────────────────────────────────
  test('BEH-BR-E02 | Modal does not appear on a weekday', async ({ page }) => {
    await loadOnThursday(page)
    await expect(page.locator('text=Jai Siya Ram. It is Sunday.')).not.toBeVisible({ timeout: 3000 })
  })

  // ── BEH-BR-E03 ───────────────────────────────────────────────────────────
  test('BEH-BR-E03 | "Back Up to Google Drive" button is visible in modal', async ({ page }) => {
    await loadOnSunday(page)
    await expect(page.locator('button:has-text("Back Up to Google Drive")')).toBeVisible({ timeout: 5000 })
  })

  // ── BEH-BR-E04 ───────────────────────────────────────────────────────────
  test('BEH-BR-E04 | "Remind me next Sunday" closes modal and sets localStorage', async ({ page }) => {
    await loadOnSunday(page)
    await expect(page.locator('text=Jai Siya Ram. It is Sunday.')).toBeVisible({ timeout: 5000 })

    await page.click('button:has-text("Remind me next Sunday")')

    // Modal closes
    await expect(page.locator('text=Jai Siya Ram. It is Sunday.')).not.toBeVisible({ timeout: 3000 })

    // localStorage is set to today's date
    const stored = await page.evaluate(() => localStorage.getItem('backupReminderLastShown'))
    expect(stored).toBe(SUNDAY_STR)
  })

  // ── BEH-BR-E05 ───────────────────────────────────────────────────────────
  test('BEH-BR-E05 | X button closes modal and sets localStorage', async ({ page }) => {
    await loadOnSunday(page)
    await expect(page.locator('text=Jai Siya Ram. It is Sunday.')).toBeVisible({ timeout: 5000 })

    // Click the × close button
    await page.click('button:has-text("×")')

    await expect(page.locator('text=Jai Siya Ram. It is Sunday.')).not.toBeVisible({ timeout: 3000 })

    const stored = await page.evaluate(() => localStorage.getItem('backupReminderLastShown'))
    expect(stored).toBe(SUNDAY_STR)
  })

  // ── BEH-BR-E06 ───────────────────────────────────────────────────────────
  test('BEH-BR-E06 | Backdrop click closes modal and sets localStorage', async ({ page }) => {
    await loadOnSunday(page)
    await expect(page.locator('text=Jai Siya Ram. It is Sunday.')).toBeVisible({ timeout: 5000 })

    // Click the backdrop directly
    await page.locator('[data-testid="backup-backdrop"]').click({ position: { x: 10, y: 10 } })

    await expect(page.locator('text=Jai Siya Ram. It is Sunday.')).not.toBeVisible({ timeout: 3000 })

    const stored = await page.evaluate(() => localStorage.getItem('backupReminderLastShown'))
    expect(stored).toBe(SUNDAY_STR)
  })

  // ── BEH-BR-E07 ───────────────────────────────────────────────────────────
  test('BEH-BR-E07 | Modal does not reappear on same Sunday after dismissal', async ({ page }) => {
    // Pre-seed as already shown today (Sunday)
    await page.clock.setSystemTime(SUNDAY)
    await page.goto('/')
    await page.evaluate((date) => localStorage.setItem('backupReminderLastShown', date), SUNDAY_STR)
    await page.reload()
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    await expect(page.locator('text=Jai Siya Ram. It is Sunday.')).not.toBeVisible({ timeout: 3000 })
  })

  // ── BEH-BR-E08 ───────────────────────────────────────────────────────────
  test('BEH-BR-E08 | App is fully usable after dismissing modal', async ({ page }) => {
    await loadOnSunday(page)
    await page.click('button:has-text("Remind me next Sunday")')

    // Today card and ledger should be accessible
    await expect(page.locator('#jaap-count')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Ledger')).toBeVisible()
  })

  // ── BEH-280 to BEH-283: Backup button state tests ────────────────────────
  // These tests verify backup button state transitions (idle → loading → success/error).
  // The backupToDrive function is imported directly in the BackupReminderModal component
  // and is not easily interceptable via Playwright without modifying the source code.
  // Module-level mocking (vi.mock) is not available in Playwright's browser context.
  //
  // RECOMMENDED APPROACH for future implementation:
  // 1. Add a `data-testid="backup-btn"` attribute and a `data-state` attribute to the
  //    backup button in BackupReminderModal.jsx, updated on each state change.
  // 2. Expose a `window.__backupToDrive` hook via a Vite env variable (TEST mode only),
  //    then use page.addInitScript to replace it before navigation.
  // 3. Use page.route() to intercept Google OAuth and Drive API network calls directly.
  //
  // These tests are SKIPPED pending source-level test hooks or network interception approach.

  test.skip('BEH-280 | Backup button shows "Backing up..." during in-flight request', async ({ page }) => {
    // Skipped: backupToDrive cannot be mocked without source modification or network interception.
    // See comment above for recommended implementation approach.
  })

  test.skip('BEH-281 | Backup button shows success state after successful backup', async ({ page }) => {
    // Skipped: requires controllable mock of backupToDrive or Drive API network interception.
  })

  test.skip('BEH-282 | Backup button shows error state when backupToDrive rejects', async ({ page }) => {
    // Skipped: requires controllable mock of backupToDrive or Drive API network interception.
  })

  test.skip('BEH-283 | Backup button returns to idle state after error is dismissed', async ({ page }) => {
    // Skipped: requires controllable mock of backupToDrive or Drive API network interception.
  })

})
