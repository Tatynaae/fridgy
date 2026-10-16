import type {
  GeneratedRecipe,
  RecipeSuggestions,
  ScanAnalysis,
} from './ai.schemas.js';
import {
  AiService,
  type AnalyzeScanInput,
  type SuggestRecipesInput,
} from './ai.service.js';

// Заглушка для разработки без API-ключа: всегда возвращает одни и те же данные
const OMELETTE: GeneratedRecipe = {
  title: 'Tomato and cheese omelette',
  description:
    'A fluffy omelette with juicy tomatoes and melted cheese, ready in 10 minutes.',
  instructions: [
    'Whisk the eggs with a pinch of salt and pepper.',
    'Dice the tomato.',
    'Heat oil in a pan over medium heat and pour in the eggs.',
    'When the edges set, add tomato and grated cheese on one half.',
    'Fold the omelette and cook 1 more minute.',
  ],
  prepTimeMinutes: 5,
  cookTimeMinutes: 5,
  servings: 1,
  difficulty: 'easy',
  calories: 380,
  cuisine: 'French',
  tags: ['breakfast', 'quick', 'vegetarian'],
  ingredients: [
    { name: 'egg', quantity: 3, unit: 'pcs', note: null, isAvailable: true },
    {
      name: 'tomato',
      quantity: 1,
      unit: 'pcs',
      note: 'diced',
      isAvailable: true,
    },
    {
      name: 'cheese',
      quantity: 40,
      unit: 'g',
      note: 'grated',
      isAvailable: true,
    },
    {
      name: 'cooking oil',
      quantity: 10,
      unit: 'ml',
      note: null,
      isAvailable: true,
    },
  ],
};

const SHAKSHUKA: GeneratedRecipe = {
  title: 'Quick shakshuka',
  description:
    'Eggs gently poached in a spiced tomato sauce. Great with bread.',
  instructions: [
    'Chop the onion and tomatoes.',
    'Fry the onion in oil for 5 minutes until soft.',
    'Add tomatoes, paprika, salt and simmer 10 minutes.',
    'Make 3 wells in the sauce and crack an egg into each.',
    'Cover and cook 5-7 minutes until the whites set.',
  ],
  prepTimeMinutes: 10,
  cookTimeMinutes: 20,
  servings: 2,
  difficulty: 'easy',
  calories: 290,
  cuisine: 'Middle Eastern',
  tags: ['brunch', 'vegetarian', 'one-pan'],
  ingredients: [
    { name: 'egg', quantity: 3, unit: 'pcs', note: null, isAvailable: true },
    {
      name: 'tomato',
      quantity: 3,
      unit: 'pcs',
      note: 'chopped',
      isAvailable: true,
    },
    {
      name: 'onion',
      quantity: 1,
      unit: 'pcs',
      note: 'chopped',
      isAvailable: false,
    },
    {
      name: 'paprika',
      quantity: 1,
      unit: 'tsp',
      note: null,
      isAvailable: false,
    },
    {
      name: 'cooking oil',
      quantity: 15,
      unit: 'ml',
      note: null,
      isAvailable: true,
    },
  ],
};

const CAPRESE: GeneratedRecipe = {
  title: 'Tomato and cheese salad',
  description: 'A fresh, no-cook salad of ripe tomatoes and cheese.',
  instructions: [
    'Slice the tomatoes and cheese.',
    'Arrange them alternating on a plate.',
    'Season with salt, pepper and a drizzle of oil.',
  ],
  prepTimeMinutes: 5,
  cookTimeMinutes: 0,
  servings: 2,
  difficulty: 'easy',
  calories: 210,
  cuisine: 'Italian',
  tags: ['salad', 'no-cook', 'vegetarian'],
  ingredients: [
    {
      name: 'tomato',
      quantity: 2,
      unit: 'pcs',
      note: 'sliced',
      isAvailable: true,
    },
    {
      name: 'cheese',
      quantity: 100,
      unit: 'g',
      note: 'sliced',
      isAvailable: true,
    },
    {
      name: 'cooking oil',
      quantity: 15,
      unit: 'ml',
      note: null,
      isAvailable: true,
    },
  ],
};

export class MockAiService extends AiService {
  analyzeScan(_input: AnalyzeScanInput): Promise<ScanAnalysis> {
    return Promise.resolve({
      containsFood: true,
      ingredients: [
        { name: 'egg', quantity: 6, unit: 'pcs', confidence: 0.95 },
        { name: 'tomato', quantity: 3, unit: 'pcs', confidence: 0.9 },
        { name: 'cheese', quantity: 200, unit: 'g', confidence: 0.7 },
      ],
      recipes: structuredClone([OMELETTE, SHAKSHUKA, CAPRESE]),
    });
  }

  suggestRecipes(_input: SuggestRecipesInput): Promise<RecipeSuggestions> {
    return Promise.resolve({
      recipes: structuredClone([SHAKSHUKA, CAPRESE, OMELETTE]),
    });
  }
}
