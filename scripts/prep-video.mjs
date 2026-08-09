// Prepares the six supplied clips for the web.
//
// Each clip carries the same four-point sparkle watermark at bottom-right that the
// posters have. delogo was tried first and left a visible rectangular smear across the
// shadowed floor in clip 1, so this crops the right edge instead. The sparkle sits from
// x=1150 onward, so a 1140-wide crop removes it with zero artefacts. Costs 11% of the
// frame width and nothing that matters in any of the six compositions.
//
// Requires ffmpeg on PATH. Run: npm run prep:video

import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'public', 'video')

// sparkle sits from about x=1150 in the 1280x720 source. crop it off the right edge.
const CROP = 'crop=1140:720:0:0'

const CLIPS = [
  { src: '1.mp4', name: 'hero-wall' },
  { src: '2.mp4', name: 'facade-golden' },
  { src: '3.mp4', name: 'interior-partition' },
  { src: '4.mp4', name: 'drying-yard' },
  { src: '5.mp4', name: 'clay-macro' },
  { src: '6.mp4', name: 'packing-export' },
]

const run = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' })

async function main() {
  await mkdir(OUT, { recursive: true })

  for (const clip of CLIPS) {
    const from = path.join(ROOT, clip.src)
    if (!existsSync(from)) {
      // already processed on a previous run
      if (existsSync(path.join(OUT, `${clip.name}.mp4`))) continue
      throw new Error(`missing source clip: ${clip.src}`)
    }

    run(['-i', from, '-vf', CROP, '-an', '-c:v', 'libx264', '-crf', '24', '-preset', 'slow',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(OUT, `${clip.name}.mp4`)])

    run(['-i', from, '-vf', CROP, '-an', '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0',
      '-row-mt', '1', path.join(OUT, `${clip.name}.webm`)])

    // poster frame keeps CLS at zero and is what reduced-motion users see instead of playback
    run(['-i', from, '-vf', `${CROP},scale=1140:-2`, '-frames:v', '1',
      path.join(OUT, `${clip.name}-poster.webp`)])

    console.log(`  ${clip.src} -> ${clip.name}`)
  }

  console.log('\nvideo prep done. check public/video for the sparkle before shipping.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
