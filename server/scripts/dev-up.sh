#!/usr/bin/env bash
# Поднимает локальный бэкенд одной командой: Postgres (Homebrew) → приёмник писем → сервер.
# Повторный запуск безопасен: то, что уже работает, не трогается.
set -euo pipefail
cd "$(dirname "$0")/.."

export PATH="/opt/homebrew/opt/postgresql@18/bin:$PATH" LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
PGDATA="${PGDATA:-$HOME/.fridgy-pgdata}"

if ! pg_isready -h 127.0.0.1 -p 5432 -q; then
  echo "▶ Postgres"
  pg_ctl -D "$PGDATA" -l "$PGDATA/server.log" -o "-p 5432 -c listen_addresses=127.0.0.1" start >/dev/null
  until pg_isready -h 127.0.0.1 -p 5432 -q; do sleep 1; done
fi

if ! lsof -nP -iTCP:1025 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "▶ Dev SMTP (письма сброса пароля печатаются в /tmp/fridgy-smtp.log)"
  nohup node scripts/dev-smtp.mjs >/tmp/fridgy-smtp.log 2>&1 &
fi

if lsof -nP -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "✔ Сервер уже запущен на :3000"
else
  echo "▶ Сервер на :3000 (Ctrl+C — остановить)"
  exec npm run start:dev
fi
