import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common';
import { BaseService } from 'src/common/services/base.service';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';

@Injectable()
export class IngredientsService extends BaseService<Ingredient> {

  constructor(
    @InjectRepository(Ingredient)
    repo: Repository<Ingredient>,
  ) {
    super(repo, 'Ingredient');
  }

  create(createDto: CreateIngredientDto) {
    return super.create(createDto);
  }

  findAll(paginationDto: PaginationDto) {
    return super.findAllByOrg(paginationDto);
  }

  findOne(data: FindOneByOrgDto) {
    return super.findOneByOrg(data);
  }

  update(dto: UpdateIngredientDto) {
    return super.updateByOrg(dto);
  }

  remove(data: FindOneByOrgDto) {
    return super.softDeleteByOrg(data);
  }

    restore(data: FindOneByOrgDto) {
    return super.restoreByOrg(data);
  }
}
