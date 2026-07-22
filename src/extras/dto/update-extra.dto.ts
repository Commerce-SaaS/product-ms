import { PartialType } from '@nestjs/mapped-types';
import { CreateExtraDto } from './create-extra.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateExtraDto extends PartialType(CreateExtraDto) {
  @IsUUID()
  organizationId: string;

  @IsUUID()
  id: string;
}
