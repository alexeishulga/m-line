import { useCallback, useEffect, useState } from 'react'
import { GALLERY } from '../data/content'
import styles from './Gallery.module.css'

const small = (src: string) => src.replace('.webp', '-sm.webp')

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null)
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + GALLERY.length) % GALLERY.length)), [])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go])

  return (
    <section id="gallery" data-scene="gallery" className="section">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Фотогалерея</span>
          <h2>Зал, вид и дорога к нам</h2>
          <p>Обработанные фото без постановки: зал, окна, холл и путь от Национальной библиотеки до нашей арки.</p>
        </div>
        <div className={styles.masonry}>
          {GALLERY.map((p, i) => (
            <button key={p.src} type="button" className={styles.item} onClick={() => setOpen(i)} data-reveal>
              <img
                src={small(p.src)}
                alt={p.alt}
                loading="lazy"
                decoding="async"
                width={p.wide ? 800 : 450}
                height={p.wide ? 450 : 800}
              />
              <span className={styles.caption}>{p.alt}</span>
            </button>
          ))}
        </div>
      </div>

      {open !== null && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={GALLERY[open].alt} onClick={() => setOpen(null)}>
          <img src={GALLERY[open].src} alt={GALLERY[open].alt} onClick={(e) => e.stopPropagation()} />
          <p className={styles.lbCaption}>
            {GALLERY[open].alt}
            <span>
              {open + 1} / {GALLERY.length}
            </span>
          </p>
          <button type="button" className={`${styles.nav} ${styles.prev}`} aria-label="Предыдущее фото" onClick={(e) => (e.stopPropagation(), go(-1))}>
            ‹
          </button>
          <button type="button" className={`${styles.nav} ${styles.next}`} aria-label="Следующее фото" onClick={(e) => (e.stopPropagation(), go(1))}>
            ›
          </button>
          <button type="button" className={styles.close} aria-label="Закрыть" onClick={() => setOpen(null)}>
            ×
          </button>
        </div>
      )}
    </section>
  )
}
