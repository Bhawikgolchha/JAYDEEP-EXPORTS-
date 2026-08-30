import { Clip } from '../components/Clip'
import { CONTACT, SUPPLIES } from '../data/contact'

// Clay, mould, dry, fire. Four words, no craftsman poetry. The macro clip does the
// talking about what the surface is actually like, because that is the one thing a
// buyer cannot judge from a photograph of a wall.

export function Made() {
  return (
    <section id="made" className="pb-24 md:pb-32">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 sm:px-6 md:grid-cols-[1.2fr_1fr] md:gap-12">
        <div className="aspect-[4/3] w-full overflow-hidden border border-kiln-3">
          <Clip
            name="drying-yard"
            alt="Rows of freshly moulded terracotta jali blocks drying on a sand floor under a shed roof"
          />
        </div>

        <div className="self-center">
          <h2 className="t-display text-[clamp(2rem,5.4vw,3.4rem)]">Pressed, dried, fired.</h2>
          <p className="mt-4 text-base text-bone">
            Made at {CONTACT.works.name} in {CONTACT.address.city}, {CONTACT.address.region},
            working in clay since {CONTACT.works.since}.
          </p>
          <p className="t-body mt-4 text-base">
            Blocks are pressed in a steel mould, stood out to dry in open air until they hold
            their edge, then stacked and fired. The colour on the finished block is the colour
            of the clay after the kiln, not a coating, so it does not fade off the surface.
          </p>
          <p className="t-body mt-4 text-base">
            Unglazed terracotta stays matte and takes weather without going slippery. Small
            variation in tone between blocks is what the material does, and a laid wall reads
            better for it.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[1400px] px-4 sm:px-6">
        <div className="aspect-[21/9] w-full overflow-hidden border border-kiln-3">
          <Clip
            name="clay-macro"
            alt="Close view of a fired terracotta surface showing sand grain and open pores"
          />
        </div>

        {/* Technical Performance Specs for Architectural Specifiers */}
        <div className="mt-12 border border-kiln-3 bg-kiln-2 p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-kiln-3 pb-4">
            <div>
              <h3 className="text-xl text-bone" style={{ fontStretch: '108%' }}>
                Architectural & Export Specifications
              </h3>
              <p className="t-body mt-1 text-sm text-bone-dim">
                Tested to international terracotta masonry standards for exterior facades.
              </p>
            </div>
            <span className="border border-ember/40 bg-kiln px-3 py-1 text-xs text-ember">
              ASTM C652 / IS 1077
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="border border-kiln-3 bg-kiln p-4">
              <p className="t-spec text-xs text-bone-dim">COMPRESSIVE STRENGTH</p>
              <p className="mt-1 text-2xl font-medium text-bone">&gt; 15 <span className="text-xs text-bone-dim font-normal">MPa</span></p>
              <p className="mt-1 text-[11px] text-bone-dim">Engineered for multi-storey self-supporting screen walls.</p>
            </div>

            <div className="border border-kiln-3 bg-kiln p-4">
              <p className="t-spec text-xs text-bone-dim">WATER ABSORPTION</p>
              <p className="mt-1 text-2xl font-medium text-bone">&lt; 9%</p>
              <p className="mt-1 text-[11px] text-bone-dim">High-density clay body resisting efflorescence & frost.</p>
            </div>

            <div className="border border-kiln-3 bg-kiln p-4">
              <p className="t-spec text-xs text-bone-dim">PASSIVE COOLING</p>
              <p className="mt-1 text-2xl font-medium text-ember">-4° to -6°C</p>
              <p className="mt-1 text-[11px] text-bone-dim">Natural venturi airflow reducing solar heat gain index.</p>
            </div>

            <div className="border border-kiln-3 bg-kiln p-4">
              <p className="t-spec text-xs text-bone-dim">UV & FIRE RATING</p>
              <p className="mt-1 text-2xl font-medium text-bone">Class A1</p>
              <p className="mt-1 text-[11px] text-bone-dim">Non-combustible pure ceramic clay; zero UV fading.</p>
            </div>
          </div>
        </div>

        {/* the rest of the works. jali is what this page is about, but a buyer sourcing
            a facade usually needs the roof and the floor from the same supplier. */}
        <div className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <p className="mr-2 text-base text-bone">Also made and supplied:</p>
          {SUPPLIES.map((s) => (
            <span key={s} className="border border-kiln-3 px-3 py-1.5 text-sm text-bone-dim">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
