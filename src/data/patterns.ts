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
  | 'arrow'
  | 'circle'
  | 'star'
  | 'zebra'
  | 'window'
  | 'leaf'
  | 'cross'
  | 'amber'

export type Pattern = {
  id: PatternId
  label: string
  /** what this cut actually does to light, in one plain sentence */
  light: string
  holes: string[]
}

const roundedRect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} ` +
  `A${r},${r} 0 0 1 ${x + w - r},${y + h} H${x + r} A${r},${r} 0 0 1 ${x},${y + h - r} ` +
  `V${y + r} A${r},${r} 0 0 1 ${x + r},${y} Z`

export const PATTERNS: Record<PatternId, Pattern> = {
  arrow: {
    id: 'arrow',
    label: 'Arrow',
    light: 'Four fans throw the light outward, so the pattern spreads as it lands.',
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
    holes: [
      'M10,46 A36,36 0 0 1 46,10 L24,10 A14,14 0 0 0 10,24 Z',
      'M54,10 A36,36 0 0 1 90,46 L90,24 A14,14 0 0 0 76,10 Z',
      'M90,54 A36,36 0 0 1 54,90 L76,90 A14,14 0 0 0 90,76 Z',
      'M46,90 A36,36 0 0 1 10,54 L10,76 A14,14 0 0 0 24,90 Z',
      'M39,50 A11,11 0 1 0 61,50 A11,11 0 1 0 39,50 Z',
    ],
  },

  star: {
    id: 'star',
    label: 'Star',
    light: 'Four eyes and a centre diamond. The cast pattern reads as scattered light, not stripes.',
    holes: [
      'M50,28 L72,50 L50,72 L28,50 Z',
      'M16,44 A30,30 0 0 1 44,16 A30,30 0 0 1 16,44 Z',
      'M56,16 A30,30 0 0 1 84,44 A30,30 0 0 1 56,16 Z',
      'M84,56 A30,30 0 0 1 56,84 A30,30 0 0 1 84,56 Z',
      'M44,84 A30,30 0 0 1 16,56 A30,30 0 0 1 44,84 Z',
    ],
  },

  zebra: {
    id: 'zebra',
    label: 'Zebra',
    light: 'Angled louvres. Cuts high sun hard and lets low morning light run straight through.',
    holes: [
      'M11,88 L22,88 L36,12 L25,12 Z',
      'M28,88 L39,88 L53,12 L42,12 Z',
      'M45,88 L56,88 L70,12 L59,12 Z',
      'M62,88 L73,88 L87,12 L76,12 Z',
    ],
  },

  window: {
    id: 'window',
    label: 'Window',
    light: 'The most open cut in the set. Four square lights, maximum airflow.',
    holes: [
      roundedRect(10, 10, 34, 34, 4),
      roundedRect(56, 10, 34, 34, 4),
      roundedRect(10, 56, 34, 34, 4),
      roundedRect(56, 56, 34, 34, 4),
    ],
  },

  leaf: {
    id: 'leaf',
    label: 'Leaf',
    light: 'One long opening on the diagonal. Reads as a single blade of light on the floor.',
    holes: ['M14,86 A72,72 0 0 1 86,14 A72,72 0 0 1 14,86 Z'],
  },

  cross: {
    id: 'cross',
    label: 'Cross',
    light: 'A solid X carries the load, so this one stacks tallest before it needs a lintel.',
    holes: [
      'M20,12 L80,12 L50,42 Z',
      'M88,20 L88,80 L58,50 Z',
      'M20,88 L80,88 L50,58 Z',
      'M12,20 L12,80 L42,50 Z',
    ],
  },

  amber: {
    id: 'amber',
    label: 'Amber',
    light: 'Petals around an eye. The tightest cut here, for walls that face the street.',
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
}

export const PATTERN_IDS = Object.keys(PATTERNS) as PatternId[]

/** outer tile plus every void, as one `d`. Use with fill-rule="evenodd". */
export function patternPathData(id: PatternId): string {
  return `M0,0 H100 V100 H0 Z ${PATTERNS[id].holes.join(' ')}`
}

/** fallback silhouette for the products with no modelled pattern */
export const GENERIC_PATH = 'M0,0 H100 V100 H0 Z M18,18 H82 V82 H18 Z'
