import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCT_PATTERNS } from './patterns/product_patterns';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';
import { PaginationProductDto } from './dto/paginationProduct.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern(PRODUCT_PATTERNS.CREATE)
  async create(@Payload() createProductDto: CreateProductDto) {
    return await this.productsService.createProduct(createProductDto);
  }

  @MessagePattern(PRODUCT_PATTERNS.FIND_ALL)
  findAll(@Payload() paginationProductDto: PaginationProductDto) {
    return this.productsService.findAllProducts(paginationProductDto);
  }

  @MessagePattern(PRODUCT_PATTERNS.FIND_ONE)
  findOne(@Payload() data: FindOneByOrgDto) {
    return this.productsService.findOne(data);
  }

  @MessagePattern(PRODUCT_PATTERNS.UPDATE)
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  @MessagePattern(PRODUCT_PATTERNS.DELETE)
  remove(@Payload() data: FindOneByOrgDto) {
    return this.productsService.remove(data);
  }

  @MessagePattern(PRODUCT_PATTERNS.RESTORE)
  restore(@Payload() data: FindOneByOrgDto) {
    return this.productsService.restore(data);
  }
}
