# fridgy server

NestJS API backed by PostgreSQL (Docker) via TypeORM.

## Setup

```bash
cp .env.example .env        # set DB_PASSWORD
npm install
npm run db:up               # starts Postgres 18 on 127.0.0.1:5432
npm run start:dev           # pending migrations run on boot
curl localhost:3000/health
```

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
