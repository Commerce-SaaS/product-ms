import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { Repository } from 'typeorm';
import { Extra } from './entities/extra.entity';
import { PaginationDto } from 'src/common';
import { BaseService } from 'src/common/services/base.service';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';

@Injectable()
export class ExtrasService extends BaseService<Extra> {
  constructor(
    @InjectRepository(Extra)
    repo: Repository<Extra>,
  ) {
    super(repo, 'Extra');
  }
  create(createDto: CreateExtraDto) {
    return super.create(createDto);
  }

  findAll(paginationDto: PaginationDto) {
    return super.findAllByOrg(paginationDto);
  }

  findOne(data: FindOneByOrgDto) {
    return super.findOneByOrg(data);
  }

  update(dto: UpdateExtraDto) {
    return super.updateByOrg(dto);
  }

  softDelete(data: FindOneByOrgDto) {
    return super.softDeleteByOrg(data);
  }

  restore(data: FindOneByOrgDto) {
    return super.restoreByOrg(data);
  }
}
