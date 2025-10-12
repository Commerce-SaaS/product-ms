import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';

import { Ingredient } from './entities/ingredient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from 'src/transports/rabbitmq.module';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
  imports: [RabbitMQModule, TypeOrmModule.forFeature([Ingredient])],
})
export class IngredientsModule {}
