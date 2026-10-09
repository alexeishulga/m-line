import { useEffect, useState } from 'react'
import { AnimatedLogo } from '../components/logo/AnimatedLogo'
import { NAV } from '../data/content'
import { useAppStore } from '../store/useAppStore'
import styles from './Header.module.css'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const scene = useAppStore((s) => s.scene)
  const entered = useAppStore((s) => s.entered)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${entered ? styles.visible : ''}`}>
      <div className={styles.inner}>
        <AnimatedLogo />
        <nav className={`${styles.nav} ${open ? styles.open : ''}`} aria-label="Основная навигация">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={scene === n.id ? styles.active : undefined}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </a>
          ))}
          <a href="#contacts" className={`btn ${styles.mobileCta}`} onClick={() => setOpen(false)}>
            Забронировать
          </a>
        </nav>
        <a href="#contacts" className={`btn ${styles.cta}`}>
          Забронировать
        </a>
        <button
          type="button"
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
