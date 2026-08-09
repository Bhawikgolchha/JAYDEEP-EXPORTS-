import { useEffect, useState } from 'react'

// Position, laid like courses of brick. Five chapters, five courses, and the wall
// builds up as you read down. It carries real state, so it is navigation rather than
// decoration, and it is gone below 768px where the screen is too narrow to spare it.

const CHAPTERS = [
  { id: 'top', label: 'The wall' },
  { id: 'catalogue', label: 'Catalogue' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'where', label: 'Where it goes' },
  { id: 'enquire', label: 'Enquire' },
]

export function ChapterCourses() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const targets = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => !!el,
    )
    if (!targets.length) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const i = CHAPTERS.findIndex((c) => c.id === e.target.id)
          if (i >= 0) setActive(i)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  return (
    <nav
      aria-label="Sections"
      className="fixed right-3 top-1/2 hidden -translate-y-1/2 md:block"
      style={{ zIndex: 'var(--z-courses)' as unknown as number }}
    >
      <ul className="grid gap-1.5">
        {CHAPTERS.map((c, i) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-current={i === active ? 'true' : undefined}
              className="group flex items-center justify-end gap-2"
            >
              <span className="pointer-events-none whitespace-nowrap text-xs text-bone-dim opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {c.label}
              </span>
              <span
                className="block h-5 w-[3px] transition-colors duration-300"
                style={{ background: i <= active ? 'var(--ember)' : 'var(--kiln-3)' }}
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
