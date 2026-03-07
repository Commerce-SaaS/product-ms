import { PartialType } from '@nestjs/mapped-types';
import { CreateProductIngredientDto } from './create-product-ingredient.dto';
import { IsUUID } from 'class-validator';

export class UpdateProductIngredientDto extends PartialType(CreateProductIngredientDto) {
  @IsUUID()
  id: string;

  @IsUUID()
  organizationId: string;
}
