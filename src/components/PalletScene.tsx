import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { jaliGeometry, clayMaterial } from '../three/JaliGeometry'
import { SunRig } from '../three/SunRig'
import type { PatternId } from '../data/patterns'

/**
 * 3D ISPM-15 Heat-Treated Wood Pallet Component
 */
function WoodPallet({ exploded = 0 }: { exploded?: number }) {
  const woodMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#8b6f4e',
      roughness: 0.88,
      metalness: 0.05,
    })
  }, [])

  const stampMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#3a2818',
      roughness: 0.95,
    })
  }, [])

  return (
    <group position={[0, -0.65 - exploded * 0.3, 0]}>
      {/* 3 Bottom Runner Planks */}
      {[-0.42, 0, 0.42].map((x, i) => (
        <mesh key={`bottom-${i}`} position={[x, 0.02, 0]} material={woodMat} castShadow receiveShadow>
          <boxGeometry args={[0.14, 0.025, 1.2]} />
        </mesh>
      ))}

      {/* 9 Solid Wood Stringer Blocks */}
      {[-0.42, 0, 0.42].map((x, xi) =>
        [-0.45, 0, 0.45].map((z, zi) => (
          <mesh
            key={`block-${xi}-${zi}`}
            position={[x, 0.08, z]}
            material={woodMat}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.14, 0.09, 0.14]} />
          </mesh>
        )),
      )}

      {/* 5 Top Deck Boards */}
      {[-0.46, -0.23, 0, 0.23, 0.46].map((z, i) => (
        <mesh key={`top-${i}`} position={[0, 0.14, z]} material={woodMat} castShadow receiveShadow>
          <boxGeometry args={[1.05, 0.025, 0.16]} />
        </mesh>
      ))}

      {/* ISPM-15 Heat Treatment Stamp on Center Block */}
      <mesh position={[0.42 + 0.071, 0.08, 0]} rotation={[0, Math.PI / 2, 0]} material={stampMat}>
        <planeGeometry args={[0.1, 0.04]} />
      </mesh>
    </group>
  )
}

/**
 * 3D Stack of Terracotta Jali Tiles on the Pallet
 */
function StackedTerracotta({
  pattern = 'amber',
  exploded = 0,
}: {
  pattern?: PatternId
  exploded?: number
}) {
  const geo = useMemo(() => jaliGeometry(pattern), [pattern])
  const mat = useMemo(() => clayMaterial('natural'), [])

  // 4 layers of 3x3 tiles = 36 representative visual blocks (representing 280 units)
  const layers = [0, 1, 2, 3]

  return (
    <group position={[0, -0.45, 0]}>
      {layers.map((layerIndex) => {
        const layerY = layerIndex * 0.24 + layerIndex * exploded * 0.22
        return (
          <group key={`layer-${layerIndex}`} position={[0, layerY, 0]}>
            {[-0.32, 0, 0.32].map((x, xi) =>
              [-0.32, 0, 0.32].map((z, zi) => (
                <mesh
                  key={`tile-${xi}-${zi}`}
                  geometry={geo}
                  material={mat}
                  scale={0.3}
                  position={[x, 0, z]}
                  rotation={[0, ((xi + zi) % 2) * (Math.PI / 2), 0]}
                  castShadow
                  receiveShadow
                />
              )),
            )}
          </group>
        )
      })}
    </group>
  )
}

/**
 * 4 Heavy-Duty Kraft Cardboard Corner Edge Protectors
 */
