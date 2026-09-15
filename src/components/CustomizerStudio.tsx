import { useState, useMemo, useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  PATTERNS,
  PATTERN_IDS,
  type JaliPatternId,
} from '../data/patterns'
import { PRODUCTS } from '../data/products'
import {
  createJaliGeometry,
  clayMaterial,
  type ClayFinish,
  JALI_MODULE_SIZE_MM,
} from './JaliGeometryFactory'
import { sun, setSunManual } from '../hooks/useSun'

export type MortarMode = 'dry-stack' | 'mortared'

export interface CustomizerState {
  pattern: JaliPatternId
  finish: ClayFinish
  cols: number
  rows: number
  mortar: MortarMode
  sunAzimuth: number // degrees -180 to 180
  sunElevation: number // degrees 10 to 85
  rotationY: number // degrees 0 to 360
  turntableActive: boolean
  viewMode: 'wall' | 'single'
}

export const FINISH_SWATCHES: {
  id: ClayFinish
  label: string
  hex: string
  desc: string
}[] = [
  { id: 'natural', label: 'Natural Clay', hex: '#b4552c', desc: 'Raw iron-rich terracotta' },
  { id: 'smoked', label: 'Smoked Charcoal', hex: '#38302b', desc: 'Reduction-fired matte black' },
  { id: 'sand', label: 'Sun-baked Sand', hex: '#cb9a6f', desc: 'Silica-buff desert warmth' },
  { id: 'ochre', label: 'Warm Ochre', hex: '#c47936', desc: 'High-alumina earthen glow' },
]

export const SUN_PRESETS = [
  { label: 'Morning', azimuth: -65, elevation: 25, sunValue: 0.15, time: '08:30' },
  { label: 'Noon', azimuth: 0, elevation: 75, sunValue: 0.5, time: '12:00' },
  { label: 'Golden Hour', azimuth: 65, elevation: 22, sunValue: 0.82, time: '17:00' },
  { label: 'Dusk', azimuth: 85, elevation: 12, sunValue: 0.95, time: '18:45' },
]

