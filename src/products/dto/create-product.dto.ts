import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  IsBoolean,
  IsArray,
  Length,
} from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  restaurantId: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  restaurantName?: string;

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
  @IsBoolean()
  isAvailable?: boolean;

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

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  extras?: string[];
}

