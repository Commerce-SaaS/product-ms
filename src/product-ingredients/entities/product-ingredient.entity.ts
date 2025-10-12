import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'product_ingredients' })
@Unique(['productId', 'ingredientId', 'restaurantId'])
export class ProductIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  restaurantId: string;

  @Column({ type: 'uuid' }) // 👈 DEBES declarar esto explícitamente
  productId: string;

  @ManyToOne(() => Product, (product) => product.ingredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' }) // 👈 este join se enlaza con la columna declarada arriba
  product: Product;

  @Column({ type: 'uuid' }) // 👈 igual aquí
  ingredientId: string;

  @ManyToOne(() => Ingredient, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
