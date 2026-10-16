import type { RecipeSuggestions, ScanAnalysis } from './ai.schemas.js';

export type ImageMediaType =
  'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

export interface AnalyzeScanInput {
  image: { data: string; mediaType: ImageMediaType }; // data — base64 без префикса data:
  description?: string | null;
  preferences?: Record<string, unknown>;
  language?: string;
}

export interface SuggestRecipesInput {
  recentIngredients: string[];
  recentRecipeTitles: string[]; // чтобы не повторяться
  favoriteRecipeTitles: string[]; // сигнал вкуса пользователя
  request?: string | null;
  preferences?: Record<string, unknown>;
  language?: string;
}

// Абстракция AI. Реализация выбирается в AiModule: Claude при наличии ключа, иначе мок.
export abstract class AiService {
  abstract analyzeScan(input: AnalyzeScanInput): Promise<ScanAnalysis>;
  abstract suggestRecipes(
    input: SuggestRecipesInput,
  ): Promise<RecipeSuggestions>;
}
