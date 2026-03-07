import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  IsArray,
  Length,
  IsEnum,
  IsObject,
} from 'class-validator';
import { ProductAvailability } from 'src/common/enums/product-availability.enum';

export class CreateProductDto {
  @IsUUID()
  organizationId: string;

  @IsString()
  @Length(1, 100)
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsEnum(ProductAvailability)
  availability?: ProductAvailability;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  imageKey?: string;

  //Relationships
  @IsUUID()
  @IsOptional()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  extras?: string[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  ingredients?: { ingredientId: string; quantity: number }[];
}
