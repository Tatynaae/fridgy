# fridgy server

NestJS API backed by PostgreSQL (Docker) via TypeORM.

## Setup

Нужны Node.js 22+ и Docker Desktop.

```bash
cd server
cp .env.example .env        # задайте DB_PASSWORD и JWT_SECRET (уже создан локально)
npm install
npm run db:up               # Postgres 18 на 127.0.0.1:5432
npm run start:dev           # миграции применяются при старте
curl localhost:3000/health
```

Клиент (`client/`): `cp .env.example .env`, затем `npx expo start`.
Для телефона в той же Wi‑Fi сети укажите `EXPO_PUBLIC_API_URL=http://<IP-компьютера>:3000`
(сервер слушает `0.0.0.0`).

Без SMTP письма не отправляются — ссылка и токен для сброса пароля печатаются в консоль сервера.

## Auth API

| Метод | Путь | Тело | Ответ |
|---|---|---|---|
| POST | `/auth/register` | `{ email, password, displayName? }` | пользователь |
| POST | `/auth/login` | `{ email, password }` | `{ accessToken, refreshToken, tokenType, user }` |
| POST | `/auth/refresh` | `{ refreshToken }` | новая пара токенов (старый refresh отзывается) |
| GET | `/auth/me` | — (Bearer) | `{ id, email, displayName, createdAt }` |
| POST | `/auth/logout` | `{ refreshToken? }` (Bearer) | отзывает access- и refresh-токен |
| POST | `/auth/forgot-password` | `{ email }` | всегда 200 |
| POST | `/auth/reset-password` | `{ token, newPassword }` | отзывает все refresh-токены пользователя |

- access-токен — JWT на `JWT_ACCESS_EXPIRES_IN` (15m), передаётся в `Authorization: Bearer ...`;
- refresh-токен — случайная строка на `REFRESH_TOKEN_TTL_DAYS` (30 дней), в БД хранится только sha256-хеш;
- повторное использование уже отозванного refresh-токена отзывает все сессии пользователя;
- клиент хранит оба токена в `expo-secure-store` и сам обновляет access-токен при 401 (`client/src/api/client.ts`).

## Schema

| Table | Purpose | Retention |
|---|---|---|
| `users` | account + `preferences` (diet, allergies) | kept |
| `scans` | photo (`image_path`) + optional description sent to the AI | `RETENTION_DAYS` |
| `scan_ingredients` | ingredients the AI detected in a scan | with scan |
| `recipes` | generated recipes (`source`: `scan` / `suggestion`) | `RETENTION_DAYS` unless favorited |
| `recipe_ingredients` | ingredients of a recipe, `is_available` = user has it | with recipe |
| `favorites` | user ↔ recipe; protects the recipe from cleanup | kept |
| `suggestions` | current 3-5 suggested recipes per user (`position`) | replaced on refresh |
| `refresh_tokens` | sha256 refresh-токенов, `revoked_at` | until `expires_at` |
| `revoked_tokens` | `jti` отозванных access-токенов (logout) | until `expires_at` |
| `password_reset_tokens` | одноразовые токены сброса пароля (15 мин) | until `expires_at` |

`RetentionService` runs hourly and deletes non-favorite recipes and scans older than `RETENTION_DAYS` (default 5). Favorited recipes survive; their `scan_id` is set to NULL when the scan expires.

## Migrations

```bash
npm run migration:generate -- src/database/migrations/<Name>   # after changing entities
npm run migration:run
npm run migration:revert
```

## AI

`AiService` (`src/ai/`) has two methods: `analyzeScan` (photo + optional note → detected ingredients + 3-5 recipes) and `suggestRecipes` (recent ingredients, history and favorites → 3-5 recipes). Prompts are in `ai.prompts.ts`, response schemas in `ai.schemas.ts`.

- `ANTHROPIC_API_KEY` empty → `MockAiService` returns fixed sample data, so the rest of the app can be built without a key.
- `ANTHROPIC_API_KEY` set → `ClaudeAiService` calls Claude (`AI_MODEL`, default `claude-opus-5-5`) with structured outputs and the server-side refusal fallback.

## Image storage

Images are stored on disk in `server/uploads/` (`STORAGE_DIR`, git-ignored) and served at `GET /uploads/<key>`, e.g. `/uploads/scans/2026/10/13/<uuid>.jpg`. The database stores only the key (`scans.image_path`); build URLs with `StorageService.publicUrl(key)`.

Code depends on the abstract `StorageService` (`src/storage/`), so `LocalStorageService` can later be swapped for cloud storage without touching callers. The retention job deletes the image files of expired scans.
