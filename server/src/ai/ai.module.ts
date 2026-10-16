import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service.js';
import { ClaudeAiService } from './claude-ai.service.js';
import { MockAiService } from './mock-ai.service.js';

@Module({
  providers: [
    {
      provide: AiService,
      inject: [ConfigService],
      useFactory: (config: ConfigService): AiService => {
        const logger = new Logger('AiModule');
        const apiKey = config.get<string>('ANTHROPIC_API_KEY');
        if (!apiKey) {
          logger.warn(
            'ANTHROPIC_API_KEY is not set, using MockAiService with sample data',
          );
          return new MockAiService();
        }
        const model = config.get<string>('AI_MODEL', 'claude-opus-5-5');
        logger.log(`Using Claude (${model})`);
        return new ClaudeAiService(apiKey, model);
      },
    },
  ],
  exports: [AiService],
})
export class AiModule {}
