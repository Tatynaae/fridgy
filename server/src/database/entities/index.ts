import { Favorite } from './favorite.entity.js';
import { RecipeIngredient } from './recipe-ingredient.entity.js';
import { Recipe } from './recipe.entity.js';
import { ScanIngredient } from './scan-ingredient.entity.js';
import { Scan } from './scan.entity.js';
import { Suggestion } from './suggestion.entity.js';
import { User } from './user.entity.js';

export {
  Favorite,
  Recipe,
  RecipeIngredient,
  Scan,
  ScanIngredient,
  Suggestion,
  User,
};
export { RecipeDifficulty, RecipeSource } from './recipe.entity.js';
export { ScanStatus } from './scan.entity.js';

export const entities = [
  User,
  Scan,
  ScanIngredient,
  Recipe,
  RecipeIngredient,
  Favorite,
  Suggestion,
];
