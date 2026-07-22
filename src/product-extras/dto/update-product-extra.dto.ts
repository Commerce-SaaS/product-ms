import { PartialType } from '@nestjs/mapped-types';
import { CreateProductExtraDto } from './create-product-extra.dto';
import { IsUUID } from 'class-validator';

export class UpdateProductExtraDto extends PartialType(CreateProductExtraDto) {
  @IsUUID()
  id: string;

  @IsUUID()
  organizationId: string;
}
