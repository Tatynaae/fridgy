import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Logger } from '@nestjs/common';
import {
  IMAGE_EXTENSIONS,
  StorageService,
  type ImageMimeType,
} from './storage.service.js';

export const UPLOADS_URL_PREFIX = '/uploads';

// Хранит файлы на диске в STORAGE_DIR (по умолчанию server/uploads)
export class LocalStorageService extends StorageService {
  private readonly logger = new Logger(LocalStorageService.name);

  constructor(readonly rootDir: string) {
    super();
  }

  async saveImage(
    folder: string,
    data: Buffer,
    mimeType: ImageMimeType,
  ): Promise<string> {
    const date = new Date().toISOString().slice(0, 10).replaceAll('-', '/');
    const key = path.posix.join(
      folder,
      date,
      `${randomUUID()}.${IMAGE_EXTENSIONS[mimeType]}`,
    );
    const filePath = this.resolve(key);

    await mkdir(path.dirname(filePath), { recursive: true });
    // flag 'wx' — никогда не перезаписываем существующий файл
    await writeFile(filePath, data, { flag: 'wx' });
    return key;
  }

  async read(key: string): Promise<Buffer> {
    return readFile(this.resolve(key));
  }

  async delete(key: string): Promise<void> {
    await rm(this.resolve(key), { force: true });
  }

  publicUrl(key: string): string {
    return `${UPLOADS_URL_PREFIX}/${key}`;
  }

  // Защита от выхода за пределы папки через ключи вида "../../etc/passwd"
  private resolve(key: string): string {
    const filePath = path.resolve(this.rootDir, key);
    if (!filePath.startsWith(this.rootDir + path.sep)) {
      this.logger.warn(`Rejected storage key outside root: ${key}`);
      throw new Error('Invalid storage key');
    }
    return filePath;
  }
}
