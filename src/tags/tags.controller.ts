import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @MessagePattern('createTag')
  create(@Payload() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @MessagePattern('findAllTags')
  findAll() {
    return this.tagsService.findAll();
  }

  @MessagePattern('findOneTag')
  findOne(@Payload() id: number) {
    return this.tagsService.findOne(id);
  }

  @MessagePattern('updateTag')
  update(@Payload() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(updateTagDto.id, updateTagDto);
  }

  @MessagePattern('removeTag')
  remove(@Payload() id: number) {
    return this.tagsService.remove(id);
  }
}
