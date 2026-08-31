import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { jaliGeometry } from '../three/JaliGeometry'
import type { PatternId } from '../data/patterns'

/**
 * GLSL Shader for 1000°C Thermal Kiln Blackbody Glow & Vitrification
 */
const KilnShader = {
  uniforms: {
    uTime: { value: 0 },
    uTemperature: { value: 1000.0 }, // in Celsius (200.0 to 1100.0)
    uNormalMap: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    uniform float uTime;
    uniform float uTemperature;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;

      // Thermal expansion & subtle microscopic heat shimmer
      float heatFactor = clamp((uTemperature - 300.0) / 750.0, 0.0, 1.0);
      vec3 displaced = position;
      float shimmer = sin(position.y * 12.0 + uTime * 3.5) * cos(position.x * 12.0 + uTime * 2.5) * 0.004 * heatFactor;
      displaced += normal * shimmer;

      vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    uniform float uTime;
    uniform float uTemperature;

    // Approximates blackbody radiation color across 200°C to 1100°C
    vec3 blackbodyColor(float tempC) {
      if (tempC < 300.0) {
        // Cold raw clay
        return vec3(0.55, 0.28, 0.16);
      } else if (tempC < 550.0) {
        // Incipient red / dark cherry glow (300°C - 550°C)
        float t = (tempC - 300.0) / 250.0;
        return mix(vec3(0.45, 0.18, 0.10), vec3(0.85, 0.12, 0.04), t);
      } else if (tempC < 850.0) {
        // Bright cherry red to incandescent orange (550°C - 850°C)
        float t = (tempC - 550.0) / 300.0;
        return mix(vec3(0.85, 0.12, 0.04), vec3(0.98, 0.48, 0.08), t);
      } else {
        // High vitrification: 900°C to 1050°C+ (Radiant orange-gold to glowing incandescent core)
        float t = clamp((tempC - 850.0) / 250.0, 0.0, 1.0);
        return mix(vec3(0.98, 0.48, 0.08), vec3(1.0, 0.92, 0.65), t);
      }
    }

    void main() {
      // Base clay shading
      vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
      float diff = max(dot(vNormal, lightDir), 0.15);
      
      // Calculate heat glow intensity
      float normTemp = clamp((uTemperature - 200.0) / 850.0, 0.0, 1.0);
      vec3 emissiveGlow = blackbodyColor(uTemperature);

      // Core interior cavity is hotter than outer cooling edges
      float distFromCenter = length(vPosition.xy);
      float cavityBoost = 1.0 - smoothstep(0.0, 0.8, distFromCenter);
      
      // Dynamic thermal turbulence
      float turbulence = sin(vPosition.x * 20.0 + uTime * 4.0) * sin(vPosition.y * 20.0 + uTime * 3.0) * 0.15;
      float totalGlow = (normTemp * 1.8 + cavityBoost * 0.6 + turbulence * normTemp) * step(0.1, normTemp);

      // Raw clay base
      vec3 baseClay = vec3(0.70, 0.33, 0.18) * diff;
      vec3 finalColor = mix(baseClay, emissiveGlow, normTemp * 0.85) + emissiveGlow * totalGlow * 0.7;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
}

/**
 * 3D Rising Ember Particle System with buoyant vortex dynamics
 */
function EmberParticles({ count = 220, temperature = 1000 }: { count?: number; temperature?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const isFiring = temperature > 400

  const [positions, velocities, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const pha = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Spawn in cylinder around the kiln hearth
      const radius = 0.2 + Math.random() * 1.2
      const angle = Math.random() * Math.PI * 2
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = -1.2 + Math.random() * 2.8
      pos[i * 3 + 2] = Math.sin(angle) * radius

      // Velocity: upward buoyancy + spiral angular momentum
      vel[i * 3] = (Math.random() - 0.5) * 0.3
      vel[i * 3 + 1] = 0.4 + Math.random() * 0.8 // rise speed
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.3

      pha[i] = Math.random() * Math.PI * 2
    }
    return [pos, vel, pha]
  }, [count])

  useFrame((state, delta) => {
    if (!pointsRef.current || !isFiring) return
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const array = posAttr.array as Float32Array

    const heatFactor = Math.min(1.5, Math.max(0.1, (temperature - 300) / 600))
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      // Upward motion
      array[idx + 1] += velocities[idx + 1] * delta * heatFactor

      // Vortex spiraling around kiln center
      const angle = 0.8 * delta * heatFactor
      const x = array[idx]
      const z = array[idx + 2]
      array[idx] = x * Math.cos(angle) - z * Math.sin(angle) + Math.sin(time * 2.0 + phases[i]) * 0.005
      array[idx + 2] = x * Math.sin(angle) + z * Math.cos(angle) + Math.cos(time * 2.0 + phases[i]) * 0.005

      // Reset when particle floats out of top
      if (array[idx + 1] > 2.2) {
        const radius = 0.15 + Math.random() * 0.9
        const a = Math.random() * Math.PI * 2
        array[idx] = Math.cos(a) * radius
        array[idx + 1] = -1.2
        array[idx + 2] = Math.sin(a) * radius
      }
    }
    posAttr.needsUpdate = true
  })

  if (!isFiring) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={temperature > 850 ? '#ffb347' : '#ff4500'}
        transparent
        opacity={Math.min(0.9, (temperature - 300) / 700)}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/**
 * 3D Fired Tile in Kiln Chamber with Custom GLSL Shader
 */
function FiringTile({
  pattern = 'circle',
  temperature = 1000,
}: {
  pattern?: PatternId
  temperature: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null)
  const geo = useMemo(() => jaliGeometry(pattern), [pattern])

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTemperature: { value: temperature },
      },
      vertexShader: KilnShader.vertexShader,
      fragmentShader: KilnShader.fragmentShader,
    })
  }, [])

  useFrame((state, delta) => {
    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = state.clock.elapsedTime
      shaderMatRef.current.uniforms.uTemperature.value = THREE.MathUtils.lerp(
        shaderMatRef.current.uniforms.uTemperature.value,
        temperature,
        0.1,
      )
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.05
    }
  })

  return (
    <group position={[0, 0.1, 0]}>
      {/* Central Terracotta Tile under 1000°C Thermal Load */}
      <mesh
        ref={meshRef}
        geometry={geo}
        material={shaderMaterial}
        ref-material={shaderMatRef}
        scale={1.5}
      />

      {/* Kiln Refractory Floor Hearth */}
      <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#211814" roughness={0.9} />
      </mesh>

      {/* Refractory Kiln Back Wall */}
      <mesh position={[0, 0.8, -2.5]}>
        <planeGeometry args={[16, 10]} />
        <meshStandardMaterial color="#1a1310" roughness={0.95} />
      </mesh>

      {/* Kiln Core Glow Point Light */}
      <pointLight
        position={[0, 0, 0]}
        intensity={Math.max(0.2, (temperature / 1000) * 8.5)}
        distance={9}
        color={temperature > 850 ? '#ff9933' : '#ff3300'}
      />
    </group>
  )
}

