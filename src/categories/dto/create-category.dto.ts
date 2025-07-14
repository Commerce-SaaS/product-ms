import { IsUUID, IsString, Length, IsOptional } from "class-validator";

export class CreateCategoryDto {
  @IsUUID()
  restaurantId: string;

  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
