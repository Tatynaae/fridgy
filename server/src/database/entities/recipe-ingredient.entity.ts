import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Recipe } from './recipe.entity.js';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'recipe_id', type: 'uuid' })
  recipeId: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Relation<Recipe>;

  @Column({ type: 'smallint', default: 0 })
  position: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  quantity: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  unit: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  note: string | null;

  // false = этого ингредиента не было на скане, пользователю нужно его купить
  @Column({ name: 'is_available', type: 'boolean', default: true })
  isAvailable: boolean;
}
