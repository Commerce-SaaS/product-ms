import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsIn, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ProductAvailability } from 'src/common/enums/product-availability.enum';

export const PRODUCT_SORT_FIELDS = ['name', 'price', 'stock', 'createdAt'] as const;
export type ProductSortField = (typeof PRODUCT_SORT_FIELDS)[number];

export class PaginationProductDto {
  @IsUUID()
  organizationId: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  withDeleted?: boolean;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  limit?: number;

  @IsString()
  @IsOptional()
  ingredient?: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(ProductAvailability)
  @IsOptional()
  availability?: ProductAvailability;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Boolean(value)))
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Boolean(value)))
  onlyDeleted?: boolean;

  @IsIn(PRODUCT_SORT_FIELDS)
  @IsOptional()
  sortBy?: ProductSortField;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
