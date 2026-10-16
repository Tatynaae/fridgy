import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Scan } from './scan.entity.js';

// Ингредиент, распознанный AI на скане
@Entity('scan_ingredients')
export class ScanIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'scan_id', type: 'uuid' })
  scanId: string;

  @ManyToOne(() => Scan, (scan) => scan.ingredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scan_id' })
  scan: Relation<Scan>;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  quantity: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  unit: string | null;

  // 0..1, насколько AI уверен в распознавании
  @Column({ type: 'real', nullable: true })
  confidence: number | null;
}
