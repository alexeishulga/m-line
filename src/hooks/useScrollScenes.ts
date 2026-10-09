import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppStore, type SceneId } from '../store/useAppStore'

gsap.registerPlugin(ScrollTrigger)

/** Marks the section crossing the middle of the viewport as the current scene and reveals [data-reveal] blocks. */
export function useScrollScenes(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const setScene = useAppStore.getState().setScene
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('[data-scene]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setScene(el.dataset.scene as SceneId),
        })
      })
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.9,
            ease: 'power3.out',
            stagger: reduced ? 0 : 0.08,
            overwrite: true,
          }),
      })
    })
    ScrollTrigger.refresh()
    // lazy images and fonts change the page height: re-measure trigger positions
    let t = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(t)
      t = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    ro.observe(document.body)
    return () => {
      ro.disconnect()
      window.clearTimeout(t)
      ctx.revert()
    }
  }, [enabled])
}
