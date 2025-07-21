import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { NatsModule } from 'src/transports/nats.module';
import { Type } from 'class-transformer';
import { Ingredient } from './entities/ingredient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
  imports: [NatsModule, TypeOrmModule.forFeature([Ingredient])],
})
export class IngredientsModule {}
