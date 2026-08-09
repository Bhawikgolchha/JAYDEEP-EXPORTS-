// One number owns the light on this page.
//
// `sun` runs 0 to 1, low morning to low evening. Scroll drives it by default, so the
// day moves as you go down the building. The scrubber in the light section takes it
// over while you drag, then hands it back. The 3D light angle, the section warmth and
// the scrubber all read this same value, so they can never disagree.

import { motionValue, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect } from 'react'

export const sun = motionValue(0.18)

let manual = false
export const setSunManual = (on: boolean) => {
  manual = on
}

/** scroll position -> sun, plus the CSS variable the stylesheet reads. Mount once. */
export function useSunDriver() {
  const { scrollYProgress } = useScroll()

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (manual) return
    // never fully overhead and never fully set: the wall always has a raking light
    sun.set(0.12 + v * 0.76)
  })

  useEffect(() => {
    const root = document.documentElement
    const write = (v: number) => root.style.setProperty('--sun', v.toFixed(3))
    write(sun.get())
    return sun.on('change', write)
  }, [])
}

/** sun (0..1) -> a light direction in world space. Shared by every 3D surface. */
export function sunDirection(v: number): [number, number, number] {
  // Sweeps from low left, up over the top, down to low right. The elevation is kept
  // deliberately shallow: light coming from near overhead throws the tile's shadow
  // straight down as a solid slab and the cut never reads. A jali is only ever
  // photographed in raking light, and this is why.
  // The arc stops short of due south on purpose. A sun sitting dead in front of the
  // wall throws its shadow straight backwards, where the wall itself hides it, and the
  // cut stops reading entirely. Keeping the azimuth off centre means there is always
  // some sideways throw, at every position of the slider.
  const a = Math.PI * (0.08 + v * 0.7)
  return [-Math.cos(a) * 10, Math.sin(a) * 5 + 0.8, 6.2]
}
