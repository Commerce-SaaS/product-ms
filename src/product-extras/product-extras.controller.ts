import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PRODUCT_EXTRAS_PATTERNS } from './patterns/product_extras_patterns';
import { ProductExtrasService } from './product-extras.service';
import { CreateProductExtraDto } from './dto/create-product-extra.dto';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';

@Controller()
export class ProductExtrasController {
  constructor(private readonly productExtrasService: ProductExtrasService) {}

  @MessagePattern(PRODUCT_EXTRAS_PATTERNS.CREATE)
  create(@Payload() createProductExtraDto: CreateProductExtraDto) {
    return this.productExtrasService.create(createProductExtraDto);
  }

  @MessagePattern(PRODUCT_EXTRAS_PATTERNS.DELETE)
  remove(@Payload() data: FindOneByOrgDto) {
    return this.productExtrasService.remove(data);
  }
}
