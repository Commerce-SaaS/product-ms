import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientDto } from './create-ingredient.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {
    @IsString()
    id: string;
  
    @IsUUID()
    organizationId: string;
}
