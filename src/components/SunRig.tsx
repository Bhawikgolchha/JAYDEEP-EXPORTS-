import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sun, sunDirection } from '../hooks/useSun'

export interface SunRigProps {
  /** Shadow map resolution: 1024 on mobile, 2048 on desktop, 4096 on ultra */
  mapSize?: number
  /** Orthographic shadow camera frustum extent */
  extent?: number
  /** Manual sun progress override (0..1). If omitted, reads reactive global sun motionValue */
  sunProgress?: number
  /** Whether directional light casts shadows */
  castShadow?: boolean
  /** Ambient light intensity multiplier */
  ambientMultiplier?: number
}

/**
 * SunRig: Dynamic Solar Trajectory & Atmospheric Lighting Rig.
 * Computes physically inspired sun angles, solar color temperature, sky hemisphere bounce,
 * and high-precision shadow mapping through complex perforated Jali geometries.
 */
export function SunRig({
  mapSize = 2048,
  extent = 4.5,
  sunProgress,
  castShadow = true,
  ambientMultiplier = 1,
}: SunRigProps) {
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const hemiRef = useRef<THREE.HemisphereLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)

  useFrame(() => {
    const l = lightRef.current
    if (!l) return

    // Determine current sun time value (0 = early morning dawn, 0.5 = midday noon, 1.0 = dusk)
    const currentSun = typeof sunProgress === 'number' ? sunProgress : sun.get()

    // 3D Direction vector
    const [x, y, z] = sunDirection(currentSun)
    l.position.set(x, y, z)

    // Noon factor (0 at sunrise/sunset, 1.0 at zenith)
    const noon = 1 - Math.abs(currentSun - 0.5) * 2

    // Dynamic solar intensity: 2.8 at dawn/dusk, up to 5.0 at midday
    l.intensity = 2.8 + noon * 2.2

    // Solar color temperature gradient:
    // Dawn/Dusk (warm terracotta/amber hue: HSL ~ 0.065, Sat 0.8, Lightness 0.55)
    // Midday (crisp architectural white-yellow: HSL ~ 0.12, Sat 0.22, Lightness 0.85)
    const hue = 0.06 + noon * 0.055
    const sat = THREE.MathUtils.lerp(0.78, 0.22, noon)
    const light = THREE.MathUtils.lerp(0.55, 0.88, noon)
    l.color.setHSL(hue, sat, light)

    // Adjust sky hemisphere fill light dynamically
    if (hemiRef.current) {
      // Sky shifts from cool twilight blue to warm daylight blue
      const skyHue = THREE.MathUtils.lerp(0.62, 0.58, noon)
      const skySat = THREE.MathUtils.lerp(0.45, 0.25, noon)
      hemiRef.current.color.setHSL(skyHue, skySat, 0.65)
      // Ground bounce reflects terracotta warmth
      hemiRef.current.groundColor.setRGB(0.24 + noon * 0.08, 0.14 + noon * 0.04, 0.08)
      hemiRef.current.intensity = (0.35 + noon * 0.2) * ambientMultiplier
    }

    if (ambientRef.current) {
      ambientRef.current.intensity = (0.12 + noon * 0.08) * ambientMultiplier
    }
  })

  return (
    <>
      {/* Sky/ground bounce hemisphere light to prevent deep shadows from turning completely black */}
      <hemisphereLight
        ref={hemiRef}
        args={['#6f7fb0', '#2a1c14', 0.45 * ambientMultiplier]}
      />

      <ambientLight ref={ambientRef} intensity={0.12 * ambientMultiplier} />

      {/* Main solar projector casting sharp geometric dappled shadows */}
      <directionalLight
        ref={lightRef}
        castShadow={castShadow}
        intensity={3.2}
        shadow-mapSize-width={mapSize}
        shadow-mapSize-height={mapSize}
        shadow-camera-left={-extent}
        shadow-camera-right={extent}
        shadow-camera-top={extent}
        shadow-camera-bottom={-extent}
        shadow-camera-near={0.5}
        shadow-camera-far={32}
        shadow-bias={-0.0008}
        shadow-normalBias={0.025}
      />
    </>
  )
}

export default SunRig
