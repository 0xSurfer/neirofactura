# NEIROFACTURA — Project Guide

## Overview
Лендинг-визитка для агентства NEIROFACTURA. Переезд с Tilda на собственный VDS + Coolify.

**Статус:** Ready for Deploy / Готовность ~95%  
**Приоритет:** Быстрый запуск, минимальная сложность, максимальная гибкость.

---

## Tech Stack

| Слой | Технология |
|------|------------|
| Разметка | HTML5 (семантические теги) |
| Стили | CSS3 + CSS Variables (без фреймворков) |
| Скрипты | Vanilla JS (ES6+) |
| Деплой | Coolify (Docker + Nginx) |
| Шрифты | Google Fonts (JetBrains Mono, Syncopate, Inter) |
| VDS | Внутри РФ (для доступности)

**Принцип:** Никаких билдов, npm, бандлеров. Прямая правка файлов = мгновенный результат.

---

## File Structure

```
/
├── index.html              # Главная (hero + services + portfolio)
├── AGENTS.md               # Этот файл
├── TODO.md                 # Текущие задачи
├── robots.txt              # Для поисковиков
├── sitemap.xml             # Карта сайта
├── css/
│   ├── base.css           # Переменные, reset, типографика
│   ├── components.css     # Кнопки, карточки, навигация
│   ├── sections.css       # Стили для каждой секции
│   └── animations.css     # Ключевые кадры, hover-эффекты
├── js/
│   ├── cursor.js          # Кастомный курсор
│   ├── waves.js           # Canvas-анимация волны
│   └── main.js            # Инициализация, обработчики
├── cases/
│   ├── case-rich.html     # Кейс: РИЧ (FMCG/AI-аудит)
│   ├── case-fintech.html  # Кейс: Финансовая логистика (FinTech)
│   ├── case-elbrus.html   # Кейс: ELBRUS HOME (ОАЭ/Deep Research)
│   └── case-yesoft.html   # Кейс: YESOFT (E-commerce/SEO)
├── legal/
│   ├── consent.html       # Согласие на обработку данных
│   ├── cookie.html        # Политика cookie
│   ├── privacy.html       # Политика конфиденциальности
│   └── 404.html           # Страница ошибки 404
└── assets/
    ├── favicon.ico        # Favicon мульти-разрешение
    ├── apple-touch-icon.png # 180×180 для iOS/Android
    ├── og-image.png       # OG баннер 1200×630
    └── [все изображения кейсов]
```

---

## URL Structure

| Страница | URL |
|----------|-----|
| Главная | `https://neirofactura.ru/` |
| Кейс РИЧ | `https://neirofactura.ru/cases/case-rich.html` |
| Кейс FinTech | `https://neirofactura.ru/cases/case-fintech.html` |
| Кейс YESOFT | `https://neirofactura.ru/cases/case-yesoft.html` |
| Кейс ELBRUS | `https://neirofactura.ru/cases/case-elbrus.html` |
| Privacy | `https://neirofactura.ru/legal/privacy.html` |
| Cookie | `https://neirofactura.ru/legal/cookie.html` |
| Consent | `https://neirofactura.ru/legal/consent.html` |

**Важно:** Все ссылки в проекте — полные абсолютные URL с доменом.

---

## Code Conventions

### CSS
- Использовать CSS Variables из `base.css`
- БЭМ-нотация для классов: `.block__element--modifier`
- Мобильные стили внизу файла через `@media`
- Никаких `!important` без крайней необходимости

### JS
- Модули через `type="module"`
- Делегирование событий вместо навешивания на каждый элемент
- `requestAnimationFrame` для анимаций
- Проверка существования DOM-элементов перед инициализацией

### HTML
- Семантические теги: `<header>`, `<main>`, `<section>`, `<footer>`
- `lang="ru"` для всего контента
- Alt-тексты для изображений
- Все ссылки — полные URL (`https://neirofactura.ru/...`)

---

## Deployment Checklist

### Pre-Deploy (Must Have) ✅
1. ✅ Все страницы с контентом
2. ✅ SEO title и meta description
3. ✅ Favicon (ICO + PNG)
4. ✅ Open Graph image (1200×630)
5. ✅ robots.txt + sitemap.xml
6. ✅ Все ссылки рабочие (полные URL)

### Deploy Process
1. Удалить `.venv/` (временная папка Python)
2. Push в GitHub репозиторий
3. Подключить репо в Coolify
4. Настроить домен neirofactura.ru
5. Проверить SSL
6. Проверить все страницы 200 OK

### Post-Deploy
- Подключить Яндекс.Метрику (код счетчика)
- Проверить индексацию через Яндекс.Вебмастер
- Настроить цели в Метрике (клики по Telegram)

---

## CDN & External Resources

### Google Fonts
- JetBrains Mono (400, 500)
- Syncopate (700)
- Inter (400, 600)

### Video
- Все видео локальные (assets/*.mp4)
- Формат: MP4 H.264
- Autoplay, muted, loop, playsinline

---

## Future Considerations (не делать сейчас)

- [ ] Интеграция форм (Formspree / EmailJS / собственный бэкенд)
- [ ] Мультиязычность (i18n)
- [ ] Блог / новости
- [ ] Переход на фреймворк (Astro/Next) если страниц станет > 10
