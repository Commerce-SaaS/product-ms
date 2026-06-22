import { Category } from 'src/categories/entities/category.entity';
import { ProductAvailability } from 'src/common/enums/product-availability.enum';
import { ProductExtra } from 'src/product-extras/entities/product-extra.entity';
import { ProductIngredient } from 'src/product-ingredients/entities/product-ingredient.entity';
import { ProductTag } from 'src/product-tags/entities/product-tag.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { ProductUiDto } from '../dto/create-product.dto';

@Entity('products')
@Index(['organizationId', 'name'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      from: (value: string) => parseFloat(value),
      to: (value: number) => value,
    },
  })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  reservedStock: number; // stock reservado por órdenes pendientes

  @Column({ nullable: true })
  lowStockThreshold?: number; // alerta cuando stock baja de este número

  @Column({ type: 'boolean', default: true })
  trackStock: boolean; // algunos productos no necesitan control de stock

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ProductAvailability,
    default: ProductAvailability.AVAILABLE,
  })
  availability: ProductAvailability;

  @Column({ type: 'jsonb', nullable: true })
  ui?: ProductUiDto;

  @Column({ type: 'text', nullable: true })
  imageUrl?: string;

  @Column({ type: 'text', nullable: true })
  imageKey?: string;

  @ManyToOne(() => Category, { nullable: true, eager: true })
  category?: Category;

  @OneToMany(() => ProductTag, (pt) => pt.product, {
    eager: true,
    cascade: true,
  })
  tags: ProductTag[];

  @OneToMany(() => ProductIngredient, (pi) => pi.product, {
    eager: true,
    cascade: true,
  })
  ingredients: ProductIngredient[];

  @OneToMany(() => ProductExtra, (pi) => pi.product, {
    eager: true,
    cascade: true,
  })
  extras: ProductExtra[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
