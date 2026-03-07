import { Module } from '@nestjs/common';
import { ProductIngredientsService } from './product-ingredients.service';
import { ProductIngredientsController } from './product-ingredients.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductIngredient } from './entities/product-ingredient.entity';

@Module({
  controllers: [ProductIngredientsController],
  providers: [ProductIngredientsService],
  imports: [TypeOrmModule.forFeature([ProductIngredient])],
})
export class ProductIngredientsModule {}
