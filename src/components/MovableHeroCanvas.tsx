import { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { jaliGeometry, type ClayFinish, FINISH_CONFIGS } from '../three/JaliGeometry'
import { getClayNormalMap } from './JaliTile'
import { PATTERNS, type PatternId } from '../data/patterns'

function ClayDustParticles({ count = 75 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return [pos]
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    const time = state.clock.elapsedTime * 0.3
    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 1
      arr[idx] += Math.sin(time + i) * 0.002 - 0.001
      if (arr[idx] < -2.5) arr[idx] = 2.5
    }
    posAttr.needsUpdate = true
    pointsRef.current.rotation.y = time * 0.08
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#e08855" transparent opacity={0.55} blending={THREE.AdditiveBlending} />
    </points>
  )
}

interface InteractiveMonolithProps {
  pattern: PatternId
  finish: ClayFinish
  isDragging: boolean
  rotVelocity: React.MutableRefObject<{ x: number; y: number }>
  manualRotation: React.MutableRefObject<{ x: number; y: number }>
}

function InteractiveMonolith({
  pattern,
  finish,
  isDragging,
  rotVelocity,
  manualRotation,
}: InteractiveMonolithProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const geo = useMemo(() => jaliGeometry(pattern), [pattern])
  const normalMap = useMemo(() => getClayNormalMap(), [])
  const mat = useMemo(() => {
    const config = FINISH_CONFIGS[finish] || FINISH_CONFIGS.natural
    return new THREE.MeshStandardMaterial({
      color: config.hex,
      roughness: config.roughness,
      metalness: config.metalness,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughnessMap: normalMap,
    })
  }, [finish, normalMap])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (!isDragging) {
      manualRotation.current.y += rotVelocity.current.x
      manualRotation.current.x += rotVelocity.current.y
      rotVelocity.current.x *= 0.94
      rotVelocity.current.y *= 0.94
      if (Math.abs(rotVelocity.current.x) < 0.0005 && Math.abs(rotVelocity.current.y) < 0.0005) {
        manualRotation.current.y += delta * 0.22
      }
    }
    const floatY = Math.sin(state.clock.elapsedTime * 1.2) * 0.06
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatY, 0.1)
    groupRef.current.rotation.x = manualRotation.current.x
    groupRef.current.rotation.y = manualRotation.current.y
    if (lightRef.current) {
      const px = state.pointer.x * 3.5
      const py = state.pointer.y * 3.0
      lightRef.current.position.set(px + 2, py + 2, 4)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <directionalLight ref={lightRef} position={[2.5, 2.5, 4]} intensity={2.8} color="#fff2e0" castShadow />
      <ambientLight intensity={0.8} color="#ffe6d0" />
      <directionalLight position={[-3, -1, -3]} intensity={1.2} color="#d96b3d" />
      <mesh ref={meshRef} geometry={geo} material={mat} scale={1.55} castShadow receiveShadow />
    </group>
  )
}

export interface MovableHeroCanvasProps {
  initialPattern?: PatternId
  initialFinish?: ClayFinish
  className?: string
}

export function MovableHeroCanvas({
  initialPattern = 'window',
  initialFinish = 'natural',
  className = 'w-full h-full min-h-[500px]',
}: MovableHeroCanvasProps) {
  const [selectedPattern, setSelectedPattern] = useState<PatternId>(initialPattern)
  const [selectedFinish, setSelectedFinish] = useState<ClayFinish>(initialFinish)
  const [isDragging, setIsDragging] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const rotVelocity = useRef({ x: 0.005, y: 0 })
  const manualRotation = useRef({ x: 0.1, y: -0.2 })

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    setHasInteracted(true)
    lastPointer.current = { x: e.clientX, y: e.clientY }
    rotVelocity.current = { x: 0, y: 0 }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const dx = e.clientX - lastPointer.current.x
    const dy = e.clientY - lastPointer.current.y
    lastPointer.current = { x: e.clientX, y: e.clientY }
    const speed = 0.008
    manualRotation.current.y += dx * speed
    manualRotation.current.x += dy * speed
    rotVelocity.current = { x: dx * 0.003, y: dy * 0.003 }
  }

  const handlePointerUp = () => setIsDragging(false)

  const handleResetRotation = () => {
    manualRotation.current = { x: 0.1, y: -0.2 }
    rotVelocity.current = { x: 0.005, y: 0 }
  }

  return (
    <div
      className={'relative select-none ' + className}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
    >
      <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true, powerPreference: 'high-performance' }} camera={{ position: [0, 0, 4.2], fov: 38 }}>
        <color attach="background" args={['#14100e']} />
        <fog attach="fog" args={['#14100e', 6, 14]} />
        <ClayDustParticles count={70} />
        <InteractiveMonolith pattern={selectedPattern} finish={selectedFinish} isDragging={isDragging} rotVelocity={rotVelocity} manualRotation={manualRotation} />
      </Canvas>

      <div className="pointer-events-none absolute top-24 left-4 right-4 z-10 flex items-center justify-between sm:top-28 sm:left-6 sm:right-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2.5 border border-ember/50 bg-kiln/85 px-3 py-1.5 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-ember animate-ping" />
          <span className="font-mono text-xs font-semibold text-bone">
            {isDragging ? 'ROTATING 3D MONOLITH' : 'DRAG TO ROTATE 360°'}
          </span>
        </div>
        {hasInteracted && (
          <button type="button" onClick={(e) => { e.stopPropagation(); handleResetRotation(); }} className="pointer-events-auto border border-kiln-3 bg-kiln/80 px-3 py-1 font-mono text-[11px] text-bone-dim hover:text-bone hover:border-ember backdrop-blur-md transition-colors">
            Reset Orbit ↺
          </button>
        )}
      </div>

      <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-10 mx-auto max-w-[1400px] border border-kiln-3 bg-kiln/90 p-3.5 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="t-spec text-[10px] text-ember">3D CUT:</span>
            {(['window', 'four-square', 'topaz', 'amber', 'circle', 'star', 'cross'] as PatternId[]).map((p) => (
              <button key={p} type="button" onClick={(e) => { e.stopPropagation(); setSelectedPattern(p); }} className={'border px-2.5 py-1 uppercase transition-colors ' + (selectedPattern === p ? 'border-ember bg-ember/25 text-bone font-medium shadow-sm' : 'border-kiln-3 bg-kiln-2 text-bone-dim hover:text-bone')}>
                {PATTERNS[p]?.label || p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="t-spec text-[10px] text-bone-dim">SURFACE:</span>
            {(['natural', 'smoked', 'sand', 'ochre'] as ClayFinish[]).map((f) => (
              <button key={f} type="button" onClick={(e) => { e.stopPropagation(); setSelectedFinish(f); }} className={'border px-2 py-1 capitalize transition-colors ' + (selectedFinish === f ? 'border-bone bg-bone/15 text-bone font-medium' : 'border-kiln-3 text-bone-dim hover:text-bone')}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default MovableHeroCanvas
