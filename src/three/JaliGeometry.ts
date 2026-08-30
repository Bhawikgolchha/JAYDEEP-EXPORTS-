import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { patternPathData, type PatternId } from '../data/patterns'

// The geometry is the product. A jali is a solid with holes cut through it, and the
// shadow it throws is the whole reason anyone buys one, so the tile is extruded from
// the real cut path rather than faked with a texture.
//
// Depth is set from the real proportion: an 8 inch tile is about 2.5 inches deep, so
// the extrusion is 0.31 of the tile width. That ratio is what makes the light rake
// through the openings instead of passing straight out the back.

const DEPTH = 31 // in the 100-unit path space, so 0.31 once scaled to a 1 x 1 tile

const cache = new Map<PatternId, THREE.ExtrudeGeometry>()

export function jaliGeometry(id: PatternId): THREE.ExtrudeGeometry {
  const hit = cache.get(id)
  if (hit) return hit

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<path fill-rule="evenodd" d="${patternPathData(id)}"/></svg>`

  const parsed = new SVGLoader().parse(svg)
  const shapes = SVGLoader.createShapes(parsed.paths[0])

  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 1.1,
    bevelSize: 1.1,
    bevelSegments: 2,
    curveSegments: 14,
  })

  geo.center()
  geo.scale(0.01, 0.01, 0.01)
  // SVG y runs down, so the tile has to be flipped to match its own silhouette.
  // Done with a rotation, not a negative scale: mirroring reverses triangle winding,
  // which turns every front face into a back face and leaves the wall lit from behind.
  geo.rotateX(Math.PI)
  geo.computeVertexNormals()

  cache.set(id, geo)
  return geo
}

export function disposeJaliGeometry() {
  cache.forEach((g) => g.dispose())
  cache.clear()
}

export type ClayFinish = 'natural' | 'smoked' | 'sand' | 'ochre'

export const FINISH_CONFIGS: Record<ClayFinish, { label: string; hex: string; roughness: number }> = {
  natural: { label: 'Natural Clay', hex: '#b4552c', roughness: 0.92 },
  smoked: { label: 'Smoked Charcoal', hex: '#38302b', roughness: 0.88 },
  sand: { label: 'Sun-baked Sand', hex: '#cb9a6f', roughness: 0.94 },
  ochre: { label: 'Warm Ochre', hex: '#c47936', roughness: 0.86 },
}

/** unglazed fired clay: matte, slightly rough, no metal, finish configurable */
export function clayMaterial(finish: ClayFinish = 'natural') {
  const conf = FINISH_CONFIGS[finish] || FINISH_CONFIGS.natural
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(conf.hex),
    roughness: conf.roughness,
    metalness: 0,
    flatShading: false,
  })
}
