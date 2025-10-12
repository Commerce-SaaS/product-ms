import { Category } from 'src/categories/entities/category.entity';
import { ProductAvailability } from 'src/common/enums/product-availability.enum';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { ProductIngredient } from 'src/product-ingredients/entities/product-ingredient.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

@Entity('products')
@Index(['restaurantId', 'name'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  restaurantId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', nullable: true })
  stock?: number;

  @Column({
    type: 'enum',
    enum: ProductAvailability,
    default: ProductAvailability.AVAILABLE,
  })
  availability: ProductAvailability;

  // 🔗 Relaciones

  @ManyToOne(() => Category, { nullable: true, eager: true })
  category?: Category;

  @ManyToMany(() => Tag, { eager: true })
  @JoinTable({
    name: 'product_tags',
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags?: Tag[];

  @OneToMany(() => ProductIngredient, (pi) => pi.product, {
    eager: true,
    cascade: true,
  })
  ingredients: ProductIngredient[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
