# AI Memory Wall - Архитектура проекта

## Общая архитектура

### Технологический стек
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, ShadCN UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI**: OpenAI API (GPT-4o, Moderation API), Python (spaCy, pandas)
- **Деплой**: Vercel (CI/CD, Analytics)
- **Интеграции**: Telegram Bot API

### Компоненты системы
1. **Next.js приложение**
   - Server Components для основного рендеринга
   - Client Components для интерактивных элементов
   - API Routes для безопасных вызовов AI и аутентификации

2. **Supabase**
   - База данных: хранение сообщений, реакций, метаданных пользователей
   - Аутентификация: OAuth (Google, GitHub), анонимный доступ
   - Edge Functions: обработка AI-запросов, аналитика, Telegram-вебхуки

3. **AI-слой**
   - Модерация контента (OpenAI Moderation API)
   - Генерация персонализированных приветствий (GPT-4o)
   - Еженедельная аналитика (GPT-3.5-turbo + Python)

4. **Telegram-бот**
   - Интеграция через Supabase Edge Functions
   - Команды для публикации и модерации контента

## Структура базы данных

### Таблицы

#### users
- id (UUID, primary key)
- email (string, nullable)
- provider (string: 'google', 'github', 'anonymous')
- provider_id (string)
- created_at (timestamp)
- last_login (timestamp)
- role (string: 'user', 'moderator', 'admin')
- banned (boolean)

#### users_meta
- id (UUID, primary key)
- user_id (UUID, foreign key)
- device_type (string)
- os (string)
- utc_offset (integer)
- referrer (string, nullable)
- utm_source (string, nullable)
- preferred_channel (string: 'email', 'telegram', null)
- theme (string: 'dark', 'light', 'auto')
- frequency_bucket (string: 'new', 'regular', 'power-user')
- language (string: 'ru', 'en')

#### messages
- id (UUID, primary key)
- user_id (UUID, foreign key)
- content (text)
- created_at (timestamp)
- updated_at (timestamp)
- toxicity_score (float)
- hidden (boolean)
- hidden_reason (string, nullable)
- language (string: 'ru', 'en', 'other')

#### reactions
- id (UUID, primary key)
- message_id (UUID, foreign key)
- user_id (UUID, foreign key)
- emoji (string)
- created_at (timestamp)

#### analytics
- id (UUID, primary key)
- week_start (timestamp)
- week_end (timestamp)
- report_json (jsonb)
- created_at (timestamp)

## Интерфейсы пользователей

### 1. Интерфейс для нового гостя
- Приветственный экран с персонализированным приветствием
- Форма для создания первого сообщения
- Опция авторизации или анонимного доступа
- Адаптивное отображение времени и языка
- Фраза-вдохновение для первого сообщения

### 2. Интерфейс для постоянного пользователя
- Персонализированное приветствие с учетом истории посещений
- Лента сообщений с рекомендованными по интересам
- Возможность добавления реакций и новых сообщений
- История собственных сообщений и полученных реакций
- Настройки уведомлений и предпочтений

### 3. Интерфейс для администратора
- Панель модерации контента
- Управление пользователями (бан/разбан)
- Настройки AI-параметров (пороги токсичности, шаблоны)
- Аналитический дашборд
- Управление Telegram-интеграцией и SEO-настройками

## Многоязычность и локализация

### Структура локализации
- Файлы локализации: `/src/locales/{ru,en}/common.json`
- Автоматическое определение языка браузера
- Переключатель языка в интерфейсе
- Адаптивные приветствия в зависимости от языка и времени суток

### Примеры локализованных приветствий
- 🇷🇺 Утро: "Доброе утро! Рады видеть вас снова."
- 🇷🇺 Вечер: "Добрый вечер! Как прошел ваш день?"
- 🇬🇧 Утро: "Good morning! Great to see you again."
- 🇬🇧 Вечер: "Good evening! How was your day?"

## AI-интеграция

### Модерация контента
- Использование OpenAI Moderation API
- Параметры проверки: toxicity, hate, self-harm, sexual
- Пороговые значения настраиваются администратором
- Автоматическое скрытие сообщений с высоким уровнем токсичности

### Персонализированные приветствия
- Использование GPT-4o для генерации приветствий
- Учет времени суток, языка, истории посещений
- Streaming completion для быстрого отображения
- Кэширование частых сценариев для оптимизации

### Еженедельная аналитика
- CRON-задача на Supabase Edge Functions
- Анализ популярных тем, настроений, активности
- Визуализация через ChartJS
- Автоматическая рассылка отчетов администраторам

## Безопасность и производительность

### Безопасность
- Защита от SQL-инъекций через ORM Supabase
- Валидация всех пользовательских данных
- Rate limiting для API-запросов
- Защита от XSS через Content-Security-Policy

### Производительность
- Серверные компоненты для основного контента
- Инкрементальная статическая регенерация (ISR)
- Оптимизация изображений через next/image
- Lazy loading для неприоритетного контента