export interface KilnSceneProps {
  initialTemperature?: number
  pattern?: PatternId
  interactive?: boolean
  className?: string
}

/**
 * Stage 2: 1000°C Kiln Firing & Material Science Scene
 */
export function KilnScene({
  initialTemperature = 1000,
  pattern = 'circle',
  interactive = true,
  className = 'w-full h-full min-h-[440px]',
}: KilnSceneProps) {
  const [temp, setTemp] = useState(initialTemperature)
  const [autoCycle, setAutoCycle] = useState(false)

  useEffect(() => {
    if (!autoCycle) return
    let forward = true
    const interval = setInterval(() => {
      setTemp((prev) => {
        if (prev >= 1050) forward = false
        if (prev <= 250) forward = true
        return forward ? prev + 25 : prev - 25
      })
    }, 120)
    return () => clearInterval(interval)
  }, [autoCycle])

  // Firing Phase Metallurgy & ASTM Insights
  const phaseInfo = useMemo(() => {
    if (temp < 450) {
      return {
        name: 'Dehydration & Hydroxide Expulsion',
        stage: 'Phase I (200°C - 450°C)',
        description: 'Physical moisture is driven off. Clay body shrinks uniformly without micro-cracking.',
        astm: 'Pore Geometry Stabilization',
      }
    } else if (temp < 650) {
      return {
        name: 'Quartz Inversion & Lattice Expansion',
        stage: 'Phase II (573°C Inversion Point)',
        description: 'Alpha quartz transforms into beta quartz. Crystalline matrix aligns for load resistance.',
        astm: 'IS 1077 Structural Density',
      }
    } else if (temp < 920) {
      return {
        name: 'Carbon Burnout & Solid-State Sintering',
        stage: 'Phase III (800°C - 920°C)',
        description: 'Organic elements vaporize. Individual clay particles coalesce and lock under solid diffusion.',
        astm: 'ASTM C652 Efflorescence Prevention',
      }
    } else {
      return {
        name: 'Vitrification & Mullite Matrix Fusion',
        stage: 'Phase IV (980°C - 1050°C+)',
        description: 'Ceramic glass bond forms. High compressive strength (>15 MPa) and low absorption (<9%) achieved.',
        astm: 'ASTM C652 & IS 1077 Certified',
      }
    }
  }, [temp])

  return (
    <div className={`relative overflow-hidden bg-kiln ${className}`}>
      {/* 3D WebGL Canvas */}
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.2, 4.0], fov: 38 }}
      >
        <color attach="background" args={['#100c0a']} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[2, 4, 3]} intensity={0.8} color="#ffe0cc" />
        <FiringTile pattern={pattern} temperature={temp} />
        <EmberParticles count={240} temperature={temp} />
      </Canvas>

      {/* Tactical Firing HUD & Controls */}
      {interactive && (
        <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-3 border border-kiln-3 bg-kiln/90 p-4 backdrop-blur-md sm:bottom-6 sm:left-6 sm:max-w-md">
          <div className="flex items-center justify-between border-b border-kiln-3 pb-2">
            <span className="t-spec text-[10px] text-bone-dim tracking-wider">
              STAGE 2: 1000°C KILN FIRING / MATERIAL SCIENCE
            </span>
            <span className="border border-ember/50 bg-ember/15 px-2 py-0.5 font-mono text-xs font-semibold text-ember">
              {temp}°C
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm font-medium text-bone">{phaseInfo.name}</h4>
              <span className="text-[11px] font-mono text-bone-dim">{phaseInfo.stage}</span>
            </div>
            <p className="text-xs leading-relaxed text-bone-dim">{phaseInfo.description}</p>
          </div>

          {/* Temperature Scrubber Slider */}
          <div className="mt-1 flex flex-col gap-1.5">
            <div className="flex justify-between text-[10px] font-mono text-bone-dim">
              <span>200°C (Raw Clay)</span>
              <span>573°C (Inversion)</span>
              <span>1000°C (Vitrified)</span>
            </div>
            <input
              type="range"
              min="200"
              max="1050"
              step="10"
              value={temp}
              onChange={(e) => {
                setAutoCycle(false)
                setTemp(Number(e.target.value))
              }}
              className="h-1.5 w-full cursor-pointer appearance-none bg-kiln-3 accent-ember"
              aria-label="Kiln Temperature Scrubber"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-ember">{phaseInfo.astm}</span>
            <button
              type="button"
              onClick={() => setAutoCycle(!autoCycle)}
              className={`border px-2.5 py-1 text-xs transition-colors ${
                autoCycle
                  ? 'border-ember bg-ember/20 text-bone'
                  : 'border-kiln-3 bg-kiln-2 text-bone-dim hover:text-bone'
              }`}
            >
              {autoCycle ? 'Stop Firing Cycle' : 'Simulate Firing Cycle'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default KilnScene
