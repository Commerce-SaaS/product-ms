import { Tag } from 'src/tags/entities/tag.entity';
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

@Entity({ name: 'product_tags' })
@Unique(['productId', 'tagId', 'organizationId'])
export class ProductTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' })
  tagId: string;

  @ManyToOne(() => Tag, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tagId' })
  tag: Tag;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
