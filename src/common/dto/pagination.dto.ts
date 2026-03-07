import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class PaginationDto {
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
  search?: string;
}
