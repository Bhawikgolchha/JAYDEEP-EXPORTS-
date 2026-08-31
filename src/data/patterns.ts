// The cut patterns, as SVG path data in a 100 x 100 box.
//
// One source of truth on purpose. The same strings feed two very different consumers:
//   - the SVG silhouette that holds an image's box while its WebP decodes
//   - THREE.ExtrudeGeometry in the 3D viewer, via SVGLoader
// If a pattern is wrong it is wrong in both places, which is the point.
//
// Each `holes` entry is one closed subpath. The outer 100 x 100 square is added by the
// consumer, so a hole is only ever the void, never the tile.

export type PatternId =
  | 'amber'
  | 'arrow'
  | 'circle'
  | 'cross'
  | 'diamond'
  | 'four-square'
  | 'leaf'
  | 'lotus'
  | 'omega'
  | 'opal'
  | 'pearl'
  | 'star'
  | 'swastik'
  | 'topaz'
  | 'tv'
  | 'window'
  | 'zebra'

export type JaliPatternId = PatternId

export type Pattern = {
  id: PatternId
  label: string
  /** what this cut actually does to light, in one plain sentence */
  light: string
  /** percentage of open void area */
  openAreaPct?: number
  /** architectural category or characteristic */
  category?: 'floral' | 'geometric' | 'solar' | 'minimal' | 'traditional'
  holes: string[]
}

