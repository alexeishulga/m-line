import { useMemo } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { COLORS, COLUMN, HALF_D, HALF_W, ROOM, WALL_T, WINDOW, WINDOW_X, archTop } from './roomConfig'
import { makeHerringbone, makePanels, makePlaster, makeRibs } from './textures'
import { asset } from '../lib/asset'

/** Arch outline as a 2D path, centered at cx, optionally inset (for the frame's inner edge). */
function archPath<T extends THREE.Path>(p: T, cx: number, inset = 0): T {
  const rx = WINDOW.w / 2 - inset
  const ry = WINDOW.top - WINDOW.spring - inset
  p.moveTo(cx - rx, WINDOW.sill + inset)
  p.lineTo(cx + rx, WINDOW.sill + inset)
  p.lineTo(cx + rx, WINDOW.spring)
  p.absellipse(cx, WINDOW.spring, rx, ry, 0, Math.PI, false, 0)
  p.lineTo(cx - rx, WINDOW.sill + inset)
  return p
}

function useRoomMaterials() {
  return useMemo(() => {
    const floor = new THREE.MeshStandardMaterial({ map: makeHerringbone([ROOM.w / 1.2, ROOM.d / 1.2]), roughness: 0.48, metalness: 0 })
    const plasterTex = makePlaster([3, 1.2])
    const plaster = new THREE.MeshStandardMaterial({ map: plasterTex, roughness: 0.95 })
    const backPlasterTex = makePlaster([0.25, 0.25])
    const backPlaster = new THREE.MeshStandardMaterial({ map: backPlasterTex, roughness: 0.95 })
    const anthracite = new THREE.MeshStandardMaterial({ color: COLORS.anthracite, emissive: '#15181a', roughness: 0.8 })
    const ceiling = new THREE.MeshStandardMaterial({ color: '#3b4146', emissive: '#2a2f33', roughness: 0.95 })
    const frame = new THREE.MeshStandardMaterial({ color: COLORS.frame, roughness: 0.45, metalness: 0.3 })
    const panels = new THREE.MeshStandardMaterial({ map: makePanels(), roughness: 0.5 })
    const white = new THREE.MeshStandardMaterial({ color: COLORS.white, roughness: 0.4 })
    const ribs = new THREE.MeshStandardMaterial({ map: makeRibs(), roughness: 0.6, metalness: 0.4 })
    const glass = new THREE.MeshStandardMaterial({
      color: '#dfeaf0',
      transparent: true,
      opacity: 0.07,
      roughness: 0.05,
      metalness: 0.1,
      depthWrite: false,
    })
    const frosted = new THREE.MeshStandardMaterial({
      color: '#eef2f3',
      transparent: true,
      opacity: 0.55,
      roughness: 0.3,
      depthWrite: false,
    })
    const lamp = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false })
    const cable = new THREE.LineBasicMaterial({ color: '#111', transparent: true, opacity: 0.6 })
    return { floor, plaster, backPlaster, anthracite, ceiling, frame, panels, white, ribs, glass, frosted, lamp, cable }
  }, [])
}

export type RoomMaterials = ReturnType<typeof useRoomMaterials>

function BackWall({ m }: { m: RoomMaterials }) {
  const geo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-HALF_W, 0)
    shape.lineTo(HALF_W, 0)
    shape.lineTo(HALF_W, ROOM.h)
    shape.lineTo(-HALF_W, ROOM.h)
    shape.lineTo(-HALF_W, 0)
    WINDOW_X.forEach((cx) => shape.holes.push(archPath(new THREE.Path(), cx)))
    return new THREE.ExtrudeGeometry(shape, { depth: WALL_T, bevelEnabled: false, curveSegments: 48 })
  }, [])
  return <mesh geometry={geo} material={m.backPlaster} position={[0, 0, -HALF_D - WALL_T]} castShadow receiveShadow />
}

