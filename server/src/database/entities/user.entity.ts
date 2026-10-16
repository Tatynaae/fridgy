import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { Favorite } from './favorite.entity.js';
import { Recipe } from './recipe.entity.js';
import { Scan } from './scan.entity.js';
import { Suggestion } from './suggestion.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  passwordHash: string | null;

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  displayName: string | null;

  // Диета, аллергии, нелюбимые ингредиенты и т.д. Передаются AI при составлении рекомендаций.
  @Column({ type: 'jsonb', default: {} })
  preferences: Record<string, unknown>;

  @OneToMany(() => Scan, (scan) => scan.user)
  scans: Relation<Scan[]>;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Relation<Recipe[]>;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Relation<Favorite[]>;

  @OneToMany(() => Suggestion, (suggestion) => suggestion.user)
  suggestions: Relation<Suggestion[]>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
