import { forwardRef, useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { COLORS } from './roomConfig'
import { makeSlide } from './textures'
import type { Item } from './layouts'

const box = (w: number, h: number, d: number, x: number, y: number, z: number, rx = 0) => {
  const g = new THREE.BoxGeometry(w, h, d)
  if (rx) g.rotateX(rx)
  g.translate(x, y, z)
  return g
}
const cyl = (rt: number, rb: number, h: number, x: number, y: number, z: number, seg = 12) => {
  const g = new THREE.CylinderGeometry(rt, rb, h, seg)
  g.translate(x, y, z)
  return g
}

/** Shared geometries & materials, built once. */
function buildKit() {
  const upholstery = new THREE.MeshStandardMaterial({ color: COLORS.navy700, roughness: 0.85 })
  const metal = new THREE.MeshStandardMaterial({ color: '#1a1d20', roughness: 0.4, metalness: 0.6 })
  const top = new THREE.MeshStandardMaterial({ color: COLORS.white, roughness: 0.35 })
  const oak = new THREE.MeshStandardMaterial({ color: '#b98b58', roughness: 0.55 })
  const board = new THREE.MeshStandardMaterial({ color: '#fbfbf8', roughness: 0.6 })
  const slide = new THREE.MeshBasicMaterial({ map: makeSlide(), toneMapped: false })
  const beam = new THREE.MeshBasicMaterial({
    color: '#fff3dc',
    transparent: true,
    opacity: 0.07,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  })

  const chairBody = mergeGeometries([
    box(0.46, 0.07, 0.46, 0, 0.47, 0),
    box(0.46, 0.44, 0.06, 0, 0.76, -0.21, -0.12),
  ])!
  const chairLegs = mergeGeometries(
    [
      [-0.2, -0.19],
      [0.2, -0.19],
      [-0.2, 0.19],
      [0.2, 0.19],
    ].map(([x, z]) => cyl(0.014, 0.012, 0.46, x, 0.23, z, 6)),
  )!
  const roundTop = cyl(0.62, 0.62, 0.04, 0, 0.74, 0, 40)
  const roundBase = mergeGeometries([cyl(0.04, 0.04, 0.72, 0, 0.36, 0, 10), cyl(0.3, 0.3, 0.02, 0, 0.01, 0, 24)])!

  return { upholstery, metal, top, oak, board, slide, beam, chairBody, chairLegs, roundTop, roundBase }
}

let kit: ReturnType<typeof buildKit> | null = null
const useKit = () => useMemo(() => (kit ??= buildKit()), [])

function Chair() {
  const k = useKit()
  return (
    <>
      <mesh geometry={k.chairBody} material={k.upholstery} castShadow receiveShadow />
      <mesh geometry={k.chairLegs} material={k.oak} castShadow />
    </>
  )
}

function Table({ size: [w, d] }: { size: [number, number] }) {
  const k = useKit()
  const legs = useMemo(
    () =>
      mergeGeometries(
        [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ].map(([sx, sz]) => box(0.05, 0.72, 0.05, sx * (w / 2 - 0.12), 0.36, sz * (d / 2 - 0.12))),
      )!,
    [w, d],
  )
  return (
    <>
      <mesh material={k.top} position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.04, d]} />
      </mesh>
      <mesh geometry={legs} material={k.metal} castShadow />
    </>
  )
}

function RoundTable() {
  const k = useKit()
  return (
    <>
      <mesh geometry={k.roundTop} material={k.top} castShadow receiveShadow />
      <mesh geometry={k.roundBase} material={k.metal} castShadow />
    </>
  )
}

/** Pull-down screen on the left wall with a branded slide. Faces +X. */
function Screen() {
  const k = useKit()
  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      <mesh material={k.metal} position={[0, 3.62, 0.06]}>
        <boxGeometry args={[3.5, 0.12, 0.12]} />
      </mesh>
      <mesh material={k.board} position={[0, 2.45, 0.03]}>
        <boxGeometry args={[3.3, 2.15, 0.01]} />
      </mesh>
      <mesh material={k.slide} position={[0, 2.5, 0.04]}>
        <planeGeometry args={[3.1, 1.74]} />
      </mesh>
    </group>
  )
}

/** Ceiling projector with a soft light beam towards the screen at x = -5.9. */
function Projector() {
  const k = useKit()
  const beamGeo = useMemo(() => {
    // pyramid from the lens to the screen corners
    const lens = new THREE.Vector3(-0.2, 3.72, 0)
    const sx = -6.5 - 0
    const corners = [
      [sx, 3.37, -1.55],
      [sx, 3.37, 1.55],
      [sx, 1.63, 1.55],
      [sx, 1.63, -1.55],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z))
    const pts: number[] = []
    for (let i = 0; i < 4; i++) {
      const a = corners[i]
      const b = corners[(i + 1) % 4]
      pts.push(lens.x, lens.y, lens.z, a.x, a.y, a.z, b.x, b.y, b.z)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [])
  return (
    <group>
      <mesh material={k.metal} position={[0, 4.1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
      </mesh>
      <mesh material={k.top} position={[0, 3.72, 0]} castShadow>
        <boxGeometry args={[0.36, 0.13, 0.32]} />
      </mesh>
      <mesh material={k.metal} position={[-0.19, 3.72, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
      </mesh>
      <mesh geometry={beamGeo} material={k.beam} />
    </group>
  )
}

function Flipchart() {
  const k = useKit()
  return (
    <group>
      <mesh material={k.board} position={[0, 1.35, 0]} rotation={[-0.12, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 1.0, 0.03]} />
      </mesh>
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} material={k.metal} position={[x, 0.75, 0.05]} rotation={[-0.12, 0, 0]} castShadow>
          <boxGeometry args={[0.03, 1.5, 0.03]} />
        </mesh>
      ))}
      <mesh material={k.metal} position={[0, 0.7, -0.35]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.03, 1.45, 0.03]} />
      </mesh>
      <mesh position={[0, 1.55, 0.04]} rotation={[-0.12, 0, 0]}>
        <planeGeometry args={[0.45, 0.04]} />
        <meshBasicMaterial color={COLORS.sunset} />
      </mesh>
    </group>
  )
}

function Lectern() {
  const k = useKit()
  return (
    <group>
      <mesh material={k.top} position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 1.1, 0.45]} />
      </mesh>
      <mesh material={k.oak} position={[0, 1.12, 0]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.66, 0.04, 0.5]} />
      </mesh>
    </group>
  )
}

/** One furniture item. The outer group is what layout transitions scale in/out. */
export const FurnitureItem = forwardRef<THREE.Group, { item: Item }>(function FurnitureItem({ item }, ref) {
  return (
    <group ref={ref} position={[item.x, 0, item.z]} rotation={[0, item.r ?? 0, 0]}>
      {item.kind === 'chair' && <Chair />}
      {item.kind === 'table' && <Table size={item.size ?? [2, 1]} />}
      {item.kind === 'roundTable' && <RoundTable />}
      {item.kind === 'screen' && <Screen />}
      {item.kind === 'projector' && <Projector />}
      {item.kind === 'flipchart' && <Flipchart />}
      {item.kind === 'lectern' && <Lectern />}
    </group>
  )
})
