import { Module } from '@nestjs/common';
import { ProductExtrasService } from './product-extras.service';
import { ProductExtrasController } from './product-extras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductExtra } from './entities/product-extra.entity';

@Module({
  controllers: [ProductExtrasController],
  providers: [ProductExtrasService],
  imports: [TypeOrmModule.forFeature([ProductExtra])]
})
export class ProductExtrasModule {}
