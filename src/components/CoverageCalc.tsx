import { useId, useState, useMemo } from 'react'
import { PATTERNS, PATTERN_IDS, type PatternId } from '../data/patterns'
import { CONTACT } from '../data/contact'
import { rfqStore } from '../data/rfqState'

export const MODULE_FT = 8 / 12 // 0.6667 ft (8 inches nominal)
export const MODULE_M = 0.2032 // 203.2 mm (20.32 cm)
export const WEIGHT_PER_BLOCK_KG = 3.2 // average unglazed terracotta jali tile
export const BLOCKS_PER_PALLET = 450 // standard ISPM-15 export pallet
export const PALLET_TARE_KG = 25 // ISPM-15 heat treated wooden pallet tare

export type PortId = 'Mundra' | 'Nhava Sheva'

export interface PortDetails {
  id: PortId
  code: string
  name: string
  payloadLimitMT: number
  transitHours: number
  distanceKm: number
  description: string
  advantages: string
}

export const SEAPORTS: Record<PortId, PortDetails> = {
  Mundra: {
    id: 'Mundra',
    code: 'INMUN',
    name: 'Mundra Port (Gujarat)',
    payloadLimitMT: 27.0,
    transitHours: 4,
    distanceKm: 190,
    description: 'Deep-water high-capacity terminal on the Gulf of Kutch.',
    advantages: 'Highest payload allowance (27 MT), direct 4h expressway transit from Morbi works.',
  },
  'Nhava Sheva': {
    id: 'Nhava Sheva',
    code: 'INNSA',
    name: 'Nhava Sheva / JNPT (Mumbai)',
    payloadLimitMT: 21.5,
    transitHours: 20,
    distanceKm: 780,
    description: 'Premier national container gateway on the West Coast.',
    advantages: 'Extensive worldwide direct liner rotations; statutory 21.5 MT highway limit.',
  },
}

export interface PackingCalcResult {
  width: number
  height: number
  unit: 'ft' | 'm'
  across: number
  down: number
  baseBlocks: number
  reserveBlocks: number
  palletCount: number
  netWeightKg: number
  grossWeightMT: number
  containerPort: PortId
  containerFillPct: number
  containerPayloadLimitMT: number
  containersRequired: number
}

