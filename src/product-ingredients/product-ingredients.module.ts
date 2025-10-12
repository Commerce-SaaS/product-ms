import { Module } from '@nestjs/common';
import { ProductIngredientsService } from './product-ingredients.service';
import { ProductIngredientsController } from './product-ingredients.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductIngredient } from './entities/product-ingredient.entity';
import { RabbitMQModule } from 'src/transports/rabbitmq.module';

@Module({
  controllers: [ProductIngredientsController],
  providers: [ProductIngredientsService],
  imports: [RabbitMQModule, TypeOrmModule.forFeature([ProductIngredient])],
})
export class ProductIngredientsModule {}
