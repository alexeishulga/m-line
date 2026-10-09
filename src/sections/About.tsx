import { ABOUT } from '../data/content'
import styles from './About.module.css'
import { asset } from '../lib/asset'

export function About() {
  return (
    <section id="about" data-scene="about" className={`section ${styles.about}`}>
      <div className={`container ${styles.inner}`}>
        <div className={`glass ${styles.panel}`} data-reveal>
          <span className="eyebrow">Об АРКА 123</span>
          <h2 className={styles.title}>{ABOUT.title}</h2>
          {ABOUT.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className={styles.text}>
              {p}
            </p>
          ))}
          <figure className={styles.figure}>
            <img src={asset('/img/interior/19-sm.webp')} alt="Арка между двумя башнями дома АРКА 123" loading="lazy" width="800" height="450" />
            <figcaption>Арка между башнями — с променада через неё видно Библиотеку</figcaption>
          </figure>
          <ul className={styles.facts}>
            {ABOUT.facts.map((f) => (
              <li key={f.title}>
                <b>{f.title}</b>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