## Telegram-интеграция

### Функциональность бота
- Публикация сообщений через команду /post
- Модерация контента для администраторов
- Получение статистики и отчетов
- Инлайн-режим для быстрых ответов

### Техническая реализация
- Webhook на Supabase Edge Function
- Обновление Next.js ISR при новых сообщениях
- Авторизация через deep linking

# AI Memory Wall - Project Architecture

## General Architecture

### Technology Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, ShadCN UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI**: OpenAI API (GPT-4o, Moderation API), Python (spaCy, pandas)
- **Deployment**: Vercel (CI/CD, Analytics)
- **Integrations**: Telegram Bot API

### System Components
1. **Next.js Application**
   - Server Components for main rendering
   - Client Components for interactive elements
   - API Routes for secure AI calls and authentication

2. **Supabase**
   - Database: storing messages, reactions, user metadata
   - Authentication: OAuth (Google, GitHub), anonymous access
   - Edge Functions: AI request processing, analytics, Telegram webhooks

3. **AI Layer**
   - Content moderation (OpenAI Moderation API)
   - Personalized greeting generation (GPT-4o)
   - Weekly analytics (GPT-3.5-turbo + Python)

4. **Telegram Bot**
   - Integration via Supabase Edge Functions
   - Commands for publishing and moderating content

## Database Structure

### Tables

#### users
- id (UUID, primary key)
- email (string, nullable)
- provider (string: 'google', 'github', 'anonymous')
- provider_id (string)
- created_at (timestamp)
- last_login (timestamp)
- role (string: 'user', 'moderator', 'admin')
- banned (boolean)

#### users_meta
- id (UUID, primary key)
- user_id (UUID, foreign key)
- device_type (string)
- os (string)
- utc_offset (integer)
- referrer (string, nullable)
- utm_source (string, nullable)
- preferred_channel (string: 'email', 'telegram', null)
- theme (string: 'dark', 'light', 'auto')
- frequency_bucket (string: 'new', 'regular', 'power-user')
- language (string: 'ru', 'en')

#### messages
- id (UUID, primary key)
- user_id (UUID, foreign key)
- content (text)
- created_at (timestamp)
- updated_at (timestamp)
- toxicity_score (float)
- hidden (boolean)
- hidden_reason (string, nullable)
- language (string: 'ru', 'en', 'other')

#### reactions
- id (UUID, primary key)
- message_id (UUID, foreign key)
- user_id (UUID, foreign key)
- emoji (string)
- created_at (timestamp)

#### analytics
- id (UUID, primary key)
- week_start (timestamp)
- week_end (timestamp)
- report_json (jsonb)
- created_at (timestamp)

## User Interfaces

### 1. New Guest Interface
- Welcome screen with personalized greeting
- Form for creating first message
- Option for authorization or anonymous access
- Adaptive display of time and language
- Inspirational phrase for the first message

### 2. Regular User Interface
- Personalized greeting based on visit history
- Message feed with interest-based recommendations
- Ability to add reactions and new messages
- History of own messages and received reactions
- Notification and preference settings

### 3. Administrator Interface
- Content moderation panel
- User management (ban/unban)
- AI parameter settings (toxicity thresholds, templates)
- Analytical dashboard
- Telegram integration and SEO settings management

## Multilingualism and Localization

### Localization Structure
- Localization files: `/src/locales/{ru,en}/common.json`
- Automatic browser language detection
- Language switcher in the interface
- Adaptive greetings depending on language and time of day

### Examples of Localized Greetings
- 🇷🇺 Morning: "Доброе утро! Рады видеть вас снова."
- 🇷🇺 Evening: "Добрый вечер! Как прошел ваш день?"
- 🇬🇧 Morning: "Good morning! Great to see you again."
- 🇬🇧 Evening: "Good evening! How was your day?"

## AI Integration

### Content Moderation
- Using OpenAI Moderation API
- Check parameters: toxicity, hate, self-harm, sexual
- Thresholds configurable by administrator
- Automatic hiding of messages with high toxicity levels

### Personalized Greetings
- Using GPT-4o for greeting generation
- Considering time of day, language, visit history
- Streaming completion for fast display
- Caching frequent scenarios for optimization

### Weekly Analytics
- CRON task on Supabase Edge Functions
- Analysis of popular topics, sentiments, activity
- Visualization through ChartJS
- Automatic report distribution to administrators

## Security and Performance

### Security
- Protection against SQL injections via Supabase ORM
- Validation of all user data
- Rate limiting for API requests
- XSS protection through Content-Security-Policy

### Performance
- Server components for main content
- Incremental Static Regeneration (ISR)
- Image optimization through next/image
- Lazy loading for non-priority content

## Telegram Integration

### Bot Functionality
- Publishing messages via /post command
- Content moderation for administrators
- Receiving statistics and reports
- Inline mode for quick responses

### Technical Implementation
- Webhook on Supabase Edge Function
- Updating Next.js ISR with new messages
- Authorization via deep linking
