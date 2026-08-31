import { useState, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion, useReducedMotion } from 'motion/react'
import { SunRig } from '../components/SunRig'
import { jaliGeometry, clayMaterial, type ClayFinish } from '../three/JaliGeometry'
import { sun, setSunManual } from '../hooks/useSun'
import type { PatternId } from '../data/patterns'

/**
 * 3D Modernist Villa Facade with dynamic dappled shadow casting
 */
function VillaFacadeMesh({
  pattern = 'circle',
  finish = 'natural',
  sunProgress,
}: {
  pattern?: PatternId
  finish?: ClayFinish
  sunProgress: number
}) {
  const facadeRef = useRef<THREE.Group>(null)
  const geo = useMemo(() => jaliGeometry(pattern), [pattern])
  const mat = useMemo(() => clayMaterial(finish), [finish])

  // 5 columns x 4 rows architectural screen panel
  const cols = 5
  const rows = 4
  const gap = 1.02

  useFrame((state) => {
    if (!facadeRef.current) return
    // Very subtle organic parallax drift
    const px = state.pointer.x * 0.04
    const py = state.pointer.y * 0.02
    facadeRef.current.rotation.y = THREE.MathUtils.lerp(facadeRef.current.rotation.y, px - 0.12, 0.05)
    facadeRef.current.rotation.x = THREE.MathUtils.lerp(facadeRef.current.rotation.x, -py, 0.05)
  })

  return (
    <group ref={facadeRef} position={[0, 0, 0]}>
      {/* Dynamic Solar Trajectory Lighting Rig */}
      <SunRig sunProgress={sunProgress} mapSize={2048} extent={4.8} />

      {/* Modernist Villa Jali Screen Grid */}
      <group position={[-(cols - 1) * gap * 0.5, -(rows - 1) * gap * 0.5, 0]}>
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => (
            <mesh
              key={`facade-tile-${r}-${c}`}
              geometry={geo}
              material={mat}
              position={[c * gap, r * gap, 0]}
              castShadow
              receiveShadow
            />
          )),
        )}
      </group>

      {/* Villa Structural Lintels & Columns */}
      <mesh position={[0, (rows * gap) * 0.5 + 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[cols * gap + 0.6, 0.3, 0.4]} />
        <meshStandardMaterial color="#2d2621" roughness={0.9} />
      </mesh>
      <mesh position={[0, -(rows * gap) * 0.5 - 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[cols * gap + 0.6, 0.3, 0.4]} />
        <meshStandardMaterial color="#2d2621" roughness={0.9} />
      </mesh>
      <mesh position={[-(cols * gap) * 0.5 - 0.15, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, rows * gap + 0.6, 0.4]} />
        <meshStandardMaterial color="#2d2621" roughness={0.9} />
      </mesh>
      <mesh position={[(cols * gap) * 0.5 + 0.15, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, rows * gap + 0.6, 0.4]} />
        <meshStandardMaterial color="#2d2621" roughness={0.9} />
      </mesh>

      {/* Interior Floor: receives sweeping geometric dappled shadow projections */}
      <mesh
        position={[0, -(rows * gap) * 0.5 - 0.3, -2.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#847668" roughness={0.92} metalness={0} />
      </mesh>

      {/* Interior Back Wall: catches raking sunbeams */}
      <mesh position={[0, 0, -5.2]} receiveShadow>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#968573" roughness={0.95} metalness={0} />
      </mesh>
    </group>
  )
}

const CLAIMS = [
  {
    head: 'You can see out. They cannot see in.',
    body: 'The human eye perceives the brightly lit exterior terracotta facade, keeping the interior private without opaque blinds or tinted glass.',
    metric: '92% Privacy Index',
  },
  {
    head: 'Air keeps moving.',
    body: 'Narrowing tapered terracotta geometry accelerates natural airflow through perforated openings, dropping indoor ambient temperatures naturally.',
    metric: '-4°C to -6°C Delta (Venturi Airflow)',
  },
  {
    head: 'The glare goes, the daylight stays.',
    body: 'Deep 75mm block extrusion cuts intense solar glare while casting dynamic, living dappled shadows across floors and walls throughout the day.',
    metric: '100% Non-Glare Lux',
  },
]

/**
 * Stage 3: Modernist Villa Facade & Solar Trajectory Section
 */
export function Light() {
  const reduce = useReducedMotion()
  const [sunValue, setSunValue] = useState(0.35)
  const [pattern, setPattern] = useState<PatternId>('circle')

  // Calculate sun time label and solar data
  const sunTimeData = useMemo(() => {
    // sunValue from 0.0 (06:00 AM) to 1.0 (18:00 PM)
    const hour = Math.floor(6 + sunValue * 12)
    const minutes = Math.floor(((6 + sunValue * 12) % 1) * 60)
    const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    let phase = 'Morning Rake'
    if (sunValue > 0.35 && sunValue < 0.65) phase = 'Solar Zenith / Noon'
    else if (sunValue >= 0.65 && sunValue < 0.88) phase = 'Golden Hour'
    else if (sunValue >= 0.88) phase = 'Dusk Twilight'

    const azimuth = Math.round(75 + sunValue * 130)
    const elevation = Math.round(Math.sin(sunValue * Math.PI) * 68)

    return { timeString, phase, azimuth, elevation }
  }, [sunValue])

  const handleSliderChange = (v: number) => {
    setSunValue(v)
    setSunManual(true)
    sun.set(v)
  }

  return (
    <section id="light" className="relative bg-kiln pb-24 pt-10 md:pb-32">
      {/* 3D Modernist Villa Viewport */}
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="t-spec text-xs text-ember">
              STAGE 3: MODERNIST VILLA FACADE & SOLAR ENGINE
            </span>
            <h2 className="t-display mt-2 text-[clamp(2.2rem,6vw,4rem)]">
              Dynamic Light & Dappled Shadows
            </h2>
          </div>
          <p className="max-w-md text-sm text-bone-dim">
            Drag the solar trajectory scrubber below to witness real-time geometric shadow casting through
            unglazed terracotta perforations.
          </p>
        </div>

        {/* 3D Canvas Box */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border border-kiln-3 bg-kiln sm:aspect-[21/10] md:h-[580px]">
          <Canvas
            shadows
            dpr={[1, 1.75]}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            camera={{ position: [0.8, 0.4, 4.4], fov: 40 }}
          >
            <color attach="background" args={['#14100e']} />
            <fog attach="fog" args={['#14100e', 6, 16]} />
            <VillaFacadeMesh pattern={pattern} sunProgress={sunValue} />
          </Canvas>

          {/* Interactive Solar Scrubber HUD */}
          <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-3 border border-kiln-3 bg-kiln/90 p-4 backdrop-blur-md sm:bottom-6 sm:left-6 sm:max-w-lg">
            <div className="flex items-center justify-between border-b border-kiln-3 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-bone">
                  {sunTimeData.timeString}
                </span>
                <span className="text-xs text-bone-dim">({sunTimeData.phase})</span>
              </div>
              <div className="flex gap-3 font-mono text-[11px] text-ember">
                <span>AZ: {sunTimeData.azimuth}°</span>
                <span>EL: {sunTimeData.elevation}°</span>
              </div>
            </div>

            {/* Scrubber Range Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] font-mono text-bone-dim">
                <span>06:00 (Dawn Rake)</span>
                <span>12:00 (Zenith)</span>
                <span>18:00 (Sunset)</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.01"
                value={sunValue}
                onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none bg-kiln-3 accent-ember"
                aria-label="Solar trajectory time scrubber"
              />
            </div>

            {/* Pattern Switcher for Facade */}
            <div className="flex items-center justify-between pt-1">
              <span className="t-spec text-[10px] text-bone-dim">FACADE PATTERN</span>
              <div className="flex gap-1.5">
                {(['circle', 'star', 'amber', 'window'] as PatternId[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPattern(p)}
                    className={`border px-2 py-0.5 text-xs capitalize transition-colors ${
                      pattern === p
                        ? 'border-ember bg-ember/20 text-bone'
                        : 'border-kiln-3 bg-kiln-2 text-bone-dim hover:text-bone'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Architectural Claims */}
        <div className="mt-16">
          <h3 className="t-display text-2xl text-bone mb-6">A screen does three jobs at once.</h3>
          <div className="grid gap-8 md:grid-cols-3">
            {CLAIMS.map((c, i) => (
              <motion.div
                key={c.head}
                className="border border-kiln-3 bg-kiln-2 p-6"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="border border-ember/30 bg-kiln px-2 py-0.5 font-mono text-xs text-ember">
                  {c.metric}
                </span>
                <h4 className="mt-4 text-xl text-bone" style={{ fontStretch: '108%' }}>
                  {c.head}
                </h4>
                <p className="t-body mt-2 text-sm leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
export default Light
