import { Category } from "src/categories/entities/category.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    restaurantId: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category


    @ManyToMany(() => Product, (product) => product.tags)
    products: Product[];
}
