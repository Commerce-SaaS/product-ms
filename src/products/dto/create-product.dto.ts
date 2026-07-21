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
  IsHexColor,
  IsBoolean,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductAvailability } from 'src/common/enums/product-availability.enum';

export class ProductUiDto {
  @IsOptional()
  @IsHexColor()
  backgroundColor?: string;

  @IsOptional()
  @IsHexColor()
  textColor?: string;

  @IsOptional()
  @IsString()
  badge?: string;

  @IsOptional()
  @IsBoolean()
  highlight?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

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
  @IsNumber()
  @Min(0)
  reservedStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @IsOptional()
  @IsBoolean()
  trackStock?: boolean;

  @IsOptional()
  @IsEnum(ProductAvailability)
  availability?: ProductAvailability;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

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

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductUiDto)
  ui?: ProductUiDto;
}
