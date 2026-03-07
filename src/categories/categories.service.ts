import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { PaginationDto } from 'src/common';
import { BaseService } from 'src/common/services/base.service';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';

@Injectable()
export class CategoriesService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    repo: Repository<Category>,
  ) {
    super(repo, 'Category');
  }
  create(createDto: CreateCategoryDto) {
    return super.create(createDto);
  }

  findAll(paginationDto: PaginationDto) {
    return super.findAllByOrg(paginationDto);
  }

  findOne(data: FindOneByOrgDto) {
    return super.findOneByOrg(data);
  }

  update(dto: UpdateCategoryDto) {
    return super.updateByOrg(dto);
  }

  remove(data: FindOneByOrgDto) {
    return super.softDeleteByOrg(data);
  }

  restore(data: FindOneByOrgDto) {
    return super.restoreByOrg(data);
  }
}

