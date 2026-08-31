import { useMemo, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { jaliGeometry, clayMaterial, type ClayFinish, FINISH_CONFIGS } from '../three/JaliGeometry'
import { SunRig } from '../three/SunRig'
import { PATTERNS, type PatternId } from '../data/patterns'

/**
 * Procedural normal map generator for terracotta clay micro-porosity.
 * Generates sand grains, clay pores, and surface micro-fissures without external image dependencies.
 */
let cachedNormalMap: THREE.CanvasTexture | null = null
let cachedRoughnessMap: THREE.CanvasTexture | null = null

export function getClayNormalMap(): THREE.CanvasTexture {
  if (cachedNormalMap) return cachedNormalMap

  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    const emptyTex = new THREE.CanvasTexture(canvas)
    cachedNormalMap = emptyTex
    return emptyTex
  }

  const heightData = new Float32Array(size * size)

  // Pseudo-random noise with multi-frequency octaves
  function noise(x: number, y: number): number {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123
    return n - Math.floor(n)
  }

  function smoothNoise(x: number, y: number): number {
    const i = Math.floor(x)
    const j = Math.floor(y)
    const fx = x - i
    const fy = y - j

    const s = fx * fx * (3 - 2 * fx)
    const t = fy * fy * (3 - 2 * fy)

    const n00 = noise(i, j)
    const n10 = noise(i + 1, j)
    const n01 = noise(i, j + 1)
    const n11 = noise(i + 1, j + 1)

    const nx0 = n00 * (1 - s) + n10 * s
    const nx1 = n01 * (1 - s) + n11 * s
    return nx0 * (1 - t) + nx1 * t
  }

  // Synthesize micro-porosity and grain heightmap
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * 32
      const v = (y / size) * 32

      // Octaves of clay grain + pores
      let h =
        smoothNoise(u, v) * 0.5 +
        smoothNoise(u * 2, v * 2) * 0.25 +
        smoothNoise(u * 4, v * 4) * 0.15 +
        smoothNoise(u * 8, v * 8) * 0.1

      // Add sharp porous pitting
      const pitNoise = smoothNoise(u * 1.5 + 50, v * 1.5 + 50)
      if (pitNoise > 0.65) {
        h -= Math.pow((pitNoise - 0.65) / 0.35, 2) * 0.4
      }

      heightData[y * size + x] = h
    }
  }

  // Sobel filter to compute normal vectors
  const imgData = ctx.createImageData(size, size)
  const data = imgData.data

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const x0 = (x - 1 + size) % size
      const x1 = (x + 1) % size
      const y0 = (y - 1 + size) % size
      const y1 = (y + 1) % size

      const hL = heightData[y * size + x0]
      const hR = heightData[y * size + x1]
      const hU = heightData[y0 * size + x]
      const hD = heightData[y1 * size + x]

      // Normal gradients
      const dx = (hR - hL) * 2.5
      const dy = (hD - hU) * 2.5
      const dz = 1.0

      const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
      const nx = dx / len
      const ny = dy / len
      const nz = dz / len

      const idx = (y * size + x) * 4
      data[idx] = Math.floor((nx * 0.5 + 0.5) * 255) // R
      data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255) // G
      data[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255) // B
      data[idx + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  cachedNormalMap = texture
  return texture
}

export function getClayRoughnessMap(): THREE.CanvasTexture {
  if (cachedRoughnessMap) return cachedRoughnessMap

  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    const emptyTex = new THREE.CanvasTexture(canvas)
    cachedRoughnessMap = emptyTex
    return emptyTex
  }

  const imgData = ctx.createImageData(size, size)
  const data = imgData.data

  for (let i = 0; i < size * size; i++) {
    const r = Math.random()
    // Matte clay roughness variations (0.78 to 0.96)
    const val = Math.floor((0.78 + r * 0.18) * 255)
    data[i * 4] = val
    data[i * 4 + 1] = val
    data[i * 4 + 2] = val
    data[i * 4 + 3] = 255
  }

  ctx.putImageData(imgData, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 3)
  cachedRoughnessMap = texture
  return texture
}

export interface JaliTileProps {
  pattern?: PatternId
  finish?: ClayFinish
  autoRotate?: boolean
  interactive?: boolean
  scale?: number
  quality?: 'low' | 'high'
  showBackdrop?: boolean
  roughnessMultiplier?: number
  className?: string
}

/**
 * 3D JaliTile Mesh Component with macro micro-porosity PBR texture
 */
