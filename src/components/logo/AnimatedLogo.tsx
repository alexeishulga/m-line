import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { LogoIcon } from './LogoIcon'
import { Wordmark } from './Wordmark'
import styles from './AnimatedLogo.module.css'

interface Props {
  href?: string
  withWordmark?: boolean
  className?: string
}

/**
 * Header logo. On hover: a warm light runs along the arch, the window lights up like a sunrise,
 * 2 and 3 hop one after another and the wordmark ripples.
 */
export function AnimatedLogo({ href = '#top', withWordmark = true, className }: Props) {
  const root = useRef<HTMLAnchorElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const sheen = q('[data-part="sheen"]')[0] as unknown as SVGPathElement | undefined
      if (!sheen) return
      const len = sheen.getTotalLength()
      const seg = len * 0.22
      gsap.set(sheen, { strokeDasharray: `${seg} ${len}`, strokeDashoffset: seg, opacity: 1 })
      gsap.set(q('[data-part="light"]'), { scaleY: 0, opacity: 0, transformOrigin: '50% 100%' })

      tl.current = gsap
        .timeline({ paused: true })
        .to(sheen, { strokeDashoffset: -len, duration: 1.1, ease: 'power2.inOut' }, 0)
        .to(q('[data-part="light"]'), { scaleY: 1, opacity: 0.95, duration: 0.55, ease: 'power2.out' }, 0.05)
        .to(q('[data-part="light"]'), { opacity: 0, duration: 0.6, ease: 'power1.in' }, 0.75)
        .to(
          q('[data-part="two"], [data-part="three"]'),
          { y: -70, duration: 0.22, stagger: 0.09, ease: 'power2.out', yoyo: true, repeat: 1 },
          0.12,
        )
        .to(
          q('[data-part="glyph"]'),
          { yPercent: -14, duration: 0.2, stagger: 0.035, ease: 'sine.out', yoyo: true, repeat: 1 },
          0.15,
        )
    },
    { scope: root },
  )

  const play = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (tl.current && !tl.current.isActive()) tl.current.restart()
  }

  return (
    <a
      ref={root}
      href={href}
      className={`${styles.logo} ${className ?? ''}`}
      onMouseEnter={play}
      onFocus={play}
      aria-label="АРКА 123 — на главную"
    >
      <LogoIcon className={styles.icon} withLight withSheen />
      {withWordmark && <Wordmark className={styles.wordmark} />}
    </a>
  )
}
