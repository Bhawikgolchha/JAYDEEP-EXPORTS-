import { useMemo, useRef } from 'react'
import { extend, useFrame, useThree, type ReactThreeFiber } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
import { jaliGeometry, clayMaterial } from './JaliGeometry'
import { SunRig } from './SunRig'
import { sun } from '../hooks/useSun'
import type { PatternId } from '../data/patterns'

// One tile, one floor, one sun. Drag to orbit, drag the sun slider to move the light.
// The tile turns slowly on its own so a visitor who touches nothing still sees the
// depth of the cut, which is the thing a flat poster cannot show.

// three's own OrbitControls rather than drei's wrapper. drei is a large dependency to
// pull into the lazy chunk for one control, and this is the only control on the page.
extend({ OrbitControls })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
    }
  }
}

function Orbit() {
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  return (
    <orbitControls
      args={[camera, gl.domElement]}
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI * 0.22}
      maxPolarAngle={Math.PI * 0.62}
      rotateSpeed={0.7}
    />
  )
}

export function TileViewer({
  pattern,
  quality,
  spin,
}: {
  pattern: PatternId
  quality: 'low' | 'high'
  spin: boolean
}) {
  const geo = useMemo(() => jaliGeometry(pattern), [pattern])
  const mat = useMemo(() => clayMaterial(), [])
  const tile = useRef<THREE.Mesh>(null)

  // The tile does not spin. A continuous turn means that at any given second it can be
  // edge on, which is the one angle where the cut cannot be read, and it competes with
  // the thing this section is actually about. It sits at a fixed three quarter view and
  // the sun is what moves. Drag to orbit if you want another angle.
  useFrame(() => {
    if (!tile.current) return
    const drift = spin ? (sun.get() - 0.5) * 0.22 : 0
    tile.current.rotation.y = THREE.MathUtils.lerp(tile.current.rotation.y, -0.42 + drift, 0.08)
  })

  return (
    <>
      <SunRig mapSize={quality === 'high' ? 2048 : 1024} extent={2.4} />

      {/* stood clear of the floor so the cast pattern separates from the block */}
      <mesh
        ref={tile}
        geometry={geo}
        material={mat}
        castShadow
        scale={1.45}
        position={[0, 0.05, 0]}
      />

      {/* floor and back wall exist to receive the pattern. they are the point of the
          section, and they run well past the frame so no plane edge is ever visible. */}
      <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#8a7c6e" roughness={1} metalness={0} />
      </mesh>

      {/* close behind the tile on purpose. this is the surface the cut prints onto,
          and if it sits far back the fog eats the pattern before anyone sees it. */}
      <mesh position={[0, 0, -1.5]} receiveShadow>
        <planeGeometry args={[40, 24]} />
        <meshStandardMaterial color="#a3927f" roughness={1} metalness={0} />
      </mesh>

      <Orbit />
    </>
  )
}
