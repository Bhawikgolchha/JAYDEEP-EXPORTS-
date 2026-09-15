import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SunRig } from './SunRig'
import { JaliTileMesh } from './JaliTile'
import { jaliGeometry, clayMaterial } from '../three/JaliGeometry'

export type NarrativeStageId = 1 | 2 | 3 | 4 | 5

export interface StageConfig {
  id: NarrativeStageId
  title: string
  subtitle: string
  cameraPos: [number, number, number]
  cameraLookAt: [number, number, number]
  fov: number
  description: string
  specs: string[]
}

export const STAGES: Record<NarrativeStageId, StageConfig> = {
  1: {
    id: 1,
    title: 'Stage 1: Raw Earthen Monolith',
    subtitle: 'Micro-Porous Terracotta PBR',
    cameraPos: [0.35, 0.25, 3.8],
    cameraLookAt: [0, 0.05, 0],
    fov: 38,
    description: 'Macro close-up perspective of raw clay material, revealing sand grain texture, surface porosity, and 0.31 depth ratio extrusion.',
    specs: ['Micro-porosity normal mapped', 'Matte unglazed natural finish', 'Unaltered earthen mineral tone'],
  },
  2: {
    id: 2,
    title: 'Stage 2: 1000°C Kiln Firing',
    subtitle: 'Thermal Transformation & Vitrification',
    cameraPos: [0, 0.2, 4.0],
    cameraLookAt: [0, 0.1, 0],
    fov: 38,
    description: 'High-temperature thermal transformation simulation. Blackbody radiation emission as clay vitrifies into high-strength ceramic masonry.',
    specs: ['Peak 1000°C vitrification', '>15 MPa compressive strength', 'ASTM C652 & IS 1077 certified'],
  },
  3: {
    id: 3,
    title: 'Stage 3: Modernist Villa Facade',
    subtitle: 'Dynamic Light & Dappled Shadows',
    cameraPos: [0.8, 0.4, 4.5],
    cameraLookAt: [0, 0, 0],
    fov: 40,
    description: 'Full modular architectural screen facade with dynamic solar trajectory, projecting moving geometric dappled shadows across interior living spaces.',
    specs: ['-4°C to -6°C passive cooling', 'Venturi airflow circulation', '100% non-glare interior daylight'],
  },
  4: {
    id: 4,
    title: 'Stage 4: Interactive Customizer Studio',
    subtitle: 'Parametric Wall & Pattern Matrix',
    cameraPos: [1.2, 0.6, 5.2],
    cameraLookAt: [0, 0, 0],
    fov: 42,
    description: 'Procedural 3D pattern customizer. Real-time parametric control over wall width, height, mortar joints, and sun angle.',
    specs: ['14+ Procedural Jali patterns', 'Mortared vs dry-stack modes', 'Interactive sun azimuth scrub'],
  },
  5: {
    id: 5,
    title: 'Stage 5: Global Export Deck',
    subtitle: 'ISPM-15 Pallet Packaging & Logistics',
    cameraPos: [2.2, 1.4, 2.8],
    cameraLookAt: [0, 0, 0],
    fov: 38,
    description: 'Export-grade packaging visualizer: ISPM-15 heat-treated wood pallet, strapped terracotta layers, shrink-wrap protection, and container freight payload.',
    specs: ['280 Blocks (1.12 MT) / Pallet', '20ft FCL container optimized', 'Seaport dispatch: Mundra / Nhava Sheva'],
  },
}

/**
 * Spring-Damped Camera Choreography System
 * Smoothly interpolates camera position and lookAt target between narrative stages
 */
function NarrativeCameraController({
  currentStage,
}: {
  currentStage: NarrativeStageId
}) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())
  const currentLook = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    const config = STAGES[currentStage]
    targetPos.current.set(...config.cameraPos)
    targetLook.current.set(...config.cameraLookAt)
  }, [currentStage])

  useFrame((_, delta) => {
    // Smooth spring dampening (60 FPS lerp)
    const dampSpeed = 4.5 * delta
    camera.position.lerp(targetPos.current, dampSpeed)

    currentLook.current.lerp(targetLook.current, dampSpeed)
    camera.lookAt(currentLook.current)
  })

  return null
}

