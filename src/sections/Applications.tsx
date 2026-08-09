import { Clip } from '../components/Clip'

// Two clips, no card grid. A facade is the reason most of these orders get placed, and
// a container is how the order actually arrives, so those are the two things shown.

export function Applications() {
  return (
    <section id="where" className="pb-24 md:pb-32">
      <div className="relative h-[62dvh] min-h-[380px] w-full md:h-[80dvh]">
        <Clip
          name="facade-golden"
          alt="A house elevation clad in terracotta jali blocks, lit low by evening sun, with planting in the foreground"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(20,16,14,0.95) 4%, transparent 52%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-10 sm:px-6">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="t-display max-w-[16ch] text-[clamp(1.9rem,6vw,4rem)]">
              Facades, courtyards, stairwells, boundary walls.
            </h2>
            <p className="t-body mt-4 text-base">
              The block carries itself in a screen wall up to normal storey height, and sits
              in a frame beyond that. Your structural engineer will size the frame.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-[1400px] items-center gap-8 px-4 sm:px-6 md:mt-24 md:grid-cols-[1fr_1.1fr] md:gap-12">
        <div>
          <h3 className="t-display text-[clamp(1.6rem,4vw,2.6rem)]">Packed to survive the trip.</h3>
          <p className="t-body mt-4 text-base">
            Blocks are stacked on wooden pallets, corner protected, film wrapped and strapped
            before they go into the container. Fired clay travels well when it cannot move.
          </p>
        </div>
        <div className="aspect-[16/10] w-full overflow-hidden border border-kiln-3">
          <Clip
            name="packing-export"
            alt="Pallets of terracotta blocks wrapped and strapped beside an open shipping container"
          />
        </div>
      </div>
    </section>
  )
}
