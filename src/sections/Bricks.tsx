import { useState } from 'react'
import { PRODUCTS, type Product } from '../data/products'
import { JaliImage } from '../components/JaliPlaceholder'
import { Lightbox } from '../components/Lightbox'

// The bricks and the Omega block are a different product class from the screens, and
// burying them in the pattern grid would misrepresent what they are. They get a row of
// their own, flicked through sideways, which is also how they arrive: on a pallet, in
// a line.

const HEAVY = PRODUCTS.filter((p) => p.kind === 'brick' || p.kind === 'block')

export function Bricks() {
  const [open, setOpen] = useState<Product | null>(null)

  return (
    <section id="bricks" className="pb-24 md:pb-32">
      <div className="mx-auto mb-8 max-w-[1400px] px-4 sm:px-6">
        <h2 className="t-display max-w-[18ch] text-[clamp(1.9rem,5.6vw,3.4rem)]">
          And the bricks that hold them up.
        </h2>
        <p className="t-body mt-4 text-base">
          Perforated and hollow clay bricks from the same body and the same kiln, so a
          screen and the wall around it fire to the same colour.
        </p>
      </div>

      <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 [scrollbar-width:thin]">
        {HEAVY.map((p) => (
          <li key={p.slug} className="w-[68vw] shrink-0 snap-start sm:w-[38vw] lg:w-[24vw]">
            <button
              type="button"
              onClick={() => setOpen(p)}
              className="tile group block w-full text-left"
            >
              <div className="relative overflow-hidden border border-kiln-3">
                <JaliImage
                  src={p.poster}
                  alt={`${p.name}, perforated terracotta clay brick`}
                  ratio="3 / 4"
                  sizes="(max-width: 640px) 68vw, (max-width: 1024px) 38vw, 24vw"
                />
                <span aria-hidden="true" className="rake" />
              </div>
              <span className="mt-2 block text-base" style={{ fontStretch: '100%' }}>
                {p.name}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox product={open} onClose={() => setOpen(null)} />
    </section>
  )
}
