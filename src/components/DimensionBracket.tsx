// The one architectural flourish on the page, used in exactly one place so it reads as
// a signature rather than a motif. Extension lines and ticks, the way a size is called
// out on an elevation drawing.

export function DimensionBracket({ label }: { label: string }) {
  return (
    <figure className="max-w-[15rem]">
      <div className="relative aspect-square border border-bone-dim/45">
        <div className="absolute inset-[14%] border border-dashed border-bone-dim/30" />
        <span className="t-spec absolute inset-0 flex items-center justify-center text-xs text-bone-dim">
          face
        </span>
      </div>

      <svg viewBox="0 0 240 26" className="mt-2 w-full" aria-hidden="true">
        <g stroke="#a79b8c" strokeWidth="1" fill="none">
          <path d="M1,4 V22 M239,4 V22" />
          <path d="M1,13 H239" />
          <path d="M1,13 L9,9 M1,13 L9,17 M239,13 L231,9 M239,13 L231,17" />
        </g>
      </svg>

      <figcaption className="t-spec mt-1 text-sm text-bone">{label}</figcaption>
    </figure>
  )
}
