import { Canvas } from '@react-three/fiber'
import { useReducedMotion } from 'motion/react'
import { TileViewer } from './TileViewer'
import type { PatternId } from '../data/patterns'

export default function ViewerScene({ pattern }: { pattern: PatternId }) {
  const reduce = useReducedMotion()
  const high = typeof window !== 'undefined' && window.innerWidth >= 1024

  return (
    <Canvas
      shadows
      dpr={[1, high ? 1.75 : 1.4]}
      frameloop={reduce ? 'demand' : 'always'}
      gl={{ antialias: high, powerPreference: 'high-performance' }}
      camera={{ position: [1.55, 0.7, 3.2], fov: 40 }}
    >
      <color attach="background" args={['#14100e']} />
      {/* fog pulls the far floor and wall back down to the page ground, so the stage
          has no visible edges and the section stays dark */}
      <fog attach="fog" args={['#14100e', 4.6, 11]} />
      <TileViewer pattern={pattern} quality={high ? 'high' : 'low'} spin={!reduce} />
    </Canvas>
  )
}
