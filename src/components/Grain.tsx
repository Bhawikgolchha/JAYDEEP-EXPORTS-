// Kiln dust. One fixed, pointer-events-none layer for the whole document.
// Deliberately never applied to a scrolling container: that repaints the filter on
// every frame and destroys FPS on mid-range phones.

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 'var(--z-grain)' as unknown as number,
        backgroundImage: NOISE,
        opacity: 0.055,
        mixBlendMode: 'overlay',
      }}
    />
  )
}
