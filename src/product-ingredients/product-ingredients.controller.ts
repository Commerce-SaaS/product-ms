import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductIngredientsService } from './product-ingredients.service';
import { CreateProductIngredientDto } from './dto/create-product-ingredient.dto';
import { UpdateProductIngredientDto } from './dto/update-product-ingredient.dto';

@Controller()
export class ProductIngredientsController {
  constructor(private readonly productIngredientsService: ProductIngredientsService) {}

  @MessagePattern('createProductIngredient')
  create(@Payload() createProductIngredientDto: CreateProductIngredientDto) {
    return this.productIngredientsService.create(createProductIngredientDto);
  }

  @MessagePattern('findAllProductIngredients')
  findAll() {
    return this.productIngredientsService.findAll();
  }

  @MessagePattern('findOneProductIngredient')
  findOne(@Payload() id: number) {
    return this.productIngredientsService.findOne(id);
  }

  @MessagePattern('updateProductIngredient')
  update(@Payload() updateProductIngredientDto: UpdateProductIngredientDto) {
    return this.productIngredientsService.update(updateProductIngredientDto.id, updateProductIngredientDto);
  }

  @MessagePattern('removeProductIngredient')
  remove(@Payload() id: number) {
    return this.productIngredientsService.remove(id);
  }
}
