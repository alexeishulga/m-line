import { useState, type FormEvent } from 'react'
import { LogoIcon } from '../components/logo/LogoIcon'
import { Wordmark } from '../components/logo/Wordmark'
import { BRAND, CONTACTS, LAYOUTS, NAV } from '../data/content'
import styles from './Footer.module.css'

export function Footer() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const body = [
      `Имя: ${f.get('name')}`,
      `Телефон: ${f.get('phone')}`,
      `Дата: ${f.get('date') || 'уточню'}`,
      `Формат: ${f.get('format')}`,
      `Комментарий: ${f.get('message') || '—'}`,
    ].join('\n')
    // No backend yet: hand the request over to the visitor's mail client.
    window.location.href = `mailto:${CONTACTS.email}?subject=${encodeURIComponent('Бронирование АРКА 123')}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <footer id="contacts" data-scene="footer" className={`site-footer ${styles.footer}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.booking} data-reveal>
          <span className={`eyebrow ${styles.eyebrow}`}>Бронирование</span>
          <h2 className={styles.title}>{BRAND.slogan}</h2>
          <p className={styles.lead}>Оставьте заявку — Анна перезвонит в течение 15 минут, подтвердит дату и подготовит зал.</p>

          <form className={styles.form} onSubmit={onSubmit}>
            <label>
              <span>Имя</span>
              <input name="name" required autoComplete="name" placeholder="Как к вам обращаться" />
            </label>
            <label>
              <span>Телефон</span>
              <input name="phone" type="tel" required autoComplete="tel" placeholder="+375 (__) ___-__-__" />
            </label>
            <label>
              <span>Дата</span>
              <input name="date" type="date" />
            </label>
            <label>
              <span>Формат</span>
              <select name="format" defaultValue="Мастер-класс">
                {LAYOUTS.map((l) => (
                  <option key={l.id}>{l.label}</option>
                ))}
                <option>Фото / видеосъёмка</option>
              </select>
            </label>
            <label className={styles.wide}>
              <span>Комментарий</span>
              <textarea name="message" rows={3} placeholder="Сколько гостей, нужен ли кофе-брейк…" />
            </label>
            <button type="submit" className="btn btn--light">
              {sent ? 'Открываем почту…' : 'Отправить заявку'}
            </button>
          </form>
        </div>

        <div className={styles.contacts} data-reveal>
          <a className={styles.phone} href={CONTACTS.phoneHref}>
            {CONTACTS.phone}
          </a>
          <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
          <p>
            {CONTACTS.address}
            <br />
            <small>{CONTACTS.addressNote}</small>
          </p>
          <p>
            <small>{CONTACTS.hours}</small>
          </p>
          <div className={styles.socials}>
            <a href={CONTACTS.telegramHref} target="_blank" rel="noreferrer">
              Telegram
            </a>
            <a href={CONTACTS.instagramHref} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={CONTACTS.mapHref} target="_blank" rel="noreferrer">
              Как добраться
            </a>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <a href="#top" className={styles.brand} aria-label="АРКА 123 — наверх">
          <LogoIcon className={styles.brandIcon} />
          <Wordmark className={styles.brandWordmark} />
        </a>
        <nav className={styles.links} aria-label="Разделы">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`}>
              {n.label}
            </a>
          ))}
        </nav>
        <small>© {new Date().getFullYear()} АРКА 123</small>
      </div>
    </footer>
  )
}
