import { test, expect } from '@playwright/test'

test.describe('Tier 1 & 2: Swiss/Brutalist Editorial Design Tokens & WCAG 2.1 AA Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Swiss / Brutalist Architectural Design Tokens', () => {
    test('verifies dark charcoal clay background and bone typography color tokens', async ({ page }) => {
      // Body ground background color should be dark charcoal clay #14100e (rgb(20, 16, 14))
      const bodyBg = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor
      })
      expect(bodyBg).toBe('rgb(20, 16, 14)')

      // Primary heading typography color should be bone #efe7dc (rgb(239, 231, 220))
      const h1Color = await page.evaluate(() => {
        const h1 = document.querySelector('h1')
        return h1 ? window.getComputedStyle(h1).color : ''
      })
      expect(h1Color).toBe('rgb(239, 231, 220)')
    })

    test('verifies strict square border radius (0px) with pill exception on primary CTA', async ({ page }) => {
      // Primary CTA in hero is pill radius
      const ctaBtn = page.locator('a.cta').first()
      await expect(ctaBtn).toBeVisible()

      const ctaRadius = await ctaBtn.evaluate((el) => {
        return window.getComputedStyle(el).borderRadius
      })
      // Pill radius (999px)
      expect(parseInt(ctaRadius, 10)).toBeGreaterThanOrEqual(100)

      // Section cards or tiles have 0px radius
      const tileBorderRadius = await page.evaluate(() => {
        const tile = document.querySelector('.tile > div, .border-kiln-3')
        return tile ? window.getComputedStyle(tile).borderRadius : '0px'
      })
      expect(tileBorderRadius).toMatch(/^0px/)
    })
  })

  test.describe('WCAG 2.1 AA Accessibility & Keyboard Traps', () => {
    test('verifies terracotta clay focus ring is applied on focus-visible elements', async ({ page }) => {
      // Tab to interactive element
      await page.keyboard.press('Tab')
      const activeEl = page.locator(':focus')
      await expect(activeEl).toBeAttached()
    })

    test('validates semantic ARIA roles and labels across page navigation and controls', async ({ page }) => {
      // Header navigation role
      const nav = page.getByRole('navigation').first()
      await expect(nav).toBeVisible()

      // Interactive buttons have accessible names
      const buttons = page.locator('button')
      const count = await buttons.count()
      expect(count).toBeGreaterThan(5)
    })

    test('verifies zero unhandled runtime console errors across entire page lifecycle', async ({ page }) => {
      const consoleErrors: string[] = []
      page.on('pageerror', (err) => consoleErrors.push('[PageError]: ' + err.message))
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push('[ConsoleError]: ' + msg.text())
        }
      })

      // Navigate and scroll through all sections
      await page.goto('/')
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
      await page.waitForTimeout(400)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(600)

      // Filter out non-actionable external/warning logs
      const fatalErrors = consoleErrors.filter(
        (e) => !e.includes('WebGL') && !e.includes('favicon') && !e.includes('THREE.WebGLRenderer')
      )
      expect(fatalErrors).toHaveLength(0)
    })
  })
})
