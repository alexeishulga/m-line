/** Pivot points of AnnaSvg (SVG user units) used by Anna.tsx. Right-side parts are a mirrored copy of the left ones. */
export const PIVOTS = {
  shoulder: '108 212',
  elbow: '102 330',
  wrist: '101.5 428',
  hipL: '138 436',
  hipR: '182 436',
  neck: '160 182',
  eyes: '160 113',
  body: '160 830',
} as const

/**
 * Joint angles in degrees. For both arms a positive angle moves the limb OUTWARDS (away from the body):
 * the right arm is a mirrored copy of the left one, so the same numbers work for both sides.
 */
export interface Pose {
  upperL: number
  foreL: number
  handL: number
  upperR: number
  foreR: number
  handR: number
  head: number
  lean: number
  pointL?: boolean
  pointR?: boolean
  tablet?: boolean
  /** forearm oscillation (waving) */
  waveR?: boolean
  waveL?: boolean
}

const base: Pose = { upperL: 7, foreL: -6, handL: 0, upperR: 7, foreR: -6, handR: 0, head: 0, lean: 0 }

export const POSES = {
  idle: base,
  wave: { ...base, upperR: 152, foreR: 22, handR: 6, head: 4, waveR: true },
  pointUp: { ...base, upperR: 168, foreR: 6, handR: 0, head: -5, pointR: true },
  presentLeft: { ...base, upperL: 98, foreL: -6, handL: -4, upperR: 10, foreR: -28, head: -6, lean: -1.5, pointL: true },
  presentRight: { ...base, upperR: 98, foreR: -6, handR: -4, upperL: 10, foreL: -28, head: 6, lean: 1.5, pointR: true },
  invite: { ...base, upperL: 24, foreL: 40, handL: 12, upperR: 24, foreR: 40, handR: 12, head: 3 },
  tablet: { ...base, upperR: 4, foreR: -98, handR: -6, upperL: 5, foreL: -64, handL: -10, head: 7, tablet: true },
  bye: { ...base, upperL: 150, foreL: 22, handL: 6, head: -4, waveL: true },
} satisfies Record<string, Pose>

export type PoseName = keyof typeof POSES
