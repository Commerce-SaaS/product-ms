import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientDto } from './create-ingredient.dto';
import { IsUUID } from 'class-validator';

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {
    @IsUUID()
    id: string;
  
    @IsUUID()
    organizationId: string;
}
