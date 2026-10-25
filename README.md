# Учёт выдачи спецодежды

CRUD-веб-приложение для учёта цехов, сотрудников, спецодежды и её выдачи.
Проект выполнен в рамках лабораторной работы по созданию CRUD-приложения на PHP.

## Стек

- Клиент: React, TypeScript, Vite, React Router, Tailwind CSS, shadcn/ui.
- Сервер: PHP 8.3, REST API, PDO.
- База данных: PostgreSQL 16.
- Инфраструктура: Docker Compose.

## Возможности

- Ведение справочников цехов, сотрудников и видов спецодежды.
- Создание, редактирование и удаление записей во всех справочниках.
- Оформление выдачи спецодежды сотруднику с датой, ценой и скидкой.
- Редактирование и удаление записей журнала выдач.
- Отчёт за выбранный месяц с фильтрацией по цеху и расчётом итоговой суммы.

## Структура проекта

```text
.
├── client/              # React-клиент
│   └── src/
│       ├── app/         # Инициализация приложения, роутинг и layout
│       ├── pages/       # Страницы приложения
│       ├── widgets/     # Крупные переиспользуемые блоки интерфейса
│       ├── features/    # Пользовательские сценарии
│       ├── entities/    # Типы и API сущностей
│       └── shared/      # UI-компоненты, утилиты и конфигурация
├── server/              # PHP REST API
│   ├── public/          # Точка входа API
│   └── src/             # Контроллеры и подключение к PostgreSQL
├── docker-compose.yml   # PostgreSQL и PHP API
└── .env.example         # Пример переменных окружения
```

## Быстрый запуск

### 1. Настроить переменные окружения

В корне проекта создайте локальный файл `.env`:

```bash
cp .env.example .env
```

При необходимости измените значения в `.env`.

### 2. Запустить PostgreSQL и API

Из корня проекта выполните:

```bash
docker compose up -d --build
```

Проверить запущенные контейнеры:

```bash
docker compose ps
```

API доступен по адресу [http://localhost:8080/api](http://localhost:8080/api), а его проверка состояния — по адресу [http://localhost:8080/api/health](http://localhost:8080/api/health).

### 3. Запустить клиент

В новом терминале:

```bash
cd client
npm install
npm run dev
```

Клиент будет доступен по адресу [http://localhost:5173](http://localhost:5173).

## Команды

Команды выполняются из директории `client`:

```bash
npm run dev          # запуск режима разработки
npm run lint         # проверка ESLint
npm run format       # форматирование через Prettier
npm run format:check # проверка форматирования
npm run build        # production-сборка
```

Остановить контейнеры:

```bash
docker compose down
```

Подключиться к PostgreSQL внутри контейнера:

```bash
docker compose exec postgres psql -U app -d special_clothes
```

## API

Базовый путь: `/api`.

| Сущность | Маршруты |
| --- | --- |
| Цеха | `GET`, `POST /workshops`; `GET`, `PUT`, `DELETE /workshops/:id` |
| Сотрудники | `GET`, `POST /employees`; `GET`, `PUT`, `DELETE /employees/:id` |
| Спецодежда | `GET`, `POST /workwear`; `GET`, `PUT`, `DELETE /workwear/:id` |
| Выдачи | `GET`, `POST /issuances`; `GET`, `PUT`, `DELETE /issuances/:id` |
| Отчёт | `GET /reports/issuances?month=10&year=2026&workshopId=1` |

Параметр `workshopId` в отчёте необязателен. Параметры `month` и `year` обязательны.