function CornerProtectors({ exploded = 0 }: { exploded?: number }) {
  const cardboardMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#9c7a52',
      roughness: 0.9,
      metalness: 0.0,
    })
  }, [])

  const offset = 0.52 + exploded * 0.35
  const height = 0.95

  return (
    <group position={[0, -0.1, 0]}>
      {/* 4 Corner Angles */}
      {[
        [-offset, -offset, 0],
        [offset, -offset, Math.PI / 2],
        [offset, offset, Math.PI],
        [-offset, offset, -Math.PI / 2],
      ].map(([x, z, rot], i) => (
        <group key={`corner-${i}`} position={[x, 0, z]} rotation={[0, rot, 0]}>
          <mesh position={[0.035, 0, 0]} material={cardboardMat} castShadow>
            <boxGeometry args={[0.07, height, 0.015]} />
          </mesh>
          <mesh position={[0, 0, 0.035]} material={cardboardMat} castShadow>
            <boxGeometry args={[0.015, height, 0.07]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * High-Tensile Tensioned Export Strapping Bands
 */
function StrappingBands({ exploded = 0 }: { exploded?: number }) {
  const strapMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1a3322', // Industrial dark green PET strapping
      roughness: 0.35,
      metalness: 0.2,
    })
  }, [])

  if (exploded > 0.4) return null

  return (
    <group position={[0, -0.1, 0]}>
      {/* Horizontal bands */}
      {[-0.25, 0.1, 0.35].map((y, i) => (
        <group key={`h-strap-${i}`} position={[0, y, 0]}>
          {/* North & South */}
          <mesh position={[0, 0, 0.51]} material={strapMat}>
            <boxGeometry args={[1.02, 0.02, 0.005]} />
          </mesh>
          <mesh position={[0, 0, -0.51]} material={strapMat}>
            <boxGeometry args={[1.02, 0.02, 0.005]} />
          </mesh>
          {/* East & West */}
          <mesh position={[0.51, 0, 0]} material={strapMat}>
            <boxGeometry args={[0.005, 0.02, 1.02]} />
          </mesh>
          <mesh position={[-0.51, 0, 0]} material={strapMat}>
            <boxGeometry args={[0.005, 0.02, 1.02]} />
          </mesh>
        </group>
      ))}

      {/* Vertical cross bands */}
      {[-0.22, 0.22].map((x, i) => (
        <mesh key={`v-strap-${i}`} position={[x, 0, 0]} material={strapMat}>
          <boxGeometry args={[0.02, 1.0, 1.03]} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Semi-Transparent Shrink-Wrap Film (Transmission / Plastic PBR Material)
 */
function ShrinkWrapFilm({
  visible = true,
  exploded = 0,
}: {
  visible?: boolean
  exploded?: number
}) {
  const filmMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.42,
      transmission: 0.75,
      roughness: 0.15,
      ior: 1.48,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  }, [])

  if (!visible || exploded > 0.3) return null

  return (
    <mesh position={[0, -0.05, 0]} material={filmMat} castShadow={false}>
      <boxGeometry args={[1.04, 1.02, 1.04]} />
    </mesh>
  )
}

function PalletTurntable({
  explodedView,
  showWrap,
  autoRotate,
  pattern,
}: {
  explodedView: boolean
  showWrap: boolean
  autoRotate: boolean
  pattern: PatternId
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.1, 0]}>
      <WoodPallet exploded={explodedView ? 1 : 0} />
      <StackedTerracotta pattern={pattern} exploded={explodedView ? 1 : 0} />
      <CornerProtectors exploded={explodedView ? 1 : 0} />
      <StrappingBands exploded={explodedView ? 1 : 0} />
      <ShrinkWrapFilm visible={showWrap} exploded={explodedView ? 1 : 0} />

      {/* Logistics floor warehouse ground plane */}
      <mesh position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#6a5e52" roughness={0.9} />
      </mesh>
    </group>
  )
}

export interface PalletSceneProps {
  pattern?: PatternId
  interactive?: boolean
  className?: string
}

/**
 * Stage 5: Global Export Deck & Logistics 3D Visualizer
 */
export function PalletScene({
  pattern = 'amber',
  interactive = true,
  className = 'w-full h-full min-h-[440px]',
}: PalletSceneProps) {
  const [explodedView, setExplodedView] = useState(false)
  const [showWrap, setShowWrap] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)

  return (
    <div className={`relative overflow-hidden bg-kiln ${className}`}>
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        dpr={[1, 1.6]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [2.2, 1.4, 2.6], fov: 38 }}
      >
        <color attach="background" args={['#14100e']} />
        <fog attach="fog" args={['#14100e', 6, 14]} />
        <SunRig mapSize={2048} extent={3.0} />

        <PalletTurntable
          explodedView={explodedView}
          showWrap={showWrap}
          autoRotate={autoRotate}
          pattern={pattern}
        />
      </Canvas>

      {/* Tactical Logistics Specifications & Controls HUD */}
      {interactive && (
        <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-3 border border-kiln-3 bg-kiln/90 p-4 backdrop-blur-md sm:bottom-6 sm:left-6 sm:max-w-md">
          <div className="flex items-center justify-between border-b border-kiln-3 pb-2">
            <span className="t-spec text-[10px] text-bone-dim tracking-wider">
              STAGE 5: GLOBAL EXPORT DECK / ISPM-15 PALLET
            </span>
            <span className="border border-ember/40 bg-kiln px-2 py-0.5 font-mono text-[10px] text-ember">
              ISPM-15 HT CERTIFIED
            </span>
          </div>

          {/* Pallet Payload Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border border-kiln-3 bg-kiln p-2">
              <span className="t-spec block text-[9px] text-bone-dim">PALLET PAYLOAD</span>
              <span className="font-mono font-medium text-bone">280 Units / 1.12 MT</span>
            </div>
            <div className="border border-kiln-3 bg-kiln p-2">
              <span className="t-spec block text-[9px] text-bone-dim">20FT FCL CAPACITY</span>
              <span className="font-mono font-medium text-bone">20 Pallets (22.4 MT)</span>
            </div>
            <div className="border border-kiln-3 bg-kiln p-2">
              <span className="t-spec block text-[9px] text-bone-dim">DISPATCH PORTS</span>
              <span className="font-mono text-bone">Mundra / Nhava Sheva</span>
            </div>
            <div className="border border-kiln-3 bg-kiln p-2">
              <span className="t-spec block text-[9px] text-bone-dim">DIMENSIONS</span>
              <span className="font-mono text-bone">1200 × 1000 × 1150 mm</span>
            </div>
          </div>

          {/* Interactive Inspection Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setExplodedView(!explodedView)}
              className={`border px-2.5 py-1 text-xs transition-colors ${
                explodedView
                  ? 'border-ember bg-ember/20 text-bone'
                  : 'border-kiln-3 bg-kiln-2 text-bone-dim hover:text-bone'
              }`}
            >
              {explodedView ? 'Collapse Stack' : 'Exploded View'}
            </button>

            <button
              type="button"
              onClick={() => setShowWrap(!showWrap)}
              className={`border px-2.5 py-1 text-xs transition-colors ${
                showWrap
                  ? 'border-ember bg-ember/20 text-bone'
                  : 'border-kiln-3 bg-kiln-2 text-bone-dim hover:text-bone'
              }`}
            >
              {showWrap ? 'Hide Film' : 'Show Shrink-Wrap'}
            </button>

            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`border px-2.5 py-1 text-xs transition-colors ${
                autoRotate
                  ? 'border-ember bg-ember/20 text-bone'
                  : 'border-kiln-3 bg-kiln-2 text-bone-dim hover:text-bone'
              }`}
            >
              {autoRotate ? 'Pause 360°' : 'Rotate 360°'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default PalletScene
