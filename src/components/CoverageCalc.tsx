import { useId, useState } from 'react'
import { PATTERNS, PATTERN_IDS, type PatternId } from '../data/patterns'

// Enter a wall, get the wall back.
//
// A tile count on its own is a number you have to trust. Drawing the elevation means
// you can see the count, see where the cut tiles land at the edges, and see whether the
// pattern reads at that size before anyone quotes anything.
//
// The module is 8 x 8 inches, which is the size printed on the product sheets. Every
// figure below follows from that one measurement and nothing else.

const MODULE_FT = 8 / 12

export function CoverageCalc() {
  const uid = useId()
  const [w, setW] = useState('12')
  const [h, setH] = useState('9')
  const [pattern, setPattern] = useState<PatternId>('star')

  const width = Number(w)
  const height = Number(h)
  const valid = width > 0 && height > 0 && width <= 400 && height <= 400

  const across = valid ? Math.ceil(width / MODULE_FT) : 0
  const down = valid ? Math.ceil(height / MODULE_FT) : 0
  const total = across * down

  return (
    <div className="bg-kiln-2 p-5 sm:p-7">
      <h3 className="text-lg" style={{ fontStretch: '108%' }}>
        Size a wall
      </h3>
      <p className="t-body mt-2 text-sm">
        Worked at the 8 x 8 inch module printed on the product sheets. Order allowance for
        breakage on top of this figure is a conversation, not a formula.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field id={`${uid}-w`} label="Wall width" unit="ft" value={w} onChange={setW} />
        <Field id={`${uid}-h`} label="Wall height" unit="ft" value={h} onChange={setH} />

        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-p`} className="t-spec text-xs text-bone-dim">
            PATTERN
          </label>
          <select
            id={`${uid}-p`}
            value={pattern}
            onChange={(e) => setPattern(e.target.value as PatternId)}
            className="border border-kiln-3 bg-kiln px-3 py-2 text-bone"
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
          <p className="mt-5 text-base">
            <span className="t-spec text-2xl text-bone">{total.toLocaleString()}</span>{' '}
            <span className="text-bone-dim">
              blocks, laid {across} across and {down} high.
            </span>
          </p>

          <figure className="mt-4">
            <div className="border border-kiln-3 bg-kiln p-2">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-auto w-full"
                style={{ maxHeight: '18rem' }}
                role="img"
                aria-label={`Elevation of a ${width} by ${height} foot wall in the ${PATTERNS[pattern].label} pattern, ${total} blocks`}
              >
                <defs>
                  {/* one pattern fill, so the part-blocks at the edges are real
                      part-blocks rather than a fudge */}
                  <pattern
                    id={`wall-${uid}`}
                    patternUnits="userSpaceOnUse"
                    width={MODULE_FT}
                    height={MODULE_FT}
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
            <figcaption className="t-spec mt-2 text-xs text-bone-dim">
              {width} ft x {height} ft elevation, drawn to the module
            </figcaption>
          </figure>
        </>
      ) : (
        <p className="mt-5 text-sm text-ember">
          Enter a width and a height in feet, up to 400 each.
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
          min={1}
          max={400}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2 text-bone"
        />
        <span className="t-spec px-3 text-xs text-bone-dim">{unit}</span>
      </div>
    </div>
  )
}
