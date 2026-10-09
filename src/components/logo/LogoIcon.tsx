import { useId } from 'react'
import { ICON_PATHS, ICON_SHAPES, ICON_STROKE, ICON_VIEWBOX } from './iconGeometry'

/** Full arch outline (left leg → keystone → right leg) used for the hover sheen. */
const ARCH_RUN = 'M314.5 1027V594.5A310.5 310.5 0 0 1 935.5 594.5V1027'

interface Props {
  className?: string
  /** Hide shapes behind centerline masks so a timeline can "draw" them (preloader). */
  drawable?: boolean
  /** Warm "window light" layer inside the arch. */
  withLight?: boolean
  /** Light segment that runs along the arch on hover. */
  withSheen?: boolean
  title?: string
}

/**
 * АРКА 123 icon. Parts are tagged with data-part so timelines can target them:
 * frame / two / three (visible shapes), mk-* (mask strokes), light, sheen.
 */
export function LogoIcon({ className, drawable, withLight, withSheen, title = 'АРКА 123' }: Props) {
  const uid = useId().replace(/:/g, '')
  const id = (s: string) => `${uid}-${s}`
  const maskW = ICON_STROKE + 22

  return (
    <svg className={className} viewBox={ICON_VIEWBOX} role="img" aria-label={title} overflow="visible">
      <defs>
        <linearGradient id={id('light')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ef9f5a" />
          <stop offset="0.55" stopColor="#f7c98e" />
          <stop offset="1" stopColor="#fff3dc" />
        </linearGradient>
        <clipPath id={id('win')}>
          <path d={ICON_PATHS.window} />
        </clipPath>
        {drawable && (
          <>
            <mask id={id('m-frame')} maskUnits="userSpaceOnUse" x="250" y="220" width="760" height="850">
              <g fill="none" stroke="#fff" strokeWidth={maskW}>
                <path data-part="mk-base" d={ICON_PATHS.baseLeft} />
                <path data-part="mk-base" d={ICON_PATHS.baseRight} />
                <path data-part="mk-arch" d={ICON_PATHS.archLeft} />
                <path data-part="mk-arch" d={ICON_PATHS.archRight} />
                <path data-part="mk-one" d={ICON_PATHS.oneStem} />
              </g>
              <path data-part="mk-flag" d={ICON_PATHS.oneFlag} fill="#fff" stroke="#fff" strokeWidth="16" />
            </mask>
            <mask id={id('m-two')} maskUnits="userSpaceOnUse" x="250" y="220" width="760" height="850">
              <path data-part="mk-two" d={ICON_PATHS.two} fill="none" stroke="#fff" strokeWidth={maskW + 6} />
            </mask>
            <mask id={id('m-three')} maskUnits="userSpaceOnUse" x="250" y="220" width="760" height="850">
              <path data-part="mk-three" d={ICON_PATHS.three} fill="none" stroke="#fff" strokeWidth={maskW + 22} />
            </mask>
          </>
        )}
      </defs>

      {withLight && (
        <g clipPath={`url(#${id('win')})`}>
          <rect data-part="light" x="330" y="300" width="590" height="690" fill={`url(#${id('light')})`} />
        </g>
      )}

      <g fill="currentColor">
        <path data-part="frame" d={ICON_SHAPES.frame} fillRule="evenodd" mask={drawable ? `url(#${id('m-frame')})` : undefined} />
        <path data-part="two" d={ICON_SHAPES.two} mask={drawable ? `url(#${id('m-two')})` : undefined} />
        <path data-part="three" d={ICON_SHAPES.three} mask={drawable ? `url(#${id('m-three')})` : undefined} />
      </g>

      {withSheen && (
        <path
          data-part="sheen"
          d={ARCH_RUN}
          fill="none"
          stroke="#f7c98e"
          strokeWidth={ICON_STROKE}
          opacity="0"
          style={{ mixBlendMode: 'screen' }}
        />
      )}
    </svg>
  )
}
