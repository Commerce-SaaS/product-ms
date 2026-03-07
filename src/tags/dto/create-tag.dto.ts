import { IsUUID, IsString, Length } from "class-validator";

export class CreateTagDto {
  @IsUUID()
  organizationId: string;

  @IsString()
  @Length(1, 100)
  name: string;
}
