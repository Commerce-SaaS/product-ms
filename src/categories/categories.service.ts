import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { RpcExceptionHelper } from 'src/common/helpers/rpc-exception.helper';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>
) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { name, restaurantId } = createCategoryDto;
    try {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name, restaurantId }
      });

      if (existingCategory) {
        RpcExceptionHelper.duplicate('Category');
      }
      return await this.categoryRepository.save(createCategoryDto);
    } catch (error) {
      RpcExceptionHelper.handle(error);  
    }
    
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
