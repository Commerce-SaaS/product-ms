import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ExtrasService } from './extras.service';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';

@Controller()
export class ExtrasController {
  constructor(private readonly extrasService: ExtrasService) {}

  @MessagePattern('createExtra')
  create(@Payload() createExtraDto: CreateExtraDto) {
    return this.extrasService.create(createExtraDto);
  }

  @MessagePattern('findAllExtras')
  findAll() {
    return this.extrasService.findAll();
  }

  @MessagePattern('findOneExtra')
  findOne(@Payload() id: number) {
    return this.extrasService.findOne(id);
  }

  @MessagePattern('updateExtra')
  update(@Payload() updateExtraDto: UpdateExtraDto) {
    return this.extrasService.update(updateExtraDto.id, updateExtraDto);
  }

  @MessagePattern('removeExtra')
  remove(@Payload() id: number) {
    return this.extrasService.remove(id);
  }
}
