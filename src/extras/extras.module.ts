import { Module } from '@nestjs/common';
import { ExtrasService } from './extras.service';
import { ExtrasController } from './extras.controller';
import { NatsModule } from 'src/transports/nats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Extra } from './entities/extra.entity';

@Module({
  controllers: [ExtrasController],
  providers: [ExtrasService],
  imports: [NatsModule, TypeOrmModule.forFeature([Extra])],
})
export class ExtrasModule {}
