import { Controller } from '@nestjs/common';
import { ProductTagsService } from './product-tags.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PRODUCT_TAGS_PATTERNS } from './patterns/product_tags_patterns';
import { CreateProductTagDto } from './dto/create-product-tag.dto';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';

@Controller()
export class ProductTagsController {
  constructor(private readonly productTagsService: ProductTagsService) {}

    @MessagePattern(PRODUCT_TAGS_PATTERNS.CREATE)
    create(@Payload() createProductTagDto: CreateProductTagDto) {
      return this.productTagsService.create(createProductTagDto);
    }
  
    @MessagePattern(PRODUCT_TAGS_PATTERNS.DELETE)
    remove(@Payload() data: FindOneByOrgDto) {
      return this.productTagsService.remove(data);
    }
}
