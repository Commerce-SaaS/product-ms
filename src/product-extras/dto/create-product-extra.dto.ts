import { IsUUID } from "class-validator";

export class CreateProductExtraDto {
  @IsUUID()
  organizationId: string;
  
  @IsUUID()
  productId: string;

  @IsUUID()
  extraId: string;
}
