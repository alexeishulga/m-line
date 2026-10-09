import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { LogoIcon } from './LogoIcon'
import { Wordmark } from './Wordmark'
import { ICON_PATHS } from './iconGeometry'
import { prepareDraw } from './drawUtils'
import { useAppStore } from '../../store/useAppStore'
import { BRAND } from '../../data/content'
import styles from './Preloader.module.css'

gsap.registerPlugin(useGSAP)

/** Inner window of the arch in icon viewBox units (see iconGeometry). */
const WIN = { x: 341, y: 310.5, w: 568, h: 665.5 }
const VIEW = { x: 288, y: 258, w: 674 }
const ARCH_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${WIN.x} ${WIN.y} ${WIN.w} ${WIN.h}" preserveAspectRatio="none"><path d="${ICON_PATHS.window}"/></svg>`,
)}")`

const FORCE_AFTER_MS = 12000

/**
 * "Входим через арку": the base line, the arch and 1-2-3 draw themselves, warm window light rises with the
 * real loading progress, then the arch becomes a hole that grows over the screen and reveals the site.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const iconWrap = useRef<HTMLDivElement>(null)
  const progress = useAppStore((s) => s.loadProgress)
  const setEntered = useAppStore((s) => s.setEntered)
  // read once: the intro runs a single time, it must not restart if the OS setting flips mid-session
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [gone, setGone] = useState(false)
  const state = useRef({ introDone: false, exiting: false, forced: false })

  const exitRef = useRef<() => void>(() => {})

  useGSAP(
    (_ctx, contextSafe) => {
      const q = gsap.utils.selector(root)

      const exit = contextSafe!(() => {
        const s = state.current
        if (s.exiting || !root.current || !iconWrap.current) return
        s.exiting = true
        const el = root.current
        const wrap = iconWrap.current
        const r = wrap.querySelector('svg')!.getBoundingClientRect()
        const k = r.width / VIEW.w
        const win = {
          w: WIN.w * k,
          h: WIN.h * k,
          cx: r.left + (WIN.x - VIEW.x + WIN.w / 2) * k,
          cy: r.top + (WIN.y - VIEW.y + WIN.h / 2) * k,
        }
        const cover = Math.max(window.innerWidth / win.w, (window.innerHeight * 1.4) / win.h) * 2.6
        const wrapRect = wrap.getBoundingClientRect()
        wrap.style.transformOrigin = `${win.cx - wrapRect.left}px ${win.cy - wrapRect.top}px`
        const proxy = { s: 1 }

        const apply = () => {
          const w = win.w * proxy.s
          const h = win.h * proxy.s
          const size = `${w}px ${h}px, 100% 100%`
          const pos = `${win.cx - w / 2}px ${win.cy - h / 2}px, 0 0`
          el.style.setProperty('-webkit-mask-size', size)
          el.style.setProperty('mask-size', size)
          el.style.setProperty('-webkit-mask-position', pos)
          el.style.setProperty('mask-position', pos)
          wrap.style.transform = `scale(${proxy.s})`
        }

        const tl = gsap.timeline({ onComplete: () => setGone(true) })
        tl.to(q('[data-part="light"]'), { scaleY: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' }).to(
          q(`.${styles.wordmark}, .${styles.slogan}, .${styles.progress}, .${styles.skip}`),
          { opacity: 0, y: -12, duration: 0.45, stagger: 0.05, ease: 'power2.in' },
          0,
        )
        if (reduced) {
          tl.to(el, { opacity: 0, duration: 0.5 }).add(() => setEntered(true), 0.2)
          return
        }
        tl.add(() => {
          el.style.setProperty('--arch-mask', ARCH_MASK)
          apply()
          el.classList.add(styles.opening)
        })
          .to(proxy, { s: cover, duration: 1.5, ease: 'power3.in', onUpdate: apply })
          .add(() => setEntered(true), '-=0.9')
          .to(el, { opacity: 0, duration: 0.3 }, '-=0.2')
      })
      exitRef.current = exit

      const finishIntro = () => {
        state.current.introDone = true
        if (useAppStore.getState().loadProgress >= 1 || state.current.forced) exit()
      }

      gsap.set(q('[data-part="light"]'), { scaleY: 0, transformOrigin: '50% 100%' })
      if (reduced) {
        gsap.from(q(`.${styles.stack}`), { opacity: 0, duration: 0.6, onComplete: finishIntro })
        return
      }
      prepareDraw(
        q('[data-part="mk-base"], [data-part="mk-arch"], [data-part="mk-one"], [data-part="mk-two"], [data-part="mk-three"]'),
      )
      gsap.set(q('[data-part="mk-flag"]'), { scale: 0, transformOrigin: '100% 100%' })
      gsap.set(q('[data-part="glyph"]'), { yPercent: 115 })
      gsap.set(q(`.${styles.slogan}`), { opacity: 0, y: 14 })

      gsap
        .timeline({ delay: 0.25, onComplete: finishIntro })
        .to(q('[data-part="mk-base"]'), { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' })
        .to(q('[data-part="mk-arch"]'), { strokeDashoffset: 0, duration: 1.05, ease: 'power2.inOut' }, '-=0.12')
        .to(q('[data-part="mk-one"]'), { strokeDashoffset: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4')
        .to(q('[data-part="mk-flag"]'), { scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, '-=0.12')
        .to(q('[data-part="mk-two"]'), { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, '-=0.25')
        .to(q('[data-part="mk-three"]'), { strokeDashoffset: 0, duration: 0.65, ease: 'power2.inOut' }, '-=0.3')
        .to(q('[data-part="glyph"]'), { yPercent: 0, duration: 0.8, stagger: 0.06, ease: 'power4.out' }, '-=0.35')
        .to(q(`.${styles.slogan}`), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.45')
        .to(q(`.${styles.skip}`), { opacity: 1, duration: 0.4 }, 3.5)
    },
    { scope: root },
  )

  // Window light and the bar follow the real loading progress.
  useEffect(() => {
    if (!root.current) return
    const q = gsap.utils.selector(root)
    gsap.to(q('[data-part="light"]'), { scaleY: progress, duration: 0.8, ease: 'power2.out', overwrite: 'auto' })
    gsap.to(q(`.${styles.barFill}`), { scaleX: progress, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
    if (progress >= 1 && state.current.introDone) exitRef.current()
  }, [progress])

  useEffect(() => {
    const t = window.setTimeout(() => {
      state.current.forced = true
      if (state.current.introDone) exitRef.current()
    }, FORCE_AFTER_MS)
    return () => window.clearTimeout(t)
  }, [])

  if (gone) return null

  return (
    <div ref={root} className={styles.loader} aria-busy="true" aria-label="Загрузка сайта АРКА 123">
      <div className={styles.stack}>
        <div ref={iconWrap} className={styles.icon}>
          <LogoIcon drawable withLight />
        </div>
        <Wordmark className={styles.wordmark} />
        <p className={styles.slogan}>{BRAND.slogan}.</p>
      </div>
      <div className={styles.progress} aria-hidden="true">
        <span>Открываем вид на Библиотеку</span>
        <span className={styles.bar}>
          <span className={styles.barFill} />
        </span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
      <button
        type="button"
        className={styles.skip}
        onClick={() => {
          state.current.forced = true
          exitRef.current()
        }}
      >
        Пропустить
      </button>
    </div>
  )
}
