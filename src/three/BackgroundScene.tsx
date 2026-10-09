import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Html, Lightformer, PerformanceMonitor, useProgress } from '@react-three/drei'
import { Room } from './Room'
import { Furnishing } from './Furnishing'
import { CameraRig } from './CameraRig'
import { SCENE_CAMERA } from './sceneCameras'
import { useActiveLayout, useAppStore } from '../store/useAppStore'
import { useFinePointer, useIsMobile, useReducedMotion } from '../hooks/useMediaQuery'
import styles from './BackgroundScene.module.css'

function Lights({ shadows }: { shadows: boolean }) {
  const sun = useRef<THREE.DirectionalLight>(null)
  return (
    <>
      <hemisphereLight args={['#fff7ec', '#8a7660', 0.9]} />
      <ambientLight intensity={0.25} color="#ffeedd" />
      {/* late-afternoon sun through the arched windows */}
      <directionalLight
        ref={sun}
        position={[-5, 8, -15]}
        intensity={3.2}
        color="#ffdcb0"
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      {/* the 33 ceiling panels, as one soft top light */}
      <directionalLight position={[1, 10, 2]} intensity={0.9} color="#f4f6ff" />
      <pointLight position={[0, 3.6, 1]} intensity={6} distance={14} decay={1.4} color="#fff4e6" />
    </>
  )
}

function ReadySignal() {
  const done = useRef(false)
  const setSceneReady = useAppStore((s) => s.setSceneReady)
  useFrame(() => {
    if (done.current) return
    done.current = true
    requestAnimationFrame(() => setSceneReady())
  })
  return null
}

/** Forwards drei's loading progress into the app store (read by the preloader). */
function ProgressBridge() {
  const progress = useProgress((s) => s.progress)
  const setThreeProgress = useAppStore((s) => s.setThreeProgress)
  useEffect(() => setThreeProgress(progress / 100), [progress, setThreeProgress])
  return null
}

const HOTSPOTS: { p: [number, number, number]; title: string; text: string }[] = [
  { p: [-3, 3.55, -4.85], title: '4 × 3,5 м', text: 'арочные окна с видом на Библиотеку' },
  { p: [-5.6, 4.1, 3.2], title: '4,5 м', text: 'высота потолков' },
  { p: [1.6, 3.85, -0.2], title: '33', text: 'линейных светильника' },
  { p: [2.2, 0.05, 3.4], title: '123 м²', text: 'паркет-ёлочка' },
]

export default function BackgroundScene() {
  const scene = useAppStore((s) => s.scene)
  const layout = useActiveLayout()
  const mobile = useIsMobile()
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const [dpr, setDpr] = useState<number>(mobile ? 1.25 : 1.6)
  const interactive = scene === 'space'

  return (
    <div className={`${styles.wrap} ${interactive ? styles.interactive : ''}`} aria-hidden={!interactive}>
      <Canvas
        className={styles.canvas}
        shadows={mobile ? false : 'percentage'}
        dpr={dpr}
        camera={{ fov: mobile ? 62 : 50, near: 0.05, far: 120, position: SCENE_CAMERA.hero.pos }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#d4dce1']} />
        <ProgressBridge />
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(mobile ? 1.25 : 1.6)} />
        <Suspense fallback={null}>
          <Lights shadows={!mobile} />
          <Room />
          <Furnishing active={layout} instant={reduced} />
          <Environment resolution={128} frames={1} background={false}>
            <Lightformer form="rect" intensity={3} color="#ffe9cf" position={[-3, 2.6, -8]} scale={[4, 3.5, 1]} />
            <Lightformer form="rect" intensity={3} color="#ffe9cf" position={[3, 2.6, -8]} scale={[4, 3.5, 1]} />
            <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[10, 8, 1]} />
            <Lightformer form="rect" intensity={0.5} color="#e8dccb" position={[0, 2, 8]} scale={[12, 4, 1]} />
          </Environment>
          {HOTSPOTS.map((h) => (
            <Html key={h.title} position={h.p} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
              <div className={`${styles.hotspot} ${interactive ? styles.hotspotOn : ''}`}>
                <b>{h.title}</b>
                <span>{h.text}</span>
              </div>
            </Html>
          ))}
          <ReadySignal />
        </Suspense>
        <CameraRig canOrbit={fine && !mobile} reduced={reduced} />
      </Canvas>
    </div>
  )
}
