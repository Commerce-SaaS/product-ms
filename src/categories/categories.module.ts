import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { RabbitMQModule } from 'src/transports/rabbitmq.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [RabbitMQModule, TypeOrmModule.forFeature([Category])],
})
export class CategoriesModule {}
