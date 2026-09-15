import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { PRODUCTS, KIND_LABEL, type Product, type ProductKind } from '../data/products'
import { JaliImage } from '../components/JaliPlaceholder'
import { Lightbox } from '../components/Lightbox'

type Filter = 'all' | ProductKind

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'jali', label: KIND_LABEL.jali },
  { id: 'brick', label: KIND_LABEL.brick },
  { id: 'block', label: KIND_LABEL.block },
]

export function Catalogue() {
  const [filter, setFilter] = useState<Filter>('all')
  const [open, setOpen] = useState<Product | null>(null)
  const reduce = useReducedMotion()

  const shown = useMemo(
    () => (filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.kind === filter)),
    [filter],
  )

  return (
    <section id="catalogue" className="bg-lime px-4 py-24 text-lime-ink sm:px-6 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10 md:mb-14">
          <h2 className="t-display text-[clamp(2.2rem,7vw,4.5rem)] text-lime-ink">
                      Twenty eight cuts, one clay.
                    </h2>
                    <p className="mt-5 max-w-[68ch] text-base leading-relaxed text-lime-dim md:text-lg">
            Every pattern below is a mould we already run. Sizes are printed here only where
            they are printed on the product sheet, so nothing on this page is a guess.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter products">
          {FILTERS.map((f) => {
            const active = filter === f.id
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 text-sm transition-colors duration-200 ${
                                  active
                                    ? 'bg-lime-ink text-lime'
                                    : 'bg-lime-dim/60 text-lime-ink hover:bg-lime-dim hover:text-lime'
                                }`}
                style={{ fontStretch: '84%', letterSpacing: '0.03em' }}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {shown.length === 0 ? (
          <EmptyTile />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-7">
            {shown.map((p, i) => (
              <motion.li
                key={p.slug}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={reduce ? {} : { scale: 1.04, y: -4, transition: { duration: 0.22, ease: 'easeOut' } }}
                whileTap={reduce ? {} : { scale: 0.98 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(i, 12) * 0.035,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(p)}
                  className="tile group block w-full text-left"
                >
                  <div className="relative overflow-hidden border border-lime-ink/25">
                    <JaliImage
                      src={p.thumb}
                      alt={`${p.name}, terracotta ${p.kind === 'brick' ? 'perforated brick' : 'jali screen'}`}
                      pattern={p.pattern}
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
                    />
                    {/* light rakes across the tile on hover, the same move the wall makes */}
                    <span aria-hidden="true" className="rake" />
                  </div>
                  <span className="mt-2 block text-sm text-lime-ink" style={{ fontStretch: '96%' }}>
                                      {p.name}
                                    </span>
                                    {p.sizes && (
                                      <span className="t-spec mt-0.5 block text-xs text-lime-dim">
                      {p.sizes[0]}
                    </span>
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <Lightbox product={open} onClose={() => setOpen(null)} />
    </section>
  )
}

/** an unfired blank, not an icon */
function EmptyTile() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden="true">
        <path d="M0,0 H100 V100 H0 Z" fill="#2a231d" />
      </svg>
      <p className="text-lime-dim">No pattern in this group yet.</p>
    </div>
  )
}
