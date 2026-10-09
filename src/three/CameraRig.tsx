import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useAppStore, type SceneId } from '../store/useAppStore'
import { SCENE_CAMERA } from './sceneCameras'
import { LAYOUT_CAMERA, type CameraPose } from './layouts'
import { HALF_D, HALF_W } from './roomConfig'

type Mode = 'scroll' | 'fly' | 'orbit'

interface Props {
  canOrbit: boolean
  reduced: boolean
}

const smooth = (t: number) => t * t * (3 - 2 * t)
const v = (a: readonly number[]) => new THREE.Vector3(a[0], a[1], a[2])

/**
 * Drives the camera along the scroll tour. Each section with [data-scene] is an anchor; between anchors the
 * pose is interpolated, so the room "turns" as the page scrolls. In the "space" section the camera flies to the
 * chosen layout's viewpoint and hands over to OrbitControls (on fine pointers).
 */
export function CameraRig({ canOrbit, reduced }: Props) {
  const camera = useThree((s) => s.camera)
  const controls = useRef<OrbitControlsImpl>(null)
  const anchors = useRef<{ id: SceneId; y: number }[]>([])
  const mode = useRef<Mode>('scroll')
  const look = useRef(v(SCENE_CAMERA.hero.target))
  const pointer = useRef({ x: 0, y: 0 })
  const goalPos = useRef(new THREE.Vector3())
  const goalTarget = useRef(new THREE.Vector3())
  const scene = useAppStore((s) => s.scene)
  const chosen = useAppStore((s) => s.chosenLayout)

  // Measure scroll anchors (section centres) on resize and layout changes.
  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      anchors.current = [...document.querySelectorAll<HTMLElement>('[data-scene]')].map((el) => {
        const r = el.getBoundingClientRect()
        const y = r.top + window.scrollY + Math.min(r.height, window.innerHeight * 1.2) / 2 - window.innerHeight / 2
        return { id: el.dataset.scene as SceneId, y: Math.max(0, Math.min(max, y)) }
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  // Mode switching for the interactive section.
  useEffect(() => {
    const c = controls.current
    if (scene === 'space' && canOrbit) {
      mode.current = 'fly'
    } else {
      mode.current = 'scroll'
    }
    if (c) c.enabled = false
  }, [scene, chosen, canOrbit])

  useFrame((state, dt) => {
    const c = controls.current
    if (mode.current === 'orbit') {
      look.current.copy(c?.target ?? look.current)
      return
    }

    let pose: CameraPose
    if (scene === 'space') {
      pose = LAYOUT_CAMERA[chosen]
    } else {
      pose = scrollPose(anchors.current, window.scrollY)
    }
    goalPos.current.set(...pose.pos)
    goalTarget.current.set(...pose.target)

    if (!reduced && mode.current === 'scroll') {
      const t = state.clock.elapsedTime
      // slow breathing drift + pointer parallax keeps the background alive
      goalPos.current.x += Math.sin(t * 0.13) * 0.18 + pointer.current.x * 0.22
      goalPos.current.y += Math.sin(t * 0.17) * 0.06 - pointer.current.y * 0.12
      goalPos.current.z += Math.cos(t * 0.11) * 0.12
    }

    const k = 1 - Math.exp(-dt * (reduced ? 8 : mode.current === 'fly' ? 3.2 : 2.6))
    camera.position.lerp(goalPos.current, k)
    look.current.lerp(goalTarget.current, k)
    camera.lookAt(look.current)

    if (mode.current === 'fly' && c && camera.position.distanceTo(goalPos.current) < 0.03) {
      mode.current = 'orbit'
      c.target.copy(goalTarget.current)
      c.enabled = true
      c.update()
    }
  })

  return (
    <OrbitControls
      ref={controls}
      enabled={false}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.55}
      minPolarAngle={0.25 * Math.PI}
      maxPolarAngle={0.62 * Math.PI}
      autoRotate={!reduced}
      autoRotateSpeed={0.35}
      onChange={() => {
        // keep the camera inside the room
        const p = camera.position
        p.set(
          THREE.MathUtils.clamp(p.x, -HALF_W + 0.4, HALF_W - 0.4),
          THREE.MathUtils.clamp(p.y, 0.6, 4.2),
          THREE.MathUtils.clamp(p.z, -HALF_D + 0.5, HALF_D - 0.4),
        )
      }}
    />
  )
}

function scrollPose(anchors: { id: SceneId; y: number }[], y: number): CameraPose {
  if (!anchors.length) return SCENE_CAMERA.hero
  if (y <= anchors[0].y) return SCENE_CAMERA[anchors[0].id]
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i]
    const b = anchors[i + 1]
    if (y >= a.y && y < b.y) {
      const t = smooth((y - a.y) / Math.max(1, b.y - a.y))
      const pa = SCENE_CAMERA[a.id]
      const pb = SCENE_CAMERA[b.id]
      return {
        pos: pa.pos.map((p, j) => p + (pb.pos[j] - p) * t) as CameraPose['pos'],
        target: pa.target.map((p, j) => p + (pb.target[j] - p) * t) as CameraPose['target'],
      }
    }
  }
  return SCENE_CAMERA[anchors[anchors.length - 1].id]
}
