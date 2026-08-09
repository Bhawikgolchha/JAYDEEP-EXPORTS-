import { Canvas } from '@react-three/fiber'
import { useReducedMotion } from 'motion/react'
import { JaliWall } from './JaliWall'

// Lazy chunk. three, r3f and drei all live behind this import, so none of it is in
// the entry bundle and none of it is fetched on a phone that never reaches the hero.

export default function HeroScene() {
  const reduce = useReducedMotion()
  const high = typeof window !== 'undefined' && window.innerWidth >= 1024

  return (
    <Canvas
      shadows
      dpr={[1, high ? 1.75 : 1.4]}
      // under reduced motion the scene draws once and then stops entirely
      frameloop={reduce ? 'demand' : 'always'}
      gl={{ antialias: high, powerPreference: 'high-performance' }}
      camera={{ position: [0.6, 0.35, 5.4], fov: 42 }}
    >
      <color attach="background" args={['#14100e']} />
      <fog attach="fog" args={['#14100e', 7, 15]} />
      <JaliWall quality={high ? 'high' : 'low'} />
    </Canvas>
  )
}
