import { PartialType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreateProductTagDto } from './create-product-tag.dto';

export class UpdateProductTagDto extends PartialType(CreateProductTagDto) {
  @IsUUID()
  id: string;

  @IsUUID()
  organizationId: string;
}
