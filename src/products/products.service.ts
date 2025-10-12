import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RMQ_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { RpcExceptionHelper } from 'src/common/helpers/rpc-exception.helper';
import { Category } from 'src/categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  logger = new Logger(ProductsService.name);

  constructor(
    @Inject(RMQ_SERVICE) private readonly client: ClientProxy,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const { name, category, restaurantId, tags, ingredients, ...rest } = createProductDto;
    try {
      // Validate if the product already exists
      const existingProduct = await this.productRepository.findOne({
        where: {
          name,
          restaurantId,
        },
      });

      if (existingProduct) {
        RpcExceptionHelper.duplicate('Product');
      }

      // Validate if the category exists
      const existingCategory = await this.categoryRepository.findOne({
        where: { id: createProductDto.category },
      });

      if (!existingCategory) {
        RpcExceptionHelper.notFound('Category');
      }

      // Validate if tags, ingredients, and extras exist
      if (tags && tags.length > 0) {
        const existingTags = await this.tagsRepository.find({
          where: { id: In(tags) },
        });

        const existingIds = existingTags.map((tag) => tag.id);
        const missingTags = tags.filter(
          (tagId) => !existingIds.includes(tagId),
        );

        if (missingTags.length > 0) {
          RpcExceptionHelper.notFound(
            `Tag(s) not found: ${missingTags.join(', ')}`,
          );
        }
      }

      // Validate if the ingredients exist
      //TODO

      // Prepare the product to be saved

      const productToSave: any = {
        ...rest,
        name,
        restaurantId,
        category: category ? { id: category } : undefined,
        tags: tags ? tags.map((tag) => ({ id: tag })) : [],
        ingredients: ingredients ? ingredients.map((ingredient) => ({ id: ingredient })) : []
      };
      const product = await this.productRepository.save(productToSave);
      this.logger.log(`Product created: ${product.name}`);
      return this.findOne(product.id);

    } catch (error) {
      RpcExceptionHelper.handle(error);
    }
  }

  async findAll() {
    const products = await this.productRepository.find({
      relations: ['category', 'tags', 'ingredients'],
    });
    if (!products || products.length === 0) {
      RpcExceptionHelper.notFound('Products');
    }

    return products.map((product) => (
      this.transformProductStructure(product))
    );
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      RpcExceptionHelper.notFound('Product');
    }

    return this.transformProductStructure(product);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  transformProductStructure(product: Product): ProductResponseDto {
    console.log('Transforming product structure:', product);
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      availability: product.availability,
      stock: product.stock,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            description: product.category.description ?? '',
          }
        : null,
      ingredients: product.ingredients.map((pi) => ({
        id: pi.ingredient.id,
        name: pi.ingredient.name,
        quantity: pi.quantity,
      })),
      tags: product.tags
        ? product.tags.map((t) => ({
            id: t.id,
            name: t.name,
          }))
        : [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
