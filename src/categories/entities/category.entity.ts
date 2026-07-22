import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique
} from 'typeorm';
import { CategoryUiDto } from '../dto/create-category.dto';
import { Tag } from 'src/tags/entities/tag.entity';

@Entity('category')
@Unique(['organizationId', 'name'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Product, (product) => product.category)
  products?: Product[];

  @OneToMany(() => Tag, (tag) => tag.category)
  tags: Tag[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  ui?: CategoryUiDto;

  // Drinks / pre-prepared / display-case categories should be set to false.
  // See PROD MIGRATION NOTE below.
  @Column({ type: 'boolean', default: true })
  countsTowardKitchenCapacity: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

// PROD MIGRATION NOTE (TypeORM synchronize handles dev automatically; do NOT
// run synchronize in production):
//   ALTER TABLE category ADD COLUMN "countsTowardKitchenCapacity" boolean NOT NULL DEFAULT true;
