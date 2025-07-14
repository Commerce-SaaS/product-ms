import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { name, restaurantId } = createProductDto;
    try {
      // Validate if the product already exists
      const existingProduct = await this.productRepository.findOne({
        where: 
        { 
          name, 
          restaurantId,
        },
      });

      if (existingProduct) {
        throw new RpcException({
          message: 'Product already exists',
          status: HttpStatus.CONFLICT, //409
        });
      }

      // Validate if the restaurant exists

      // Validate if the category exists

      // Validate if tags, ingredients, and extras exist

      // Convert category string to Category entity reference if necessary
      const { category, ...rest } = createProductDto;
      const productToSave: any = {
        ...rest,
        category: category ? { id: category } : undefined, // assumes category is an ID
      };

      return await this.productRepository.save(productToSave);
    } catch (error) {
      console.log('Error creating product:', error);
      // If the product already exists, throw an error
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new RpcException({
        message: 'Duplicate entry: product already exists',
        status: HttpStatus.CONFLICT,
      });
    }

    throw new RpcException({
      message: error.detail || 'Internal server error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
