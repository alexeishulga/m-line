import * as THREE from 'three'

/** Deterministic PRNG so procedural textures look the same on every load. */
function rng(seed: number) {
  let s = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) >>> 0
  s = Math.imul(s ^ (s >>> 13), 0xc2b2ae35) >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')!] as const
}

function finish(c: HTMLCanvasElement, repeat?: [number, number], srgb = true) {
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(...repeat)
  }
  return t
}

/**
 * Herringbone oak parquet. Planks are W×L with L = 6W; the pattern is periodic over 2L,
 * so the 1024px canvas tiles seamlessly. Rotated 45° so the "arrows" run towards the windows.
 */
export function makeHerringbone(repeat: [number, number]) {
  const size = 1024
  const [c, g] = canvas(size, size)
  const L = size / 2
  const W = L / 6
  g.fillStyle = '#b98a55'
  g.fillRect(0, 0, size, size)
  const mod = (v: number) => ((Math.round(v) % size) + size) % size

  // Each plank's look is seeded by its position modulo the tile, so wrapped copies match exactly.
  const plank = (x: number, y: number, w: number, h: number, seedX: number, seedY: number) => {
    if (x > size || y > size || x + w < 0 || y + h < 0) return
    const rand = rng(mod(seedX) * 7919 + mod(seedY) * 104729 + (w > h ? 1 : 2))
    const light = 52 + rand() * 12
    const sat = 38 + rand() * 12
    const hue = 30 + rand() * 6
    g.fillStyle = `hsl(${hue} ${sat}% ${light}%)`
    g.fillRect(x, y, w, h)
    // wood grain along the plank
    const horizontal = w > h
    g.save()
    g.beginPath()
    g.rect(x, y, w, h)
    g.clip()
    for (let i = 0; i < 9; i++) {
      g.strokeStyle = `rgba(${90 + rand() * 40}, ${55 + rand() * 25}, 25, ${0.05 + rand() * 0.08})`
      g.lineWidth = 0.8 + rand() * 1.6
      g.beginPath()
      if (horizontal) {
        const yy = y + rand() * h
        g.moveTo(x, yy)
        g.bezierCurveTo(x + w * 0.3, yy + (rand() - 0.5) * 6, x + w * 0.7, yy + (rand() - 0.5) * 6, x + w, yy)
      } else {
        const xx = x + rand() * w
        g.moveTo(xx, y)
        g.bezierCurveTo(xx + (rand() - 0.5) * 6, y + h * 0.3, xx + (rand() - 0.5) * 6, y + h * 0.7, xx, y + h)
      }
      g.stroke()
    }
    g.restore()
    g.strokeStyle = 'rgba(70, 45, 20, 0.45)'
    g.lineWidth = 2
    g.strokeRect(x + 1, y + 1, w - 2, h - 2)
  }

  // Wrap every plank at ±size so the texture is seamless.
  for (let k = -8; k <= 8; k++) {
    for (let i = -24; i <= 24; i++) {
      const x0 = i * W + k * L
      const y0 = i * W - k * L
      for (const dx of [-size, 0, size]) {
        for (const dy of [-size, 0, size]) {
          plank(x0 + dx, y0 + dy, L, W, x0, y0)
          plank(x0 + dx, y0 + W + dy, W, L, x0, y0 + W)
        }
      }
    }
  }
  const t = finish(c, repeat)
  t.center.set(0.5, 0.5)
  t.rotation = Math.PI / 4
  return t
}

/** Warm decorative plaster with soft clouds. */
export function makePlaster(repeat: [number, number], base = '#ece4d6') {
  const size = 512
  const [c, g] = canvas(size, size)
  const rand = rng(7)
  g.fillStyle = base
  g.fillRect(0, 0, size, size)
  for (let i = 0; i < 260; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 10 + rand() * 60
    const light = rand() > 0.5
    const grad = g.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, light ? 'rgba(255,255,255,0.08)' : 'rgba(120,95,60,0.035)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grad
    // draw 4 times to wrap
    for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) g.fillRect(x - r + dx, y - r + dy, r * 2, r * 2)
  }
  return finish(c, repeat)
}

/** White flush cabinet panels with asymmetric seams (right wall, as on photos 2 and 12). */
export function makePanels() {
  const [c, g] = canvas(1024, 384)
  g.fillStyle = '#f1f0ec'
  g.fillRect(0, 0, 1024, 384)
  g.strokeStyle = 'rgba(40,40,40,0.55)'
  g.lineWidth = 2
  const cols = [0, 150, 270, 430, 560, 700, 820, 1024]
  cols.forEach((x) => {
    g.beginPath()
    g.moveTo(x, 0)
    g.lineTo(x, 384)
    g.stroke()
  })
  const rows: [number, number, number][] = [
    [0, 150, 130],
    [150, 270, 230],
    [270, 430, 90],
    [430, 560, 260],
    [560, 700, 170],
    [700, 820, 300],
    [820, 1024, 140],
  ]
  rows.forEach(([a, b, y]) => {
    g.beginPath()
    g.moveTo(a, y)
    g.lineTo(b, y)
    g.stroke()
  })
  // two dark recessed handles/sockets
  g.fillStyle = '#2a2e31'
  g.fillRect(186, 196, 26, 10)
  g.fillRect(186, 214, 26, 10)
  return finish(c)
}

/** Ribbed radiator. */
export function makeRibs() {
  const [c, g] = canvas(256, 64)
  for (let x = 0; x < 256; x += 8) {
    g.fillStyle = '#2b2f32'
    g.fillRect(x, 0, 5, 64)
    g.fillStyle = '#1b1e20'
    g.fillRect(x + 5, 0, 3, 64)
  }
  return finish(c)
}

/** Slide on the projector screen. */
export function makeSlide() {
  const [c, g] = canvas(1280, 720)
  const grad = g.createLinearGradient(0, 0, 1280, 720)
  grad.addColorStop(0, '#20363f')
  grad.addColorStop(1, '#2c4a56')
  g.fillStyle = grad
  g.fillRect(0, 0, 1280, 720)
  // arch motif
  g.strokeStyle = 'rgba(247, 201, 142, 0.9)'
  g.lineWidth = 18
  g.beginPath()
  g.moveTo(940, 600)
  g.lineTo(940, 330)
  g.arc(1060, 330, 120, Math.PI, 0)
  g.lineTo(1180, 600)
  g.closePath()
  g.stroke()
  g.fillStyle = '#fbf8f3'
  g.font = '800 92px Manrope, sans-serif'
  g.fillText('Мастер-класс', 90, 300)
  g.font = '500 44px Inter, sans-serif'
  g.fillStyle = 'rgba(251, 248, 243, 0.75)'
  g.fillText('Встречаемся напротив Библиотеки', 92, 380)
  g.fillStyle = '#ef9f5a'
  g.fillRect(92, 440, 120, 8)
  g.font = '800 40px Manrope, sans-serif'
  g.fillStyle = '#fbf8f3'
  g.fillText('АРКА 123', 92, 610)
  return finish(c)
}
