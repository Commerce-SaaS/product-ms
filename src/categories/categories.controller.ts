import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CATEGORIES_PATTERNS } from './patterns/categories';
import { PaginationDto } from 'src/common';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern(CATEGORIES_PATTERNS.CREATE)
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @MessagePattern(CATEGORIES_PATTERNS.FIND_ALL)
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.categoriesService.findAll(paginationDto);
  }

  @MessagePattern(CATEGORIES_PATTERNS.FIND_ONE)
  findOne(@Payload() data: FindOneByOrgDto) {
    return this.categoriesService.findOne(data);
  }

  @MessagePattern(CATEGORIES_PATTERNS.UPDATE)
  update(@Payload() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(updateCategoryDto);
  }

  @MessagePattern(CATEGORIES_PATTERNS.DELETE)
  remove(@Payload() data: FindOneByOrgDto) {
    return this.categoriesService.remove(data);
  }

  @MessagePattern(CATEGORIES_PATTERNS.RESTORE)
  restore(@Payload() data: FindOneByOrgDto) {
    return this.categoriesService.restore(data);
  }
}
