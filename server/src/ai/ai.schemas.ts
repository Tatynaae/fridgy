import { z } from 'zod';

// Схемы ответа AI. Поля совпадают с сущностями БД, чтобы сохранять результат без лишнего маппинга.
// Ограничения вроде min/max SDK проверяет на клиенте — в API они не отправляются.

export const DetectedIngredientSchema = z.object({
  name: z
    .string()
    .describe(
      'Ingredient name, singular, lowercase, e.g. "egg", "cherry tomato"',
    ),
  quantity: z
    .number()
    .nullable()
    .describe('Estimated amount, null if impossible to tell'),
  unit: z
    .string()
    .nullable()
    .describe('Metric unit or "pcs", null if quantity is null'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('0..1, how sure you are it is in the photo'),
});

export const RecipeIngredientSchema = z.object({
  name: z.string(),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
  note: z
    .string()
    .nullable()
    .describe('Preparation note, e.g. "finely chopped"'),
  isAvailable: z
    .boolean()
    .describe(
      'true if the user already has it (seen in the photo or a pantry staple)',
    ),
});

export const RecipeSchema = z.object({
  title: z.string(),
  description: z.string().describe('One or two appetizing sentences'),
  instructions: z
    .array(z.string())
    .describe('Ordered steps, one action per step'),
  prepTimeMinutes: z.number().int(),
  cookTimeMinutes: z.number().int(),
  servings: z.number().int(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  calories: z
    .number()
    .int()
    .nullable()
    .describe('Approximate kcal per serving'),
  cuisine: z.string().nullable(),
  tags: z
    .array(z.string())
    .describe('Short lowercase tags, e.g. "vegetarian", "quick", "breakfast"'),
  ingredients: z.array(RecipeIngredientSchema),
});

export const ScanAnalysisSchema = z.object({
  containsFood: z
    .boolean()
    .describe('false if the photo has no recognizable food'),
  ingredients: z.array(DetectedIngredientSchema),
  recipes: z.array(RecipeSchema).max(5),
});

export const RecipeSuggestionsSchema = z.object({
  recipes: z.array(RecipeSchema).min(3).max(5),
});

export type DetectedIngredient = z.infer<typeof DetectedIngredientSchema>;
export type GeneratedRecipe = z.infer<typeof RecipeSchema>;
export type ScanAnalysis = z.infer<typeof ScanAnalysisSchema>;
export type RecipeSuggestions = z.infer<typeof RecipeSuggestionsSchema>;
