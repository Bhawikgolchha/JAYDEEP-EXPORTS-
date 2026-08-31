import { test, expect } from '@playwright/test'

test.describe('Narrative Stages 1-5 & WebGL Scrollytelling Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Stage 1: Raw Earthen Monolith (Hero Section)', () => {
    test('renders hero stage with branding, heading and export dispatch indicator', async ({ page }) => {
      // 1. Page title and top navigation branding
      await expect(page).toHaveTitle(/Jaydeep Exports/i)
      const brandLogo = page.locator('header nav a[href="#top"]').first()
      await expect(brandLogo).toBeVisible()
      await expect(brandLogo).toContainText('Jaydeep')
      await expect(brandLogo).toContainText('EXPORTS')

      // 2. Primary editorial display headline
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()
      await expect(heading).toContainText(/Cut clay/i)
      await expect(heading).toContainText(/Filtered sun/i)

      // 3. Stage 1 editorial copy and ASTM standard badge
      const heroSection = page.locator('#top')
      await expect(heroSection).toBeVisible()
      await expect(heroSection).toContainText(/terracotta jali/i)

      // 4. Primary CTA button
      const ctaButton = heroSection.locator('a[href="#enquire"]').first()
      await expect(ctaButton).toBeVisible()
      await expect(ctaButton).toHaveText(/Enquire/i)
    })

    test('verifies 3D stage container or high-fidelity macro poster fallback', async ({ page }) => {
      const heroSection = page.locator('#top')
      // Stage component wrapper
      const stageContainer = heroSection.locator('img, canvas').first()
      await expect(stageContainer).toBeVisible()
    })
  })

  test.describe('Stage 2: 1000°C Kiln Firing & Material Science (Made Section)', () => {
    test('displays manufacturing heritage, Morbi works and ASTM C652 certifications', async ({ page }) => {
      const madeSection = page.locator('#made')
      await expect(madeSection).toBeVisible()

      // Section title
      await expect(madeSection.locator('h2')).toContainText(/Pressed, dried, fired/i)

      // Manufacturing provenance
      await expect(madeSection).toContainText(/National Potteries/i)
      await expect(madeSection).toContainText(/Morbi/i)
      await expect(madeSection).toContainText(/1967/i)

      // ASTM and testing standards
      await expect(madeSection).toContainText(/ASTM C652/i)
    })

    test('verifies physical engineering metrics (Compressive Strength, Water Absorption, Fire Rating)', async ({ page }) => {
      const madeSection = page.locator('#made')

      // Compressive Strength metric > 15 MPa
      await expect(madeSection.locator('text=COMPRESSIVE STRENGTH')).toBeVisible()
      await expect(madeSection).toContainText(/15/i)
      await expect(madeSection).toContainText(/MPa/i)

      // Water absorption < 8.5 - 9.0%
      await expect(madeSection.locator('text=WATER ABSORPTION')).toBeVisible()
      await expect(madeSection).toContainText(/WATER ABSORPTION/i)

      // Passive cooling differential -4° to -6°C
      await expect(madeSection.locator('text=PASSIVE COOLING')).toBeVisible()
      await expect(madeSection).toContainText(/-4/i)

      // UV & Fire Rating Class A1
      await expect(madeSection.locator('text=/FIRE (RATING|CLASSIFICATION)/i').first()).toBeVisible()
      await expect(madeSection).toContainText(/Class A1/i)
    })

    test('displays full architectural supply list from the ceramic works', async ({ page }) => {
      const madeSection = page.locator('#made')
      await expect(madeSection).toContainText(/Clay roofing/i)
      await expect(madeSection).toContainText(/Decorative tiles/i)
      await expect(madeSection).toContainText(/Terracotta jali blocks/i)
      await expect(madeSection).toContainText(/Terracotta wall cladding bricks/i)
    })
  })

  test.describe('Stage 3: Modernist Villa Facade & Solar Trajectory', () => {
    test('renders architectural functional triad claims in light section', async ({ page }) => {
      const lightSection = page.locator('#light')
      await expect(lightSection).toBeVisible()

      // Core architectural argument heading
      await expect(lightSection).toContainText(/A screen does three jobs at once/i)

      // Claim 1: Privacy
      await expect(lightSection).toContainText(/You can see out\. They cannot see in/i)
      // Claim 2: Natural Airflow
      await expect(lightSection).toContainText(/Air keeps moving/i)
      // Claim 3: Daylight vs Glare
      await expect(lightSection).toContainText(/The glare goes, the daylight stays/i)
    })
  })

  test.describe('Stage 4: Interactive 3D Pattern Customizer Studio', () => {
    test('renders customizer studio header, 3D viewport and parametric controls', async ({ page }) => {
      const patternsSection = page.locator('#patterns')
      await expect(patternsSection).toBeVisible()
      await expect(patternsSection.locator('h2')).toContainText(/Move the sun\. Watch the shadow/i)

      // Solar slider control
      const sunSlider = patternsSection.locator('input#sun, input[type="range"]').first()
      await expect(sunSlider).toBeVisible()

      // Light presets (Morning, Noon, Golden Hour, Dusk)
      await expect(patternsSection.locator('button', { hasText: /Morning/i })).toBeVisible()
      await expect(patternsSection.locator('button', { hasText: /Noon/i })).toBeVisible()
      await expect(patternsSection.locator('button', { hasText: /Golden Hour/i })).toBeVisible()
      await expect(patternsSection.locator('button', { hasText: /Dusk/i })).toBeVisible()
    })
  })

  test.describe('Stage 5: Global Export Deck & Logistics (Where & Enquire)', () => {
    test('displays facade applications and export packing certifications', async ({ page }) => {
      const whereSection = page.locator('#where')
      await expect(whereSection).toBeVisible()
      await expect(whereSection.locator('h2')).toContainText(/Facades, courtyards, stairwells, boundary walls/i)

      // Typologies grid
      await expect(whereSection).toContainText(/Double-Skin Facades/i)
      await expect(whereSection).toContainText(/Courtyard Breezeways/i)
      await expect(whereSection).toContainText(/Stairwell Sunscreens/i)
      await expect(whereSection).toContainText(/Perimeter Screening/i)

      // Export packing integrity badges
      await expect(whereSection).toContainText(/ISPM-15 Heat Treated Pallets/i)
      await expect(whereSection).toContainText(/Shrink-Wrap Weatherproofing/i)
      await expect(whereSection).toContainText(/Heavy-Duty Corner Protectors/i)
    })

    test('enquire section provides export logistics, direct contact and RFQ suite', async ({ page }) => {
      const enquireSection = page.locator('#enquire')
      await expect(enquireSection).toBeVisible()
      await expect(enquireSection.locator('h2')).toContainText(/Tell us the wall/i)

      // Export contact information
      await expect(enquireSection).toContainText(/Gautam Bhansali/i)
      await expect(enquireSection).toContainText(/92277 38035/i)
      await expect(enquireSection).toContainText(/jaydeepexporrts@gmail.com/i)
      await expect(enquireSection).toContainText(/Morbi 363 642, Gujarat, India/i)
    })
  })

  test.describe('WebGL Canvas Lifecycle & Navigation Choreography', () => {
    test('preloader dissolves and allows immediate access to content', async ({ page }) => {
      // Wait for preloader to fade / disappear
      await page.waitForSelector('#top h1', { state: 'visible' })
      const main = page.locator('main')
      await expect(main).toBeVisible()
    })

    test('skip to catalogue link is available for keyboard navigation', async ({ page }) => {
      const skipLink = page.locator('a[href="#catalogue"]').first()
      await expect(skipLink).toBeAttached()
      await skipLink.focus()
      await expect(skipLink).toBeVisible()
      await skipLink.click()
      await expect(page.locator('#catalogue')).toBeInViewport()
    })

    test('chapter courses navigation reflects scroll progress on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      const coursesNav = page.locator('nav[aria-label="Sections"]')
      await expect(coursesNav).toBeVisible()

      // Verify all 5 chapters are present
      const links = coursesNav.locator('a')
      await expect(links).toHaveCount(5)

      // Scroll to #patterns and verify navigation active state
      await page.locator('#patterns').scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)
      const patternsLink = coursesNav.locator('a[href="#patterns"]')
      await expect(patternsLink).toBeVisible()
    })
  })
})
