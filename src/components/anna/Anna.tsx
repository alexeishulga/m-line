import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { AnnaSvg } from './AnnaSvg'
import { PIVOTS, POSES, type Pose } from './poses'
import { ANNA_SCRIPT, type Spot } from './script'
import { useAppStore, type SceneId } from '../../store/useAppStore'
import { useIsMobile, useReducedMotion } from '../../hooks/useMediaQuery'
import styles from './Anna.module.css'

const WALK_SPEED = 520 // px per second

export function Anna() {
  const layer = useRef<HTMLDivElement>(null)
  const figure = useRef<HTMLDivElement>(null)
  const bubble = useRef<HTMLDivElement>(null)
  const textEl = useRef<HTMLSpanElement>(null)
  const scene = useAppStore((s) => s.scene)
  const entered = useAppStore((s) => s.entered)
  const mobile = useIsMobile()
  const reduced = useReducedMotion()
  const api = useRef<{ go: (s: SceneId, first?: boolean) => void } | null>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      const fig = figure.current!
      const q = gsap.utils.selector(fig)
      const part = (n: string) => q(`[data-part="${n}"]`)
      const state = { spot: null as Spot | null, x: 0, scale: 1 }
      let sceneTl: gsap.core.Timeline | null = null
      let loops: gsap.core.Tween[] = []
      let bubbleHide: gsap.core.Tween | null = null

      // pivots
      gsap.set(part('upperL'), { svgOrigin: PIVOTS.shoulder })
      gsap.set(part('upperR'), { svgOrigin: PIVOTS.shoulder })
      gsap.set([...part('foreL'), ...part('foreR')], { svgOrigin: PIVOTS.elbow })
      gsap.set([...part('handL'), ...part('handR')], { svgOrigin: PIVOTS.wrist })
      gsap.set(part('legL'), { svgOrigin: PIVOTS.hipL })
      gsap.set(part('legR'), { svgOrigin: PIVOTS.hipR })
      gsap.set(part('head'), { svgOrigin: PIVOTS.neck })
      gsap.set(part('eyes'), { svgOrigin: PIVOTS.eyes })
      gsap.set(part('body'), { svgOrigin: PIVOTS.body })

      if (!reduced) {
        // breathing, blinking and the brooch glint
        gsap.to(part('torso'), { y: -1.2, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        gsap.to(part('head'), { y: -1.4, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        const blink = () => {
          gsap.to(part('eyes'), { scaleY: 0.08, duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.in' })
          gsap.delayedCall(2.2 + Math.random() * 3.5, blink)
        }
        gsap.delayedCall(1.5, blink)
        gsap
          .timeline({ repeat: -1, repeatDelay: 4.5 })
          .fromTo(part('glint'), { opacity: 0, scale: 0.2, svgOrigin: '880 400' }, { opacity: 1, scale: 1, duration: 0.25 })
          .to(part('glint'), { opacity: 0, scale: 0.2, duration: 0.35 })
      }

      const sizeOf = () => {
        const h = fig.offsetHeight
        return { w: (h * 320) / 860, h }
      }

      const spotGeometry = (spot: Spot) => {
        const vw = window.innerWidth
        const { w } = sizeOf()
        const narrow = vw <= 860
        if (spot === 'corner' || narrow) {
          const scale = narrow ? 0.62 : 0.46
          return { x: vw - w * scale - (narrow ? 4 : 18), scale }
        }
        if (spot === 'left') return { x: Math.max(8, vw * 0.035), scale: 1 }
        return { x: vw - w - Math.max(8, vw * 0.035), scale: 1 }
      }

      const placeBubble = (spot: Spot, geo: { x: number; scale: number }) => {
        const b = bubble.current!
        const { w, h } = sizeOf()
        const vw = window.innerWidth
        const vh = window.innerHeight
        const bw = b.offsetWidth
        const bh = b.offsetHeight
        const top = vh - h * geo.scale
        if (spot === 'corner' || vw <= 860) {
          return { x: Math.max(16, vw - bw - 16), y: top - bh - 6 }
        }
        if (spot === 'left') return { x: Math.min(vw - bw - 16, geo.x + w * 0.82), y: top + h * 0.02 }
        return { x: Math.max(16, geo.x + w * 0.16 - bw), y: top + h * 0.02 }
      }

      const applyPose = (tl: gsap.core.Timeline, p: Pose, at: number | string) => {
        loops.forEach((l) => l.kill())
        loops = []
        const d = 0.7
        const ease = 'power3.inOut'
        tl.to(part('upperL'), { rotation: p.upperL, duration: d, ease }, at)
          .to(part('foreL'), { rotation: p.foreL, duration: d, ease }, '<')
          .to(part('handL'), { rotation: p.handL, duration: d, ease }, '<')
          .to(part('upperR'), { rotation: p.upperR, duration: d, ease }, '<')
          .to(part('foreR'), { rotation: p.foreR, duration: d, ease }, '<')
          .to(part('handR'), { rotation: p.handR, duration: d, ease }, '<')
          .to(part('head'), { rotation: p.head, duration: d, ease }, '<')
          .to(part('body'), { rotation: p.lean, duration: d, ease }, '<')
          .to(part('pointL'), { opacity: p.pointL ? 1 : 0, duration: 0.2 }, '<0.2')
          .to(part('openL'), { opacity: p.pointL ? 0 : 1, duration: 0.2 }, '<')
          .to(part('pointR'), { opacity: p.pointR ? 1 : 0, duration: 0.2 }, '<')
          .to(part('openR'), { opacity: p.pointR || p.tablet ? 0 : 1, duration: 0.2 }, '<')
          .to(part('tablet'), { opacity: p.tablet ? 1 : 0, duration: 0.3 }, '<')
          .add(() => {
            if (reduced) return
            if (p.waveR) loops.push(gsap.fromTo(part('foreR'), { rotation: p.foreR }, { rotation: p.foreR + 26, duration: 0.42, ease: 'sine.inOut', yoyo: true, repeat: 7 }))
            if (p.waveL) loops.push(gsap.fromTo(part('foreL'), { rotation: p.foreL }, { rotation: p.foreL + 26, duration: 0.42, ease: 'sine.inOut', yoyo: true, repeat: -1, repeatDelay: 0.6 }))
          })
      }

      const walkCycle = (duration: number, dir: number) => {
        const steps = Math.max(2, Math.round(duration / 0.38))
        const tl = gsap.timeline()
        for (let i = 0; i < steps; i++) {
          const s = i % 2 ? 1 : -1
          tl.to(part('legL'), { rotation: 11 * s, duration: 0.19, ease: 'sine.inOut' }, i * 0.38)
            .to(part('legR'), { rotation: -11 * s, duration: 0.19, ease: 'sine.inOut' }, '<')
            .to(part('upperL'), { rotation: 7 - 9 * s, duration: 0.19, ease: 'sine.inOut' }, '<')
            .to(part('upperR'), { rotation: 7 + 9 * s, duration: 0.19, ease: 'sine.inOut' }, '<')
            .to(part('body'), { y: -6, duration: 0.19, ease: 'sine.out', yoyo: true, repeat: 1 }, '<')
        }
        tl.to(part('body'), { rotation: 2.5 * dir, duration: 0.3 }, 0)
        tl.to([...part('legL'), ...part('legR')], { rotation: 0, duration: 0.25 })
        return tl
      }

      const say = (
        tl: gsap.core.Timeline,
        spot: Spot,
        geo: { x: number; scale: number },
        line: string,
        at: number | string,
        autoHide: boolean,
      ) => {
        const b = bubble.current!
        const t = textEl.current!
        tl.to(b, { opacity: 0, y: '+=6', duration: 0.2 }, 0)
        tl.add(() => {
          t.textContent = line // measure with the full line
          const pos = placeBubble(spot, geo)
          gsap.set(b, { x: pos.x, y: pos.y + 10 })
          t.textContent = reduced ? line : ''
        }, at)
        tl.to(b, { opacity: 1, y: '-=10', duration: 0.35, ease: 'power2.out' }, '>')
        if (!reduced) {
          const proxy = { n: 0 }
          tl.to(
            proxy,
            {
              n: line.length,
              duration: Math.min(2.2, line.length * 0.028),
              ease: 'none',
              onUpdate: () => {
                t.textContent = line.slice(0, Math.round(proxy.n))
              },
            },
            '<',
          )
        }
        tl.add(() => {
          bubbleHide?.kill()
          // over content the bubble would cover text, so it hides after a while
          if (autoHide || window.innerWidth <= 860) bubbleHide = gsap.to(b, { opacity: 0, duration: 0.4, delay: 5 })
        })
      }

      const go = contextSafe!((id: SceneId, first = false) => {
        const step = ANNA_SCRIPT[id]
        const geo = spotGeometry(step.spot)
        sceneTl?.kill()
        bubbleHide?.kill()
        const tl = gsap.timeline()
        sceneTl = tl
        fig.classList.toggle(styles.clickable, step.spot === 'corner' || window.innerWidth <= 860)

        if (first) {
          gsap.set(fig, { x: geo.x, scale: geo.scale, y: 60, opacity: 0 })
          tl.to(fig, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' })
          applyPose(tl, POSES[step.pose], 0.4)
          say(tl, step.spot, geo, step.line, 0.7, !!step.autoHide)
        } else {
          const dist = Math.abs(geo.x - state.x)
          const scaleChange = geo.scale !== state.scale
          if (reduced) {
            tl.to(fig, { opacity: 0, duration: 0.2 }).set(fig, { x: geo.x, scale: geo.scale }).to(fig, { opacity: 1, duration: 0.3 })
          } else if (dist > 40) {
            const dur = gsap.utils.clamp(0.9, 2.4, dist / WALK_SPEED)
            applyPose(tl, POSES.idle, 0)
            tl.to(fig, { x: geo.x, scale: geo.scale, duration: dur, ease: scaleChange ? 'power2.inOut' : 'sine.inOut' }, 0.15)
            tl.add(walkCycle(dur, Math.sign(geo.x - state.x)), 0.15)
            tl.to(part('body'), { rotation: 0, duration: 0.3 })
          } else if (scaleChange) {
            tl.to(fig, { scale: geo.scale, x: geo.x, duration: 0.6, ease: 'power2.inOut' }, 0)
          }
          applyPose(tl, POSES[step.pose], '>-0.1')
          say(tl, step.spot, geo, step.line, '<', step.spot === 'corner' || !!step.autoHide)
        }
        state.spot = step.spot
        state.x = geo.x
        state.scale = geo.scale
      })
      api.current = { go }

      // gaze follows the pointer
      const gx = gsap.quickTo(part('irises'), 'x', { duration: 0.4 })
      const gy = gsap.quickTo(part('irises'), 'y', { duration: 0.4 })
      const onMove = (e: PointerEvent) => {
        const r = fig.getBoundingClientRect()
        const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
        const dy = (e.clientY - (r.top + r.height * 0.13)) / window.innerHeight
        gx(gsap.utils.clamp(-1.8, 1.8, dx * 5))
        gy(gsap.utils.clamp(-1.1, 1.1, dy * 4))
      }
      if (!reduced) window.addEventListener('pointermove', onMove)
      return () => window.removeEventListener('pointermove', onMove)
    },
    { scope: layer, dependencies: [reduced] },
  )

  const started = useRef(false)
  useEffect(() => {
    if (!entered || !api.current) return
    api.current.go(scene, !started.current)
    started.current = true
  }, [scene, entered, mobile])

  useEffect(() => {
    const onResize = () => started.current && api.current?.go(useAppStore.getState().scene)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div ref={layer} className={styles.layer}>
      <div
        ref={figure}
        className={styles.figure}
        onClick={() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })}
        title="Связаться с Анной"
      >
        <AnnaSvg />
      </div>
      <div ref={bubble} className={styles.bubble} role="status" aria-live="polite">
        <span className={styles.name}>Анна · АРКА 123</span>
        <span ref={textEl} className={styles.text} />
      </div>
    </div>
  )
}
