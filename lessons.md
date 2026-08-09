# Lessons

## 2026-08-09 - Video looped on desktop and stopped dead on phones

Three faults stacked, and desktop Chrome hid all three. `play()` was called in the
IntersectionObserver callback immediately after `setNear(true)`, so it ran one render
before the `<source>` children existed: the promise rejected, the `.catch(() => {})`
swallowed it, and nothing retried. Desktop still played because inserting a `<source>`
into a `NETWORK_EMPTY` element triggers resource selection and Chrome will start a muted
clip unprompted. Mobile autoplay policy will not. On top of that, `preload="none"` plus
`loop` is a known iOS Safari failure: it reaches the end and stops on the last frame
instead of seeking back. Learned: a swallowed promise rejection on a media element is
where this class of bug hides, and "works on desktop" is not evidence for autoplay or
looping. Prevention: call `play()` from an effect that runs after the sources render,
call `load()` explicitly, and keep an `ended` handler that resets `currentTime` as a
fallback beneath the `loop` attribute. Test the loop by seeking to `duration - 0.25` and
asserting the time wraps, and test the iOS path by setting `loop = false` first.

## 2026-08-09 - Negative scale on a THREE geometry inverts lighting

Flipping SVG-derived geometry with `geo.scale(0.01, -0.01, 0.01)` mirrored it, which
reverses triangle winding. Every front face became a back face, `computeVertexNormals`
then pointed the normals inward, and the whole jali wall rendered as if lit from behind.
Learned: mirroring is not a free transform in a lit scene. Prevention: flip with
`rotateX(Math.PI)` (determinant +1) instead of a negative axis scale, and treat "the
model is inexplicably dark" as a winding problem before touching light intensities.

## 2026-08-09 - `receiveShadow` on a thin slab self-shadows its own face

The tile in the pattern viewer had both `castShadow` and `receiveShadow`. With a raking
light and `shadow-normalBias 0.02`, the front face sampled its own shadow map and went
almost black, which read as a lighting bug and sent me tuning intensities for two
rounds. Prevention: on a thin object that is the subject of the shot, cast but do not
receive, or drop the normal bias to match the object's thickness.

## 2026-08-09 - Tailwind position utilities collide silently

`Stage` had `relative` in its base class list and callers passed `absolute inset-0`.
Both landed on the element, source order decided the winner, and the box collapsed to
zero height, which showed up as an R3F canvas stuck at its 300x150 default. Prevention:
a component that accepts a `className` must not also set `position` in its base classes.

## 2026-08-09 - ffmpeg `delogo` smears on textured areas

Used `delogo` to remove the sparkle watermark from the supplied clips. On the shadowed
floor of clip 1 it left an obvious rectangular smear. Cropping 140px off the right edge
removed the watermark with no artefact and cost nothing that mattered in any of the six
compositions. Prevention: check a delogo result on the busiest frame, not an easy one,
and prefer a crop when the watermark sits near an edge.

## 2026-08-09 - A sun arc that crosses due south has a dead centre

The light angle was mapped straight across a half circle, so at the middle of the slider
the sun sat directly in front of the wall and threw its shadow straight backwards, where
the wall itself hid it. The control looked broken at exactly the position most people
would leave it. Prevention: when an angle drives a visible effect, check the effect at
both ends and the middle, and clip the range so no position is degenerate.
