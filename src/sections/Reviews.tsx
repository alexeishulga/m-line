import { useCallback, useEffect, useRef, useState } from 'react'
import { REVIEWS } from '../data/content'
import styles from './Reviews.module.css'

export function Reviews() {
  const [index, setIndex] = useState(0)
  const track = useRef<HTMLDivElement>(null)
  const paused = useRef(false)

  const go = useCallback((i: number) => {
    const n = REVIEWS.length
    const next = ((i % n) + n) % n
    setIndex(next)
    const el = track.current?.children[next] as HTMLElement | undefined
    if (el && track.current) track.current.scrollTo({ left: el.offsetLeft - track.current.offsetLeft, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const t = window.setInterval(() => !paused.current && go(index + 1), 6500)
    return () => window.clearInterval(t)
  }, [index, go])

  return (
    <section id="reviews" data-scene="reviews" className="section">
      <div className="container">
        <div className={styles.head}>
          <div className="section-head" data-reveal>
            <span className="eyebrow">Отзывы</span>
            <h2>Что говорят гости</h2>
          </div>
          <div className={styles.arrows} data-reveal>
            <button type="button" onClick={() => go(index - 1)} aria-label="Предыдущий отзыв">
              ←
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Следующий отзыв">
              →
            </button>
          </div>
        </div>
        <div
          ref={track}
          className={styles.track}
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
          data-lenis-prevent-horizontal
        >
          {REVIEWS.map((r, i) => (
            <figure key={r.name} className={`glass ${styles.card} ${i === index ? styles.current : ''}`} data-reveal>
              <svg viewBox="0 0 40 46" className={styles.quote} aria-hidden="true">
                <path d="M4 44V20a16 16 0 0 1 32 0v24" fill="none" stroke="currentColor" strokeWidth="4" />
                <text x="20" y="38" textAnchor="middle" fontSize="22" fontWeight="800" fill="currentColor">
                  ”
                </text>
              </svg>
              <blockquote>{r.text}</blockquote>
              <figcaption>
                <span className={styles.avatar}>{r.name[0]}</span>
                <span>
                  <b>{r.name}</b>
                  {r.role}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className={styles.dots}>
          {REVIEWS.map((r, i) => (
            <button key={r.name} type="button" aria-label={`Отзыв ${i + 1}`} aria-current={i === index} onClick={() => go(i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
