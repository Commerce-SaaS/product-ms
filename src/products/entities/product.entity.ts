import { Category } from 'src/categories/entities/category.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
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
} from 'typeorm';
// import { Category } from './category.entity';
// import { Tag } from './tag.entity';
// import { Ingredient } from './ingredient.entity';
// import { Extra } from './extra.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  restaurantId: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', nullable: true })
  stock?: number;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

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

  @ManyToMany(() => Ingredient, { eager: true })
  @JoinTable({
    name: 'product_ingredients',
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ingredientId', referencedColumnName: 'id' },
  })
  ingredients?: Ingredient[];

  //   @ManyToMany(() => Extra, { eager: true })
  //   @JoinTable({
  //     name: 'product_extras',
  //     joinColumn: { name: 'productId', referencedColumnName: 'id' },
  //     inverseJoinColumn: { name: 'extraId', referencedColumnName: 'id' },
  //   })
  //   extras?: Extra[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
