# FSD Architecture - RTK Application

## Структура проекта (Feature-Sliced Design)

```
src/
├── app/                          # Инициализация приложения
│   ├── index.js                  # Entry point
│   └── App.js                    # Root компонент
│
├── pages/                        # Страницы приложения
│   ├── LoginPage/
│   ├── RegisterPage/
│   ├── DashboardPage/
│   └── QRPassPage/
│
├── features/                     # Функциональность пользователя
│   ├── auth/                     # Фича авторизации
│   │   ├── ui/                   # UI компоненты
│   │   ├── model/                # Zustand stores
│   │   │   └── authStore.js
│   │   └── api/                  # API запросы
│   │       └── authAPI.js
│   │
│   └── pass-generation/          # Фича генерации пропуска
│       ├── ui/                   # UI компоненты
│       ├── model/                # Zustand stores
│       │   └── passStore.js
│       └── api/                  # API запросы
│           └── passAPI.js
│
├── entities/                     # Бизнес сущности
│   ├── user/                     # Пользователь
│   │   ├── ui/                   # UI компоненты
│   │   └── model/                # Моделі и логика
│   │
│   └── pass/                     # Пропуск
│       ├── ui/                   # UI компоненты
│       └── model/                # Моделі и логика
│
├── widgets/                      # Большие компоненты
│   ├── Header/                   # Заголовок
│   └── Navigation/               # Навигация
│
├── shared/                       # Переиспользуемый код
│   ├── ui/
│   │   ├── components/           # Общие компоненты
│   │   └── styles/
│   │       └── index.css         # Глобальные стили
│   ├── api/
│   │   └── http.js               # HTTP клиент (axios)
│   ├── config/
│   │   └── api.js                # API конфигурация
│   ├── lib/                      # Утилиты
│   ├── constants/                # Константы
│   │   └── index.js
│   └── hooks/                    # Общие hooks (если нужны)
│
└── index.js                      # Entry point для React

```

## Используемые технологии

- **React** - UI библиотека
- **Zustand** - State management
- **Axios** - HTTP клиент
- **React Router** - Маршрутизация
- **qrcode.react** - Генерация QR кодов

## Принципы FSD

1. **Слои** (layers):
   - `app` - инициализация приложения
   - `pages` - страницы (экраны)
   - `features` - пользовательские функции
   - `entities` - бизнес сущности
   - `shared` - переиспользуемый код

2. **Слайсы** (slices):
   - Находятся внутри layers
   - Группируют код по фичам/сущностям
   - Самодостаточные и независимые

3. **Сегменты** (segments):
   - `ui` - UI компоненты
   - `model` - состояние (store) и логика
   - `api` - запросы на сервер
   - `lib` - утилиты и помощники

## Как добавить новую фичу

1. Создать папку в `features/your-feature`
2. Добавить сегменты: `ui`, `model`, `api`
3. Экспортировать из индекса:
   ```js
   // features/your-feature/index.js
   export * from './ui';
   export * from './model';
   export * from './api';
   ```

## Как добавить новую страницу

1. Создать папку в `pages/YourPage`
2. Использовать компоненты из `features` и `entities`
3. Подключить в роутер в `app/App.js`
