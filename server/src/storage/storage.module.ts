import path from 'node:path';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalStorageService } from './local-storage.service.js';
import { StorageService } from './storage.service.js';

export function storageRootDir(config: {
  get(key: string): string | undefined;
}): string {
  return path.resolve(config.get('STORAGE_DIR') ?? 'uploads');
}

@Global()
@Module({
  providers: [
    {
      provide: StorageService,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new LocalStorageService(storageRootDir(config)),
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
