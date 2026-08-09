import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sun, sunDirection } from '../hooks/useSun'

// One light, one shadow map. The whole page shares this rig so the sun angle on a
// single tile in the viewer matches the sun angle on the wall in the hero.

type Props = {
  /** shadow map size. 1024 on phones, 2048 on desktop */
  mapSize: number
  /** how far the shadow camera has to reach */
  extent?: number
}

export function SunRig({ mapSize, extent = 4.2 }: Props) {
  const light = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    const l = light.current
    if (!l) return
    const [x, y, z] = sunDirection(sun.get())
    l.position.set(x, y, z)
    // warmer and dimmer at the ends of the day, white and hard overhead
    const noon = 1 - Math.abs(sun.get() - 0.5) * 2
    l.intensity = 3.4 + noon * 1.6
    l.color.setHSL(0.075 - noon * 0.02, 0.6 - noon * 0.38, 0.6 + noon * 0.1)
  })

  return (
    <>
      {/* sky bounce, so the shadowed face of the clay is not black */}
      {/* kept low on purpose. the drama in a jali wall is the difference between a
          lit face and a recess, and fill light is what flattens that out. */}
      <hemisphereLight args={['#6f7fb0', '#2a1c14', 0.42]} />
      <ambientLight intensity={0.1} />
      <directionalLight
        ref={light}
        castShadow
        intensity={2.4}
        shadow-mapSize-width={mapSize}
        shadow-mapSize-height={mapSize}
        shadow-camera-left={-extent}
        shadow-camera-right={extent}
        shadow-camera-top={extent}
        shadow-camera-bottom={-extent}
        shadow-camera-near={0.5}
        shadow-camera-far={26}
        shadow-bias={-0.0012}
        shadow-normalBias={0.02}
      />
    </>
  )
}
