import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

// Video on this page never autoplays off screen and never plays at all for someone who
// asked for less motion. They get the poster frame, which carries the same information.
//
// Three things here exist because looping silently failed on phones while working on
// desktop:
//
// 1. `play()` is called from an effect that runs AFTER the <source> children are in the
//    DOM. The obvious version calls play() in the IntersectionObserver callback right
//    after setNear(true), but that runs a render too early: the element still has no
//    source, the promise rejects, and nothing ever retries. Desktop Chrome papered over
//    it by starting muted playback on its own once the source appeared. Mobile autoplay
//    policies do not.
//
// 2. `load()` is called explicitly. Inserting a <source> only triggers resource
//    selection while networkState is still NETWORK_EMPTY, which is not guaranteed once
//    the element has already been poked. load() makes it deterministic.
//
// 3. There is an `ended` fallback on top of the `loop` attribute. iOS Safari will reach
//    the end of a `preload="none"` clip and stop on the last frame instead of seeking
//    back, which is exactly the "plays once then freezes" symptom. When `loop` is
//    honoured, `ended` never fires and this costs nothing.

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

  const start = useCallback(() => {
    const el = ref.current
    if (!el || reduce) return
    // Safari checks the muted *property*, not the attribute, before allowing autoplay
    el.muted = true
    void el.play().catch(() => {
      // autoplay refused, for example iOS Low Power Mode. the poster stays up.
    })
  }, [reduce])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          start()
        } else {
          el.pause()
        }
      },
      { rootMargin: '200px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [start])

  // runs after the <source> children have rendered, which is the whole point
  useEffect(() => {
    const el = ref.current
    if (!el || !near || reduce) return
    el.preload = 'auto'
    el.load()
    start()
  }, [near, reduce, start])

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
      onEnded={(e) => {
        // only reached when `loop` was ignored, which is the iOS case
        const el = e.currentTarget
        el.currentTime = 0
        void el.play().catch(() => {})
      }}
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
