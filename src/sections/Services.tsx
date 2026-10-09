import { EXTRAS, SERVICES } from '../data/content'
import styles from './Services.module.css'

const ICONS: Record<string, React.ReactNode> = {
  brush: <path d="M14 4l6 6-8.5 8.5a3 3 0 0 1-4.2 0l-1.8-1.8a3 3 0 0 1 0-4.2zM4 20c1.5 0 3-.5 3-2" />,
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3 3 0 0 1 0 6M18 14c2 .7 3 2.8 3 6" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
}

export function Services() {
  return (
    <section id="services" data-scene="services" className="section">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Наши услуги и цены</span>
          <h2>Под что сдаём зал</h2>
          <p>Аренда всего зала целиком: никаких соседей за перегородкой. Мебель расставим под ваш формат до прихода гостей.</p>
        </div>
        <div className={styles.grid}>
          {SERVICES.map((s) => (
            <article key={s.title} className={`glass ${styles.card}`} data-reveal>
              <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
                <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[s.icon]}
                </g>
              </svg>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <span className={styles.price}>{s.price}</span>
            </article>
          ))}
        </div>
        <div className={`glass ${styles.extras}`} data-reveal>
          <h3>Дополнительно</h3>
          <ul>
            {EXTRAS.map((e) => (
              <li key={e.title}>
                <span>{e.title}</span>
                <i aria-hidden="true" />
                <b className={e.price === 'включено' || e.price === 'бесплатно' ? styles.free : undefined}>{e.price}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
