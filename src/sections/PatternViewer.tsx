import { lazy, useEffect, useState } from 'react'
import { Stage } from '../three/Stage'
import { PATTERNS, PATTERN_IDS, type PatternId } from '../data/patterns'
import { PRODUCTS } from '../data/products'
import { sun, setSunManual } from '../hooks/useSun'
import { SunSlider } from '../components/SunSlider'
import { DimensionBracket } from '../components/DimensionBracket'
import { FINISH_CONFIGS, type ClayFinish } from '../three/JaliGeometry'

const ViewerScene = lazy(() => import('../three/ViewerScene'))

const SUN_PRESETS = [
  { label: 'Morning', value: 0.15, time: '08:30' },
  { label: 'Noon', value: 0.5, time: '12:00' },
  { label: 'Golden Hour', value: 0.82, time: '17:00' },
  { label: 'Dusk', value: 0.95, time: '18:45' },
]

export function PatternViewer() {
  const [pattern, setPattern] = useState<PatternId>('star')
  const [finish, setFinish] = useState<ClayFinish>('natural')
  const product = PRODUCTS.find((p) => p.pattern === pattern)

  useEffect(() => () => setSunManual(false), [])

  const selectSunPreset = (v: number) => {
    setSunManual(true)
    sun.set(v)
  }

  return (
    <section id="patterns" className="px-4 pb-24 sm:px-6 md:pb-32">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="t-display mb-8 max-w-[16ch] text-[clamp(2.2rem,7vw,4.5rem)] md:mb-12">
          Move the sun. Watch the shadow.
        </h2>

        <div className="grid gap-6 md:grid-cols-[1.15fr_1fr] md:gap-10">
          <div className="md:sticky md:top-24 md:self-start">
            <Stage
              poster={`/posters/${product?.slug ?? 'star'}-thumb.webp`}
              alt={`${PATTERNS[pattern].label} terracotta jali tile in ${FINISH_CONFIGS[finish].label}, rotating in daylight`}
              className="relative aspect-[4/3] w-full border border-kiln-3 sm:aspect-[16/11]"
            >
              <ViewerScene pattern={pattern} finish={finish} />
            </Stage>

            <SunSlider />

            {/* Sun Time of Day Presets */}
            <div className="mt-3 flex flex-wrap items-center gap-2 border border-kiln-3 bg-kiln p-2">
              <span className="t-spec px-1 text-xs text-bone-dim">LIGHT PRESETS:</span>
              {SUN_PRESETS.map((sp) => (
                <button
                  key={sp.label}
                  type="button"
                  onClick={() => selectSunPreset(sp.value)}
                  className="border border-kiln-3 px-2 py-1 text-xs text-bone hover:border-ember hover:bg-kiln-2 transition-colors"
                >
                  {sp.label} <span className="text-bone-dim font-mono text-[10px]">({sp.time})</span>
                </button>
              ))}
            </div>

            {/* Clay Material Finish Selection */}
            <div className="mt-4 border border-kiln-3 bg-kiln p-3">
              <p className="t-spec text-xs text-bone-dim mb-2">CLAY MATERIAL FINISH:</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.keys(FINISH_CONFIGS) as ClayFinish[]).map((fKey) => {
                  const conf = FINISH_CONFIGS[fKey]
                  const active = finish === fKey
                  return (
                    <button
                      key={fKey}
                      type="button"
                      onClick={() => setFinish(fKey)}
                      className={`flex items-center gap-2 border px-2 py-1.5 text-xs text-left transition-all ${
                        active
                          ? 'border-ember bg-kiln-2 text-bone'
                          : 'border-kiln-3 text-bone-dim hover:border-bone-dim'
                      }`}
                    >
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: conf.hex }}
                      />
                      <span>{conf.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div>
            <ul className="grid grid-cols-2 gap-px bg-kiln-3 sm:grid-cols-4 md:grid-cols-2">
              {PATTERN_IDS.map((id) => {
                const active = id === pattern
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setPattern(id)}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors ${
                        active ? 'bg-bone text-kiln' : 'bg-kiln hover:bg-kiln-2'
                      }`}
                    >
                      <svg viewBox="0 0 100 100" className="h-9 w-9 shrink-0" aria-hidden="true">
                        <path
                          d={`M0,0 H100 V100 H0 Z ${PATTERNS[id].holes.join(' ')}`}
                          fillRule="evenodd"
                          fill={active ? '#14100e' : '#ce6d38'}
                        />
                      </svg>
                      <span style={{ fontStretch: '96%' }}>{PATTERNS[id].label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="mt-8">
              <p className="t-body text-base">{PATTERNS[pattern].light}</p>

              <div className="mt-8">
                {product?.sizes?.[0] ? (
                  <DimensionBracket label={product.sizes[0]} />
                ) : (
                  <p className="t-spec text-sm text-bone-dim">
                    Size for this cut is not printed on its product sheet. Ask and we will
                    confirm it.
                  </p>
                )}
              </div>

              {product && (
                <p className="mt-6 text-sm text-bone-dim">
                  Sold as{' '}
                  <span className="text-bone" style={{ fontStretch: '104%' }}>
                    {product.name}
                  </span>
                  {product.weightKg ? `, about ${product.weightKg} kg a block.` : '.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** keeps the slider honest if a pattern is selected before the canvas exists */
export function currentSun() {
  return sun.get()
}
