import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ExtrasService } from './extras.service';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { EXTRA_PATTERNS } from './patterns/extra_patterns';
import { PaginationDto } from 'src/common';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';

@Controller()
export class ExtrasController {
  constructor(private readonly extrasService: ExtrasService) {}

  @MessagePattern(EXTRA_PATTERNS.CREATE)
  create(@Payload() createExtraDto: CreateExtraDto) {
    return this.extrasService.create(createExtraDto);
  }

  @MessagePattern(EXTRA_PATTERNS.FIND_ALL)
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.extrasService.findAll(paginationDto);
  }

  @MessagePattern(EXTRA_PATTERNS.FIND_ONE)
  findOne(@Payload() data: FindOneByOrgDto) {
    return this.extrasService.findOne(data);
  }

  @MessagePattern(EXTRA_PATTERNS.UPDATE)
  update(@Payload() updateExtraDto: UpdateExtraDto) {
    return this.extrasService.update(updateExtraDto);
  }

  @MessagePattern(EXTRA_PATTERNS.DELETE)
  softDelete(@Payload() data: FindOneByOrgDto) {
    return this.extrasService.softDelete(data);
  }

  @MessagePattern(EXTRA_PATTERNS.RESTORE)
  restore(@Payload() data: FindOneByOrgDto) {
    return this.extrasService.restore(data);
  }
}
