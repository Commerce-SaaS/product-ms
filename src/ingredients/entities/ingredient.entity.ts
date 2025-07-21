import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  restaurantId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToMany(() => Product, (product) => product.ingredients)
  products?: Product[];
}
