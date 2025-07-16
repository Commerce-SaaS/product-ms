import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { RpcException } from '@nestjs/microservices';
import { RpcExceptionHelper } from 'src/common/helpers/rpc-exception.helper';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const { name, categoryId, restaurantId } = createTagDto;
    try {
      // Validate if the tag already exists
      const existingTag = await this.tagRepository.findOne({
        where: { name, restaurantId },
      });

      if (existingTag) {
        RpcExceptionHelper.duplicate('Tag');
      }

      // Validate if the category exists
      const existingCategory = await this.tagRepository.findOne({
        where: { id: categoryId },
      });

      if (!existingCategory) {
        RpcExceptionHelper.notFound('Category');
      }

      //

      // Prepare the tag to be saved
      const tagToSave: any = {
        name,
        restaurantId,
        category: categoryId ? { id: categoryId } : undefined,
      };

      // Save the tag
      return await this.tagRepository.save(tagToSave);
    } catch (error) {
      RpcExceptionHelper.handle(error);
    }
  }

  findAll() {
    return `This action returns all tags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
