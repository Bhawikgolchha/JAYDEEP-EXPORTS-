import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

// Video on this page never autoplays off screen and never plays at all for someone who
// asked for less motion. They get the poster frame, which carries the same information.

type Props = {
  name: string
  alt: string
  className?: string
  /** object-position, for clips where the subject is off centre */
  position?: string
}

export function Clip({ name, alt, className = '', position = 'center' }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          if (!reduce) void el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { rootMargin: '200px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  return (
    <video
      ref={ref}
      className={`h-full w-full object-cover ${className}`}
      style={{ objectPosition: position }}
      poster={`/video/${name}-poster.webp`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
    >
      {near && !reduce && (
        <>
          <source src={`/video/${name}.webm`} type="video/webm" />
          <source src={`/video/${name}.mp4`} type="video/mp4" />
        </>
      )}
    </video>
  )
}
