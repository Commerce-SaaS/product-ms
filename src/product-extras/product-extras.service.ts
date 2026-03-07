import { Injectable } from '@nestjs/common';
import { ProductExtra } from './entities/product-extra.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductExtraDto } from './dto/create-product-extra.dto';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';
import { BaseRelationService } from 'src/common/services/base.relations.service';

@Injectable()
export class ProductExtrasService extends BaseRelationService<ProductExtra> {
  constructor(
    @InjectRepository(ProductExtra)
    repo: Repository<ProductExtra>,
  ) {
    super(repo, 'ProductExtra');
  }
  create(dto: CreateProductExtraDto) {
    return this.createRelation(
      {
        organizationId: dto.organizationId,
        productId: dto.productId,
        extraId: dto.extraId,
      },
      dto,
    );
  }

  remove(data: FindOneByOrgDto) {
    return super.softDeleteRelation(data);
  }
}
