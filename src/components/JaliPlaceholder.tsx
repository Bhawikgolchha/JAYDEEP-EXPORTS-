// An image on this site never shows a grey shimmer. It shows the cut it is about to
// show you, in silhouette, and the clay washes up through it as the WebP decodes.
//
// The silhouette comes from the same path data the 3D geometry is built from, so a
// thumbnail and its 3D tile can never drift apart.

import { useState } from 'react'
import { GENERIC_PATH, patternPathData, type PatternId } from '../data/patterns'

type Props = {
  src: string
  alt: string
  pattern?: PatternId
  /** width/height of the reserved box. posters are 3:4 */
  ratio?: string
  sizes?: string
  className?: string
  loading?: 'lazy' | 'eager'
}

export function JaliImage({
  src,
  alt,
  pattern,
  ratio = '3 / 4',
  sizes,
  className = '',
  loading = 'lazy',
}: Props) {
  const [loaded, setLoaded] = useState(false)
  const d = pattern ? patternPathData(pattern) : GENERIC_PATH

  return (
    <div
      className={`relative overflow-hidden bg-kiln-2 ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {/* the box is reserved by aspect-ratio, so this never shifts layout */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={`firing-${pattern ?? 'x'}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ce6d38" />
            <stop offset="100%" stopColor="#3a2b22" />
          </linearGradient>
        </defs>
        <path
          d={d}
          fillRule="evenodd"
          fill={`url(#firing-${pattern ?? 'x'})`}
          opacity={loaded ? 0 : 0.5}
          style={{ transition: 'opacity 420ms var(--ease-out-quint)' }}
        />
      </svg>

      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className="relative h-full w-full object-cover"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 420ms var(--ease-out-quint)',
        }}
      />
    </div>
  )
}
