import { IsUUID, IsString, IsNumber, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateExtraDto {
  @IsUUID()
  restaurantId: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  categoryIds?: string[];
}