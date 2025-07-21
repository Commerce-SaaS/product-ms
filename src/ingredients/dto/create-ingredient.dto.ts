import { IsUUID, IsString, Length } from "class-validator";

export class CreateIngredientDto {
  @IsUUID()
  restaurantId: string;

  @IsString()
  @Length(1, 100)
  name: string;
}