// 3D Customizer Viewport Scene
function CustomizerScene({ state }: { state: CustomizerState }) {
  const { pattern, finish, cols, rows, mortar, sunAzimuth, sunElevation, rotationY, turntableActive, viewMode } = state
  const wallGroup = useRef<THREE.Group>(null)
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null)
  const singleTileMeshRef = useRef<THREE.Mesh>(null)
  const sunLightRef = useRef<THREE.DirectionalLight>(null)
  const { viewport } = useThree()

  // Calculate mortar gap: Dry-stack = 1.004 (2mm), Mortared = 1.040 (8mm)
  const gap = mortar === 'dry-stack' ? 1.004 : 1.040

  const activeCols = viewMode === 'single' ? 1 : Math.max(1, Math.min(12, cols))
  const activeRows = viewMode === 'single' ? 1 : Math.max(1, Math.min(8, rows))
  const totalInstances = activeCols * activeRows

  const geo = useMemo(() => createJaliGeometry(pattern), [pattern])
  const mat = useMemo(() => clayMaterial(finish), [finish])

  // Scale wall dynamically to fit comfortably in viewport
  const wallScale = useMemo(() => {
    if (viewMode === 'single') return 1.45
    const maxDimension = Math.max(activeCols * gap, activeRows * gap)
    const targetSpan = Math.min(viewport.width * 0.72, 3.8)
    return Math.min(1.0, targetSpan / maxDimension)
  }, [activeCols, activeRows, gap, viewMode, viewport.width])

  // Update InstancedMesh dynamic matrix transformations
  useEffect(() => {
    if (viewMode === 'single' || !instancedMeshRef.current) return

    const mesh = instancedMeshRef.current
    const dummy = new THREE.Object3D()
    let idx = 0

    for (let r = 0; r < activeRows; r++) {
      for (let c = 0; c < activeCols; c++) {
        const posX = (c - (activeCols - 1) / 2) * gap
        const posY = (r - (activeRows - 1) / 2) * gap
        dummy.position.set(posX, posY, 0)
        // Hand-laid natural micro-variation
        dummy.rotation.z = (((c * 7 + r * 13) % 5) - 2) * 0.0018
        dummy.rotation.x = 0
        dummy.rotation.y = 0
        dummy.updateMatrix()
        mesh.setMatrixAt(idx++, dummy.matrix)
      }
    }

    mesh.count = totalInstances
    mesh.instanceMatrix.needsUpdate = true
  }, [activeCols, activeRows, gap, viewMode, totalInstances, geo])

  // Sun dynamic trajectory calculation based on Azimuth & Elevation
  useFrame((_, delta) => {
    // Turntable rotation
    if (wallGroup.current) {
      if (turntableActive) {
        wallGroup.current.rotation.y += delta * 0.45
      } else {
        const targetRad = (rotationY * Math.PI) / 180
        wallGroup.current.rotation.y = THREE.MathUtils.lerp(
          wallGroup.current.rotation.y,
          targetRad,
          0.1
        )
      }
    }

    // Directional sun light position & shadow throw
    if (sunLightRef.current) {
      const azRad = (sunAzimuth * Math.PI) / 180
      const elRad = (sunElevation * Math.PI) / 180
      const dist = 12.0
      const lx = Math.sin(azRad) * Math.cos(elRad) * dist
      const ly = Math.sin(elRad) * dist
      const lz = Math.cos(azRad) * Math.cos(elRad) * dist + 2.0

      sunLightRef.current.position.set(lx, Math.max(1.2, ly), lz)

      // Light color temperature based on elevation
      const normEl = Math.max(0, Math.min(1, (sunElevation - 10) / 75))
      const isLowSun = normEl < 0.35
      const colorWarmth = isLowSun ? 0.06 : 0.09
      const colorSat = isLowSun ? 0.75 : 0.35
      const colorLight = 0.55 + normEl * 0.25
      sunLightRef.current.color.setHSL(colorWarmth, colorSat, colorLight)
      sunLightRef.current.intensity = 2.4 + normEl * 1.6
    }
  })

  return (
    <>
      {/* Dynamic Solar Rig with shadow projections */}
      <hemisphereLight args={['#6f7fb0', '#2a1c14', 0.45]} />
      <ambientLight intensity={0.12} />
      <directionalLight
        ref={sunLightRef}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-5.5}
        shadow-camera-right={5.5}
        shadow-camera-top={5.5}
        shadow-camera-bottom={-5.5}
        shadow-camera-near={0.5}
        shadow-camera-far={32}
        shadow-bias={-0.0008}
        shadow-normalBias={0.022}
      />

      <group ref={wallGroup} scale={wallScale}>
        {viewMode === 'single' ? (
          <mesh
            ref={singleTileMeshRef}
            geometry={geo}
            material={mat}
            castShadow
            receiveShadow
            position={[0, 0.05, 0]}
          />
        ) : (
          <instancedMesh
            ref={instancedMeshRef}
            args={[geo, mat, 144]}
            castShadow
            receiveShadow
            frustumCulled={false}
          />
        )}

        {/* Plaster back wall to catch dappled geometric shadows */}
        <mesh position={[0, 0, -3.6]} receiveShadow>
          <planeGeometry args={[32, 22]} />
          <meshStandardMaterial color="#9c8b79" roughness={1} metalness={0} />
        </mesh>

        {/* Terracotta / concrete ground plane */}
        <mesh
          position={[0, viewMode === 'single' ? -1.05 : -(activeRows * gap) / 2 - 0.05, -1.8]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[32, 5.5]} />
          <meshStandardMaterial color="#7d6f62" roughness={1} metalness={0} />
        </mesh>
      </group>
    </>
  )
}

