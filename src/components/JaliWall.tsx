import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  createJaliGeometry,
  clayMaterial,
  type ClayFinish,
  type JaliPatternId,
  JALI_MODULE_SIZE_MM,
} from './JaliGeometryFactory'
import { SunRig } from '../three/SunRig'
import { sun } from '../hooks/useSun'

export interface JaliWallProps {
  pattern?: JaliPatternId
  patterns?: JaliPatternId[]
  finish?: ClayFinish
  cols?: number
  rows?: number
  mortarJoint?: 'dry-stack' | 'mortared' | number
  rotationY?: number
  turntable?: boolean
  quality?: 'low' | 'high'
  showBackWall?: boolean
  showFloor?: boolean
  interactiveSun?: boolean
  sunAzimuth?: number
  sunElevation?: number
  scale?: number
}

const DEFAULT_BANDS: JaliPatternId[] = ['star', 'circle', 'amber']
const MAX_INSTANCES = 160

export function JaliWall({
  pattern,
  patterns,
  finish = 'natural',
  cols: userCols,
  rows: userRows,
  mortarJoint = 'mortared',
  rotationY = 0,
  turntable = false,
  quality = 'high',
  showBackWall = true,
  showFloor = true,
  scale: userScale,
}: JaliWallProps) {
  const group = useRef<THREE.Group>(null)
  const singleMesh = useRef<THREE.InstancedMesh>(null)
  const bandedMeshes = useRef<(THREE.InstancedMesh | null)[]>([])
  const { viewport } = useThree()

  // Calculate gap multiplier based on mortar joint mode
  // 0mm dry-stack = 1.002 (tight flush), 8mm mortared = 1.040
  const gap = useMemo(() => {
    if (mortarJoint === 'dry-stack') return 1.004
    if (mortarJoint === 'mortared') return 1.040
    if (typeof mortarJoint === 'number') {
      return 1.0 + mortarJoint / JALI_MODULE_SIZE_MM
    }
    return 1.040
  }, [mortarJoint])

  // Determine grid dimensions
  const isCustomGrid = typeof userCols === 'number' && typeof userRows === 'number'
  const activePatterns = useMemo(() => {
    if (pattern) return [pattern]
    if (patterns && patterns.length > 0) return patterns
    return DEFAULT_BANDS
  }, [pattern, patterns])

  const isSinglePattern = activePatterns.length === 1

  const { cols, rows, tileScale } = useMemo(() => {
    if (isCustomGrid) {
      const c = Math.max(1, Math.min(16, userCols!))
      const r = Math.max(1, Math.min(12, userRows!))
      // Scale so custom wall fits comfortably within viewport
      const maxDim = Math.max(c * gap, r * gap)
      const targetWidth = Math.min(viewport.width * 0.75, 4.2)
      const t = userScale ?? Math.min(1.0, targetWidth / maxDim)
      return { cols: c, rows: r, tileScale: t }
    } else {
      const across = quality === 'high' ? 6 : 3
      const t = viewport.width / across
      const c = across + 2
      const r = Math.max(3, Math.ceil(viewport.height / (t * gap)) + 2)
      return { cols: c, rows: r, tileScale: userScale ?? t }
    }
  }, [isCustomGrid, userCols, userRows, userScale, viewport.width, viewport.height, quality, gap])

  const geos = useMemo(() => {
    return activePatterns.map((p) => createJaliGeometry(p))
  }, [activePatterns])

  const mat = useMemo(() => {
    return clayMaterial(finish)
  }, [finish])

  // Update InstancedMesh matrices
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()

    if (isSinglePattern && singleMesh.current) {
      const mesh = singleMesh.current
      let count = 0
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (count >= MAX_INSTANCES) break
          const posX = (x - (cols - 1) / 2) * gap
          const posY = (y - (rows - 1) / 2) * gap
          dummy.position.set(posX, posY, 0)
          // Subtle artisan irregularity (0.1 degree variation)
          dummy.rotation.z = (((x * 7 + y * 13) % 5) - 2) * 0.0018
          dummy.rotation.x = 0
          dummy.rotation.y = 0
          dummy.updateMatrix()
          mesh.setMatrixAt(count++, dummy.matrix)
        }
      }
      mesh.count = count
      mesh.instanceMatrix.needsUpdate = true
    } else {
      const counts = activePatterns.map(() => 0)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const band = Math.floor(x / 2) % activePatterns.length
          const m = bandedMeshes.current[band]
          if (!m || counts[band] >= MAX_INSTANCES) continue

          const posX = (x - (cols - 1) / 2) * gap
          const posY = (y - (rows - 1) / 2) * gap
          dummy.position.set(posX, posY, 0)
          dummy.rotation.z = (((x * 7 + y * 13) % 5) - 2) * 0.0022
          dummy.updateMatrix()
          m.setMatrixAt(counts[band]++, dummy.matrix)
        }
      }
      bandedMeshes.current.forEach((m, i) => {
        if (!m) return
        m.count = counts[i]
        m.instanceMatrix.needsUpdate = true
      })
    }
  }, [cols, rows, gap, isSinglePattern, activePatterns])

  // Responsive frame updates with subtle parallax or interactive rotation
  useFrame((state, delta) => {
    if (!group.current) return

    if (turntable) {
      // Continuous turntable rotation
      group.current.rotation.y += delta * 0.35
    } else if (rotationY !== 0) {
      // User manual rotation scrubber
      const rad = (rotationY * Math.PI) / 180
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, rad, 0.1)
    } else if (!isCustomGrid) {
      // Hero subtle mouse parallax
      const px = state.pointer.x * 0.07
      const py = state.pointer.y * 0.04
      const targetY = -0.2 + (sun.get() - 0.5) * 0.12 + px
      const targetX = -py
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.05)
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05)
    }
  })

  return (
    <>
      <SunRig
        mapSize={quality === 'high' ? 2048 : 1024}
        extent={Math.max(viewport.width, viewport.height, cols * gap, rows * gap) * 0.9}
      />

      <group ref={group} scale={tileScale}>
        {isSinglePattern ? (
          <instancedMesh
            ref={singleMesh}
            args={[geos[0], mat, MAX_INSTANCES]}
            castShadow
            receiveShadow
            frustumCulled={false}
          />
        ) : (
          activePatterns.map((pId, i) => (
            <instancedMesh
              key={pId}
              ref={(el) => {
                bandedMeshes.current[i] = el
              }}
              args={[geos[i], mat, MAX_INSTANCES]}
              castShadow
              receiveShadow
              frustumCulled={false}
            />
          ))
        )}

        {/* Plaster back wall to catch dappled geometric shadow projection */}
        {showBackWall && (
          <mesh position={[0, 0, -3.8]} receiveShadow>
            <planeGeometry args={[Math.max(cols * gap * 3.5, 30), Math.max(rows * gap * 3.5, 20)]} />
            <meshStandardMaterial color="#9c8b79" roughness={1} metalness={0} />
          </mesh>
        )}

        {/* Floor plane to receive ground shadow projections */}
        {showFloor && (
          <mesh
            position={[0, -(rows * gap) / 2 - 0.05, -1.9]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[Math.max(cols * gap * 3.5, 30), 4.2]} />
            <meshStandardMaterial color="#7d6f62" roughness={1} metalness={0} />
          </mesh>
        )}
      </group>
    </>
  )
}