function ArchWindow({ cx, m }: { cx: number; m: RoomMaterials }) {
  const { frameGeo, glassGeo, bars } = useMemo(() => {
    const outer = archPath(new THREE.Shape(), 0)
    outer.holes.push(archPath(new THREE.Path(), 0, 0.09))
    const frameGeo = new THREE.ExtrudeGeometry(outer, { depth: 0.12, bevelEnabled: false, curveSegments: 48 })
    const glassGeo = new THREE.ShapeGeometry(archPath(new THREE.Shape(), 0, 0.05), 48)
    const bars: { x: number; y: number; w: number; h: number }[] = []
    for (const x of [-1, 0, 1]) {
      const top = archTop(x)
      bars.push({ x, y: (WINDOW.sill + top) / 2, w: 0.07, h: top - WINDOW.sill })
    }
    bars.push({ x: 0, y: WINDOW.spring, w: WINDOW.w - 0.1, h: 0.07 })
    bars.push({ x: 0, y: 1.9, w: WINDOW.w - 0.1, h: 0.06 })
    return { frameGeo, glassGeo, bars }
  }, [])
  const z = -HALF_D - WALL_T / 2
  return (
    <group position={[cx, 0, z]}>
      <mesh geometry={frameGeo} material={m.frame} position={[0, 0, -0.06]} castShadow />
      {bars.map((b, i) => (
        <mesh key={i} material={m.frame} position={[b.x, b.y, 0]} castShadow>
          <boxGeometry args={[b.w, b.h, 0.1]} />
        </mesh>
      ))}
      <mesh geometry={glassGeo} material={m.glass} position={[0, 0, 0.01]} />
      {/* sill: its top sits 12 mm above the bottom of the wall opening — if the two surfaces were coplanar
          the GPU couldn't tell which is in front and the sill would flicker (z-fighting) */}
      <mesh material={m.frame} position={[0, WINDOW.sill - 0.013, WALL_T / 2 - 0.05]} receiveShadow castShadow>
        <boxGeometry args={[WINDOW.w + 0.2, 0.05, WALL_T * 0.7]} />
      </mesh>
      {/* radiator */}
      <mesh material={m.ribs} position={[0, 0.48, WALL_T / 2 + 0.12]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.55, 0.1]} />
      </mesh>
    </group>
  )
}

/** View through the windows: photo of the National Library on a far plane (padded with a blurred copy). */
function OutsideView() {
  const tex = useTexture(asset('/img/view-library-wide.webp'), (t) => {
    t.colorSpace = THREE.SRGBColorSpace
  })
  // Original photo region spans 18×10 m; the padded texture is 2.4× wider and 2× taller.
  return (
    <mesh position={[-3.25, 4, -11]}>
      <planeGeometry args={[18 * 2.4, 10 * 2]} />
      <meshBasicMaterial map={tex} toneMapped={false} color="#fff6ec" />
    </mesh>
  )
}

/** 33 linear pendant lights, scattered diagonally like on the photos. */
function CeilingLights({ m }: { m: RoomMaterials }) {
  const { lights, cables } = useMemo(() => {
    const angles = [0.6, -0.5, 1.1, -0.9, 0.25, -0.2, 0.85]
    const lights: { p: [number, number, number]; r: number }[] = []
    let n = 0
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 11; col++) {
        const x = -5 + col * 1.0 + ((row * 37 + col * 13) % 7) * 0.05
        const z = -3.4 + row * 3.4 + (((col * 29 + row * 11) % 9) - 4) * 0.12
        lights.push({ p: [x, 3.95 - ((col + row) % 3) * 0.08, z], r: angles[n++ % angles.length] })
      }
    }
    const pts: number[] = []
    for (const l of lights) {
      const dx = Math.cos(l.r) * 0.5
      const dz = -Math.sin(l.r) * 0.5
      for (const s of [-1, 1]) pts.push(l.p[0] + dx * s, l.p[1], l.p[2] + dz * s, l.p[0] + dx * s, ROOM.h, l.p[2] + dz * s)
    }
    const cables = new THREE.BufferGeometry()
    cables.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return { lights, cables }
  }, [])
  return (
    <group>
      {lights.map((l, i) => (
        <mesh key={i} position={l.p} rotation={[0, l.r, 0]} material={m.lamp}>
          <boxGeometry args={[1.2, 0.03, 0.045]} />
        </mesh>
      ))}
      <lineSegments geometry={cables} material={m.cable} />
    </group>
  )
}

function Clock({ m }: { m: RoomMaterials }) {
  const marks = useMemo(() => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2), [])
  return (
    <group position={[-HALF_W + 0.02, 3.0, 0.8]} rotation={[0, Math.PI / 2, 0]}>
      {marks.map((a, i) => (
        <mesh key={i} material={m.anthracite} position={[Math.sin(a) * 0.55, Math.cos(a) * 0.55, 0]} rotation={[0, 0, -a]}>
          <boxGeometry args={[0.035, i % 3 === 0 ? 0.16 : 0.08, 0.02]} />
        </mesh>
      ))}
      <mesh material={m.anthracite} position={[0.12, 0.08, 0.02]} rotation={[0, 0, -1.0]}>
        <boxGeometry args={[0.03, 0.34, 0.015]} />
      </mesh>
      <mesh material={m.anthracite} position={[-0.06, 0.2, 0.03]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.02, 0.44, 0.015]} />
      </mesh>
    </group>
  )
}

