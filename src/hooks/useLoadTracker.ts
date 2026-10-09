import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

/**
 * Combines fonts, window load and the 3D scene into one 0…1 progress value for the preloader.
 * Three.js progress comes through the store so this hook doesn't pull the 3D bundle into the main chunk.
 */
export function useLoadTracker() {
  useEffect(() => {
    let fonts = 0
    let dom = document.readyState === 'complete' ? 1 : 0
    const update = () => {
      const { sceneReady, threeProgress, setLoadProgress } = useAppStore.getState()
      const scene = sceneReady ? 1 : threeProgress * 0.85
      setLoadProgress(0.15 * fonts + 0.15 * dom + 0.7 * scene)
    }
    document.fonts.ready.then(() => {
      fonts = 1
      update()
    })
    const onLoad = () => {
      dom = 1
      update()
    }
    window.addEventListener('load', onLoad)
    const unsubApp = useAppStore.subscribe((s, prev) => {
      if (s.sceneReady !== prev.sceneReady || s.threeProgress !== prev.threeProgress) update()
    })
    update()
    return () => {
      window.removeEventListener('load', onLoad)
      unsubApp()
    }
  }, [])
}
