import { IsUUID, IsString, Length, IsOptional, ValidateNested, IsHexColor, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryUiDto {
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
export class CreateCategoryDto {
  @IsUUID()
  organizationId: string;

  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryUiDto)
  ui?: CategoryUiDto;
}
