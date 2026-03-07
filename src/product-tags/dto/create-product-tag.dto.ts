import { IsUUID } from 'class-validator';

export class CreateProductTagDto {
  @IsUUID()
  organizationId: string;

  @IsUUID()
  productId: string;

  @IsUUID()
  tagId: string;
}
