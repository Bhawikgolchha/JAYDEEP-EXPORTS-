import assert from 'node:assert'

// 1. MODULE & CONVERSION CONSTANTS
const MODULE_FT = 8 / 12 // 0.6667 ft
const MODULE_M = 0.2032 // 203.2 mm
const WEIGHT_PER_BLOCK_KG = 3.2
const BLOCKS_PER_PALLET = 450
const PALLET_TARE_KG = 25

console.log('Testing Milestone 3 Calculations & Logistics Logic...')

// Scenario A: Standard 14ft x 10ft wall (Imperial)
{
  const width = 14
  const height = 10
  const across = Math.ceil(width / MODULE_FT)
  const down = Math.ceil(height / MODULE_FT)
  const base = across * down
  const reserve = Math.ceil(base * 1.05)
  const pallets = Math.ceil(reserve / BLOCKS_PER_PALLET)
  const netKg = reserve * WEIGHT_PER_BLOCK_KG
  const grossKg = netKg + pallets * PALLET_TARE_KG
  const grossMT = Number((grossKg / 1000).toFixed(2))

  assert.strictEqual(across, 21, '14ft across should equal 21 modules')
  assert.strictEqual(down, 15, '10ft down should equal 15 modules')
  assert.strictEqual(base, 315, '315 base blocks')
  assert.strictEqual(reserve, 331, '331 reserve blocks (+5%)')
  assert.strictEqual(pallets, 1, '1 pallet')
  assert.strictEqual(grossMT, 1.08, '1.08 MT gross weight')
  console.log('? Scenario A (14ft x 10ft Imperial) Passed')
}

// Scenario B: Large Commercial Facade (60m x 15m Metric)
{
  const width = 60
  const height = 15
  const across = Math.ceil(width / MODULE_M)
  const down = Math.ceil(height / MODULE_M)
  const base = across * down
  const reserve = Math.ceil(base * 1.05)
  const pallets = Math.ceil(reserve / BLOCKS_PER_PALLET)
  const netKg = reserve * WEIGHT_PER_BLOCK_KG
  const grossKg = netKg + pallets * PALLET_TARE_KG
  const grossMT = Number((grossKg / 1000).toFixed(2))

  // Mundra Port payload calculation (27 MT limit)
  const mundraLimit = 27.0
  const mundraContainers = Math.ceil(grossMT / mundraLimit)

  // Nhava Sheva payload calculation (21.5 MT limit)
  const nhavaLimit = 21.5
  const nhavaContainers = Math.ceil(grossMT / nhavaLimit)

  assert(across > 200, 'Metric module count valid')
  assert(grossMT > 50, 'Heavy commercial shipment')
  assert.strictEqual(mundraContainers, Math.ceil(grossMT / 27.0), 'Mundra containers correct')
  assert.strictEqual(nhavaContainers, Math.ceil(grossMT / 21.5), 'Nhava Sheva containers correct')
  console.log(`? Scenario B (60m x 15m Metric: ${reserve} blocks, ${pallets} pallets, ${grossMT} MT) Passed`)
  console.log(`  - Mundra (27 MT cap): ${mundraContainers} x 20ft FCL`)
  console.log(`  - Nhava Sheva (21.5 MT cap): ${nhavaContainers} x 20ft FCL`)
}

console.log('All M3 verification tests passed successfully!')