/**
 * Stage 2 Shader Tile for Narrative Canvas
 */
function Stage2KilnTile({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const geo = useMemo(() => jaliGeometry('circle'), [])
  const mat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#ff4500',
      emissive: '#ff7700',
      emissiveIntensity: 1.8,
      roughness: 0.4,
    })
  }, [])

  useFrame((state, delta) => {
    if (!active || !meshRef.current) return
    meshRef.current.rotation.y += delta * 0.4
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.08
  })

  if (!active) return null

  return (
    <group position={[0, 0.05, 0]}>
      <mesh ref={meshRef} geometry={geo} material={mat} scale={1.4} castShadow />
      <pointLight position={[0, 0, 0]} intensity={7.0} distance={8} color="#ffaa33" />
      {/* Refractory floor */}
      <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#1a120e" roughness={0.9} />
      </mesh>
    </group>
  )
}

/**
 * Stage 3 Facade for Narrative Canvas
 */
function Stage3Facade({ active }: { active: boolean }) {
  const geo = useMemo(() => jaliGeometry('star'), [])
  const mat = useMemo(() => clayMaterial('natural'), [])

  if (!active) return null

  return (
    <group position={[0, 0, 0]}>
      {/* 4x3 Jali Screen */}
      {[-1.5, -0.5, 0.5, 1.5].map((x) =>
        [-1, 0, 1].map((y) => (
          <mesh
            key={`s3-${x}-${y}`}
            geometry={geo}
            material={mat}
            position={[x, y, 0]}
            castShadow
            receiveShadow
          />
        )),
      )}
      {/* Floor for shadow catching */}
      <mesh position={[0, -1.6, -1.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color="#88786a" roughness={0.92} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 0, -3.8]} receiveShadow>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#998877" roughness={0.95} />
      </mesh>
    </group>
  )
}

/**
 * Stage 4 Customizer Preview for Narrative Canvas
 */
function Stage4Customizer({ active }: { active: boolean }) {
  const geo = useMemo(() => jaliGeometry('amber'), [])
  const mat = useMemo(() => clayMaterial('ochre'), [])
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!active || !groupRef.current) return
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      -0.25 + state.pointer.x * 0.1,
      0.05,
    )
  })

  if (!active) return null

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 5x3 Parametric Wall Preview */}
      {[-2, -1, 0, 1, 2].map((x) =>
        [-1, 0, 1].map((y) => (
          <mesh
            key={`s4-${x}-${y}`}
            geometry={geo}
            material={mat}
            position={[x * 1.03, y * 1.03, 0]}
            castShadow
            receiveShadow
          />
        )),
      )}
      {/* Floor */}
      <mesh position={[0, -1.7, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#807264" roughness={0.92} />
      </mesh>
    </group>
  )
}

/**
 * Stage 5 Pallet Preview for Narrative Canvas
 */
function Stage5Pallet({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const geo = useMemo(() => jaliGeometry('amber'), [])
  const clayMat = useMemo(() => clayMaterial('natural'), [])
  const woodMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8b6f4e', roughness: 0.88 }), [])

  useFrame((_, delta) => {
    if (!active || !groupRef.current) return
    groupRef.current.rotation.y += delta * 0.35
  })

  if (!active) return null

  return (
    <group ref={groupRef} position={[0, 0.05, 0]}>
      {/* Wood Pallet */}
      <mesh position={[0, -0.6, 0]} material={woodMat} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.12, 1.1]} />
      </mesh>
      {/* Stacked Terracotta Layers */}
      {[0, 1, 2].map((layer) => (
        <group key={`s5-layer-${layer}`} position={[0, -0.45 + layer * 0.26, 0]}>
          {[-0.32, 0, 0.32].map((x) =>
            [-0.32, 0, 0.32].map((z) => (
              <mesh
                key={`s5-${layer}-${x}-${z}`}
                geometry={geo}
                material={clayMat}
                scale={0.3}
                position={[x, 0, z]}
                castShadow
                receiveShadow
              />
            )),
          )}
        </group>
      ))}
      {/* Floor */}
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#6a5e52" roughness={0.9} />
      </mesh>
    </group>
  )
}

