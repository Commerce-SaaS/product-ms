import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductTagDto } from './dto/create-product-tag.dto';
import { ProductTag } from './entities/product-tag.entity';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';
import { BaseRelationService } from 'src/common/services/base.relations.service';

@Injectable()
export class ProductTagsService extends BaseRelationService<ProductTag> {
  constructor(
    @InjectRepository(ProductTag)
    repo: Repository<ProductTag>,
  ) {
    super(repo, 'ProductTag');
  }
  create(dto: CreateProductTagDto) {
    return this.createRelation(
      {
        organizationId: dto.organizationId,
        productId: dto.productId,
        tagId: dto.tagId,
      },
      dto,
    );
  }

  remove(data: FindOneByOrgDto) {
    return super.softDeleteRelation(data);
  }
}
