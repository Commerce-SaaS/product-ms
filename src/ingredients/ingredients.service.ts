import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { number } from 'zod';
import { Ingredient } from './entities/ingredient.entity';
import { Repository } from 'typeorm';
import { RpcExceptionHelper } from 'src/common/helpers/rpc-exception.helper';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createIngredientDto: CreateIngredientDto) {
    const { name, restaurantId } = createIngredientDto;
    try {
      const existingIngredient = await this.ingredientRepository.findOne({
        where: {
          name,
          restaurantId,
        },
      });
      if (existingIngredient) {
        RpcExceptionHelper.duplicate('Ingredient');
      }

      return await this.ingredientRepository.save(createIngredientDto);
    } catch (error) {
      RpcExceptionHelper.handle(error);
    }
  }

  findAll() {
    return `This action returns all ingredients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ingredient`;
  }

  update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return `This action updates a #${id} ingredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredient`;
  }
}
