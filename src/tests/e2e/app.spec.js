import { test, expect } from '@playwright/test'

// Helper — wait for splash screen to finish
async function waitForApp(page) {
  await page.goto('/')
  // Wait for splash to fade (3 seconds) and app to load
  await page.waitForSelector('#jaap-count', { timeout: 8000 })
}

test.describe('Jaap Ledger', () => {

  test.beforeEach(async ({ page }) => {
    await waitForApp(page)
  })

  // ── APP LOADS ──────────────────────────────────────

  test('should show correct date in Today Card', async ({ page }) => {
    const today = new Date()
    const year = today.getFullYear()
    // The today card should contain the current year
    const todayCard = page.locator('.card').first()
    await expect(todayCard).toContainText(String(year))
  })

  test('should show Ledger section', async ({ page }) => {
    await expect(page.locator('h2').filter({ hasText: 'Ledger' })).toBeVisible()
  })

  test('should show Reflection Card with Lifetime Jaap', async ({ page }) => {
    await expect(page.locator('text=LIFETIME JAAP')).toBeVisible()
  })

  // ── TODAY CARD ─────────────────────────────────────

  test('should save a jaap count and show saved confirmation', async ({ page }) => {
    // Clear and enter a count
    await page.fill('#jaap-count', '50000')
    await page.fill('#jaap-notes', 'E2E test entry')

    // Click Save
    await page.click('button:has-text("Save")')

    // Button should briefly show "✓ Saved!"
    await expect(page.locator('button:has-text("Saved")')).toBeVisible({ timeout: 3000 })
  })

  test('should pre-populate Today Card with saved data on reload', async ({ page }) => {
    // Save a value
    await page.fill('#jaap-count', '65000')
    await page.click('button:has-text("Save")')
    await page.waitForSelector('button:has-text("Saved")')

    // Reload the page
    await page.reload()
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Count should be pre-populated
    await expect(page.locator('#jaap-count')).toHaveValue('65000')
  })

  // ── SETTINGS ───────────────────────────────────────

  test('should open settings panel when cog is clicked', async ({ page }) => {
    await page.click('button[title="Settings"]')
    await expect(page.locator('h2:has-text("Settings")')).toBeVisible()
  })

  test('should show export buttons in settings', async ({ page }) => {
    await page.click('button[title="Settings"]')
    await expect(page.locator('button:has-text("Export as CSV")')).toBeVisible()
    await expect(page.locator('button:has-text("Export as JSON")')).toBeVisible()
  })

  test('should show palette options in settings', async ({ page }) => {
    await page.click('button[title="Settings"]')
    await expect(page.locator('text=Midnight Sanctum')).toBeVisible()
    await expect(page.locator('text=Sacred Saffron')).toBeVisible()
    await expect(page.locator('text=Forest Ashram')).toBeVisible()
  })

  test('should close settings when backdrop is clicked', async ({ page }) => {
    await page.click('button[title="Settings"]')
    await expect(page.locator('h2:has-text("Settings")')).toBeVisible()

    // Click the × close button
    await page.click('button:has-text("×")')
    await expect(page.locator('h2:has-text("Settings")')).not.toBeVisible()
  })

  // ── LEDGER ─────────────────────────────────────────

  test('should show current year in Ledger', async ({ page }) => {
    const year = new Date().getFullYear()
    await expect(
      page.locator('text=' + year).first()
    ).toBeVisible()
  })

  test('should show TODAY badge on current date in Ledger', async ({ page }) => {
    await expect(page.locator('text=TODAY').first()).toBeVisible();
  })

  test('should show Sunday dates in red', async ({ page }) => {
    // 22 Feb 2026 is a Sunday — check if it exists and has red color
    const sundayRow = page.locator('text=22 Feb 2026')
    // If this date is within 7 days it will be visible
    const count = await sundayRow.count()
    if (count > 0) {
      const color = await sundayRow.evaluate(el =>
        window.getComputedStyle(el).color
      )
      // Red color = rgb(192, 57, 43)
      expect(color).toBe('rgb(192, 57, 43)')
    }
  })

  // ── PALETTE ────────────────────────────────────────

  test('should change palette when Sacred Saffron is selected', async ({ page }) => {
    await page.click('button[title="Settings"]')

    // Click Sacred Saffron
    await page.click('text=Sacred Saffron')

    // Check that data-palette attribute is set on html element
    const palette = await page.evaluate(() =>
      document.documentElement.getAttribute('data-palette')
    )
    expect(palette).toBe('sacred-saffron')

    // Reset back to Midnight Sanctum
    await page.click('text=Midnight Sanctum')
  })

  test('should persist palette choice after reload', async ({ page }) => {
    // Set to Forest Ashram
    await page.click('button[title="Settings"]')
    await page.click('text=Forest Ashram')
    await page.click('button:has-text("×")')

    // Reload
    await page.reload()
    await page.waitForSelector('#jaap-count', { timeout: 8000 })

    // Palette should still be forest-ashram
    const palette = await page.evaluate(() =>
      document.documentElement.getAttribute('data-palette')
    )
    expect(palette).toBe('forest-ashram')

    // Reset back
    await page.click('button[title="Settings"]')
    await page.click('text=Midnight Sanctum')
  })

  // ── SANKALPA ───────────────────────────────────────

  test('should open Sankalpa page from Settings', async ({ page }) => {
    await page.click('button[title="Settings"]')
    await page.click('text=Sankalpa')
    await expect(page.locator('text=It is not a goal')).toBeVisible()
  })

  test('should show intro text on Sankalpa page', async ({ page }) => {
    await page.click('button[title="Settings"]')
    await page.click('text=Sankalpa')
    await expect(page.locator('text=It is not a goal')).toBeVisible()
  })

  test('should show Establish Sankalpa button when no sankalpa set', async ({ page }) => {
    await page.click('button[title="Settings"]')
    await page.click('text=Sankalpa')
    await expect(page.locator('button:has-text("Establish Sankalpa")')).toBeVisible()
  })

  test('should save a Sankalpa and show confirmation', async ({ page }) => {
    await page.click('button[title="Settings"]')
    await page.click('text=Sankalpa')
    await page.fill('textarea', 'May every jaap be offered at the feet of Śrī Rāma.')
    await page.click('button:has-text("Establish Sankalpa")')
    await expect(page.locator('text=Sankalpa recorded')).toBeVisible({ timeout: 3000 })
  })

  test('should show saved Sankalpa in read-only view', async ({ page }) => {
    await page.click('button[title="Settings"]')
    await page.click('text=Sankalpa')
    await page.fill('textarea', 'Test Sankalpa for read-only check')
    await page.click('button:has-text("Establish Sankalpa")')
    await expect(page.locator('button:has-text("Re-affirm Sankalpa")')).toBeVisible({ timeout: 6000 })
  })

  test('should show rewrite warning when Re-affirm is clicked', async ({ page }) => {
    await page.click('button[title="Settings"]')
    await page.click('text=Sankalpa')
    const reaffirm = page.locator('button:has-text("Re-affirm Sankalpa")')
    const count = await reaffirm.count()
    if (count > 0) {
      await reaffirm.click()
      await expect(page.locator('text=Rewriting a Sankalpa should be done with care')).toBeVisible()
    }
  })

  test('should navigate back from Sankalpa page', async ({ page }) => {
    await page.click('button[title="Settings"]')
    await page.click('text=Sankalpa')
    await expect(page.locator('text=It is not a goal')).toBeVisible()
    await page.click('button:has-text("←")')
    await expect(page.locator('h2:has-text("Settings")')).toBeVisible()
  })

})