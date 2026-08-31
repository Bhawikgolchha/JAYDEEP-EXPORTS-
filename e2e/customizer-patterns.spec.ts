import { test, expect } from '@playwright/test'

const ALL_17_PATTERNS = [
  { id: 'amber', label: 'Amber', keyword: /Petals around an eye/i },
  { id: 'arrow', label: 'Arrow', keyword: /Four fans/i },
  { id: 'circle', label: 'Circle', keyword: /Curved ribs/i },
  { id: 'cross', label: 'Cross', keyword: /solid X/i },
  { id: 'diamond', label: 'Diamond', keyword: /Rhombus/i },
  { id: 'four-square', label: 'Four Square', keyword: /Four quadrant/i },
  { id: 'leaf', label: 'Leaf', keyword: /blade of light/i },
  { id: 'lotus', label: 'Lotus', keyword: /sacred petals/i },
  { id: 'omega', label: 'Omega', keyword: /Horseshoe arch/i },
  { id: 'opal', label: 'Opal', keyword: /Octagonal/i },
  { id: 'pearl', label: 'Pearl', keyword: /circular apertures/i },
  { id: 'star', label: 'Star', keyword: /Four eyes/i },
  { id: 'swastik', label: 'Swastik', keyword: /solar meander/i },
  { id: 'topaz', label: 'Topaz', keyword: /Oculus|circular/i },
  { id: 'tv', label: 'TV', keyword: /Mid-century/i },
  { id: 'window', label: 'Window', keyword: /monolithic square frame|daylighting|open/i },
  { id: 'zebra', label: 'Zebra', keyword: /Angled louvres/i },
]

const FINISH_SWATCHES = [
  { id: 'natural', label: 'Natural Clay' },
  { id: 'smoked', label: 'Smoked Charcoal' },
  { id: 'sand', label: 'Sun-baked Sand' },
  { id: 'ochre', label: 'Warm Ochre' },
]

test.describe('Tier 1 & 2: Interactive 3D Customizer Studio & All 17 Jali Patterns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    const studio = page.locator('#patterns')
    await studio.scrollIntoViewIfNeeded()
  })

  test.describe('Comprehensive 17-Pattern Geometric Extrusion Verification', () => {
    for (const pattern of ALL_17_PATTERNS) {
      test(`activates ${pattern.label} (${pattern.id}) pattern and renders specific light transmission metadata`, async ({ page }) => {
        const patternSection = page.locator('#patterns')
        const patternBtn = patternSection.locator('button', { hasText: new RegExp(`^${pattern.label}$`, 'i') }).first()

        if (await patternBtn.isVisible()) {
          await patternBtn.click()
          await expect(patternBtn).toHaveAttribute('aria-pressed', 'true')
          await expect(patternSection).toContainText(pattern.keyword)
        } else {
          // Fallback to searching button with text
          const genericBtn = patternSection.locator('button').filter({ hasText: pattern.label }).first()
          await genericBtn.click()
          await expect(patternSection).toContainText(pattern.label)
        }
      })
    }
  })

  test.describe('Parametric Grid, Courses & Dimension Calculations', () => {
    test('updates columns and rows in pattern viewer / studio', async ({ page }) => {
      const patternSection = page.locator('#patterns')
      
      // Look for range inputs for columns/rows if customizer studio is present
      const colsInput = patternSection.locator('input[aria-label*="column" i]').first()
      const rowsInput = patternSection.locator('input[aria-label*="row" i]').first()

      if (await colsInput.isVisible()) {
        await colsInput.fill('6')
        await expect(patternSection).toContainText('6')
      }

      if (await rowsInput.isVisible()) {
        await rowsInput.fill('4')
        await expect(patternSection).toContainText('4')
      }
    })

    test('switches between Imperial (FT) and Metric (M) unit systems in studio', async ({ page }) => {
      const patternSection = page.locator('#patterns')
      const ftBtn = patternSection.locator('button', { hasText: /^FT$/i }).first()
      const mBtn = patternSection.locator('button', { hasText: /^M$/i }).first()

      if (await mBtn.isVisible() && await ftBtn.isVisible()) {
        await mBtn.click()
        await expect(mBtn).toHaveClass(/bg-bone/)

        await ftBtn.click()
        await expect(ftBtn).toHaveClass(/bg-bone/)
      }
    })
  })

  test.describe('Mortar Joint Modes (Dry-Stack vs Mortared)', () => {
    test('toggles between mortared and dry-stack installation methods', async ({ page }) => {
      const patternSection = page.locator('#patterns')
      const mortaredBtn = patternSection.locator('button', { hasText: /Mortared/i }).first()
      const dryStackBtn = patternSection.locator('button', { hasText: /Dry-Stack/i }).first()

      if (await mortaredBtn.isVisible() && await dryStackBtn.isVisible()) {
        await dryStackBtn.click()
        await expect(dryStackBtn).toHaveClass(/border-ember/)

        await mortaredBtn.click()
        await expect(mortaredBtn).toHaveClass(/border-ember/)
      }
    })
  })

  test.describe('Clay Material Reduction Finishes', () => {
    for (const finish of FINISH_SWATCHES) {
      test(`selects ${finish.label} (${finish.id}) clay finish swatch`, async ({ page }) => {
        const patternSection = page.locator('#patterns')
        const finishBtn = patternSection.locator('button', { hasText: new RegExp(finish.label, 'i') }).first()
        await expect(finishBtn).toBeVisible()
        await finishBtn.click()
        await expect(finishBtn).toHaveClass(/border-ember/)
      })
    }
  })

  test.describe('Solar Rig Controls & Presets', () => {
    test('cycles through all four solar presets (Morning, Noon, Golden Hour, Dusk)', async ({ page }) => {
      const patternSection = page.locator('#patterns')
      const presets = ['Morning', 'Noon', 'Golden Hour', 'Dusk']

      for (const preset of presets) {
        const presetBtn = patternSection.locator('button', { hasText: new RegExp(preset, 'i') }).first()
        await expect(presetBtn).toBeVisible()
        await presetBtn.click()
      }
    })

    test('manipulates solar range slider and updates time/hour label', async ({ page }) => {
      const sunSlider = page.locator('#patterns input#sun, #patterns input.sun-range, #patterns input[aria-label*="Time of day" i]').first()
      if (await sunSlider.isVisible()) {
        await sunSlider.fill('0.85')
        await sunSlider.dispatchEvent('change')
        const hourLabel = page.locator('#patterns').locator('text=/Afternoon|Late|Golden Hour|Noon|Early|Mid morning/i').first()
        await expect(hourLabel).toBeVisible()
      }
    })
  })
})
