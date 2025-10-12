import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { RabbitMQModule } from 'src/transports/rabbitmq.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [RabbitMQModule, TypeOrmModule.forFeature([Product, Category, Tag, Ingredient])],
})
export class ProductsModule {}
