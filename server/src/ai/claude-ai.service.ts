import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import {
  BadGatewayException,
  Logger,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { z } from 'zod';
import {
  buildScanUserText,
  buildSuggestionsUserText,
  SCAN_SYSTEM_PROMPT,
  SUGGESTIONS_SYSTEM_PROMPT,
} from './ai.prompts.js';
import {
  RecipeSuggestionsSchema,
  ScanAnalysisSchema,
  type RecipeSuggestions,
  type ScanAnalysis,
} from './ai.schemas.js';
import {
  AiService,
  type AnalyzeScanInput,
  type SuggestRecipesInput,
} from './ai.service.js';

export class ClaudeAiService extends AiService {
  private readonly logger = new Logger(ClaudeAiService.name);
  private readonly client: Anthropic;

  constructor(
    apiKey: string,
    private readonly model: string,
  ) {
    super();
    this.client = new Anthropic({ apiKey });
  }

  analyzeScan(input: AnalyzeScanInput): Promise<ScanAnalysis> {
    return this.request(ScanAnalysisSchema, SCAN_SYSTEM_PROMPT, [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: input.image.mediaType,
          data: input.image.data,
        },
      },
      { type: 'text', text: buildScanUserText(input) },
    ]);
  }

  suggestRecipes(input: SuggestRecipesInput): Promise<RecipeSuggestions> {
    return this.request(RecipeSuggestionsSchema, SUGGESTIONS_SYSTEM_PROMPT, [
      { type: 'text', text: buildSuggestionsUserText(input) },
    ]);
  }

  private async request<T extends z.ZodType>(
    schema: T,
    system: string,
    content: Anthropic.Beta.BetaContentBlockParam[],
  ): Promise<z.infer<T>> {
    let response;
    try {
      response = await this.client.beta.messages.parse({
        model: this.model,
        max_tokens: 16000,
        // При отказе по политике безопасности запрос автоматически повторяется на резервной модели
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        output_config: {
          effort: 'medium',
          format: betaZodOutputFormat(schema),
        },
        system,
        messages: [{ role: 'user', content }],
      });
    } catch (error) {
      throw this.mapError(error);
    }

    if (response.stop_reason === 'refusal') {
      this.logger.warn(
        `Claude refused: ${response.stop_details?.category ?? 'unknown'}`,
      );
      throw new UnprocessableEntityException(
        'AI declined to process this request',
      );
    }
    if (response.stop_reason === 'max_tokens') {
      throw new BadGatewayException('AI response was cut off');
    }
    if (!response.parsed_output) {
      throw new BadGatewayException('AI returned an invalid response');
    }

    this.logger.debug(
      `Tokens in/out: ${response.usage.input_tokens}/${response.usage.output_tokens}`,
    );
    return response.parsed_output;
  }

  private mapError(error: unknown): Error {
    if (error instanceof Anthropic.BadRequestError) {
      // Например, битое или слишком большое изображение
      return new UnprocessableEntityException(
        `AI rejected the request: ${error.message}`,
      );
    }
    if (error instanceof Anthropic.AuthenticationError) {
      this.logger.error('Invalid ANTHROPIC_API_KEY');
      return new ServiceUnavailableException('AI is not configured');
    }
    if (error instanceof Anthropic.RateLimitError) {
      return new ServiceUnavailableException('AI is busy, try again later');
    }
    if (error instanceof Anthropic.APIError) {
      this.logger.error(`Claude API error ${error.status}: ${error.message}`);
      return new BadGatewayException('AI request failed');
    }
    // Ошибки валидации схемы и прочие — пробрасываем как есть
    return error instanceof Error ? error : new Error(String(error));
  }
}
