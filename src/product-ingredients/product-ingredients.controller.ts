import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductIngredientsService } from './product-ingredients.service';
import { CreateProductIngredientDto } from './dto/create-product-ingredient.dto';
import { PRODUCT_INGREDIENTS_PATTERNS } from './patterns/ingredients_patterns';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';

@Controller()
export class ProductIngredientsController {
  constructor(private readonly productIngredientsService: ProductIngredientsService) {}

  @MessagePattern(PRODUCT_INGREDIENTS_PATTERNS.CREATE)
  create(@Payload() createExtraDto: CreateProductIngredientDto) {
    return this.productIngredientsService.create(createExtraDto);
  }

  @MessagePattern(PRODUCT_INGREDIENTS_PATTERNS.DELETE)
  remove(@Payload() data: FindOneByOrgDto) {
    return this.productIngredientsService.remove(data);
  }
}
