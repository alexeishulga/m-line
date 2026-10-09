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
                <path d="M12 3a9 9 0 1 0 9 9M12 3c2.5 2.4 3.8 5.4 3.8 9M12 3C9.5 5.4 8.2 8.4 8.2 12s1.3 6.6 3.8 9M3.5 9h17M3.5 15H14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
