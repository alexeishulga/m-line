/** Prepare SVG geometry elements for a stroke-dashoffset "draw" animation; returns their lengths. */
export function prepareDraw(els: Element[]): void {
  for (const el of els) {
    if (!(el instanceof SVGGeometryElement)) continue
    const len = el.getTotalLength()
    el.style.strokeDasharray = `${len} ${len}`
    el.style.strokeDashoffset = `${len}`
  }
}
