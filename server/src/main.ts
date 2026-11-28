import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { UPLOADS_URL_PREFIX } from './storage/local-storage.service.js';
import { storageRootDir } from './storage/storage.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  // CORS нужен для Expo Web (браузер). Нативным iOS/Android он не мешает.
  // CORS_ORIGINS="http://localhost:8081,http://localhost:19006" или пусто = разрешить всё (dev)
  const origins = config
    .get<string>('CORS_ORIGINS', '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins.length ? origins : true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Раздаём локальные изображения: GET /uploads/scans/... Без листинга папок и dot-файлов
  app.useStaticAssets(storageRootDir(config), {
    prefix: `${UPLOADS_URL_PREFIX}/`,
    index: false,
    dotfiles: 'deny',
    fallthrough: false,
  });
  // 0.0.0.0 — чтобы телефон в той же Wi‑Fi сети мог достучаться до сервера по IP компьютера
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
await bootstrap();
