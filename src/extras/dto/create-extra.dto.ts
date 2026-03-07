import {
  IsUUID,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  Min,
} from 'class-validator';

export class CreateExtraDto {
  @IsUUID()
  organizationId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number; 
}
