import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';
import { IsUUID } from 'class-validator';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @IsUUID()
  id: string;

  @IsUUID()
  organizationId: string;
}