export function CustomizerStudio() {
  const [state, setState] = useState<CustomizerState>({
    pattern: 'star',
    finish: 'natural',
    cols: 4,
    rows: 3,
    mortar: 'mortared',
    sunAzimuth: -35,
    sunElevation: 42,
    rotationY: 0,
    turntableActive: false,
    viewMode: 'wall',
  })

  const [activeUnit, setActiveUnit] = useState<'ft' | 'm'>('ft')
  const activePatternObj = PATTERNS[state.pattern] || PATTERNS.star
  const product = PRODUCTS.find((p) => p.pattern === state.pattern)

  // Physical calculations
  const moduleM = JALI_MODULE_SIZE_MM / 1000 // 0.2032 m
  const mortarM = state.mortar === 'mortared' ? 0.008 : 0.002 // 8mm vs 2mm
  const colCount = state.viewMode === 'single' ? 1 : state.cols
  const rowCount = state.viewMode === 'single' ? 1 : state.rows
  const totalBlocks = colCount * rowCount
  const widthM = (colCount * (moduleM + mortarM)).toFixed(2)
  const heightM = (rowCount * (moduleM + mortarM)).toFixed(2)
  const widthFt = (Number(widthM) * 3.28084).toFixed(1)
  const heightFt = (Number(heightM) * 3.28084).toFixed(1)
  const estWeightKg = (totalBlocks * (product?.weightKg ?? 2.8)).toFixed(1)

  const selectSunPreset = (preset: typeof SUN_PRESETS[0]) => {
    setSunManual(true)
    sun.set(preset.sunValue)
    setState((prev) => ({
      ...prev,
      sunAzimuth: preset.azimuth,
      sunElevation: preset.elevation,
    }))
  }

  const setFinish = (finish: ClayFinish) => {
    setState((prev) => ({ ...prev, finish }))
  }

  const setPattern = (pattern: JaliPatternId) => {
    setState((prev) => ({ ...prev, pattern }))
  }

  const toggleMortar = (mortar: MortarMode) => {
    setState((prev) => ({ ...prev, mortar }))
  }

  return (
    <div className="border border-kiln-3 bg-kiln-2" data-testid="customizer-studio">
      {/* Customizer Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-kiln-3 bg-kiln p-4 sm:p-5">
        <div>
          <span className="t-spec text-[11px] text-ember tracking-widest uppercase">
            3D Customizer Studio // Real-Time GPU Engine
          </span>
          <h3 className="text-xl sm:text-2xl text-bone font-medium mt-0.5" style={{ fontStretch: '104%' }}>
            Parametric Jali Screen Customizer
          </h3>
        </div>

        {/* View Mode & Unit Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center border border-kiln-3 bg-kiln-2 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, viewMode: 'wall' }))}
              className={`px-3 py-1 transition-colors ${
                state.viewMode === 'wall'
                  ? 'bg-bone text-kiln font-medium'
                  : 'text-bone-dim hover:text-bone'
              }`}
            >
              Full Screen Wall
            </button>
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, viewMode: 'single' }))}
              className={`px-3 py-1 transition-colors ${
                state.viewMode === 'single'
                  ? 'bg-bone text-kiln font-medium'
                  : 'text-bone-dim hover:text-bone'
              }`}
            >
              Single Tile
            </button>
          </div>

          <div className="flex items-center border border-kiln-3 bg-kiln-2 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveUnit('ft')}
              className={`px-2.5 py-1 ${
                activeUnit === 'ft' ? 'bg-bone text-kiln font-medium' : 'text-bone-dim hover:text-bone'
              }`}
            >
              FT
            </button>
            <button
              type="button"
              onClick={() => setActiveUnit('m')}
              className={`px-2.5 py-1 ${
                activeUnit === 'm' ? 'bg-bone text-kiln font-medium' : 'text-bone-dim hover:text-bone'
              }`}
            >
              M
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Viewport on Left, Control Suite on Right */}
      <div className="grid gap-0 lg:grid-cols-[1.25fr_1fr]">
        {/* 3D Canvas Viewport */}
        <div className="relative min-h-[420px] sm:min-h-[520px] bg-[#1a120c] border-b lg:border-b-0 lg:border-r border-kiln-3">
          <Canvas
            shadows
            dpr={[1, 1.75]}
            camera={{ position: [1.6, 0.8, 3.4], fov: 42 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <color attach="background" args={['#1a120c']} />
            <fog attach="fog" args={['#14100e', 5, 14]} />
            <Suspense fallback={null}>
              <CustomizerScene state={state} />
            </Suspense>
          </Canvas>

          {/* HUD Overlay Specs */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2 pointer-events-none">
            <span className="border border-kiln-3 bg-kiln/80 backdrop-blur-sm px-2.5 py-1 text-xs text-bone font-mono">
              {state.viewMode === 'wall'
                ? activeUnit === 'ft'
                  ? `${widthFt} x ${heightFt} ft (${colCount}C x ${rowCount}R)`
                  : `${widthM} x ${heightM} m (${colCount}C x ${rowCount}R)`
                : '8 x 8 in (203 x 203 mm)'}
            </span>
            <span className="border border-kiln-3 bg-kiln/80 backdrop-blur-sm px-2.5 py-1 text-xs text-ember font-mono">
              {totalBlocks} {totalBlocks === 1 ? 'Block' : 'Blocks'} (~{estWeightKg} kg)
            </span>
            <span className="border border-kiln-3 bg-kiln/80 backdrop-blur-sm px-2.5 py-1 text-xs text-bone-dim font-mono">
              {state.mortar === 'mortared' ? 'Mortar: 8mm' : 'Dry-Stack: 0mm'}
            </span>
          </div>

          {/* Turntable Quick Scrub Control */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 border border-kiln-3 bg-kiln/85 backdrop-blur-sm p-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setState((s) => ({ ...s, turntableActive: !s.turntableActive }))
                }
                className={`px-2.5 py-1 border transition-colors ${
                  state.turntableActive
                    ? 'border-ember bg-ember/20 text-bone'
                    : 'border-kiln-3 text-bone-dim hover:text-bone'
                }`}
              >
                {state.turntableActive ? '⏸ Pause 360°' : '▶ 360° Turntable'}
              </button>
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, rotationY: 0, turntableActive: false }))}
                className="px-2 py-1 border border-kiln-3 text-bone-dim hover:text-bone"
              >
                Reset Angle
              </button>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-[180px]">
              <span className="text-[10px] text-bone-dim font-mono">ROT:</span>
              <input
                type="range"
                min={-180}
                max={180}
                value={state.rotationY}
                disabled={state.turntableActive}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    rotationY: Number(e.target.value),
                    turntableActive: false,
                  }))
                }
                className="w-full accent-ember cursor-pointer"
                aria-label="Wall rotation angle"
              />
              <span className="text-[10px] text-bone font-mono w-7 text-right">
                {state.rotationY}°
              </span>
            </div>
          </div>
        </div>

        {/* Customizer Control Panel */}
        <div className="p-5 sm:p-7 flex flex-col gap-6 overflow-y-auto max-h-[750px]">
          {/* 1. Pattern Selection Grid (All 15 Patterns) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="t-spec text-xs text-bone-dim uppercase">
                1. Select Jali Pattern ({PATTERN_IDS.length} Procedural Extrusions)
              </label>
              <span className="text-xs text-ember font-mono">
                {activePatternObj.openAreaPct}% Open Void
              </span>
            </div>

            <div className="flex max-h-[340px] flex-col overflow-y-auto border border-kiln-3 bg-kiln-2">
              {PATTERN_IDS.map((id, i) => {
                const active = id === state.pattern
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPattern(id)}
                    aria-pressed={active}
                    className={`flex items-center gap-3 text-left transition-all ${
                      active
                        ? 'bg-bone text-kiln font-medium shadow-[inset_3px_0_0_var(--ember)]'
                        : 'text-bone-dim hover:bg-kiln-3 hover:text-bone'
                    }`}
                  >
                    <span className="t-spec w-8 shrink-0 text-[11px]" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <svg viewBox="0 0 100 100" className={`h-5 w-5 shrink-0 ${active ? 'text-ember' : ''}`} aria-hidden="true">
                      <path
                        d={`M0,0 H100 V100 H0 Z ${PATTERNS[id].holes.join(' ')}`}
                        fillRule="evenodd"
                        fill={active ? '#14100e' : '#ce6d38'}
                      />
                    </svg>
                    <span className="text-xs truncate w-full" style={{ fontStretch: '92%' }}>
                      {PATTERNS[id].label}
                    </span>
                    <span className="t-spec text-[10px] text-bone-dim shrink-0">
                      {active ? `${activePatternObj.openAreaPct}% open` : ''}
                    </span>
                  </button>
                )
              })}
            </div>

            <p className="t-body mt-2 text-xs text-bone-dim italic">
              "{activePatternObj.light}"
            </p>
          </div>

          {/* 2. Grid Dimensions (Cols & Rows) */}
          {state.viewMode === 'wall' && (
            <div className="border-t border-kiln-3 pt-5">
              <label className="t-spec text-xs text-bone-dim uppercase block mb-3">
                2. Parametric Wall Grid (Course Rows & Columns)
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-bone-dim">COLUMNS ACROSS:</span>
                    <span className="text-bone font-mono font-medium">{state.cols}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={state.cols}
                    onChange={(e) =>
                      setState((s) => ({ ...s, cols: Number(e.target.value) }))
                    }
                    className="w-full accent-ember cursor-pointer"
                    aria-label="Wall columns count"
                  />
                  <span className="text-[11px] text-bone-dim">
                    ~{activeUnit === 'ft' ? widthFt : widthM} {activeUnit} width
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-bone-dim">COURSE ROWS DOWN:</span>
                    <span className="text-bone font-mono font-medium">{state.rows}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={state.rows}
                    onChange={(e) =>
                      setState((s) => ({ ...s, rows: Number(e.target.value) }))
                    }
                    className="w-full accent-ember cursor-pointer"
                    aria-label="Wall rows count"
                  />
                  <span className="text-[11px] text-bone-dim">
                    ~{activeUnit === 'ft' ? heightFt : heightM} {activeUnit} height
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Mortar Joint Mode (Dry-Stack vs Mortared) */}
          <div className="border-t border-kiln-3 pt-5">
            <label className="t-spec text-xs text-bone-dim uppercase block mb-2.5">
              3. Joint Installation Method
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => toggleMortar('mortared')}
                className={`flex flex-col p-3 text-left border transition-all ${
                  state.mortar === 'mortared'
                    ? 'border-ember bg-kiln-2 text-bone'
                    : 'border-kiln-3 bg-kiln text-bone-dim hover:border-bone-dim'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-bone">Mortared Joints</span>
                  <span className="text-[10px] font-mono text-ember">8 mm Joint</span>
                </div>
                <span className="text-[11px] text-bone-dim mt-1">
                  Traditional bonded mortar beds for structural external screens.
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleMortar('dry-stack')}
                className={`flex flex-col p-3 text-left border transition-all ${
                  state.mortar === 'dry-stack'
                    ? 'border-ember bg-kiln-2 text-bone'
                    : 'border-kiln-3 bg-kiln text-bone-dim hover:border-bone-dim'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-bone">Dry-Stack Flush</span>
                  <span className="text-[10px] font-mono text-ember">0 mm Joint</span>
                </div>
                <span className="text-[11px] text-bone-dim mt-1">
                  Precision steel dowel or bracketed system for seamless monolithic screens.
                </span>
              </button>
            </div>
          </div>

          {/* 4. Clay Material Finish Swatches */}
          <div className="border-t border-kiln-3 pt-5">
            <label className="t-spec text-xs text-bone-dim uppercase block mb-2.5">
              4. Natural Clay Finish Swatches
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FINISH_SWATCHES.map((swatch) => {
                const active = state.finish === swatch.id
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => setFinish(swatch.id)}
                    className={`flex flex-col items-start gap-1.5 p-2.5 border text-left transition-all ${
                      active
                        ? 'border-ember bg-kiln-2 text-bone ring-1 ring-ember'
                        : 'border-kiln-3 bg-kiln text-bone-dim hover:border-bone-dim'
                    }`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span
                        className="h-3.5 w-3.5 rounded-full shrink-0 border border-black/30"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span className="text-xs font-medium text-bone truncate">{swatch.label}</span>
                    </div>
                    <span className="text-[10px] text-bone-dim line-clamp-1">{swatch.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 5. Sun Azimuth & Elevation Scrubbers with Live Shadow Throw */}
          <div className="border-t border-kiln-3 pt-5">
            <div className="flex items-center justify-between mb-2.5">
              <label className="t-spec text-xs text-bone-dim uppercase">
                5. Solar Light Rig & Dynamic Shadows
              </label>
            </div>

            {/* Solar Presets */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {SUN_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => selectSunPreset(preset)}
                  className="border border-kiln-3 bg-kiln px-2.5 py-1 text-xs text-bone hover:border-ember hover:bg-kiln-2 transition-colors"
                >
                  {preset.label}{' '}
                  <span className="text-bone-dim font-mono text-[10px]">({preset.time})</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 bg-kiln p-3 border border-kiln-3">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-bone-dim">SUN AZIMUTH:</span>
                  <span className="text-bone font-mono">{state.sunAzimuth}°</span>
                </div>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={state.sunAzimuth}
                  onChange={(e) => {
                    setSunManual(true)
                    setState((s) => ({ ...s, sunAzimuth: Number(e.target.value) }))
                  }}
                  className="w-full accent-ember cursor-pointer"
                  aria-label="Sun azimuth angle"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-bone-dim">SUN ELEVATION:</span>
                  <span className="text-bone font-mono">{state.sunElevation}°</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={85}
                  value={state.sunElevation}
                  onChange={(e) => {
                    setSunManual(true)
                    setState((s) => ({ ...s, sunElevation: Number(e.target.value) }))
                  }}
                  className="w-full accent-ember cursor-pointer"
                  aria-label="Sun elevation angle"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
