import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { NatsModule } from 'src/transports/nats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [NatsModule, TypeOrmModule.forFeature([Product, Category, Tag])],
})
export class ProductsModule {}
