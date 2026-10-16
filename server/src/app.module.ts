import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from './ai/ai.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { databaseOptions } from './database/database.config.js';
import { User } from './database/entities/index.js';
import { RetentionModule } from './retention/retention.module.js';
import { StorageModule } from './storage/storage.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({ ...databaseOptions(), migrationsRun: true }),
    }),
    TypeOrmModule.forFeature([User]),
    ScheduleModule.forRoot(),
    StorageModule,
    RetentionModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
