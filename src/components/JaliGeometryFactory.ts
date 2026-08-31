import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { patternPathData, type JaliPatternId } from '../data/patterns'

export { type PatternId, type JaliPatternId } from '../data/patterns'

// The geometry is the product. A jali is a solid with holes cut through it, and the
// shadow it throws is the reason an architect specifies one.
//
// Real architectural dimensions: 203.2 x 203.2 x 63.5 mm (8" x 8" x 2.5").
// In normalized units: 1.0 x 1.0 with 0.31 depth ratio.

export const JALI_MODULE_SIZE_MM = 203.2
export const JALI_MODULE_THICKNESS_MM = 63.5
export const JALI_DEPTH_RATIO = 0.31

export type ClayFinish = 'natural' | 'smoked' | 'sand' | 'ochre' | 'clay' | 'charcoal'

export interface JaliGeometryOptions {
  patternId: JaliPatternId
  bevelEnabled?: boolean
  bevelThickness?: number
  bevelSize?: number
  bevelSegments?: number
  curveSegments?: number
  thickness?: number
  depth?: number
  scale?: number
}

export const FINISH_CONFIGS: Record<
  ClayFinish,
  { label: string; hex: string; roughness: number; metalness: number }
> = {
  natural: { label: 'Natural Clay', hex: '#b4552c', roughness: 0.92, metalness: 0 },
  clay: { label: 'Natural Clay', hex: '#b4552c', roughness: 0.92, metalness: 0 },
  smoked: { label: 'Smoked Charcoal', hex: '#38302b', roughness: 0.88, metalness: 0.05 },
  charcoal: { label: 'Smoked Charcoal', hex: '#38302b', roughness: 0.88, metalness: 0.05 },
  sand: { label: 'Sun-baked Sand', hex: '#cb9a6f', roughness: 0.94, metalness: 0 },
  ochre: { label: 'Warm Ochre', hex: '#c47936', roughness: 0.86, metalness: 0 },
}

const geometryCache = new Map<string, THREE.ExtrudeGeometry>()

/**
 * Procedural 3D Jali extrusion factory.
 * Generates watertight Three.js ExtrudeGeometry from normalized SVG paths.
 */
export function createJaliGeometry(
  optionsOrId: JaliGeometryOptions | JaliPatternId
): THREE.ExtrudeGeometry {
  const options: JaliGeometryOptions =
    typeof optionsOrId === 'string' ? { patternId: optionsOrId } : optionsOrId

  const id = options.patternId
  const depth = options.depth ?? options.thickness ?? 31
  const bevelEnabled = options.bevelEnabled ?? true
  const bevelThickness = options.bevelThickness ?? 1.1
  const bevelSize = options.bevelSize ?? 1.1
  const bevelSegments = options.bevelSegments ?? 2
  const curveSegments = options.curveSegments ?? 14
  const scale = options.scale ?? 0.01

  const cacheKey = `${id}:${depth}:${bevelEnabled}:${bevelThickness}:${bevelSize}:${curveSegments}:${scale}`
  const cached = geometryCache.get(cacheKey)
  if (cached) return cached

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<path fill-rule="evenodd" d="${patternPathData(id)}"/></svg>`

  const parsed = new SVGLoader().parse(svg)
  const shapes = SVGLoader.createShapes(parsed.paths[0])

  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled,
    bevelThickness,
    bevelSize,
    bevelSegments,
    curveSegments,
  })

  geo.center()
  geo.scale(scale, scale, scale)
  // SVG y runs downwards, rotate 180° around X to align upright without inverting triangle winding normals
  geo.rotateX(Math.PI)
  geo.computeVertexNormals()

  geometryCache.set(cacheKey, geo)
  return geo
}

/** Backward-compatible alias */
export function jaliGeometry(id: JaliPatternId): THREE.ExtrudeGeometry {
  return createJaliGeometry(id)
}

/** Disposes all cached extrusion geometries to reclaim GPU VRAM */
export function disposeJaliGeometry() {
  geometryCache.forEach((g) => g.dispose())
  geometryCache.clear()
}

/**
 * Standard unglazed fired clay material with roughness & micro-porosity settings.
 */
export function clayMaterial(finish: ClayFinish = 'natural') {
  const conf = FINISH_CONFIGS[finish] || FINISH_CONFIGS.natural
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(conf.hex),
    roughness: conf.roughness,
    metalness: conf.metalness,
    flatShading: false,
  })
}
