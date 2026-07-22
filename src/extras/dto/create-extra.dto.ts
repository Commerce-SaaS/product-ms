import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
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
