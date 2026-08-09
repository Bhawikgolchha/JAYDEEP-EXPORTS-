# Jaydeep Exports

One-page site for terracotta jali screens and perforated clay bricks.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck, then build to dist/
npm run preview  # serve the built site
```

`dist/` is static. Any host works: Netlify, Vercel, Cloudflare Pages, or plain nginx.

## Before this goes live

**Fill in `src/data/contact.ts`.** Phone, email, and the WhatsApp number if it differs
from the phone. Until those are set, the contact block says the details are coming and
the enquiry form's submit button is disabled on purpose, so nothing typed into it is
silently lost. Nothing else needs touching to ship.

## What the page claims

Nothing that was not printed on a product sheet. No minimum order quantity, no country
count, no years in business, no certifications, no water absorption or compressive
strength figures. Sizes appear on exactly three products because those are the three
posters that printed a size. If you want any of that on the page, send the real numbers
and they go in `src/data/products.ts` and a new trust section.

The one derived figure is the coverage calculator, which works from the 8 x 8 inch
module and says so on screen.

## Assets

Source posters and clips live in `assets-source/` and are not served. The web versions
are generated:

```bash
npm run prep:posters   # 28 posters -> public/posters/*.webp, regenerates src/data/products.ts
npm run prep:video     # 6 clips -> public/video/*.{mp4,webm} + poster stills, needs ffmpeg
```

The poster manifest at the top of `scripts/prep-posters.mjs` is the source of truth for
product names, sizes and kinds. Edit it there, not in `src/data/products.ts`, which is
generated.

Two of the thirty source posters are deliberately excluded: a second "Leaf" whose tile
has no leaf pattern, and "Steper", which is the same stepped-slot product as "Stepper
jali". Product names are shown exactly as printed, misspellings included.

## Structure

- `src/data/patterns.ts` is the single source of truth for the eight modelled cuts. The
  same SVG path data feeds both the 3D geometry and the image placeholders, so a
  thumbnail and its 3D tile cannot drift apart.
- `src/three/` is lazy loaded. The page is fully usable with WebGL switched off: the
  hero falls back to the wall clip and every other section is images and video.
- `src/hooks/useSun.ts` owns the light. One value, 0 to 1, drives the 3D sun angle, the
  page warmth and the slider in the pattern section.

## Verified

- Production build clean, no console errors
- No horizontal overflow at 390, 768 and 1440
- Nav on one line at 64px at every width
- WCAG AA on every text and background pair on the page
- `prefers-reduced-motion: reduce`: canvas draws one static frame then stops, no entrance
  animation, no hover rake, no video playback
- WebGL disabled: hero falls back to video, all 28 products still render
- Lightbox opens and closes on Escape
