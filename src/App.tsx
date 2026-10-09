import { lazy, Suspense, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis, useLenis, type LenisRef } from 'lenis/react'
import { Preloader } from './components/logo/Preloader'
import { Anna } from './components/anna/Anna'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { WindowView } from './sections/WindowView'
import { Space } from './sections/Space'
import { Services } from './sections/Services'
import { Gallery } from './sections/Gallery'
import { Pricing } from './sections/Pricing'
import { Reviews } from './sections/Reviews'
import { Footer } from './sections/Footer'
import { useAppStore } from './store/useAppStore'
import { useLoadTracker } from './hooks/useLoadTracker'
import { useScrollScenes } from './hooks/useScrollScenes'
import './styles/app.css'

gsap.registerPlugin(ScrollTrigger)

const BackgroundScene = lazy(() => import('./three/BackgroundScene'))

/** Keeps ScrollTrigger in sync with Lenis and locks scrolling until the preloader has opened. */
function LenisSync({ entered }: { entered: boolean }) {
  const lenis = useLenis(ScrollTrigger.update)
  useEffect(() => {
    document.body.classList.toggle('is-loading', !entered)
    if (!lenis) return
    if (entered) {
      lenis.start()
    } else {
      // the tour always starts at the hero, whatever position the browser tried to keep
      lenis.scrollTo(0, { immediate: true, force: true })
      lenis.stop()
    }
  }, [entered, lenis])

  // pages restored from the back/forward cache start from the top as well
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => e.persisted && window.scrollTo(0, 0)
    window.addEventListener('pageshow', onShow)
    return () => window.removeEventListener('pageshow', onShow)
  }, [])
  return null
}

export default function App() {
  const lenis = useRef<LenisRef>(null)
  const entered = useAppStore((s) => s.entered)
  const scene = useAppStore((s) => s.scene)

  useLoadTracker()
  useScrollScenes(entered)

  // Lenis is driven by GSAP's ticker so ScrollTrigger and smooth scroll share one clock.
  useEffect(() => {
    const update = (time: number) => lenis.current?.lenis?.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <ReactLenis root ref={lenis} options={{ autoRaf: false, lerp: 0.09, anchors: { offset: -60 } }}>
      <LenisSync entered={entered} />
      <Suspense fallback={null}>
        <BackgroundScene />
      </Suspense>
      {/* data-active-scene, not data-scene: [data-scene] marks the page sections that drive the tour */}
      <div className="scrim" data-active-scene={scene} aria-hidden="true">
        <span className="scrim__left" />
        <span className="scrim__right" />
        <span className="scrim__full" />
        <span className="scrim__bottom" />
      </div>

      <Header />
      <main id="top" className="page">
        <Hero />
        <About />
        <WindowView />
        <Space />
        <Services />
        <Gallery />
        <Pricing />
        <Reviews />
      </main>
      <Footer />

      <Anna />
      <Preloader />
    </ReactLenis>
  )
}
