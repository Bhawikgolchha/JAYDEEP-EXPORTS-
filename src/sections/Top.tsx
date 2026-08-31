import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { JaliTile } from '../components/JaliTile'
import type { PatternId } from '../data/patterns'
import type { ClayFinish } from '../three/JaliGeometry'

/**
 * Stage 1: Raw Earthen Monolith Section (Top Hero)
 * Implements macro 3D perspective of raw clay material with micro-porosity normal mapping,
 * PBR roughness variations, and tactile finish exploration.
 */
export function Top() {
  const reduce = useReducedMotion()
  const [selectedPattern, setSelectedPattern] = useState<PatternId>('amber')
  const [selectedFinish, setSelectedFinish] = useState<ClayFinish>('natural')

  return (
    <section id="top" className="relative min-h-[100dvh] w-full bg-kiln">
      {/* 3D Macro Raw Earthen Monolith Canvas */}
      <div className="absolute inset-0 z-0">
        <JaliTile
          pattern={selectedPattern}
          finish={selectedFinish}
          autoRotate={true}
          interactive={false}
          scale={1.55}
          quality="high"
          className="h-full w-full"
        />
      </div>

      {/* Atmospheric Scrim to preserve editorial typography contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(circle at 65% 50%, rgba(20,16,14,0.3) 0%, rgba(20,16,14,0.85) 65%, rgba(20,16,14,0.98) 100%)',
        }}
      />

      {/* Hero Editorial Content */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-between px-4 pb-12 pt-28 sm:px-6 md:pb-16 lg:px-12">
        {/* Top Header Tag */}
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="border border-ember/40 bg-ember/15 px-3 py-1 font-mono text-xs font-semibold text-ember">
              STAGE 1: RAW EARTHEN MONOLITH
            </span>
            <span className="hidden font-mono text-xs text-bone-dim sm:inline-block">
              ASTM C652 / IS 1077 COMPLIANT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-ember animate-pulse" />
            <span className="font-mono text-xs text-bone">EXPORT DISPATCH: MUNDRA / NHAVA SHEVA</span>
          </div>
        </div>

        {/* Main Hero Copy */}
        <div className="mx-auto w-full max-w-[1400px]">
          <motion.div
            className="max-w-2xl"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <h1 className="t-display text-[clamp(2.8rem,9vw,5.6rem)] leading-[0.95]">
              Cut clay. <br />
              <span className="text-ember">Filtered sun.</span>
            </h1>

            <p className="t-body mt-6 max-w-xl text-base leading-relaxed text-bone sm:text-lg">
              Architectural terracotta jali screens, wirecut perforated bricks, and monolithic clay
              facades. High-temperature 1000°C kiln fired, micro-porous unglazed finish, engineered for
              global export.
            </p>

            {/* CTA Group */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#enquire" className="cta inline-flex">
                Enquire
              </a>
              <a
                href="#patterns"
                className="border border-kiln-3 bg-kiln-2 px-6 py-3 text-sm text-bone transition-colors hover:border-ember hover:text-ember"
              >
                Explore 14+ Patterns
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Tactile Selector Bar */}
        <div className="mx-auto w-full max-w-[1400px] border-t border-kiln-3/80 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            {/* Pattern Quick-Picks */}
            <div className="flex items-center gap-2">
              <span className="t-spec text-[10px] text-bone-dim">FEATURED CUT:</span>
              {(['amber', 'circle', 'star', 'window', 'leaf'] as PatternId[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPattern(p)}
                  className={`border px-2.5 py-1 uppercase transition-colors ${
                    selectedPattern === p
                      ? 'border-ember bg-ember/20 text-bone font-medium'
                      : 'border-kiln-3 bg-kiln-2 text-bone-dim hover:text-bone'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Clay Finish Selector */}
            <div className="flex items-center gap-2">
              <span className="t-spec text-[10px] text-bone-dim">SURFACE CLAY:</span>
              {(['natural', 'smoked', 'sand', 'ochre'] as ClayFinish[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedFinish(f)}
                  className={`border px-2 py-1 capitalize transition-colors ${
                    selectedFinish === f
                      ? 'border-bone text-bone font-medium'
                      : 'border-kiln-3 text-bone-dim hover:text-bone'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Top
