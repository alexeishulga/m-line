import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { STATS } from '../data/content'
import { useAppStore } from '../store/useAppStore'
import styles from './Hero.module.css'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const entered = useAppStore((s) => s.entered)

  useGSAP(
    () => {
      if (!entered) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.to(root.current!.querySelectorAll('[data-hero]'), {
        opacity: 1,
        y: 0,
        duration: reduced ? 0.01 : 1.1,
        ease: 'power4.out',
        stagger: 0.09,
        delay: reduced ? 0 : 0.35,
      })
    },
    { scope: root, dependencies: [entered] },
  )

  return (
    <section ref={root} id="hero" data-scene="hero" className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="eyebrow" data-hero>
            Пространство для мастер-классов и семинаров
          </span>
          <h1 className={styles.title}>
            <span data-hero>Встречаемся</span>
            <span data-hero>
              напротив <em>Библиотеки</em>
            </span>
          </h1>
          <p className={styles.lead} data-hero>
            123 м² света, потолки 4,5 метра и два арочных окна с видом на Национальную библиотеку. Сдаём зал по
            часам под мастер-классы, лекции, тренинги и съёмки.
          </p>
          <div className={styles.actions} data-hero>
            <a href="#contacts" className="btn">
              Забронировать дату
            </a>
            <a href="#space" className="btn btn--ghost">
              Зал в 3D
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" />
                  <ellipse cx="12" cy="12" rx="4" ry="9" />
                  <path d="M3 12h18M4.6 7h14.8M4.6 17h14.8" />
                </g>
              </svg>
            </a>
          </div>
        </div>
        <ul className={styles.stats} data-hero>
          {STATS.map((s) => (
            <li key={s.label}>
              <b>
                {s.value}
                <small>{s.unit}</small>
              </b>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <a href="#about" className={styles.scrollHint} data-hero aria-label="Листайте вниз">
        <span />
        Листайте — Анна проведёт экскурсию
      </a>
    </section>
  )
}
