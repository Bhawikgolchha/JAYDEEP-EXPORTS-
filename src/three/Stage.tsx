import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Clip } from '../components/Clip'

// Gate in front of every canvas on this page.
//
// It does three jobs, and all three are load-time decisions rather than nice-to-haves:
//   1. paints a real still first, so the largest contentful paint is an image
//   2. only mounts the WebGL chunk once the section is actually near the viewport
//   3. never mounts it at all when WebGL is missing, and shows the wall video instead
//
// The page is fully usable and fully legible with the 3D permanently switched off.

let webglOk: boolean | null = null
function hasWebGL(): boolean {
  if (webglOk !== null) return webglOk
  try {
    const c = document.createElement('canvas')
    webglOk = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    webglOk = false
  }
  return webglOk
}

type Props = {
  poster: string
  /** clip name shown instead of the canvas when WebGL is unavailable */
  video?: string
  alt: string
  children: ReactNode
  className?: string
}

export function Stage({ poster, video, alt, children, className = '' }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const canRender3D = near && hasWebGL()

  return (
    // positioning comes from the caller. adding `relative` here as well would collide
    // with an `absolute` passed in and collapse the box to zero height.
    <div ref={wrap} className={`overflow-hidden bg-kiln ${className}`}>
      {/* the still. stays until the canvas has actually drawn a frame. */}
      <img
        src={poster}
        alt={alt}
        // React 18 passes this through only in lowercase
        {...{ fetchpriority: 'high' }}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          opacity: live ? 0 : 1,
          transition: 'opacity 700ms var(--ease-out-quint)',
        }}
      />

      {canRender3D ? (
        <Suspense fallback={null}>
          <div
            className="absolute inset-0"
            style={{ opacity: live ? 1 : 0, transition: 'opacity 700ms var(--ease-out-quint)' }}
            onTransitionEnd={undefined}
          >
            <ReadySignal onReady={() => setLive(true)} />
            {children}
          </div>
        </Suspense>
      ) : (
        video && (
          // same component as every other clip on the page, so the loop fix lives in
          // exactly one place
          <div className="absolute inset-0">
            <Clip name={video} alt={alt} />
          </div>
        )
      )}
    </div>
  )
}

/** fires one frame after the lazy chunk has mounted, which is when the canvas exists */
function ReadySignal({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(onReady))
    return () => cancelAnimationFrame(id)
  }, [onReady])
  return null
}
