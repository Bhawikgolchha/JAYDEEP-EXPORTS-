import { test, expect } from '@playwright/test'

test.describe('Jaydeep Exports 3D Architectural Landing Page', () => {
  test('Hero section loads with navigation and displays heading', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Jaydeep Exports/i)

    const heading = page.locator('h1')
    await expect(heading).toContainText(/Cut clay/i)

    const nav = page.getByRole('navigation').first()
    await expect(nav).toBeVisible()
  })

  test('Pattern studio allows selecting different Jali patterns and clay finishes', async ({ page }) => {
    await page.goto('/')
    const patternSection = page.locator('#patterns')
    await expect(patternSection).toBeVisible()

    // Test pattern selection button inside #patterns section
    const circleBtn = patternSection.locator('button', { hasText: /Circle/i })
    await circleBtn.click()
    await expect(circleBtn).toHaveAttribute('aria-pressed', 'true')

    // Test clay finish selection
    const smokedFinish = patternSection.locator('button', { hasText: /Smoked Charcoal/i })
    await smokedFinish.click()
    await expect(smokedFinish).toHaveClass(/border-ember/)
  })

  test('Architectural Export Calculator computes blocks, weight and container payload', async ({ page }) => {
    await page.goto('/')
    const calcSection = page.locator('#enquire')
    await expect(calcSection).toBeVisible()

    // Test calculator inputs
    const widthInput = page.locator('input[type="number"]').first()
    await widthInput.fill('20')

    const heightInput = page.locator('input[type="number"]').nth(1)
    await heightInput.fill('10')

    // Expect container load metric to be visible
    await expect(page.locator('text=20FT CONTAINER').first()).toBeVisible()
    await expect(page.locator('text=EST. WEIGHT').first()).toBeVisible()

    // Test Unit toggle (Feet to Meters)
    const metersBtn = page.getByRole('button', { name: 'Meters (m)' })
    await metersBtn.click()
    await expect(metersBtn).toHaveClass(/bg-bone/)
  })

  test('Enquiry form validates required inputs before submitting', async ({ page }) => {
    await page.goto('/')
    const form = page.locator('form')
    await expect(form).toBeVisible()

    // Submit empty form
    const submitBtn = form.getByRole('button', { name: /Enquire/i })
    await submitBtn.click()

    // Assert validation errors appear
    await expect(page.locator('text=Add your name').first()).toBeVisible()
    await expect(page.locator('text=Add a country').first()).toBeVisible()
  })

  test('Technical specifications and ASTM C652 certifications are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=ASTM C652').first()).toBeVisible()
    await expect(page.locator('text=COMPRESSIVE STRENGTH').first()).toBeVisible()
    await expect(page.locator('text=PASSIVE COOLING').first()).toBeVisible()
  })
})