function Plant({ position }: { position: [number, number, number] }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const a = i * 2.39
        const r = 0.18 + (i % 3) * 0.1
        return { p: [Math.cos(a) * r, 1.35 + (i % 4) * 0.18, Math.sin(a) * r] as [number, number, number], s: 0.22 + (i % 3) * 0.05 }
      }),
    [],
  )
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.22, 0.56, 32]} />
        <meshStandardMaterial color="#e9e3d8" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.035, 0.9, 8]} />
        <meshStandardMaterial color="#6b5137" roughness={0.9} />
      </mesh>
      {leaves.map((l, i) => (
        <mesh key={i} position={l.p} scale={l.s} castShadow>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={i % 2 ? '#7d8f5a' : '#66784a'} roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  )
}

export function Room() {
  const m = useRoomMaterials()
  return (
    <group>
      {/* floor & ceiling */}
      <mesh material={m.floor} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.w, ROOM.d]} />
      </mesh>
      <mesh material={m.ceiling} rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.h, 0]}>
        <planeGeometry args={[ROOM.w, ROOM.d]} />
      </mesh>
      {[-1.9, 1.9].map((z) => (
        <mesh key={z} material={m.anthracite} position={[0, ROOM.h - 0.22, z]}>
          <boxGeometry args={[ROOM.w, 0.44, 0.38]} />
        </mesh>
      ))}
      <mesh material={m.anthracite} position={[0, ROOM.h - 0.3, 3.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, ROOM.w, 20]} />
      </mesh>

      {/* walls */}
      <BackWall m={m} />
      {WINDOW_X.map((x) => (
        <ArchWindow key={x} cx={x} m={m} />
      ))}
      <OutsideView />
      <mesh material={m.plaster} position={[-HALF_W, ROOM.h / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.d, ROOM.h]} />
      </mesh>
      {/* right wall: white cabinet panels below, plaster above */}
      <mesh material={m.panels} position={[HALF_W - 0.04, 1.6, -0.6]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8.8, 3.2]} />
      </mesh>
      <mesh material={m.plaster} position={[HALF_W, ROOM.h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.d, ROOM.h]} />
      </mesh>
      {/* front wall with frosted glass partition and the entrance */}
      <mesh material={m.plaster} position={[0, ROOM.h / 2, HALF_D]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[ROOM.w, ROOM.h]} />
      </mesh>
      <group position={[2.2, 0, HALF_D - 0.05]}>
        <mesh material={m.frosted} position={[0, 1.5, 0]}>
          <boxGeometry args={[5, 3, 0.04]} />
        </mesh>
        {[-2.5, -0.8, 0.9, 2.5].map((x) => (
          <mesh key={x} material={m.frame} position={[x, 1.5, 0]}>
            <boxGeometry args={[0.05, 3, 0.07]} />
          </mesh>
        ))}
        <mesh material={m.frame} position={[0, 3.02, 0]}>
          <boxGeometry args={[5.05, 0.05, 0.07]} />
        </mesh>
        <mesh material={m.anthracite} position={[0, 3.75, 0.02]}>
          <boxGeometry args={[5.05, 1.5, 0.05]} />
        </mesh>
      </group>
      {/* skirting */}
      {(
        [
          [0, -HALF_D + 0.01, ROOM.w, 0],
          [0, HALF_D - 0.01, ROOM.w, 0],
          [-HALF_W + 0.01, 0, ROOM.d, Math.PI / 2],
          [HALF_W - 0.05, 0, ROOM.d, Math.PI / 2],
        ] as const
      ).map(([x, z, len, r], i) => (
        <mesh key={i} material={m.anthracite} position={[x, 0.04, z]} rotation={[0, r, 0]}>
          <boxGeometry args={[len, 0.08, 0.02]} />
        </mesh>
      ))}

      {/* anthracite column and pier */}
      <mesh material={m.anthracite} position={[COLUMN.x, ROOM.h / 2, COLUMN.z]} castShadow receiveShadow>
        <boxGeometry args={[COLUMN.size, ROOM.h, COLUMN.size]} />
      </mesh>
      <mesh material={m.anthracite} position={[HALF_W - 0.35, ROOM.h / 2, -HALF_D + 0.35]} castShadow receiveShadow>
        <boxGeometry args={[0.7, ROOM.h, 0.7]} />
      </mesh>

      {/* reception desk (photo 11) */}
      <group position={[4.5, 0, 3.9]} rotation={[0, -0.2, 0]}>
        <mesh material={m.white} position={[-0.45, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.8, 0.6]} />
        </mesh>
        <mesh material={m.anthracite} position={[0.45, 0.55, -0.05]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 1.1, 0.7]} />
        </mesh>
      </group>

      <CeilingLights m={m} />
      <Clock m={m} />
      <Plant position={[-5.3, 0, -4.3]} />
      <Plant position={[0, 0, -4.4]} />
    </group>
  )
}
