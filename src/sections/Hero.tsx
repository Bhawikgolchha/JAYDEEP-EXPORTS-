import { motion, useReducedMotion } from 'motion/react'
import { MovableHeroCanvas } from '../components/MovableHeroCanvas'

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="top" className="relative min-h-[100dvh] w-full overflow-hidden bg-kiln">
      {/* 3D Movable & 360° Rotatable WebGL Canvas */}
      <div className="absolute inset-0 z-0">
        <MovableHeroCanvas initialPattern="window" initialFinish="natural" />
      </div>

      {/* Radial atmospheric scrim to preserve typography contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(circle at 65% 50%, rgba(20,16,14,0.25) 0%, rgba(20,16,14,0.85) 60%, rgba(20,16,14,0.98) 100%)',
        }}
      />

      {/* Editorial Content Overlay */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-between px-4 pb-20 pt-24 sm:px-6 md:pb-24 lg:px-12 pointer-events-none">
        {/* Top Header Tag */}
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="border border-ember/40 bg-ember/15 px-3 py-1 font-mono text-xs font-semibold text-ember">
              STAGE 1: 3D INTERACTIVE MONOLITH
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
            className="max-w-2xl pointer-events-auto"
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
                Explore 17+ Patterns
              </a>
            </div>
          </motion.div>
        </div>

        {/* Space reservation for bottom HUD */}
        <div className="h-10 sm:h-12" />
      </div>
    </section>
  )
}

export default Hero
