import { IsUUID, IsInt, Min } from "class-validator";

export class CreateProductIngredientDto {
  @IsUUID()
  organizationId?: string;
  
  @IsUUID()
  productId?: string;

  @IsUUID()
  ingredientId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
