import { Injectable } from '@nestjs/common';
import { CreateProductIngredientDto } from './dto/create-product-ingredient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductIngredient } from './entities/product-ingredient.entity';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';
import { BaseRelationService } from 'src/common/services/base.relations.service';

@Injectable()
export class ProductIngredientsService extends BaseRelationService<ProductIngredient> {
  constructor(
    @InjectRepository(ProductIngredient)
    repo: Repository<ProductIngredient>,
  ) {
    super(repo, 'ProductIngredient');
  }
  create(dto: CreateProductIngredientDto) {
    return this.createRelation(
      {
        organizationId: dto.organizationId,
        productId: dto.productId,
        ingredientId: dto.ingredientId,
      },
      dto,
    );
  }

  remove(data: FindOneByOrgDto) {
    return super.softDeleteRelation(data);
  }
}
