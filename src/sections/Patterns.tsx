import { CustomizerStudio } from '../components/CustomizerStudio'

export function Patterns() {
  return (
    <section id="patterns" className="px-4 pb-24 sm:px-6 md:pb-32" data-testid="patterns-section">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 md:mb-12">
          <span className="t-spec text-xs text-ember tracking-widest uppercase block mb-2">
            Stage 04 // Interactive 3D Architectural Studio
          </span>
          <h2 className="t-display max-w-[18ch] text-[clamp(2.2rem,7vw,4.5rem)] leading-none text-bone">
            Move the sun. Watch the shadow.
          </h2>
          <p className="t-body mt-4 max-w-[65ch] text-base text-bone-dim">
            Experiment with all 15 procedural terracotta jali patterns. Configure parametric wall
            spans, toggle mortar joints, swap artisanal reduction finishes, and scrub solar trajectories
            to observe real-time daylight projection.
          </p>
        </div>

        <CustomizerStudio />
      </div>
    </section>
  )
}

export { Patterns as PatternViewer }
export default Patterns
