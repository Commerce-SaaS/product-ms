import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  IsArray,
  Length,
  IsEnum,
} from 'class-validator';
import { ProductAvailability } from 'src/common/enums/product-availability.enum';

export class CreateProductDto {
  @IsUUID()
  restaurantId: string;
  
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
  ingredients?: string[];
}

