import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { INGREDIENT_PATTERNS } from './patterns/ingredients_patterns';
import { PaginationDto } from 'src/common';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';

@Controller()
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @MessagePattern(INGREDIENT_PATTERNS.CREATE)
  create(@Payload() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @MessagePattern(INGREDIENT_PATTERNS.FIND_ALL)
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.ingredientsService.findAll(paginationDto);
  }

  @MessagePattern(INGREDIENT_PATTERNS.FIND_ONE)
  findOne(@Payload() data: FindOneByOrgDto) {
    return this.ingredientsService.findOne(data);
  }

  @MessagePattern(INGREDIENT_PATTERNS.UPDATE)
  update(@Payload() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientsService.update(updateIngredientDto);
  }

  @MessagePattern(INGREDIENT_PATTERNS.DELETE)
  remove(@Payload() data: FindOneByOrgDto) {
    return this.ingredientsService.remove(data);
  }

  @MessagePattern(INGREDIENT_PATTERNS.RESTORE)
  restore(@Payload() data: FindOneByOrgDto) {
    return this.ingredientsService.restore(data);
  }

}
