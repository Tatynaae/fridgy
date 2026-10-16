import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource, In, IsNull, LessThan } from 'typeorm';
import { Recipe, Scan } from '../database/entities/index.js';
import { StorageService } from '../storage/storage.service.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const BATCH_SIZE = 500;

@Injectable()
export class RetentionService {
  private readonly logger = new Logger(RetentionService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly config: ConfigService,
    private readonly storage: StorageService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async purgeExpired(): Promise<void> {
    const days = Number(this.config.get('RETENTION_DAYS', 5));
    const cutoff = new Date(Date.now() - days * DAY_MS);

    const { recipeCount, imagePaths } = await this.dataSource.transaction(
      async (manager) => {
        let recipeCount = 0;
        for (;;) {
          // Старые рецепты, которых нет в избранном
          const expired = await manager.find(Recipe, {
            select: { id: true },
            relations: { favorites: true },
            where: {
              createdAt: LessThan(cutoff),
              favorites: { recipeId: IsNull() },
            },
            take: BATCH_SIZE,
          });
          if (expired.length === 0) break;

          // Каскадно удаляет recipe_ingredients и suggestions
          await manager.delete(Recipe, {
            id: In(expired.map((recipe) => recipe.id)),
          });
          recipeCount += expired.length;
        }

        const imagePaths: string[] = [];
        for (;;) {
          const expired = await manager.find(Scan, {
            select: { id: true, imagePath: true },
            where: { createdAt: LessThan(cutoff) },
            take: BATCH_SIZE,
          });
          if (expired.length === 0) break;

          // Каскадно удаляет scan_ingredients; у избранных рецептов scan_id становится NULL
          await manager.delete(Scan, {
            id: In(expired.map((scan) => scan.id)),
          });
          for (const scan of expired) {
            if (scan.imagePath) imagePaths.push(scan.imagePath);
          }
        }
        return { recipeCount, imagePaths };
      },
    );

    // Файлы удаляем только после успешного коммита, чтобы не потерять изображения при откате
    const results = await Promise.allSettled(
      imagePaths.map((key) => this.storage.delete(key)),
    );
    const failed = results.filter(
      (result) => result.status === 'rejected',
    ).length;
    if (failed > 0) this.logger.warn(`Failed to delete ${failed} image files`);

    this.logger.log(
      `Purged ${recipeCount} recipes and ${imagePaths.length} scan images older than ${days} days`,
    );
  }
}
