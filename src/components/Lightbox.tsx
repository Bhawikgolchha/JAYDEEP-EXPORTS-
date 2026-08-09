// Opening a poster lifts it off the stack: the sheet rises and its shadow separates.
// Uses the native <dialog> element so focus trapping, Esc and the top layer are the
// browser's job rather than ours, and so it can never be clipped by an ancestor's
// overflow.

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import type { Product } from '../data/products'

type Props = {
  product: Product | null
  onClose: () => void
}

export function Lightbox({ product, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (product && !el.open) el.showModal()
    if (!product && el.open) el.close()
  }, [product])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // backdrop click: the dialog element itself is the backdrop hit area
        if (e.target === ref.current) onClose()
      }}
      className="m-auto max-h-[92dvh] w-[min(92vw,44rem)] bg-transparent p-0 backdrop:bg-kiln/88 backdrop:backdrop-blur-sm"
    >
      {product && (
        <div
          className="relative bg-kiln-2 p-3 sm:p-4"
          style={{
            boxShadow: '0 40px 90px -20px rgba(0,0,0,0.9)',
            animation: reduce ? undefined : 'lift 340ms var(--ease-out-quint) both',
          }}
        >
          <img
            src={product.poster}
            alt={`${product.name} terracotta jali poster`}
            className="max-h-[70dvh] w-full object-contain"
          />

          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="text-xl" style={{ fontStretch: '112%' }}>
              {product.name}
            </h3>
            {product.sizes && (
              <p className="t-spec text-sm text-bone-dim">{product.sizes.join('  /  ')}</p>
            )}
            {product.weightKg && (
              <p className="t-spec text-sm text-bone-dim">{product.weightKg} kg approx</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute -top-11 right-0 px-2 py-1 text-sm text-bone hover:text-ember"
          >
            Close
          </button>
        </div>
      )}
    </dialog>
  )
}
