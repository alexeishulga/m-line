import type { LayoutId } from '../store/useAppStore'

export type ItemKind = 'chair' | 'table' | 'roundTable' | 'screen' | 'projector' | 'flipchart' | 'lectern'

export interface Item {
  kind: ItemKind
  x: number
  z: number
  /** rotation around Y, radians; chairs face +Z at 0 */
  r?: number
  /** table size [w, d] */
  size?: [number, number]
}

export interface CameraPose {
  pos: [number, number, number]
  target: [number, number, number]
}

const FACE_MINUS_X = -Math.PI / 2

function masterclass(): Item[] {
  const items: Item[] = [
    { kind: 'screen', x: -5.93, z: 0 },
    { kind: 'projector', x: 0.6, z: 0 },
    { kind: 'lectern', x: -4.6, z: -1.9, r: Math.PI / 2 - 0.5 },
    { kind: 'flipchart', x: -4.7, z: 2.5, r: Math.PI / 2 + 0.6 },
  ]
  const zs = [-2.8, -2.1, -1.4, -0.7, 0.7, 1.4, 2.1, 2.8]
  for (const x of [-2.6, -1.6, -0.6, 0.4, 1.4]) for (const z of zs) items.push({ kind: 'chair', x, z, r: FACE_MINUS_X })
  return items
}

function boardroom(): Item[] {
  const items: Item[] = [{ kind: 'table', x: -0.5, z: 0, size: [7.4, 1.5] }]
  for (let i = 0; i < 9; i++) {
    const x = -3.7 + i * 0.8
    items.push({ kind: 'chair', x, z: -1.12, r: 0 })
    items.push({ kind: 'chair', x, z: 1.12, r: Math.PI })
  }
  items.push({ kind: 'chair', x: -4.65, z: 0, r: Math.PI / 2 })
  items.push({ kind: 'chair', x: 3.65, z: 0, r: -Math.PI / 2 })
  return items
}

function groups(): Item[] {
  const items: Item[] = [{ kind: 'flipchart', x: -5.2, z: -0.2, r: Math.PI / 2 }]
  for (const x of [-3.6, -0.8, 2.0]) {
    for (const z of [-2.3, 1.5]) {
      items.push({ kind: 'roundTable', x, z })
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2 + 0.3
        // chair at angle a around the table, facing its centre
        items.push({ kind: 'chair', x: x + Math.sin(a) * 1.0, z: z + Math.cos(a) * 1.0, r: a + Math.PI })
      }
    }
  }
  return items
}

export const LAYOUT_ITEMS: Record<LayoutId, Item[]> = {
  empty: [],
  masterclass: masterclass(),
  boardroom: boardroom(),
  groups: groups(),
}

/** Best viewpoint for each layout in the interactive "Наше помещение" mode. */
export const LAYOUT_CAMERA: Record<LayoutId, CameraPose> = {
  empty: { pos: [5.0, 2.0, 4.3], target: [-1.6, 1.7, -2.6] },
  masterclass: { pos: [4.7, 2.7, 3.9], target: [-2.6, 1.0, -0.6] },
  boardroom: { pos: [4.3, 3.5, 4.3], target: [-0.9, 0.5, -0.2] },
  groups: { pos: [4.6, 4.0, 4.4], target: [-0.9, 0.3, -0.3] },
}
