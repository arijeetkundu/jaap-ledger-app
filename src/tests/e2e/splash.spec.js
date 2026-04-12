import { test, expect } from '@playwright/test'

// Navigate to app without waiting for splash to clear
async function goToApp(page) {
  await page.goto('/')
}

test.describe('Splash Screen', () => {

  test('SS-001 | Splash screen is visible immediately on app load', async ({ page }) => {
    await goToApp(page)
    // The splash is a fixed overlay covering the full viewport
    const splash = page.locator('div[style*="position: fixed"][style*="9999"]')
    await expect(splash).toBeVisible({ timeout: 1000 })
  })

  test('SS-002 | Deity image loads successfully with correct src path', async ({ page }) => {
    // Intercept any failed image requests
    const failedImages = []
    page.on('requestfailed', request => {
      if (request.resourceType() === 'image') {
        failedImages.push(request.url())
      }
    })

    await goToApp(page)

    // Locate the deity img element
    const deityImg = page.locator('img[alt="deity"]')
    await expect(deityImg).toBeVisible({ timeout: 2000 })

    // Verify src contains the correct base path prefix
    const src = await deityImg.getAttribute('src')
    expect(src).toContain('deity.png')
    expect(src).not.toBe('/deity.png') // must NOT be the old absolute path

    // Verify the image actually loaded (naturalWidth > 0 means it rendered)
    const naturalWidth = await deityImg.evaluate(img => img.naturalWidth)
    expect(naturalWidth).toBeGreaterThan(0)

    // No image network failures
    expect(failedImages.filter(url => url.includes('deity'))).toHaveLength(0)
  })

  test('SS-003 | Splash screen displays app name "Sumiran" and subtitle', async ({ page }) => {
    await goToApp(page)
    const splash = page.locator('div[style*="position: fixed"][style*="9999"]')
    await expect(splash).toContainText('Sumiran')
    await expect(splash).toContainText('Daily Practice Tracker')
  })

  test('SS-004 | Splash screen disappears and app content loads within 5 seconds', async ({ page }) => {
    await goToApp(page)

    // Splash must be gone and main app visible within 5 seconds
    await expect(page.locator('#jaap-count')).toBeVisible({ timeout: 5000 })

    // Once app is loaded, the splash fixed overlay should no longer be in the DOM
    const splash = page.locator('div[style*="position: fixed"][style*="9999"]')
    await expect(splash).toHaveCount(0)
  })

  test('SS-005 | Splash screen is visible for at least 2 seconds before fading', async ({ page }) => {
    await goToApp(page)

    // After 2 seconds the splash should still be present (fade starts at 3s)
    await page.waitForTimeout(2000)
    const splash = page.locator('div[style*="position: fixed"][style*="9999"]')
    await expect(splash).toBeVisible()
  })

})
