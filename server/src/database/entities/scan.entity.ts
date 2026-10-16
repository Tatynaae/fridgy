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
import { Recipe } from './recipe.entity.js';
import { ScanIngredient } from './scan-ingredient.entity.js';
import { User } from './user.entity.js';

export enum ScanStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
}

// Фото от пользователя (опционально с текстовым описанием). Удаляется через RETENTION_DAYS.
@Entity('scans')
@Index(['userId', 'createdAt'])
export class Scan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.scans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  // Ключ файла в StorageService, например "scans/2026/10/13/<uuid>.jpg"
  @Column({ name: 'image_path', type: 'text', nullable: true })
  imagePath: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: ScanStatus,
    enumName: 'scan_status',
    default: ScanStatus.Pending,
  })
  status: ScanStatus;

  @Column({ type: 'text', nullable: true })
  error: string | null;

  // Сырой ответ AI, хранится для отладки
  @Column({ name: 'ai_response', type: 'jsonb', nullable: true })
  aiResponse: unknown;

  @OneToMany(() => ScanIngredient, (ingredient) => ingredient.scan)
  ingredients: Relation<ScanIngredient[]>;

  @OneToMany(() => Recipe, (recipe) => recipe.scan)
  recipes: Relation<Recipe[]>;

  @Index()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
