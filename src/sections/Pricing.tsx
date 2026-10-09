import { TARIFFS } from '../data/content'
import styles from './Pricing.module.css'

export function Pricing() {
  return (
    <section id="pricing" data-scene="pricing" className="section">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Тарифы и услуги</span>
          <h2>Платите за время, а не за метры</h2>
          <p>Цены за весь зал, независимо от числа гостей. Проектор, экран, флипчарт и Wi-Fi входят в любой тариф.</p>
        </div>
        <div className={styles.grid}>
          {TARIFFS.map((t) => (
            <article key={t.name} className={`${styles.card} ${t.featured ? styles.featured : ''}`} data-reveal>
              {t.featured && <span className={styles.badge}>Выбирают чаще</span>}
              <h3>{t.name}</h3>
              <p className={styles.price}>
                <b>{t.price}</b>
                <span>{t.unit}</span>
              </p>
              <p className={styles.note}>{t.note}</p>
              <ul>
                {t.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a href="#contacts" className={`btn ${t.featured ? 'btn--light' : 'btn--ghost'}`}>
                Забронировать
              </a>
            </article>
          ))}
        </div>
        <p className={styles.footnote} data-reveal>
          Цены указаны для примера и будут уточнены. Скидка 10% на будни до 12:00 и для постоянных резидентов.
        </p>
      </div>
    </section>
  )
}
