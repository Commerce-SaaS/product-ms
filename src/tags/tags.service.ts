import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { PaginationDto } from 'src/common';
import { BaseService } from 'src/common/services/base.service';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';

@Injectable()
export class TagsService extends BaseService<Tag> {
  constructor(
    @InjectRepository(Tag)
    repo: Repository<Tag>,
  ) {
    super(repo, 'Tag');
  }

  create(createDto: CreateTagDto) {
    return super.create(createDto);
  }

  findAll(paginationDto: PaginationDto) {
    return super.findAllByOrg(paginationDto);
  }

  findOne(data: FindOneByOrgDto) {
    return super.findOneByOrg(data);
  }

  update(dto: UpdateTagDto) {
    return super.updateByOrg(dto);
  }

  remove(data: FindOneByOrgDto) {
    return super.softDeleteByOrg(data);
  }

  restore(data: FindOneByOrgDto) {
    return super.restoreByOrg(data);
  }
}
