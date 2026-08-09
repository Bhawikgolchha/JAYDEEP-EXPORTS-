// Converts the 30 source posters to WebP and emits src/data/products.ts.
//
// The manifest below is the source of truth. It was built by reading every poster.
// Rules that are deliberate, not oversights:
//   - names are shown EXACTLY as printed on the poster, misspellings included
//   - `sizes` and `weightKg` appear only when the poster actually printed them
//   - two posters are dropped: a second "Leaf" with no leaf pattern, and "Steper",
//     which is the same stepped-slot product as "Stepper jali"
// Run: npm run prep:posters

import { mkdir, writeFile, rename, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = ROOT
const ARCHIVE = path.join(ROOT, 'assets-source')
const OUT = path.join(ROOT, 'public', 'posters')

const g = (n) => (n === null ? 'Gemini_Generated_Image_.png' : `Gemini_Generated_Image_ (${n}).png`)

/** @type {{file:string,slug:string,name:string,kind:'jali'|'brick'|'block',sizes?:string[],weightKg?:number,pattern?:string}[]} */
const MANIFEST = [
  { file: g(null), slug: 'arrow', name: 'Arrow', kind: 'jali', sizes: ['8 x 8 in'], pattern: 'arrow' },
  { file: g(1), slug: 'circle', name: 'Circle', kind: 'jali', pattern: 'circle' },
  { file: g(2), slug: 'camp', name: 'Camp', kind: 'jali' },
  { file: g(3), slug: 'amber', name: 'Amber', kind: 'jali', sizes: ['8 x 8 in'], weightKg: 2.5, pattern: 'amber' },
  { file: g(4), slug: 'cross', name: 'Cross', kind: 'jali', pattern: 'cross' },
  { file: g(5), slug: 'ludo', name: 'Ludo', kind: 'jali' },
  { file: g(6), slug: 'petal', name: 'Petal', kind: 'jali' },
  { file: g(7), slug: 'daimond', name: 'Daimond', kind: 'jali' },
  { file: g(8), slug: 'pearl', name: 'Pearl', kind: 'jali' },
  { file: g(9), slug: 'opel', name: 'Opel', kind: 'jali' },
  { file: g(10), slug: 'lotus', name: 'Lotus', kind: 'jali' },
  { file: g(11), slug: 'slice', name: 'Slice', kind: 'jali' },
  { file: g(12), slug: 'star', name: 'Star', kind: 'jali', pattern: 'star' },
  { file: g(13), slug: 'tv', name: 'Tv', kind: 'jali' },
  { file: g(14), slug: 'zebra', name: 'Zebra', kind: 'jali', pattern: 'zebra' },
  { file: g(15), slug: 'swastik', name: 'Swastik', kind: 'jali' },
  { file: g(16), slug: 'w', name: 'W', kind: 'jali', sizes: ['12 x 8 in', '10 x 7 in', '8 x 8 in'] },
  { file: g(17), slug: 'topaz', name: 'Topaz', kind: 'jali' },
  { file: g(18), slug: 'lilly', name: 'Lilly', kind: 'jali' },
  { file: g(19), slug: 'leaf', name: 'Leaf', kind: 'jali', pattern: 'leaf' },
  // g(20) "Steper" dropped: same product as "Stepper jali" below
  { file: g(21), slug: 'capsul', name: 'Capsul', kind: 'brick' },
  { file: g(22), slug: 'two-hole-square-bricks', name: '2 Hole Square Bricks', kind: 'brick' },
  { file: g(23), slug: 'ten-hole-bricks', name: '10 Hole Bricks', kind: 'brick' },
  { file: g(24), slug: 'omega-jali', name: 'Omega Jali', kind: 'block' },
  { file: g(25), slug: 'three-hole-bricks', name: '3 Hole Bricks', kind: 'brick' },
  { file: g(26), slug: 'greek-bricks', name: 'Greek Bricks', kind: 'jali' },
  { file: g(27), slug: 'stepper-jali', name: 'Stepper Jali', kind: 'jali' },
  { file: g(28), slug: 'window', name: 'Window', kind: 'jali', pattern: 'window' },
  // g(29) "Leaf" dropped: duplicate name, and the tile shown has no leaf pattern
]

const DROPPED = [g(20), g(29)]

async function main() {
  await mkdir(OUT, { recursive: true })
  await mkdir(ARCHIVE, { recursive: true })

  let converted = 0
  for (const item of MANIFEST) {
    const from = existsSync(path.join(SRC, item.file))
      ? path.join(SRC, item.file)
      : path.join(ARCHIVE, item.file)

    if (!existsSync(from)) {
      throw new Error(`missing source poster: ${item.file}`)
    }

    const img = sharp(from)
    await img
      .clone()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(OUT, `${item.slug}.webp`))
    await img
      .clone()
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(path.join(OUT, `${item.slug}-thumb.webp`))

    converted++
    process.stdout.write(`  ${item.slug}\n`)
  }

  // move every source PNG out of the project root, dropped ones included
  const all = await readdir(SRC)
  for (const f of all) {
    if (!f.endsWith('.png') || !f.startsWith('Gemini_Generated_Image_')) continue
    await rename(path.join(SRC, f), path.join(ARCHIVE, f))
  }

  const entries = MANIFEST.map((m) => {
    const parts = [
      `    slug: '${m.slug}'`,
      `    name: '${m.name.replace(/'/g, "\\'")}'`,
      `    kind: '${m.kind}'`,
    ]
    if (m.sizes) parts.push(`    sizes: [${m.sizes.map((s) => `'${s}'`).join(', ')}]`)
    if (m.weightKg) parts.push(`    weightKg: ${m.weightKg}`)
    if (m.pattern) parts.push(`    pattern: '${m.pattern}'`)
    parts.push(`    poster: '/posters/${m.slug}.webp'`)
    parts.push(`    thumb: '/posters/${m.slug}-thumb.webp'`)
    return `  {\n${parts.join(',\n')},\n  },`
  }).join('\n')

  const file = `// GENERATED by scripts/prep-posters.mjs. Edit the manifest there, not this file.
//
// Every value here was printed on a poster. Nothing is inferred. A product with no
// \`sizes\` genuinely has no size printed on its poster, and the page shows nothing
// rather than a guess.

import type { PatternId } from './patterns'

export type ProductKind = 'jali' | 'brick' | 'block'

export type Product = {
  slug: string
  /** exactly as printed on the poster, misspellings preserved */
  name: string
  kind: ProductKind
  sizes?: string[]
  weightKg?: number
  /** set only for the patterns modelled in 3D */
  pattern?: PatternId
  poster: string
  thumb: string
}

export const PRODUCTS: Product[] = [
${entries}
]

export const KIND_LABEL: Record<ProductKind, string> = {
  jali: 'Jali screens',
  brick: 'Perforated bricks',
  block: 'Special blocks',
}
`

  await mkdir(path.join(ROOT, 'src', 'data'), { recursive: true })
  await writeFile(path.join(ROOT, 'src', 'data', 'products.ts'), file, 'utf8')

  console.log(`\n${converted} posters converted, ${DROPPED.length} dropped, products.ts written`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
