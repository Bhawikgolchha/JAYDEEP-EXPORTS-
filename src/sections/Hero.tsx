import { lazy } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Stage } from '../three/Stage'

const HeroScene = lazy(() => import('../three/HeroScene'))

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="top" className="relative min-h-[100dvh] w-full">
      <Stage
        poster="/video/hero-wall-poster.webp"
        video="hero-wall"
        alt="Sunlight passing through a terracotta jali wall and printing its pattern across a dark floor"
        className="absolute inset-0"
      >
        <HeroScene />
      </Stage>

      {/* legibility scrim. sits under the type only, so the wall stays the picture. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5"
        style={{
          background:
            'linear-gradient(to top, rgba(20,16,14,0.94) 6%, rgba(20,16,14,0.72) 38%, transparent 100%)',
        }}
      />

      <div className="relative flex min-h-[100dvh] flex-col justify-end px-4 pb-14 pt-24 sm:px-6 md:pb-20">
        <motion.div
          className="mx-auto w-full max-w-[1400px]"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <h1 className="t-display max-w-[14ch] text-[clamp(2.6rem,11vw,5.5rem)]">
            Cut clay. Filtered sun.
          </h1>

          <p className="t-body mt-5 text-base sm:text-lg">
            Terracotta jali screens and perforated clay bricks. Twenty eight cuts, pressed and
            fired, packed for export.
          </p>

          {/* one label per intent, used identically in the nav, here and in the footer */}
          <a href="#enquire" className="cta mt-8 inline-flex">
            Enquire
          </a>
        </motion.div>
      </div>
    </section>
  )
}
