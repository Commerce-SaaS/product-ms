import { Module } from '@nestjs/common';
import { ProductTagsService } from './product-tags.service';
import { ProductTagsController } from './product-tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTag } from './entities/product-tag.entity';

@Module({
  controllers: [ProductTagsController],
  providers: [ProductTagsService],
  imports: [TypeOrmModule.forFeature([ProductTag])]
})
export class ProductTagsModule {}
