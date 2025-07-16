import { IsUUID, IsString, Length } from "class-validator";

export class CreateTagDto {
  @IsUUID()
  restaurantId: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  @Length(1, 100)
  name: string;
}
