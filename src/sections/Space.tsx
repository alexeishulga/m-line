import { LAYOUTS } from '../data/content'
import { useAppStore } from '../store/useAppStore'
import { useFinePointer } from '../hooks/useMediaQuery'
import styles from './Space.module.css'

const ICONS: Record<string, React.ReactNode> = {
  empty: <path d="M4 20V10a8 8 0 0 1 16 0v10Z" />,
  masterclass: (
    <>
      <path d="M3 4h18v10H3z" />
      <path d="M6 20h2M11 20h2M16 20h2M12 14v3" />
    </>
  ),
  boardroom: (
    <>
      <rect x="6" y="9" width="12" height="6" rx="1" />
      <path d="M8 6v1M12 6v1M16 6v1M8 17v1M12 17v1M16 17v1" />
    </>
  ),
  groups: (
    <>
      <circle cx="7" cy="8" r="3" />
      <circle cx="17" cy="8" r="3" />
      <circle cx="7" cy="17" r="3" />
      <circle cx="17" cy="17" r="3" />
    </>
  ),
}

/** The 3D room becomes interactive here: the visitor rotates it and switches furniture layouts. */
export function Space() {
  const chosen = useAppStore((s) => s.chosenLayout)
  const setChosen = useAppStore((s) => s.setChosenLayout)
  const fine = useFinePointer()

  return (
    <section id="space" data-scene="space" className={styles.space}>
      <div className={`container ${styles.inner}`}>
        <div className={`glass ${styles.head}`} data-reveal>
          <span className="eyebrow">Наше помещение</span>
          <h2>123 м² под любую задачу</h2>
          <p>
            Это 3D-модель зала в реальных пропорциях. {fine ? 'Потяните мышью, чтобы осмотреться,' : 'Выберите формат'} — и
            посмотрите, как зал выглядит пустым и под разные мероприятия.
          </p>
        </div>

        <div className={`glass ${styles.switcher}`} role="radiogroup" aria-label="Формат расстановки" data-reveal>
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={chosen === l.id}
              className={`${styles.option} ${chosen === l.id ? styles.selected : ''}`}
              onClick={() => setChosen(l.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
                <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[l.id]}
                </g>
              </svg>
              <span className={styles.optionText}>
                <b>{l.label}</b>
                <small>{l.capacity}</small>
                <span>{l.text}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
