import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tag } from './entities/tag.entity';
import { RabbitMQModule } from 'src/transports/rabbitmq.module';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [RabbitMQModule, TypeOrmModule.forFeature([Tag])],
})
export class TagsModule {}