export function JaliTileMesh({
  pattern = 'amber',
  finish = 'natural',
  autoRotate = true,
  scale = 1.45,
  showBackdrop = true,
  roughnessMultiplier = 1,
}: {
  pattern?: PatternId
  finish?: ClayFinish
  autoRotate?: boolean
  scale?: number
  showBackdrop?: boolean
  roughnessMultiplier?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const geo = useMemo(() => jaliGeometry(pattern), [pattern])

  const mat = useMemo(() => {
    const baseMat = clayMaterial(finish)
    const normalMap = getClayNormalMap()
    const roughnessMap = getClayRoughnessMap()

    baseMat.normalMap = normalMap
    baseMat.normalScale = new THREE.Vector2(0.35, 0.35)
    baseMat.roughnessMap = roughnessMap
    baseMat.roughness = Math.min(1, baseMat.roughness * roughnessMultiplier)
    baseMat.needsUpdate = true
    return baseMat
  }, [finish, roughnessMultiplier])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    if (autoRotate) {
      // Gentle continuous macro rotation showcasing volumetric depth & perforations
      groupRef.current.rotation.y += delta * 0.35
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.08
    } else {
      // Responsive pointer follow tilt
      const px = state.pointer.x * 0.25
      const py = state.pointer.y * 0.15
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, px - 0.4, 0.08)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -py + 0.1, 0.08)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 3D Macro Extruded Tile */}
      <mesh
        ref={meshRef}
        geometry={geo}
        material={mat}
        castShadow
        receiveShadow
        scale={scale}
        position={[0, 0.05, 0]}
      />

      {showBackdrop && (
        <>
          {/* Floor plane capturing sharp geometric raking shadows */}
          <mesh position={[0, -1.15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#827568" roughness={0.95} metalness={0} />
          </mesh>

          {/* Architectural back plaster wall */}
          <mesh position={[0, 0, -1.8]} receiveShadow>
            <planeGeometry args={[30, 20]} />
            <meshStandardMaterial color="#9e8d7c" roughness={0.92} metalness={0} />
          </mesh>
        </>
      )}
    </group>
  )
}

/**
 * Stage 1: Raw Earthen Monolith 3D Interactive Component.
 * Self-contained macro canvas with lighting, PBR normal relief, and finish selectors.
 */
export function JaliTile({
  pattern = 'amber',
  finish = 'natural',
  autoRotate = true,
  interactive = true,
  scale = 1.45,
  quality = 'high',
  showBackdrop = true,
  className = 'w-full h-full min-h-[380px]',
}: JaliTileProps) {
  const [activePattern, setActivePattern] = useState<PatternId>(pattern)
  const [activeFinish, setActiveFinish] = useState<ClayFinish>(finish)
  const [isRotating, setIsRotating] = useState(autoRotate)

  useEffect(() => {
    setActivePattern(pattern)
  }, [pattern])

  useEffect(() => {
    setActiveFinish(finish)
  }, [finish])

  return (
    <div className={`relative overflow-hidden bg-kiln ${className}`}>
      <Canvas
        shadows
        dpr={[1, quality === 'high' ? 1.75 : 1.2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0.35, 0.25, 4.2], fov: 38 }}
      >
        <color attach="background" args={['#14100e']} />
        <fog attach="fog" args={['#14100e', 6, 14]} />
        <SunRig mapSize={quality === 'high' ? 2048 : 1024} extent={2.5} />
        <JaliTileMesh
          pattern={activePattern}
          finish={activeFinish}
          autoRotate={isRotating}
          scale={scale}
          showBackdrop={showBackdrop}
        />
      </Canvas>

      {/* Floating Tactical Overlay Controls */}
      {interactive && (
        <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 border border-kiln-3 bg-kiln/90 p-3 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md">
          <div className="flex flex-col gap-1">
            <span className="t-spec text-[10px] text-bone-dim tracking-wider">
              RAW EARTHEN MONOLITH / STAGE 1
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-bone">
                {PATTERNS[activePattern]?.label || activePattern}
              </span>
              <span className="text-xs text-ember font-mono">
                {FINISH_CONFIGS[activeFinish]?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Finishes */}
            {(Object.keys(FINISH_CONFIGS) as ClayFinish[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFinish(f)}
                title={FINISH_CONFIGS[f].label}
                aria-label={`Select ${FINISH_CONFIGS[f].label} finish`}
                className={`h-6 w-6 rounded-full border transition-all ${
                  activeFinish === f
                    ? 'border-bone scale-110 shadow-sm'
                    : 'border-kiln-3 opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: FINISH_CONFIGS[f].hex }}
              />
            ))}

            {/* Rotation toggle */}
            <button
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              aria-pressed={isRotating}
              className={`ml-2 border px-2 py-1 text-xs transition-colors ${
                isRotating
                  ? 'border-ember bg-ember/15 text-bone'
                  : 'border-kiln-3 bg-kiln-2 text-bone-dim hover:text-bone'
              }`}
            >
              {isRotating ? 'Pause' : 'Rotate'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default JaliTile
