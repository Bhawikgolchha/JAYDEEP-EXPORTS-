// One line, 64px, and it stays that way at every width. Three links is all this page
// has, so there is no hamburger to build and nothing to hide behind one.

const LINKS = [
  { href: '#catalogue', label: 'Catalogue' },
  { href: '#patterns', label: 'Patterns' },
  { href: '#made', label: 'Made' },
]

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 h-16 bg-kiln/72 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="text-base" style={{ fontStretch: '116%', fontWeight: 700 }}>
            Jaydeep
          </span>
          <span
            className="t-spec text-[0.68rem] text-bone-dim"
            style={{ letterSpacing: '0.22em' }}
          >
            EXPORTS
          </span>
        </a>

        <div className="flex items-center gap-4 sm:gap-6">
          <ul className="hidden items-center gap-5 sm:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-bone-dim transition-colors hover:text-bone"
                  style={{ fontStretch: '92%' }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#enquire"
            className="whitespace-nowrap bg-bone px-3.5 py-1.5 text-sm text-kiln transition-colors hover:bg-white"
            style={{ fontStretch: '92%', fontWeight: 600 }}
          >
            Enquire
          </a>
        </div>
      </nav>
    </header>
  )
}
