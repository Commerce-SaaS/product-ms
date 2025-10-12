import { Injectable } from '@nestjs/common';
import { CreateProductIngredientDto } from './dto/create-product-ingredient.dto';
import { UpdateProductIngredientDto } from './dto/update-product-ingredient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductIngredient } from './entities/product-ingredient.entity';
import { RpcExceptionHelper } from 'src/common/helpers/rpc-exception.helper';

@Injectable()
export class ProductIngredientsService {
  constructor(
    @InjectRepository(ProductIngredient)
    private readonly productRepository: Repository<ProductIngredient>,
  ) {}
  async create(createProductIngredientDto: CreateProductIngredientDto) {
    const { restaurantId, ingredientId } =
      createProductIngredientDto;
    try {
      const existingIngredient = await this.productRepository.findOne({
        where: {
          ingredientId,
          restaurantId,
        },
      });
      if (existingIngredient) {
        RpcExceptionHelper.duplicate('Product-Ingredient');
      }

      return await this.productRepository.save(createProductIngredientDto);
    } catch (error) {
      RpcExceptionHelper.handle('Product-Ingredient');
    }
  }

  findAll() {
    return `This action returns all productIngredients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productIngredient`;
  }

  update(id: number, updateProductIngredientDto: UpdateProductIngredientDto) {
    return `This action updates a #${id} productIngredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} productIngredient`;
  }
}
