import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { UPLOADS_URL_PREFIX } from './storage/local-storage.service.js';
import { storageRootDir } from './storage/storage.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Раздаём локальные изображения: GET /uploads/scans/... Без листинга папок и dot-файлов
  app.useStaticAssets(storageRootDir(app.get(ConfigService)), {
    prefix: `${UPLOADS_URL_PREFIX}/`,
    index: false,
    dotfiles: 'deny',
    fallthrough: false,
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
