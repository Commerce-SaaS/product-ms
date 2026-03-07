import { Module } from '@nestjs/common';
import { ExtrasService } from './extras.service';
import { ExtrasController } from './extras.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Extra } from './entities/extra.entity';

@Module({
  controllers: [ExtrasController],
  providers: [ExtrasService],
  imports: [TypeOrmModule.forFeature([Extra])],
})
export class ExtrasModule {}
