import { create } from 'zustand'

export type SceneId =
  | 'hero'
  | 'about'
  | 'windows'
  | 'space'
  | 'services'
  | 'gallery'
  | 'pricing'
  | 'reviews'
  | 'footer'

export type LayoutId = 'empty' | 'masterclass' | 'boardroom' | 'groups'

interface AppState {
  /** The arch-shaped hole of the preloader has started to open: the 3D room becomes visible. */
  revealing: boolean
  /** Preloader finished and the arch has opened. */
  entered: boolean
  /** 0…1 combined loading progress (fonts, textures, 3D scene). */
  loadProgress: number
  /** 3D scene has rendered its first frame. */
  sceneReady: boolean
  /** 0…1 progress of 3D assets (textures), reported from inside the lazy 3D chunk. */
  threeProgress: number
  /** Section currently in the middle of the viewport. */
  scene: SceneId
  /** Furniture layout the visitor picked in the "Наше помещение" section. */
  chosenLayout: LayoutId
  setRevealing: () => void
  setEntered: (v: boolean) => void
  setSceneReady: () => void
  setThreeProgress: (v: number) => void
  setLoadProgress: (v: number) => void
  setScene: (s: SceneId) => void
  setChosenLayout: (l: LayoutId) => void
}

export const useAppStore = create<AppState>((set) => ({
  revealing: false,
  entered: false,
  loadProgress: 0,
  sceneReady: false,
  threeProgress: 0,
  scene: 'hero',
  chosenLayout: 'masterclass',
  setRevealing: () => set((s) => (s.revealing ? s : { revealing: true })),
  setEntered: (entered) => set((s) => (s.entered === entered ? s : { entered, revealing: s.revealing || entered })),
  setSceneReady: () => set((s) => (s.sceneReady ? s : { sceneReady: true })),
  setThreeProgress: (v) => set((s) => (v > s.threeProgress ? { threeProgress: v } : s)),
  setLoadProgress: (v) =>
    set((s) => ((v >= 1 && s.loadProgress < 1) || v > s.loadProgress + 0.005 ? { loadProgress: Math.min(1, v) } : s)),
  setScene: (scene) => set((s) => (s.scene === scene ? s : { scene })),
  setChosenLayout: (chosenLayout) => set({ chosenLayout }),
}))

/** Layout shown in the 3D room for each scroll scene ("space" uses the visitor's choice). */
export const SCENE_LAYOUT: Record<SceneId, LayoutId | 'chosen'> = {
  hero: 'empty',
  about: 'empty',
  windows: 'empty',
  space: 'chosen',
  services: 'masterclass',
  gallery: 'groups',
  pricing: 'boardroom',
  reviews: 'groups',
  footer: 'empty',
}

export const useActiveLayout = (): LayoutId =>
  useAppStore((s) => {
    const l = SCENE_LAYOUT[s.scene]
    return l === 'chosen' ? s.chosenLayout : l
  })