const roundedRect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} ` +
  `A${r},${r} 0 0 1 ${x + w - r},${y + h} H${x + r} A${r},${r} 0 0 1 ${x},${y + h - r} ` +
  `V${y + r} A${r},${r} 0 0 1 ${x + r},${y} Z`

export const PATTERNS: Record<PatternId, Pattern> = {
  amber: {
    id: 'amber',
    label: 'Amber',
    light: 'Petals around an eye. The tightest cut here, for walls that face the street.',
    openAreaPct: 26,
    category: 'floral',
    holes: [
      'M50,12 Q64,26 50,38 Q36,26 50,12 Z',
      'M88,50 Q74,64 62,50 Q74,36 88,50 Z',
      'M50,88 Q64,74 50,62 Q36,74 50,88 Z',
      'M12,50 Q26,64 38,50 Q26,36 12,50 Z',
      'M40,50 A10,10 0 1 0 60,50 A10,10 0 1 0 40,50 Z',
      'M26,18 L34,26 L26,34 L18,26 Z',
      'M74,18 L82,26 L74,34 L66,26 Z',
      'M74,66 L82,74 L74,82 L66,74 Z',
      'M26,66 L34,74 L26,82 L18,74 Z',
    ],
  },

  arrow: {
    id: 'arrow',
    label: 'Arrow',
    light: 'Four fans throw the light outward, so the pattern spreads as it lands.',
    openAreaPct: 38,
    category: 'geometric',
    holes: [
      'M17,47 A30,30 0 0 1 47,17 L47,47 Z',
      'M53,17 A30,30 0 0 1 83,47 L53,47 Z',
      'M83,53 A30,30 0 0 1 53,83 L53,53 Z',
      'M47,83 A30,30 0 0 1 17,53 L47,53 Z',
    ],
  },

  circle: {
    id: 'circle',
    label: 'Circle',
    light: 'Curved ribs soften the edge of every shadow, so the wall reads warm at noon.',
    openAreaPct: 42,
    category: 'geometric',
    holes: [
      'M10,46 A36,36 0 0 1 46,10 L24,10 A14,14 0 0 0 10,24 Z',
      'M54,10 A36,36 0 0 1 90,46 L90,24 A14,14 0 0 0 76,10 Z',
      'M90,54 A36,36 0 0 1 54,90 L76,90 A14,14 0 0 0 90,76 Z',
      'M46,90 A36,36 0 0 1 10,54 L10,76 A14,14 0 0 0 24,90 Z',
      'M39,50 A11,11 0 1 0 61,50 A11,11 0 1 0 39,50 Z',
    ],
  },

  cross: {
    id: 'cross',
    label: 'Cross',
    light: 'A solid X carries the load, so this one stacks tallest before it needs a lintel.',
    openAreaPct: 36,
    category: 'geometric',
    holes: [
      'M20,12 L80,12 L50,42 Z',
      'M88,20 L88,80 L58,50 Z',
      'M20,88 L80,88 L50,58 Z',
      'M12,20 L12,80 L42,50 Z',
    ],
  },

  diamond: {
    id: 'diamond',
    label: 'Diamond',
    light: 'Rhombus facets break direct sun into crisp diagonal ribbons across the interior.',
    openAreaPct: 34,
    category: 'geometric',
    holes: [
      'M50,16 L84,50 L50,84 L16,50 Z',
      'M16,16 L34,16 L16,34 Z',
      'M84,16 L84,34 L66,16 Z',
      'M84,84 L66,84 L84,66 Z',
      'M16,84 L16,66 L34,84 Z',
    ],
  },

  leaf: {
    id: 'leaf',
    label: 'Leaf',
    light: 'One long opening on the diagonal. Reads as a single blade of light on the floor.',
    openAreaPct: 28,
    category: 'floral',
    holes: ['M14,86 A72,72 0 0 1 86,14 A72,72 0 0 1 14,86 Z'],
  },

  lotus: {
    id: 'lotus',
    label: 'Lotus',
    light: 'Tiered sacred petals cast layered organic shadows reminiscent of temple courtyards.',
    openAreaPct: 32,
    category: 'floral',
    holes: [
      'M50,16 C58,30 58,46 50,58 C42,46 42,30 50,16 Z',
      'M50,58 C36,50 24,38 28,26 C38,36 46,48 50,58 Z',
      'M50,58 C64,50 76,38 72,26 C62,36 54,48 50,58 Z',
      'M30,68 C38,62 46,64 50,68 C44,76 34,76 30,68 Z',
      'M70,68 C62,62 54,64 50,68 C56,76 66,76 70,68 Z',
      'M44,78 H56 V86 H44 Z',
    ],
  },

  omega: {
    id: 'omega',
    label: 'Omega',
    light: 'Horseshoe arch geometry channels high midday light into a dramatic central focal beam.',
    openAreaPct: 35,
    category: 'traditional',
    holes: [
      'M28,68 C18,50 22,24 50,22 C78,24 82,50 72,68 H58 C62,54 60,34 50,34 C40,34 38,54 42,68 Z',
      'M22,76 H78 V84 H22 Z',
    ],
  },

  opal: {
    id: 'opal',
    label: 'Opal',
    light: 'Octagonal gem facets provide balanced multi-directional diffusion with sharp edges.',
    openAreaPct: 40,
    category: 'geometric',
    holes: [
      'M32,16 H68 L84,32 V68 L68,84 H32 L16,68 V32 Z',
      'M50,36 L64,50 L50,64 L36,50 Z',
    ],
  },

  pearl: {
    id: 'pearl',
    label: 'Pearl',
    light: 'Clustered circular apertures cast soft celestial orbs across walls and walkways.',
    openAreaPct: 30,
    category: 'floral',
    holes: [
      'M39,50 A11,11 0 1 0 61,50 A11,11 0 1 0 39,50 Z',
      'M42,25 A8,8 0 1 0 58,25 A8,8 0 1 0 42,25 Z',
      'M67,50 A8,8 0 1 0 83,50 A8,8 0 1 0 67,50 Z',
      'M42,75 A8,8 0 1 0 58,75 A8,8 0 1 0 42,75 Z',
      'M17,50 A8,8 0 1 0 33,50 A8,8 0 1 0 17,50 Z',
      'M20,24 A4,4 0 1 0 28,24 A4,4 0 1 0 20,24 Z',
      'M72,24 A4,4 0 1 0 80,24 A4,4 0 1 0 72,24 Z',
      'M72,76 A4,4 0 1 0 80,76 A4,4 0 1 0 72,76 Z',
      'M20,76 A4,4 0 1 0 28,76 A4,4 0 1 0 20,76 Z',
    ],
  },

  star: {
    id: 'star',
    label: 'Star',
    light: 'Four eyes and a centre diamond. The cast pattern reads as scattered light, not stripes.',
    openAreaPct: 36,
    category: 'solar',
    holes: [
      'M50,28 L72,50 L50,72 L28,50 Z',
      'M16,44 A30,30 0 0 1 44,16 A30,30 0 0 1 16,44 Z',
      'M56,16 A30,30 0 0 1 84,44 A30,30 0 0 1 56,16 Z',
      'M84,56 A30,30 0 0 1 56,84 A30,30 0 0 1 84,56 Z',
      'M44,84 A30,30 0 0 1 16,56 A30,30 0 0 1 44,84 Z',
    ],
  },

  swastik: {
    id: 'swastik',
    label: 'Swastik',
    light: 'Ancient four-fold solar meander channels cooling cross-breezes and crisp right-angled shadows.',
    openAreaPct: 31,
    category: 'solar',
    holes: [
      'M14,14 H54 V23 H23 V54 H14 Z',
      'M86,14 V54 H77 V23 H46 V14 Z',
      'M86,86 H46 V77 H77 V46 H86 Z',
      'M14,86 V46 H23 V77 H54 V86 Z',
      'M46,46 H54 V54 H46 Z',
    ],
  },

  tv: {
    id: 'tv',
    label: 'TV',
    light: 'Mid-century wide viewports maximize panoramic daylighting while framing exterior views.',
    openAreaPct: 44,
    category: 'minimal',
    holes: [
      roundedRect(14, 14, 72, 32, 6),
      roundedRect(14, 54, 72, 32, 6),
    ],
  },

  'four-square': {
    id: 'four-square',
    label: 'Four Square',
    light: 'Four quadrant square apertures. Symmetrical geometry providing open balanced airflow and daylighting.',
    openAreaPct: 48,
    category: 'geometric',
    holes: [
      roundedRect(10, 10, 35, 35, 4),
      roundedRect(55, 10, 35, 35, 4),
      roundedRect(10, 55, 35, 35, 4),
      roundedRect(55, 55, 35, 35, 4),
    ],
  },

  topaz: {
    id: 'topaz',
    label: 'Topaz',
    light: 'Large circular Oculus opening. Bold central aperture casting sharp focal sunbeams.',
    openAreaPct: 40,
    category: 'geometric',
    holes: [
      'M16,50 A34,34 0 1 0 84,50 A34,34 0 1 0 16,50 Z',
    ],
  },

  window: {
    id: 'window',
    label: 'Window',
    light: 'Single monolithic square frame aperture. Maximum continuous sightlines and uninterrupted daylighting.',
    openAreaPct: 52,
    category: 'minimal',
    holes: [
      roundedRect(14, 14, 72, 72, 5),
    ],
  },

  zebra: {
    id: 'zebra',
    label: 'Zebra',
    light: 'Angled louvres. Cuts high sun hard and lets low morning light run straight through.',
    openAreaPct: 36,
    category: 'geometric',
    holes: [
      'M11,88 L22,88 L36,12 L25,12 Z',
      'M28,88 L39,88 L53,12 L42,12 Z',
      'M45,88 L56,88 L70,12 L59,12 Z',
      'M62,88 L73,88 L87,12 L76,12 Z',
    ],
  },
}

export const PATTERN_IDS = Object.keys(PATTERNS) as PatternId[]

/** outer tile plus every void, as one `d`. Use with fill-rule="evenodd". */
export function patternPathData(id: PatternId): string {
  const pattern = PATTERNS[id] || PATTERNS.star
  return `M0,0 H100 V100 H0 Z ${pattern.holes.join(' ')}`
}

/** fallback silhouette for the products with no modelled pattern */
export const GENERIC_PATH = 'M0,0 H100 V100 H0 Z M18,18 H82 V82 H18 Z'
