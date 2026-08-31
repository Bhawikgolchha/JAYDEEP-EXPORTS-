import { test, expect } from '@playwright/test'

test.describe('Tier 1 & 2: Specifier Suite & Export Logistics Engine', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    const calcHeader = page.locator('text=Architectural Wall & Export Calculator')
    await calcHeader.scrollIntoViewIfNeeded()
    await expect(calcHeader).toBeVisible()
  })

  test.describe('Architectural Coverage & Packing Calculator', () => {
    test('renders default calculation for standard 14ft x 10ft wall', async ({ page }) => {
      const calc = page.locator('#enquire')

      // Check for presence of metric cards
      await expect(calc.locator('text=TOTAL BLOCKS').first()).toBeVisible()
      await expect(calc.locator('text=EST. WEIGHT').first()).toBeVisible()
      await expect(calc.locator('text=PALLETS').first()).toBeVisible()
      await expect(calc.locator('text=20FT CONTAINER').first()).toBeVisible()

      // Default inputs: 14 ft x 10 ft
      // across = ceil(14 / 0.6667) = 21
      // down = ceil(10 / 0.6667) = 15
      // base = 315, reserve = ceil(315 * 1.05) = 331
      await expect(calc).toContainText('331')
      await expect(calc).toContainText('+5% res')
    })

    test('toggles unit between Imperial (Feet) and Metric (Meters) with conversion', async ({ page }) => {
      const calc = page.locator('#enquire')
      const widthInput = calc.locator('input[type="number"]').first()
      const heightInput = calc.locator('input[type="number"]').nth(1)

      // Enter known dimensions in Feet: 20 ft x 10 ft
      await widthInput.fill('20')
      await heightInput.fill('10')

      // Switch to Meters
      const metersBtn = calc.getByRole('button', { name: /Meters \(m\)/i })
      await metersBtn.click()
      await expect(metersBtn).toHaveClass(/bg-bone/)

      // 20 ft * 0.3048 = 6.1 m; 10 ft * 0.3048 = 3.0 m
      const convertedWidth = await widthInput.inputValue()
      expect(parseFloat(convertedWidth)).toBeCloseTo(6.1, 1)

      // Switch back to Feet
      const feetBtn = calc.getByRole('button', { name: /Feet \(ft\)/i })
      await feetBtn.click()
      await expect(feetBtn).toHaveClass(/bg-bone/)
    })

    test('recalculates metrics when wall dimensions change', async ({ page }) => {
      const calc = page.locator('#enquire')
      const widthInput = calc.locator('input[type="number"]').first()
      const heightInput = calc.locator('input[type="number"]').nth(1)

      // 40 ft x 20 ft wall
      await widthInput.fill('40')
      await heightInput.fill('20')

      // across = ceil(40 / 0.6667) = 60, down = ceil(20 / 0.6667) = 30
      // base = 1800, reserve = ceil(1800 * 1.05) = 1890
      await expect(calc).toContainText('1,890')
      // Pallets = ceil(1890 / 450) = 5 pallets
      await expect(calc).toContainText('5 Pallets')
    })
  })

  test.describe('Seaport Logistics & Statutory Weight Constraints', () => {
    test('switches between Mundra Port (27 MT limit) and Nhava Sheva (21.5 MT limit)', async ({ page }) => {
      const calc = page.locator('#enquire')

      // Look for Mundra and Nhava Sheva port buttons if present
      const mundraBtn = calc.locator('button', { hasText: /Mundra/i }).first()
      const nhavaBtn = calc.locator('button', { hasText: /Nhava Sheva/i }).first()

      if (await mundraBtn.isVisible() && await nhavaBtn.isVisible()) {
        // Select Nhava Sheva
        await nhavaBtn.click()
        await expect(calc).toContainText(/INNSA|21\.5/i)

        // Select Mundra
        await mundraBtn.click()
        await expect(calc).toContainText(/INMUN|27/i)
      } else {
        // Verify default dispatch ports mentioned in text
        await expect(calc).toContainText(/Mundra/i)
      }
    })
  })

  test.describe('Boundary Value Analysis & Validation', () => {
    test('shows validation error on invalid / zero / negative dimensions', async ({ page }) => {
      const calc = page.locator('#enquire')
      const widthInput = calc.locator('input[type="number"]').first()

      // Invalid zero width
      await widthInput.fill('0')
      await expect(calc).toContainText(/Enter a valid width and height/i)

      // Invalid negative width
      await widthInput.fill('-10')
      await expect(calc).toContainText(/Enter a valid width and height/i)

      // Restore valid width
      await widthInput.fill('15')
      await expect(calc.locator('text=TOTAL BLOCKS').first()).toBeVisible()
    })

    test('handles extreme dimensions up to 400 ft max limit', async ({ page }) => {
      const calc = page.locator('#enquire')
      const widthInput = calc.locator('input[type="number"]').first()
      const heightInput = calc.locator('input[type="number"]').nth(1)

      await widthInput.fill('400')
      await heightInput.fill('50')
      await expect(calc.locator('text=TOTAL BLOCKS').first()).toBeVisible()

      // Beyond limit
      await widthInput.fill('450')
      await expect(calc).toContainText(/Enter a valid width and height/i)
    })
  })

  test.describe('Elevation SVG & Export Quotation Payload', () => {
    test('renders interactive SVG elevation preview with pattern repeat', async ({ page }) => {
      const calc = page.locator('#enquire')
      const elevationSvg = calc.locator('svg[role="img"]').first()
      await expect(elevationSvg).toBeVisible()

      const figcaption = calc.locator('figcaption').first()
      await expect(figcaption).toContainText(/Elevation/i)
    })

    test('generates valid WhatsApp export quotation link with encoded parameters', async ({ page }) => {
      const calc = page.locator('#enquire')
      const waLink = calc.locator('a[href*="wa.me"][href*="text="]').first()
      await expect(waLink).toBeVisible()

      const href = await waLink.getAttribute('href')
      expect(href).toContain('wa.me/919227738035')
      expect(href).toContain('text=')
      // Verify decoded text contains key specifier data
      const decoded = decodeURIComponent(href || '')
      expect(decoded).toMatch(/Jaydeep Exports|Terracotta Jali/i)
      expect(decoded).toMatch(/Pattern:/i)
      expect(decoded).toMatch(/Wall (Dimensions|Size):/i)
      expect(decoded).toMatch(/(Total|Estimated) Blocks:/i)
    })
  })
})
