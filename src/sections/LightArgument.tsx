import { motion, useReducedMotion } from 'motion/react'
import { Clip } from '../components/Clip'

// The argument of the whole page, made once, in one viewport. A jali is not a
// decorative panel. It is the only wall element that does these three jobs at the same
// time, and the clip behind this text is the proof rather than an illustration of it.

const CLAIMS = [
  {
    head: 'You can see out. They cannot see in.',
    body: 'The eye reads the lit face of the screen, not the dark room behind it. Privacy without closing a shutter.',
  },
  {
    head: 'Air keeps moving.',
    body: 'Open area runs through the wall, so a courtyard or stairwell stays ventilated with nothing switched on.',
  },
  {
    head: 'The glare goes, the daylight stays.',
    body: 'Thickness is what does it. Light entering at a low angle is cut by the depth of the block, not by a curtain.',
  },
]

export function LightArgument() {
  const reduce = useReducedMotion()

  return (
    <section id="light" className="relative">
      <div className="relative h-[68dvh] min-h-[420px] w-full md:h-[86dvh]">
        <Clip
          name="interior-partition"
          alt="Hard sunlight passing through a floor to ceiling terracotta jali screen and printing a pattern across a dark stone floor"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(26,18,12,0.98) 2%, rgba(26,18,12,0.35) 46%, rgba(26,18,12,0.55) 100%)',
          }}
        />

        <div className="absolute inset-x-0 bottom-0 px-4 pb-10 sm:px-6 md:pb-16">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="t-display max-w-[18ch] text-[clamp(2rem,6.4vw,4.2rem)]">
              A screen does three jobs at once.
            </h2>
          </div>
        </div>
      </div>

      {/* deliberately not three equal columns. the claims step down and across the
          grid, so the eye reads them in order instead of scanning a row of boxes. */}
      <div className="px-4 pb-24 pt-14 sm:px-6 md:pb-32">
        <div className="mx-auto grid max-w-[1400px] gap-y-10 md:grid-cols-12 md:gap-x-8">
          {CLAIMS.map((c, i) => (
            <motion.div
              key={c.head}
              className={
                [
                  'md:col-span-5 md:col-start-1',
                  'md:col-span-4 md:col-start-8 md:mt-16',
                  'md:col-span-6 md:col-start-4',
                ][i]
              }
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-xl md:text-2xl" style={{ fontStretch: '110%' }}>
                {c.head}
              </h3>
              <p className="t-body mt-3 text-base">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
