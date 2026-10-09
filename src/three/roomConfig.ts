/** Room dimensions in metres, matched to the photos: ~12×10 m hall (≈123 m² with the reception), 4.5 m ceiling. */
export const ROOM = { w: 12, d: 10, h: 4.5 } as const
export const HALF_W = ROOM.w / 2
export const HALF_D = ROOM.d / 2

/** Two arched windows 4 × 3.5 m on the back wall (z = -HALF_D). */
export const WINDOW = { w: 4, sill: 0.85, spring: 2.9, top: 4.35 } as const
export const WINDOW_X = [-3, 3] as const
export const WALL_T = 0.45

/** Anthracite column, half-embedded in the right wall next to the cabinet panels (photo 2). */
export const COLUMN = { x: 5.75, z: 1.4, size: 0.6 } as const

export const COLORS = {
  anthracite: '#2a2f33',
  frame: '#1c2125',
  plaster: '#ece4d6',
  navy: '#20363f',
  navy700: '#2c4a56',
  oak: '#c79a62',
  white: '#f3f1ec',
  sunset: '#ef9f5a',
} as const

/** Height of the arch at local x (centered on the window). */
export function archTop(x: number) {
  const rx = WINDOW.w / 2
  const ry = WINDOW.top - WINDOW.spring
  return WINDOW.spring + ry * Math.sqrt(Math.max(0, 1 - (x / rx) ** 2))
}
