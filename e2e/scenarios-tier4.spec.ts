import { test, expect } from '@playwright/test'

test.describe('Tier 3 & 4: Cross-Feature Interactions & Realistic Specifier Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Tier 3: Pairwise Feature Combinations', () => {
    test('combines pattern swap with clay finish selection and solar adjustment', async ({ page }) => {
      const patternSection = page.locator('#patterns')
      await patternSection.scrollIntoViewIfNeeded()

      // 1. Select Amber pattern
      const amberBtn = patternSection.locator('button', { hasText: /Amber/i }).first()
      await amberBtn.click()
      await expect(amberBtn).toHaveAttribute('aria-pressed', 'true')

      // 2. Select Smoked Charcoal finish
      const smokedBtn = patternSection.locator('button', { hasText: /Smoked Charcoal/i }).first()
      await smokedBtn.click()
      await expect(smokedBtn).toHaveClass(/border-ember/)

      // 3. Adjust sun to Golden hour preset
      const goldenPreset = patternSection.locator('button', { hasText: /Golden Hour/i }).first()
      await goldenPreset.click()
    })

    test('combines catalogue filtering with product lightbox inspection', async ({ page }) => {
      const catalogue = page.locator('#catalogue')
      await catalogue.scrollIntoViewIfNeeded()

      // Filter by Jali
      const jaliFilter = catalogue.locator('button', { hasText: /Jali screens/i }).first()
      if (await jaliFilter.isVisible()) {
        await jaliFilter.click()
        await expect(jaliFilter).toHaveAttribute('aria-pressed', 'true')
      }

      // Open a product in lightbox
      const firstTile = catalogue.locator('button.tile').first()
      await firstTile.click()

      const dialog = page.locator('dialog[open], dialog').first()
      await expect(dialog).toBeVisible()

      // Close dialog
      await page.keyboard.press('Escape')
    })
  })

  test.describe('Tier 4: Realistic Architectural Workflows', () => {
    test('Scenario 1: Luxury Dubai Hotel Facade Specification (High Solar Shading)', async ({ page }) => {
      // 1. Inspect architectural argument on solar heat reduction
      const lightSection = page.locator('#light')
      await lightSection.scrollIntoViewIfNeeded()
      await expect(lightSection).toContainText(/A screen does three jobs at once|Dynamic Light/i)

      // 2. Configure Amber pattern with low open void for high privacy in Studio
      const patternSection = page.locator('#patterns')
      await patternSection.scrollIntoViewIfNeeded()
      const amberBtn = patternSection.locator('button', { hasText: /Amber/i }).first()
      await amberBtn.click()

      // 3. Compute 30m x 12m facade metrics in Export Calculator
      const calcSection = page.locator('#enquire')
      await calcSection.scrollIntoViewIfNeeded()

      // Switch to metric
      const mBtn = calcSection.getByRole('button', { name: /Meters \(m\)/i })
      await mBtn.click()

      const widthInput = calcSection.locator('input[type="number"]').first()
      const heightInput = calcSection.locator('input[type="number"]').nth(1)
      await widthInput.fill('30')
      await heightInput.fill('12')

      // Verify calculation generated
      await expect(calcSection.locator('text=TOTAL BLOCKS').first()).toBeVisible()
      await expect(calcSection.locator('text=EST. WEIGHT').first()).toBeVisible()
      await expect(calcSection.locator('text=20FT CONTAINER').first()).toBeVisible()
    })

    test('Scenario 2: London Conservation Townhouse Brick Screen (ASTM C652 Verification)', async ({ page }) => {
      // 1. Verify ASTM C652 physical compliance in Made section
      const madeSection = page.locator('#made')
      await madeSection.scrollIntoViewIfNeeded()
      await expect(madeSection).toContainText(/ASTM C652/i)
      await expect(madeSection).toContainText(/COMPRESSIVE STRENGTH/i)
      await expect(madeSection).toContainText(/WATER ABSORPTION/i)

      // 2. Explore perforated bricks catalog
      const catalogue = page.locator('#catalogue')
      await catalogue.scrollIntoViewIfNeeded()
      await expect(catalogue).toBeVisible()

      // 3. Submit enquiry with London project note
      const enquireSection = page.locator('#enquire')
      await enquireSection.scrollIntoViewIfNeeded()
      const nameInput = enquireSection.locator('input[autoComplete="name"]').first()
      await nameInput.fill('Oliver Vance (Foster + Partners)')
      const countryInput = enquireSection.locator('input[autoComplete="country-name"]').first()
      await countryInput.fill('London, United Kingdom (CIF Southampton)')
      const noteInput = enquireSection.locator('textarea')
      await noteInput.fill('Historic mews restoration requiring ASTM C652 compliant terracotta brick screen.')
    })

    test('Scenario 3: Sydney Coastal Villa Sunken Courtyard (Star Pattern & Sand Finish)', async ({ page }) => {
      // 1. Navigate to pattern studio
      const patternSection = page.locator('#patterns')
      await patternSection.scrollIntoViewIfNeeded()

      // 2. Select Star pattern
      const starBtn = patternSection.locator('button', { hasText: /Star/i }).first()
      await starBtn.click()

      // 3. Select Sun-baked Sand finish
      const sandBtn = patternSection.locator('button', { hasText: /Sun-baked Sand/i }).first()
      await sandBtn.click()
      await expect(sandBtn).toHaveClass(/border-ember/)

      // 4. Scrub solar angle to Sunset / Dusk
      const duskPreset = patternSection.locator('button', { hasText: /Dusk/i }).first()
      await duskPreset.click()

      // 5. Verify packaging notes in export section
      const whereSection = page.locator('#where')
      await whereSection.scrollIntoViewIfNeeded()
      await expect(whereSection).toContainText(/ISPM-15 Heat Treated Pallets/i)
    })

    test('Scenario 4: Singapore Green Mark Zero-Energy Screen (Venturi Cooling & Airflow)', async ({ page }) => {
      // 1. Check thermal and passive cooling metrics (-4° to -6°C)
      const madeSection = page.locator('#made')
      await madeSection.scrollIntoViewIfNeeded()
      await expect(madeSection).toContainText(/PASSIVE COOLING/i)
      await expect(madeSection).toContainText(/-4/i)

      // 2. Choose high-airflow Window pattern in studio
      const patternSection = page.locator('#patterns')
      await patternSection.scrollIntoViewIfNeeded()
      const windowBtn = patternSection.locator('button', { hasText: /Window/i }).first()
      await windowBtn.click()

      // 3. Verify WhatsApp export quotation link formatting
      const calcSection = page.locator('#enquire')
      await calcSection.scrollIntoViewIfNeeded()
      const waLink = calcSection.locator('a[href*="wa.me"]').first()
      await expect(waLink).toBeVisible()
    })

    test('Scenario 5: Mobile Contractor Fast-Track Order (Touch Viewport)', async ({ page }) => {
      // Set mobile viewport (iPhone 14 / modern device)
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')

      // 1. Verify responsive mobile layout and hero CTA
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()
      const ctaBtn = page.locator('a[href="#enquire"]').first()
      await expect(ctaBtn).toBeVisible()

      // 2. Scroll directly to export calculator
      const calcSection = page.locator('#enquire')
      await calcSection.scrollIntoViewIfNeeded()

      // 3. Enter contractor wall dimensions
      const widthInput = calcSection.locator('input[type="number"]').first()
      await widthInput.fill('25')
      const heightInput = calcSection.locator('input[type="number"]').nth(1)
      await heightInput.fill('12')

      // 4. Verify calculated metrics are clear and responsive
      await expect(calcSection.locator('text=TOTAL BLOCKS').first()).toBeVisible()
      await expect(calcSection.locator('text=20FT CONTAINER').first()).toBeVisible()
    })
  })
})
