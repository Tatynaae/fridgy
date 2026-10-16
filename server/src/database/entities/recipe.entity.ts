import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Favorite } from './favorite.entity.js';
import { RecipeIngredient } from './recipe-ingredient.entity.js';
import { Scan } from './scan.entity.js';
import { User } from './user.entity.js';

export enum RecipeSource {
  Scan = 'scan',
  Suggestion = 'suggestion',
}

export enum RecipeDifficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

// Рецепты — это история: удаляются через RETENTION_DAYS, если пользователь не добавил их в избранное.
@Entity('recipes')
@Index(['userId', 'createdAt'])
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.recipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  // Обнуляется при удалении скана, чтобы избранные рецепты пережили свой скан
  @Index()
  @Column({ name: 'scan_id', type: 'uuid', nullable: true })
  scanId: string | null;

  @ManyToOne(() => Scan, (scan) => scan.recipes, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'scan_id' })
  scan: Relation<Scan> | null;

  @Column({ type: 'enum', enum: RecipeSource, enumName: 'recipe_source' })
  source: RecipeSource;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // Шаги приготовления по порядку
  @Column({ type: 'jsonb', default: [] })
  instructions: string[];

  @Column({ name: 'prep_time_minutes', type: 'smallint', nullable: true })
  prepTimeMinutes: number | null;

  @Column({ name: 'cook_time_minutes', type: 'smallint', nullable: true })
  cookTimeMinutes: number | null;

  @Column({ type: 'smallint', nullable: true })
  servings: number | null;

  @Column({
    type: 'enum',
    enum: RecipeDifficulty,
    enumName: 'recipe_difficulty',
    nullable: true,
  })
  difficulty: RecipeDifficulty | null;

  @Column({ type: 'integer', nullable: true })
  calories: number | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  cuisine: string | null;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string | null;

  @OneToMany(() => RecipeIngredient, (ingredient) => ingredient.recipe)
  ingredients: Relation<RecipeIngredient[]>;

  @OneToMany(() => Favorite, (favorite) => favorite.recipe)
  favorites: Relation<Favorite[]>;

  @Index()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
