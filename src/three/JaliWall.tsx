import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { jaliGeometry, clayMaterial } from './JaliGeometry'
import { SunRig } from './SunRig'
import { sun } from '../hooks/useSun'
import type { PatternId } from '../data/patterns'

// The hero: a screen wall standing in front of a plaster wall, lit by one raking sun.
// Nothing here is decorative. You are looking at the product doing its job, and the
// pattern thrown on the plaster behind is what a buyer is actually buying.
//
// The wall is sized from the viewport rather than from a fixed grid, so a block is
// roughly the same size on a phone and on a desktop. A fixed 9 x 6 grid looks right on
// a laptop and turns into two enormous blocks on a portrait phone.
//
// Three cuts run in vertical bands, two blocks wide. Real walls are usually laid in a
// single pattern, but banding is how a supplier's own sample wall gets built, and it
// shows range in the first second without looking like scattered noise.

const GAP = 1.03 // blocks butt together, the sliver between them reads as the mortar line
const BANDS: PatternId[] = ['star', 'circle', 'amber']
const MAX_PER_BAND = 90

export function JaliWall({ quality }: { quality: 'low' | 'high' }) {
  const group = useRef<THREE.Group>(null)
  const meshes = useRef<(THREE.InstancedMesh | null)[]>([])
  const { viewport } = useThree()

  const geos = useMemo(() => BANDS.map((id) => jaliGeometry(id)), [])
  const mat = useMemo(() => clayMaterial(), [])

  const { cols, rows, tile } = useMemo(() => {
    const across = quality === 'high' ? 6 : 3
    const t = viewport.width / across
    const c = across + 2
    const r = Math.max(3, Math.ceil(viewport.height / (t * GAP)) + 2)
    return { cols: c, rows: r, tile: t }
  }, [viewport.width, viewport.height, quality])

  useLayoutEffect(() => {
    const counts = BANDS.map(() => 0)
    const t = new THREE.Object3D()

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const band = Math.floor(x / 2) % BANDS.length
        const m = meshes.current[band]
        if (!m || counts[band] >= MAX_PER_BAND) continue

        t.position.set((x - (cols - 1) / 2) * GAP, (y - (rows - 1) / 2) * GAP, 0)
        // a hand-laid wall is not a spreadsheet. a fraction of a degree per block is
        // the difference between clay and a render.
        t.rotation.z = (((x * 7 + y * 13) % 5) - 2) * 0.0022
        t.updateMatrix()
        m.setMatrixAt(counts[band]++, t.matrix)
      }
    }

    meshes.current.forEach((m, i) => {
      if (!m) return
      m.count = counts[i]
      m.instanceMatrix.needsUpdate = true
    })
  }, [cols, rows])

  // the wall turns a couple of degrees across the day, so the parallax reads as the
  // sun moving rather than as an object spinning
  useFrame(() => {
    if (!group.current) return
    // held off square on purpose. straight on, a repeating wall reads as wallpaper;
    // a few degrees of turn gives the blocks their thickness back.
    group.current.rotation.y = -0.2 + (sun.get() - 0.5) * 0.12
  })

  return (
    <>
      {/* the shadow camera lives in world space, so it is sized from the viewport,
          not from the grid, which is scaled */}
      <SunRig
        mapSize={quality === 'high' ? 2048 : 1024}
        extent={Math.max(viewport.width, viewport.height) * 0.8}
      />

      <group ref={group} scale={tile}>
        {BANDS.map((id, i) => (
          <instancedMesh
            key={id}
            ref={(el) => {
              meshes.current[i] = el
            }}
            args={[geos[i], mat, MAX_PER_BAND]}
            castShadow
            receiveShadow
            frustumCulled={false}
          />
        ))}

        {/* plaster wall behind. this is the surface the pattern lands on, and the
            reason the scene is worth rendering at all. it sits several block-depths
            back so the cast pattern separates from the block it came through. */}
        <mesh position={[0, 0, -4.2]} receiveShadow>
          <planeGeometry args={[cols * GAP * 4, rows * GAP * 4]} />
          <meshStandardMaterial color="#9c8b79" roughness={1} metalness={0} />
        </mesh>

        {/* floor, catching the same pattern at a second angle */}
        <mesh
          position={[0, -(rows * GAP) / 2, -2.1]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[cols * GAP * 4, 4.2]} />
          <meshStandardMaterial color="#7d6f62" roughness={1} metalness={0} />
        </mesh>
      </group>
    </>
  )
}
