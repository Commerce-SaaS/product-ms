import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { RpcExceptionHelper } from 'src/common/helpers/rpc-exception.helper';
import { Category } from 'src/categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { name, restaurantId, category, tags, ...rest } = createProductDto;
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

      // Validate if the extras exist
      
      // Prepare the product to be saved

      const productToSave: any = {
        ...rest,
        name,
        restaurantId,
        category: category ? { id: category } : undefined,
        tags: tags ? tags.map((tag) => ({ id: tag })) : [],
      };

      return await this.productRepository.save(productToSave);
    } catch (error) {
      RpcExceptionHelper.handle(error);
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
}