export interface StageNarrativeProps {
  initialStage?: NarrativeStageId
  interactive?: boolean
  className?: string
}

/**
 * Unified Canvas / Stage Narrative Coordinator
 * Orchestrates seamless transitions across the 5 3D narrative stages
 */
export function StageNarrative({
  initialStage = 1,
  interactive = true,
  className = 'w-full h-[650px] min-h-[500px]',
}: StageNarrativeProps) {
  const [activeStage, setActiveStage] = useState<NarrativeStageId>(initialStage)
  const stage = STAGES[activeStage]

  return (
    <div className={`relative overflow-hidden bg-kiln ${className}`}>
      {/* 3D WebGL Canvas with unified scene & spring-damped camera trajectory */}
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0.35, 0.25, 3.8], fov: 38 }}
      >
        <color attach="background" args={['#1a120c']} />
        <fog attach="fog" args={['#14100e', 6, 16]} />
        <SunRig mapSize={2048} extent={4.2} />

        <NarrativeCameraController currentStage={activeStage} />

        {/* Stage 1: Raw Monolith */}
        {activeStage === 1 && (
          <JaliTileMesh pattern="amber" finish="natural" autoRotate={true} scale={1.45} />
        )}

        {/* Stage 2: Kiln Firing */}
        <Stage2KilnTile active={activeStage === 2} />

        {/* Stage 3: Villa Facade */}
        <Stage3Facade active={activeStage === 3} />

        {/* Stage 4: Customizer Studio */}
        <Stage4Customizer active={activeStage === 4} />

        {/* Stage 5: Global Export Pallet */}
        <Stage5Pallet active={activeStage === 5} />
      </Canvas>

      {/* Stage Selector Navigation Header */}
      <div className="pointer-events-auto absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 border border-kiln-3 bg-kiln/90 p-2.5 backdrop-blur-md sm:top-6 sm:left-6 sm:right-6">
        <span className="font-mono text-xs font-semibold text-ember">
          5-STAGE 3D NARRATIVE ENGINE
        </span>

        {/* Stage Step Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {([1, 2, 3, 4, 5] as NarrativeStageId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveStage(id)}
              className={`border px-3 py-1 text-xs transition-colors ${
                activeStage === id
                  ? 'border-ember bg-ember/25 text-bone font-medium'
                  : 'border-kiln-3 bg-kiln-2 text-bone-dim hover:text-bone'
              }`}
            >
              Stage {id}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Narrative Description HUD */}
      {interactive && (
        <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-3 border border-kiln-3 bg-kiln/90 p-4 backdrop-blur-md sm:bottom-6 sm:left-6 sm:max-w-lg">
          <div className="flex items-center justify-between border-b border-kiln-3 pb-2">
            <span className="t-spec text-[10px] text-ember tracking-wider">
              {stage.subtitle.toUpperCase()}
            </span>
            <span className="font-mono text-xs text-bone-dim">
              0{activeStage} / 05
            </span>
          </div>

          <div>
            <h3 className="text-base font-semibold text-bone">{stage.title}</h3>
            <p className="t-body mt-1 text-xs leading-relaxed text-bone-dim">
              {stage.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {stage.specs.map((spec) => (
              <span
                key={spec}
                className="border border-kiln-3 bg-kiln px-2 py-0.5 font-mono text-[10px] text-bone-dim"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
export default StageNarrative
