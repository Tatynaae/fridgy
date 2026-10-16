import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AiModule } from './ai.module.js';
import { RecipeSuggestionsSchema, ScanAnalysisSchema } from './ai.schemas.js';
import { AiService } from './ai.service.js';
import { ClaudeAiService } from './claude-ai.service.js';
import { MockAiService } from './mock-ai.service.js';

async function resolveAiService(
  env: Record<string, string>,
): Promise<AiService> {
  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        ignoreEnvFile: true,
        load: [() => env],
      }),
      AiModule,
    ],
  }).compile();
  return moduleRef.get(AiService);
}

describe('AiModule', () => {
  it('uses the mock without an API key', async () => {
    expect(await resolveAiService({ ANTHROPIC_API_KEY: '' })).toBeInstanceOf(
      MockAiService,
    );
  });

  it('uses Claude when an API key is set', async () => {
    expect(
      await resolveAiService({ ANTHROPIC_API_KEY: 'sk-ant-test' }),
    ).toBeInstanceOf(ClaudeAiService);
  });
});

describe('MockAiService', () => {
  const ai = new MockAiService();
  const image = { data: '', mediaType: 'image/jpeg' as const };

  it('returns a scan analysis that matches the schema', async () => {
    expect(
      ScanAnalysisSchema.safeParse(await ai.analyzeScan({ image })).success,
    ).toBe(true);
  });

  it('returns 3-5 suggestions that match the schema', async () => {
    const result = await ai.suggestRecipes({
      recentIngredients: [],
      recentRecipeTitles: [],
      favoriteRecipeTitles: [],
    });
    expect(RecipeSuggestionsSchema.safeParse(result).success).toBe(true);
  });
});
