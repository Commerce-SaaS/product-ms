import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { ProductTag } from 'src/product-tags/entities/product-tag.entity';
import { ProductIngredient } from 'src/product-ingredients/entities/product-ingredient.entity';
import { ProductExtra } from 'src/product-extras/entities/product-extra.entity';
import { Extra } from 'src/extras/entities/extra.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Tag } from 'src/tags/entities/tag.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product, Category, Tag, Ingredient, Extra, ProductTag, ProductIngredient, ProductExtra])],
})
export class ProductsModule {}
