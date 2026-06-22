import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'product_ingredients' })
@Unique(['productId', 'ingredientId', 'organizationId'])
export class ProductIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.ingredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' }) // 👈 igual aquí
  ingredientId: string;

  @ManyToOne(() => Ingredient, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
