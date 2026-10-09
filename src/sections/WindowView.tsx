import styles from './WindowView.module.css'
import { asset } from '../lib/asset'

/** The camera turns to the arched windows here; the copy stays compact so the 3D view stays visible. */
export function WindowView() {
  return (
    <section id="windows" data-scene="windows" className={`section ${styles.windows}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="eyebrow" data-reveal>
            Вид из окна
          </span>
          <h2 className={styles.title} data-reveal>
            Два окна <span>4 × 3,5 м</span> и&nbsp;Библиотека в&nbsp;каждом кадре
          </h2>
          <p className={styles.text} data-reveal>
            Огромные арочные окна дают ровный дневной свет без бликов на экране, а Национальная библиотека напротив
            становится частью вашего мероприятия — и лучшим ориентиром для гостей.
          </p>
          <div className={styles.photos} data-reveal>
            <img src={asset('/img/interior/7-sm.webp')} alt="Вид из арочного окна на Национальную библиотеку" loading="lazy" />
            <img src={asset('/img/interior/8-sm.webp')} alt="Вид на променад и фонтан" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}
