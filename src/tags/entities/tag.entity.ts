import { ProductTag } from 'src/product-tags/entities/product-tag.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { TagUiDto } from '../dto/create-tag.dto';
import { Category } from 'src/categories/entities/category.entity';

@Entity('tags')
@Index(['organizationId', 'name', 'categoryId'], {
  unique: true,
  where: '"deletedAt" IS NULL',
})
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => ProductTag, (pt) => pt.tag)
  productTags: ProductTag[];

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.tags, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  ui?: TagUiDto;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
