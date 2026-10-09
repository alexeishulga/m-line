import { useEffect, useRef } from 'react'
import type * as THREE from 'three'
import gsap from 'gsap'
import { LAYOUT_ITEMS } from './layouts'
import { FurnitureItem } from './Furniture'
import type { LayoutId } from '../store/useAppStore'

const IDS = Object.keys(LAYOUT_ITEMS) as LayoutId[]

/**
 * All layouts are mounted once; switching animates the old furniture sinking into the floor
 * and the new one growing out of it, rippling from the windows towards the entrance.
 */
export function Furnishing({ active, instant }: { active: LayoutId; instant?: boolean }) {
  const refs = useRef<Record<string, (THREE.Group | null)[]>>({})
  const prev = useRef<LayoutId | null>(null)

  useEffect(() => {
    const from = prev.current
    prev.current = active
    const order = (id: LayoutId) =>
      (refs.current[id] ?? [])
        .map((g, i) => ({ g, i, d: LAYOUT_ITEMS[id][i].z * 0.6 - LAYOUT_ITEMS[id][i].x * 0.4 }))
        .filter((o): o is { g: THREE.Group; i: number; d: number } => !!o.g)
        .sort((a, b) => a.d - b.d)
        .map((o) => o.g)

    // first run: just set visibility
    if (from === null || instant) {
      for (const id of IDS) {
        for (const g of order(id)) {
          g.visible = id === active
          g.scale.setScalar(id === active ? 1 : 0.001)
        }
      }
      return
    }
    if (from === active) return

    const out = order(from)
    const inn = order(active)
    gsap.killTweensOf([...out, ...inn].map((g) => g.scale))
    if (out.length)
      gsap.to(
        out.map((g) => g.scale),
        {
          x: 0.001,
          y: 0.001,
          z: 0.001,
          duration: 0.35,
          ease: 'power2.in',
          stagger: { amount: 0.25 },
          onComplete: () => out.forEach((g) => (g.visible = false)),
        },
      )
    inn.forEach((g) => {
      g.visible = true
      g.scale.setScalar(0.001)
    })
    if (inn.length)
      gsap.to(
        inn.map((g) => g.scale),
        { x: 1, y: 1, z: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.3, stagger: { amount: 0.7 } },
      )
  }, [active, instant])

  return (
    <group>
      {IDS.map((id) => (
        <group key={id}>
          {LAYOUT_ITEMS[id].map((item, i) => (
            <FurnitureItem
              key={i}
              item={item}
              ref={(g) => {
                ;(refs.current[id] ??= [])[i] = g
              }}
            />
          ))}
        </group>
      ))}
    </group>
  )
}
