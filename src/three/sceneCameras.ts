import type { SceneId } from '../store/useAppStore'
import type { CameraPose } from './layouts'

/**
 * Camera keyframes of the scroll tour. Anna's lines in each scene refer to what the camera shows:
 * entrance → ceiling → arched windows with the Library → overview → slow walk-around → back to the window.
 */
export const SCENE_CAMERA: Record<SceneId, CameraPose> = {
  hero: { pos: [4.9, 1.7, 4.3], target: [-1.6, 1.9, -3.6] },
  about: { pos: [3.6, 2.4, 3.9], target: [-1.2, 3.9, -1.6] },
  windows: { pos: [-1.4, 1.75, -0.6], target: [-3.0, 2.45, -5.0] },
  space: { pos: [4.7, 2.7, 3.9], target: [-2.6, 1.0, -0.6] },
  services: { pos: [4.6, 2.2, 1.2], target: [-3.5, 1.3, -0.2] },
  gallery: { pos: [-4.6, 3.3, 3.8], target: [1.5, 0.8, -1.8] },
  pricing: { pos: [-4.8, 2.0, -3.4], target: [3.0, 1.0, 1.6] },
  reviews: { pos: [0.5, 3.6, 4.4], target: [-0.5, 0.6, -1.5] },
  footer: { pos: [1.4, 1.7, 0.6], target: [-3.0, 2.5, -5.0] },
}
