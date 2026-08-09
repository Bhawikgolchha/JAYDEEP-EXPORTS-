import { useEffect, useState } from 'react'
import { sun, setSunManual } from '../hooks/useSun'

// The day, on a handle.
//
// Scroll drives the sun until someone touches this. From then on it is theirs and
// scrolling stops moving it, because a control that silently undoes itself as you keep
// reading is worse than no control.

const HOURS = ['Early', 'Mid morning', 'Noon', 'Afternoon', 'Late']

export function SunSlider() {
  const [value, setValue] = useState(() => sun.get())
  const [owned, setOwned] = useState(false)

  useEffect(() => {
    if (owned) return
    return sun.on('change', setValue)
  }, [owned])

  const take = (v: number) => {
    setOwned(true)
    setSunManual(true)
    setValue(v)
    sun.set(v)
  }

  const hour = HOURS[Math.min(HOURS.length - 1, Math.floor(value * HOURS.length))]

  return (
    <div className="mt-4 flex items-center gap-4">
      <label htmlFor="sun" className="t-spec shrink-0 text-xs text-bone-dim">
        SUN
      </label>
      <input
        id="sun"
        type="range"
        min={0}
        max={1}
        step={0.005}
        value={value}
        onChange={(e) => take(Number(e.target.value))}
        className="sun-range h-6 w-full"
        aria-label="Time of day"
        aria-valuetext={hour}
      />
      <span className="t-spec w-24 shrink-0 text-right text-xs text-bone-dim">{hour}</span>
    </div>
  )
}
