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

@Entity('products')
@Index(['organizationId', 'name'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', nullable: true })
  stock?: number;

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
