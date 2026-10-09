import { useId } from 'react'
import { WORDMARK_GLYPHS, WORDMARK_HEIGHT, WORDMARK_WIDTH } from './wordmarkPaths'

interface Props {
  className?: string
}

/** "АРКА 123" wordmark; each glyph is a separate path (data-part="glyph") inside a clip window. */
export function Wordmark({ className }: Props) {
  const clip = `${useId().replace(/:/g, '')}-wm`
  return (
    <svg className={className} viewBox={`0 0 ${WORDMARK_WIDTH} ${WORDMARK_HEIGHT}`} role="img" aria-label="АРКА 123">
      <defs>
        <clipPath id={clip}>
          <rect x="-20" y="-40" width={WORDMARK_WIDTH + 40} height={WORDMARK_HEIGHT + 40} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`} fill="currentColor">
        {WORDMARK_GLYPHS.map((g) => (
          <path key={g.char} data-part="glyph" d={g.d} fillRule="evenodd" />
        ))}
      </g>
    </svg>
  )
}
