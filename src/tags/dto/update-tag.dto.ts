import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @IsString()
  id: string;

  @IsUUID()
  organizationId: string;
}
