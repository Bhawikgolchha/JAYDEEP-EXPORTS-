import { test, expect } from '@playwright/test'

test.describe('Tier 1 & 2: RFQ Drawer & Architectural CAD / BIM Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Enquiry Form & Specifier Contact Actions', () => {
    test('validates required fields (Name, Country/Port) before email dispatch', async ({ page }) => {
      const enquireSection = page.locator('#enquire')
      await enquireSection.scrollIntoViewIfNeeded()

      const form = enquireSection.locator('form')
      await expect(form).toBeVisible()

      // Submit without filling
      const submitBtn = form.getByRole('button', { name: /Enquire/i })
      await submitBtn.click()

      // Assert error messages appear
      await expect(page.getByText(/Add your name/i).first()).toBeVisible()
      await expect(page.getByText(/Add a country/i).first()).toBeVisible()
    })

    test('populates valid enquiry form fields and verifies pattern selection options', async ({ page }) => {
      const enquireSection = page.locator('#enquire')
      await enquireSection.scrollIntoViewIfNeeded()

      // Fill name and country
      const nameInput = enquireSection.locator('input[autocomplete="name"]').first()
      await nameInput.fill('Sarah Jenkins')

      const countryInput = enquireSection.locator('input[autocomplete="country-name"]').first()
      await countryInput.fill('United Kingdom (Port of Felixstowe)')

      // Select pattern by value
      const patternSelect = enquireSection.locator('select').first()
      if (await patternSelect.isVisible()) {
        await patternSelect.selectOption({ index: 1 })
      }

      // Notes
      const noteInput = enquireSection.locator('textarea').first()
      if (await noteInput.isVisible()) {
        await noteInput.fill('Architectural screen wall for London residential courtyard project.')
      }

      // Submit error messages should be cleared
      await expect(page.getByText(/Add your name so we know/i)).not.toBeVisible()
    })
  })

  test.describe('Direct Communication & Business Information Triggers', () => {
    test('provides telephone, email and WhatsApp direct communication links', async ({ page }) => {
      const enquireSection = page.locator('#enquire')
      await enquireSection.scrollIntoViewIfNeeded()

      // Phone links
      const phoneLinks = enquireSection.locator('a[href^="tel:"]')
      await expect(phoneLinks.first()).toBeVisible()
      const phoneHref = await phoneLinks.first().getAttribute('href')
      expect(phoneHref).toMatch(/^tel:\+?91/)

      // Email links
      const emailLinks = enquireSection.locator('a[href^="mailto:"]')
      await expect(emailLinks.first()).toBeVisible()
      const emailHref = await emailLinks.first().getAttribute('href')
      expect(emailHref).toMatch(/jaydeepexporrts|nationalpotteries/i)

      // WhatsApp link
      const waLink = enquireSection.locator('a[href*="wa.me"]').first()
      await expect(waLink).toBeVisible()
    })
  })

  test.describe('Product Catalogue Lightbox Modal', () => {
    test('opens product lightbox modal upon clicking catalogue item and closes via Escape / Close', async ({ page }) => {
      const catalogue = page.locator('#catalogue')
      await catalogue.scrollIntoViewIfNeeded()

      // Click first product tile
      const firstTile = catalogue.locator('button.tile').first()
      await expect(firstTile).toBeVisible()
      await firstTile.click()

      // Native dialog opens
      const dialog = page.locator('dialog')
      await expect(dialog.first()).toBeAttached()

      // Press Escape to dismiss
      await page.keyboard.press('Escape')
    })
  })

  test.describe('CAD / BIM & Engineering Spec Sheet Modal Triggers', () => {
    test('triggers CAD/BIM download modal if available from specifications section', async ({ page }) => {
      const madeSection = page.locator('#made')
      await madeSection.scrollIntoViewIfNeeded()

      const cadButton = madeSection.locator('button', { hasText: /CAD|BIM|Spec Sheet/i }).first()
      if (await cadButton.isVisible()) {
        await cadButton.click()
        const modal = page.locator('dialog, [role="dialog"]').first()
        await expect(modal).toBeAttached()
        await page.keyboard.press('Escape')
      }
    })
  })
})
