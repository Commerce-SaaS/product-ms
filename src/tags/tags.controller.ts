import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TAG_PATTERNS } from './patterns/tag_patterns';
import { PaginationDto } from 'src/common';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';

@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @MessagePattern(TAG_PATTERNS.CREATE)
  async create(@Payload() createTagDto: CreateTagDto) {
    return await this.tagsService.create(createTagDto);
  }

  @MessagePattern(TAG_PATTERNS.FIND_ALL)
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.tagsService.findAll(paginationDto);
  }

  @MessagePattern(TAG_PATTERNS.FIND_ONE)
  findOne(@Payload() data: FindOneByOrgDto) {
    return this.tagsService.findOne(data);
  }

  @MessagePattern(TAG_PATTERNS.UPDATE)
  update(@Payload() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(updateTagDto);
  }

  @MessagePattern(TAG_PATTERNS.DELETE)
  remove(@Payload() data: FindOneByOrgDto) {
    return this.tagsService.remove(data);
  }

  @MessagePattern(TAG_PATTERNS.RESTORE)
  restore(@Payload() data: FindOneByOrgDto) {
    return this.tagsService.restore(data);
  }
}