export function CoverageCalc() {
  const uid = useId()
  const [unit, setUnit] = useState<'ft' | 'm'>('ft')
  const [w, setW] = useState(unit === 'ft' ? '14' : '4.5')
  const [h, setH] = useState(unit === 'ft' ? '10' : '3.0')
  const [pattern, setPattern] = useState<PatternId>('star')
  const [selectedPort, setSelectedPort] = useState<PortId>('Mundra')
  const [addedToast, setAddedToast] = useState(false)

  const width = Number(w)
  const height = Number(h)
  const isFt = unit === 'ft'
  const moduleSize = isFt ? MODULE_FT : MODULE_M
  const maxDim = isFt ? 400 : 120
  const minDim = isFt ? 0.67 : 0.2
  const valid = !isNaN(width) && !isNaN(height) && width >= minDim && height >= minDim && width <= maxDim && height <= maxDim

  const calcResult = useMemo<PackingCalcResult | null>(() => {
    if (!valid) return null

    const across = Math.ceil(width / moduleSize)
    const down = Math.ceil(height / moduleSize)
    const baseBlocks = across * down
    const reserveBlocks = Math.ceil(baseBlocks * 1.05) // 5% architectural reserve buffer
    const palletCount = Math.ceil(reserveBlocks / BLOCKS_PER_PALLET)
    const netWeightKg = reserveBlocks * WEIGHT_PER_BLOCK_KG
    const grossWeightKg = netWeightKg + palletCount * PALLET_TARE_KG
    const grossWeightMT = Number((grossWeightKg / 1000).toFixed(2))

    const port = SEAPORTS[selectedPort]
    const containerPayloadLimitMT = port.payloadLimitMT
    const containersRequired = Math.max(1, Math.ceil(grossWeightMT / containerPayloadLimitMT))
    const singleContainerUtil = Math.round((grossWeightMT / containerPayloadLimitMT) * 100)
    const containerFillPct = Math.min(100, singleContainerUtil)

    return {
      width,
      height,
      unit,
      across,
      down,
      baseBlocks,
      reserveBlocks,
      palletCount,
      netWeightKg,
      grossWeightMT,
      containerPort: selectedPort,
      containerFillPct,
      containerPayloadLimitMT,
      containersRequired,
    }
  }, [valid, width, height, unit, moduleSize, selectedPort])

  const toggleUnit = (newUnit: 'ft' | 'm') => {
    if (newUnit === unit) return
    if (newUnit === 'm') {
      const convertedW = (Number(w) * 0.3048).toFixed(1)
      const convertedH = (Number(h) * 0.3048).toFixed(1)
      setW(convertedW)
      setH(convertedH)
    } else {
      const convertedW = (Number(w) / 0.3048).toFixed(1)
      const convertedH = (Number(h) / 0.3048).toFixed(1)
      setW(convertedW)
      setH(convertedH)
    }
    setUnit(newUnit)
  }

  const handleAddToCart = () => {
    if (!calcResult) return
    rfqStore.addItem({
      productSlug: pattern,
      productName: `${PATTERNS[pattern].label} Jali Screen`,
      patternId: pattern,
      finish: 'clay',
      quantity: calcResult.reserveBlocks,
      unit: 'pieces',
      application: 'screen',
      customNotes: `Calculated from ${width}${unit} x ${height}${unit} wall elevation (${calcResult.across} cols x ${calcResult.down} rows). Port: ${selectedPort} (${SEAPORTS[selectedPort].code}). Gross: ~${calcResult.grossWeightMT} MT across ${calcResult.palletCount} pallets.`,
    })
    setAddedToast(true)
    setTimeout(() => setAddedToast(false), 3000)
  }

  const waQuoteText = useMemo(() => {
    if (!calcResult) return ''
    const port = SEAPORTS[selectedPort]
    return encodeURIComponent(
      `Hello Gautam,\nI would like an architectural export quotation for Jaydeep Exports Terracotta Jali:\n\n` +
      ` -  Pattern: ${PATTERNS[pattern].label}\n` +
      ` -  Wall Dimensions: ${width} ${unit} (W) x ${height} ${unit} (H)\n` +
      ` -  Module Grid: ${calcResult.across} cols x ${calcResult.down} rows\n` +
      ` -  Total Blocks: ${calcResult.reserveBlocks.toLocaleString()} units (Base: ${calcResult.baseBlocks} + 5% reserve)\n` +
      ` -  Export Packaging: ${calcResult.palletCount} ISPM-15 Pallets (450 blocks/pallet + 25kg tare)\n` +
      ` -  Gross Shipping Weight: ~${calcResult.grossWeightMT} MT\n` +
      ` -  Port of Loading: ${port.name} [${port.code}] (${port.payloadLimitMT} MT limit, ${port.transitHours}h transit)\n` +
      ` -  20ft Container Utilization: ${calcResult.containerFillPct}% (${calcResult.containersRequired} x 20ft FCL)\n` +
      ` -  Target Destination Port: [Please advise CIF rates to target port]`
    )
  }, [calcResult, pattern, width, height, unit, selectedPort])

  const port = SEAPORTS[selectedPort]

  return (
    <div className="border border-kiln-3 bg-kiln-2 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg text-bone" style={{ fontStretch: '108%' }}>
            Architectural Wall & Export Calculator
          </h3>
          <p className="t-body mt-1 text-xs text-bone-dim">
            Standard 8 x 8 in (203.2 x 203.2 mm) modular terracotta jali units.
          </p>
        </div>
        <div className="flex items-center border border-kiln-3 bg-kiln p-0.5 text-xs">
          <button
            type="button"
            onClick={() => toggleUnit('ft')}
            className={`px-2.5 py-1 transition-colors ${
              unit === 'ft' ? 'bg-bone text-kiln font-medium' : 'text-bone-dim hover:text-bone'
            }`}
          >
            Feet (ft)
          </button>
          <button
            type="button"
            onClick={() => toggleUnit('m')}
            className={`px-2.5 py-1 transition-colors ${
              unit === 'm' ? 'bg-bone text-kiln font-medium' : 'text-bone-dim hover:text-bone'
            }`}
          >
            Meters (m)
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field
          id={`${uid}-w`}
          label="Wall width"
          unit={unit}
          value={w}
          onChange={setW}
          min={minDim}
          max={maxDim}
        />
        <Field
          id={`${uid}-h`}
          label="Wall height"
          unit={unit}
          value={h}
          onChange={setH}
          min={minDim}
          max={maxDim}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-p`} className="t-spec text-xs text-bone-dim">
            PATTERN OF CHOICE
          </label>
          <select
            id={`${uid}-p`}
            value={pattern}
            onChange={(e) => setPattern(e.target.value as PatternId)}
            className="border border-kiln-3 bg-kiln px-3 py-2 text-sm text-bone focus:border-ember focus:outline-none"
          >
            {PATTERN_IDS.map((id) => (
              <option key={id} value={id}>
                {PATTERNS[id].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Port of Loading Freight Selector */}
      <div className="mt-5 border border-kiln-3 bg-kiln p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-kiln-3 pb-3">
          <div>
            <span className="t-spec text-xs text-bone-dim">PORT OF LOADING FREIGHT DISPATCH</span>
            <p className="mt-0.5 text-xs text-bone">Select export seaport for statutory weight & transit limit</p>
          </div>
          <span className="border border-ember/30 bg-kiln-2 px-2.5 py-0.5 text-[11px] text-ember">
            {port.code}  -  {port.transitHours}h road transit
          </span>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(['Mundra', 'Nhava Sheva'] as PortId[]).map((pId) => {
            const p = SEAPORTS[pId]
            const active = selectedPort === pId
            return (
              <button
                key={pId}
                type="button"
                onClick={() => setSelectedPort(pId)}
                className={`flex flex-col text-left p-3 border transition-all ${
                  active
                    ? 'border-ember bg-kiln-2 text-bone'
                    : 'border-kiln-3 bg-kiln text-bone-dim hover:border-bone-dim/40 hover:text-bone'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-sm text-bone">{p.name}</span>
                  <span className="t-spec text-xs text-ember font-mono">{p.code}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-bone-dim">
                  <span>Max Payload: <strong className="text-bone">{p.payloadLimitMT} MT</strong></span>
                  <span>Transit: <strong className="text-bone">{p.transitHours}h</strong> ({p.distanceKm} km)</span>
                </div>
                <p className="mt-1.5 text-[11px] text-bone-dim line-clamp-1">{p.advantages}</p>
              </button>
            )
          })}
        </div>
      </div>

      {calcResult ? (
        <>
          {/* Key Metrics Grid */}
          <div className="mt-5 grid grid-cols-2 gap-3 border border-kiln-3 bg-kiln p-4 sm:grid-cols-4">
            <div>
              <p className="t-spec text-[11px] text-bone-dim">TOTAL BLOCKS</p>
              <p className="text-xl font-medium text-bone">
                {calcResult.reserveBlocks.toLocaleString()}{' '}
                <span className="text-xs text-bone-dim font-normal">(+5% res)</span>
              </p>
              <p className="t-spec mt-0.5 text-[10px] text-bone-dim">
                Base: {calcResult.baseBlocks.toLocaleString()} ({calcResult.across}w x {calcResult.down}h)
              </p>
            </div>

            <div>
              <p className="t-spec text-[11px] text-bone-dim">EST. WEIGHT / GROSS (MT)</p>
              <p className="text-xl font-medium text-bone">
                {calcResult.grossWeightMT}{' '}
                <span className="text-xs text-bone-dim font-normal">MT</span>
              </p>
              <p className="t-spec mt-0.5 text-[10px] text-bone-dim">
                Incl. {calcResult.palletCount * PALLET_TARE_KG}kg pallet tare
              </p>
            </div>

            <div>
              <p className="t-spec text-[11px] text-bone-dim">ISPM-15 PALLETS</p>
              <p className="text-xl font-medium text-bone">
                {calcResult.palletCount}{' '}
                <span className="text-xs text-bone-dim font-normal">Pallets</span>
              </p>
              <p className="t-spec mt-0.5 text-[10px] text-bone-dim">
                450 blocks / pallet (1.1x1.1m)
              </p>
            </div>

            <div>
              <p className="t-spec text-[11px] text-bone-dim">20FT CONTAINER LOAD</p>
              <p className={`text-xl font-medium ${calcResult.grossWeightMT > port.payloadLimitMT ? 'text-amber-400' : 'text-ember'}`}>
                {calcResult.containerFillPct}%{' '}
                <span className="text-xs text-bone-dim font-normal">
                  {calcResult.containersRequired > 1 ? `(${calcResult.containersRequired} FCL)` : 'payload'}
                </span>
              </p>
              <p className="t-spec mt-0.5 text-[10px] text-bone-dim">
                Cap: {port.payloadLimitMT} MT ({port.code})
              </p>
            </div>
          </div>

          {/* Container Utilization Progress Bar & Capacity Warnings */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-bone-dim mb-1">
              <span>20ft Container Payload Utilization ({port.name})</span>
              <span>
                {calcResult.grossWeightMT} MT / {calcResult.containersRequired * port.payloadLimitMT} MT Capacity
              </span>
            </div>
            <div className="h-2 w-full bg-kiln border border-kiln-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  calcResult.grossWeightMT > port.payloadLimitMT ? 'bg-amber-500' : 'bg-ember'
                }`}
                style={{ width: `${calcResult.containerFillPct}%` }}
              />
            </div>

            {calcResult.grossWeightMT > port.payloadLimitMT ? (
              <div className="mt-2 flex items-start gap-2 border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-200">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p>
                  <strong>Multi-Container Shipment:</strong> Shipment gross weight ({calcResult.grossWeightMT} MT) exceeds single 20ft container limit of {port.payloadLimitMT} MT at {port.code}. Requires <strong>{calcResult.containersRequired} x 20ft FCL</strong> containers.
                </p>
              </div>
            ) : (
              <p className="mt-1 text-[11px] text-bone-dim">
                Export shipments dispatched via {port.name} in heat-treated ISPM-15 shrink-wrapped pallets with 4-way PET strapping.
              </p>
            )}
          </div>

          {/* SVG Wall Elevation Preview */}
          <figure className="mt-4">
            <div className="border border-kiln-3 bg-kiln p-3">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-auto w-full"
                style={{ maxHeight: '14rem' }}
                role="img"
                aria-label={`Elevation preview of a ${width} by ${height} ${unit} wall in ${PATTERNS[pattern].label} pattern`}
              >
                <defs>
                  <pattern
                    id={`wall-${uid}`}
                    patternUnits="userSpaceOnUse"
                    width={moduleSize}
                    height={moduleSize}
                    viewBox="0 0 100 100"
                  >
                    <path
                      d={`M0,0 H100 V100 H0 Z ${PATTERNS[pattern].holes.join(' ')}`}
                      fillRule="evenodd"
                      fill="#b4552c"
                    />
                    <rect width="100" height="100" fill="none" stroke="#1d1815" strokeWidth="2" />
                  </pattern>
                </defs>
                <rect width={width} height={height} fill="#241d18" />
                <rect width={width} height={height} fill={`url(#wall-${uid})`} />
              </svg>
            </div>
            <figcaption className="t-spec mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-bone-dim">
              <span>
                {width} {unit} x {height} {unit} Elevation ({calcResult.across} cols x {calcResult.down} rows  -  {calcResult.baseBlocks} blocks + 5% res)
              </span>
              <span className="text-bone">
                {PATTERNS[pattern].label} Pattern
              </span>
            </figcaption>
          </figure>

          {/* Actions: Add to RFQ Drawer & WhatsApp Quote Link */}
          <div className="mt-5 flex flex-wrap items-center gap-3 pt-3 border-t border-kiln-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 min-w-[180px] bg-bone px-4 py-2.5 text-center text-sm font-semibold text-kiln transition-all hover:bg-white active:scale-[0.99]"
              style={{ fontStretch: '92%' }}
            >
              Add Wall to RFQ Cart &rarr;
            </button>

            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=${waQuoteText}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-w-[180px] border border-ember/60 bg-kiln px-4 py-2.5 text-center text-sm font-medium text-ember transition-colors hover:bg-ember/10 hover:text-white"
              style={{ fontStretch: '92%' }}
            >
              Request Quote on WhatsApp &rarr;
            </a>
          </div>

          {addedToast && (
            <p className="mt-2 text-center text-xs text-green-400 transition-all">
              ? Added {calcResult.reserveBlocks} {PATTERNS[pattern].label} blocks to RFQ Drawer!
            </p>
          )}
        </>
      ) : (
        <p className="mt-5 text-sm text-ember">
          Enter a valid width and height between {minDim} and {maxDim} {unit}.
        </p>
      )}
    </div>
  )
}

function Field({
  id,
  label,
  unit,
  value,
  onChange,
  min,
  max,
}: {
  id: string
  label: string
  unit: string
  value: string
  onChange: (v: string) => void
  min: number
  max: number
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="t-spec text-xs text-bone-dim">
        {label.toUpperCase()}
      </label>
      <div className="flex items-center border border-kiln-3 bg-kiln focus-within:border-ember">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={0.1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2 text-bone text-sm focus:outline-none"
        />
        <span className="t-spec px-3 text-xs text-bone-dim">{unit}</span>
      </div>
    </div>
  )
}
