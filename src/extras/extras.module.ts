import { Module } from '@nestjs/common';
import { ExtrasService } from './extras.service';
import { ExtrasController } from './extras.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Extra } from './entities/extra.entity';
import { RabbitMQModule } from 'src/transports/rabbitmq.module';

@Module({
  controllers: [ExtrasController],
  providers: [ExtrasService],
  imports: [RabbitMQModule, TypeOrmModule.forFeature([Extra])],
})
export class ExtrasModule {}
