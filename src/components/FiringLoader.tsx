import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { patternPathData } from '../data/patterns'

// One block, firing.
//
// It goes from raw grey-green clay to fired terracotta while its shadow sharpens under
// it, which is the actual thing that happens to this product in a kiln. Progress is
// tied to the font and the hero still genuinely finishing, not to a timer pretending
// to be progress, and it gives up after 2.5s so it can never hold the page hostage.

const HERO_STILL = '/video/hero-wall-poster.webp'

export function FiringLoader() {
  const reduce = useReducedMotion()
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (reduce) {
      setDone(true)
      return
    }

    let cancelled = false
    const finish = () => {
      if (!cancelled) setDone(true)
    }

    const still = new Image()
    still.src = HERO_STILL

    const work = [
      document.fonts?.ready ?? Promise.resolve(),
      still.decode().catch(() => undefined),
    ]

    void Promise.all(work).then(finish)
    const bail = setTimeout(finish, 2500)

    return () => {
      cancelled = true
      clearTimeout(bail)
    }
  }, [reduce])

  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setGone(true), reduce ? 0 : 620)
    return () => clearTimeout(t)
  }, [done, reduce])

  if (gone) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 flex items-center justify-center bg-kiln"
      style={{
        zIndex: 'var(--z-loader)' as unknown as number,
        opacity: done ? 0 : 1,
        transition: 'opacity 600ms var(--ease-out-quint)',
      }}
    >
      <svg viewBox="0 0 140 150" className="w-28" role="presentation">
        {/* the shadow arrives as the block leaves the kiln */}
        <ellipse
          cx="70"
          cy="134"
          rx={done ? 44 : 20}
          ry={done ? 7 : 3}
          fill="#000"
          opacity={done ? 0.5 : 0.1}
          style={{ transition: 'all 900ms var(--ease-out-quint)' }}
        />
        <g transform="translate(20,10)">
          <path
            d={patternPathData('star')}
            fillRule="evenodd"
            fill={done ? '#c0602f' : '#6e6b56'}
            style={{ transition: 'fill 1100ms var(--ease-out-quint)' }}
          />
        </g>
      </svg>
    </div>
  )
}
