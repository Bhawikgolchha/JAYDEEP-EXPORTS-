import { useId, useState } from 'react'
import { PATTERNS, PATTERN_IDS, type PatternId } from '../data/patterns'
import { CONTACT } from '../data/contact'

const MODULE_FT = 8 / 12 // 0.6667 ft
const MODULE_M = 0.2032 // 20.32 cm
const WEIGHT_PER_BLOCK_KG = 3.2 // average unglazed terracotta jali tile
const BLOCKS_PER_PALLET = 450
const CONTAINER_20FT_CAPACITY_BLOCKS = 6200 // based on 21.5 MT max weight limit

export function CoverageCalc() {
  const uid = useId()
  const [unit, setUnit] = useState<'ft' | 'm'>('ft')
  const [w, setW] = useState(unit === 'ft' ? '14' : '4.5')
  const [h, setH] = useState(unit === 'ft' ? '10' : '3.0')
  const [pattern, setPattern] = useState<PatternId>('star')

  const width = Number(w)
  const height = Number(h)
  const isFt = unit === 'ft'
  const moduleSize = isFt ? MODULE_FT : MODULE_M
  const maxDim = isFt ? 400 : 120
  const valid = width > 0 && height > 0 && width <= maxDim && height <= maxDim

  const across = valid ? Math.ceil(width / moduleSize) : 0
  const down = valid ? Math.ceil(height / moduleSize) : 0
  const baseBlocks = across * down
  const reserveBlocks = Math.ceil(baseBlocks * 1.05) // 5% architectural reserve
  const totalWeightTonnes = ((reserveBlocks * WEIGHT_PER_BLOCK_KG) / 1000).toFixed(2)
  const pallets = Math.ceil(reserveBlocks / BLOCKS_PER_PALLET)
  const containerFillPct = Math.min(100, Math.round((reserveBlocks / CONTAINER_20FT_CAPACITY_BLOCKS) * 100))

  const waQuoteText = encodeURIComponent(
    `Hello Gautam,\nI would like an export quotation for Jaydeep Exports Terracotta Jali:\n- Pattern: ${PATTERNS[pattern].label}\n- Wall Size: ${width} ${unit} x ${height} ${unit}\n- Estimated Blocks: ${reserveBlocks} units (~${totalWeightTonnes} MT)\n- Port: [Please enter destination port]`
  )

  const toggleUnit = (newUnit: 'ft' | 'm') => {
    if (newUnit === unit) return
    if (newUnit === 'm') {
      setW((Number(w) * 0.3048).toFixed(1))
      setH((Number(h) * 0.3048).toFixed(1))
    } else {
      setW((Number(w) / 0.3048).toFixed(1))
      setH((Number(h) / 0.3048).toFixed(1))
    }
    setUnit(newUnit)
  }

  return (
    <div className="border border-kiln-3 bg-kiln-2 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg text-bone" style={{ fontStretch: '108%' }}>
            Architectural Wall & Export Calculator
          </h3>
          <p className="t-body mt-1 text-xs text-bone-dim">
            Standard 8 x 8 inch (203 x 203 mm) structural terracotta module.
          </p>
        </div>
        <div className="flex items-center border border-kiln-3 bg-kiln p-0.5 text-xs">
          <button
            type="button"
            onClick={() => toggleUnit('ft')}
            className={`px-2.5 py-1 ${unit === 'ft' ? 'bg-bone text-kiln font-medium' : 'text-bone-dim hover:text-bone'}`}
          >
            Feet (ft)
          </button>
          <button
            type="button"
            onClick={() => toggleUnit('m')}
            className={`px-2.5 py-1 ${unit === 'm' ? 'bg-bone text-kiln font-medium' : 'text-bone-dim hover:text-bone'}`}
          >
            Meters (m)
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field id={`${uid}-w`} label="Wall width" unit={unit} value={w} onChange={setW} />
        <Field id={`${uid}-h`} label="Wall height" unit={unit} value={h} onChange={setH} />

        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-p`} className="t-spec text-xs text-bone-dim">
            PATTERN
          </label>
          <select
            id={`${uid}-p`}
            value={pattern}
            onChange={(e) => setPattern(e.target.value as PatternId)}
            className="border border-kiln-3 bg-kiln px-3 py-2 text-bone text-sm"
          >
            {PATTERN_IDS.map((id) => (
              <option key={id} value={id}>
                {PATTERNS[id].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {valid ? (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 border border-kiln-3 bg-kiln p-4 sm:grid-cols-4">
            <div>
              <p className="t-spec text-[11px] text-bone-dim">TOTAL BLOCKS</p>
              <p className="text-xl font-medium text-bone">{reserveBlocks.toLocaleString()} <span className="text-xs text-bone-dim font-normal">(+5% res)</span></p>
            </div>
            <div>
              <p className="t-spec text-[11px] text-bone-dim">EST. WEIGHT</p>
              <p className="text-xl font-medium text-bone">{totalWeightTonnes} <span className="text-xs text-bone-dim font-normal">MT</span></p>
            </div>
            <div>
              <p className="t-spec text-[11px] text-bone-dim">PALLETS</p>
              <p className="text-xl font-medium text-bone">{pallets} <span className="text-xs text-bone-dim font-normal">Pallets</span></p>
            </div>
            <div>
              <p className="t-spec text-[11px] text-bone-dim">20FT CONTAINER</p>
              <p className="text-xl font-medium text-ember">{containerFillPct}% <span className="text-xs text-bone-dim font-normal">load</span></p>
            </div>
          </div>

          <div className="mt-3">
            <div className="h-1.5 w-full bg-kiln border border-kiln-3 overflow-hidden">
              <div
                className="h-full bg-ember transition-all duration-300"
                style={{ width: `${containerFillPct}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-bone-dim">
              Export shipments dispatched via Mundra/Kandla Port, Gujarat in strapped shrink-wrapped pallets.
            </p>
          </div>

          <figure className="mt-4">
            <div className="border border-kiln-3 bg-kiln p-2">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-auto w-full"
                style={{ maxHeight: '14rem' }}
                role="img"
                aria-label={`Elevation of a ${width} by ${height} ${unit} wall in ${PATTERNS[pattern].label} pattern`}
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
                  </pattern>
                </defs>
                <rect width={width} height={height} fill="#241d18" />
                <rect width={width} height={height} fill={`url(#wall-${uid})`} />
              </svg>
            </div>
            <figcaption className="t-spec mt-2 flex items-center justify-between text-xs text-bone-dim">
              <span>{width} {unit} x {height} {unit} Elevation ({across} cols x {down} rows)</span>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}?text=${waQuoteText}`}
                target="_blank"
                rel="noreferrer"
                className="text-bone underline underline-offset-4 hover:text-ember"
              >
                Request Quote on WhatsApp &rarr;
              </a>
            </figcaption>
          </figure>
        </>
      ) : (
        <p className="mt-5 text-sm text-ember">
          Enter a valid width and height up to {maxDim} {unit}.
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
}: {
  id: string
  label: string
  unit: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="t-spec text-xs text-bone-dim">
        {label.toUpperCase()}
      </label>
      <div className="flex items-center border border-kiln-3 bg-kiln">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0.5}
          max={400}
          step={0.1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2 text-bone text-sm"
        />
        <span className="t-spec px-3 text-xs text-bone-dim">{unit}</span>
      </div>
    </div>
  )
}
