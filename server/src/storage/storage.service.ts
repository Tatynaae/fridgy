export const IMAGE_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
} as const;

export type ImageMimeType = keyof typeof IMAGE_EXTENSIONS;

export function isImageMimeType(value: string): value is ImageMimeType {
  return value in IMAGE_EXTENSIONS;
}

// Абстракция хранилища файлов. Сейчас — локальная папка, позже можно заменить на облако (S3 и т.п.).
// В БД хранится только ключ (относительный путь), URL строится при отдаче клиенту.
export abstract class StorageService {
  // Сохраняет изображение и возвращает его ключ, например "scans/2026/10/13/<uuid>.jpg"
  abstract saveImage(
    folder: string,
    data: Buffer,
    mimeType: ImageMimeType,
  ): Promise<string>;
  abstract read(key: string): Promise<Buffer>;
  // Не падает, если файла уже нет
  abstract delete(key: string): Promise<void>;
  abstract publicUrl(key: string): string;
}
