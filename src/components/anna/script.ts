import type { SceneId } from '../../store/useAppStore'
import type { PoseName } from './poses'

export type Spot = 'left' | 'right' | 'corner'

/** Anna's tour script: where she stands, what she does and says in each section. */
export const ANNA_SCRIPT: Record<SceneId, { spot: Spot; pose: PoseName; line: string; autoHide?: boolean }> = {
  hero: { spot: 'right', pose: 'wave', line: 'Здравствуйте! Я Анна. Добро пожаловать в АРКА 123 — давайте покажу пространство.' },
  about: { spot: 'left', pose: 'pointUp', line: 'Потолки 4,5 метра и 33 светильника — здесь легко дышится и всё хорошо видно.' },
  windows: { spot: 'right', pose: 'presentLeft', line: 'А это наш главный секрет: два окна 4 × 3,5 м и Национальная библиотека напротив.' },
  space: { spot: 'left', pose: 'invite', line: 'Выберите формат — я расставлю мебель. А зал можно осмотреть со всех сторон.' },
  services: { spot: 'corner', pose: 'tablet', line: 'Проектор, флипчарт и Wi-Fi уже включены в аренду.' },
  gallery: { spot: 'corner', pose: 'presentLeft', line: 'Это настоящие фото — без постановки.' },
  pricing: { spot: 'corner', pose: 'tablet', line: 'Чаще всего берут «Полдня» — 4 часа с подготовкой.' },
  reviews: { spot: 'corner', pose: 'invite', line: 'Наши гости расскажут лучше меня.' },
  footer: { spot: 'right', pose: 'bye', line: 'Встречаемся напротив Библиотеки!', autoHide: true },
}
