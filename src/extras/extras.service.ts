import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { ILike, Repository } from 'typeorm';
import { Extra } from './entities/extra.entity';
import { RpcExceptionHelper } from 'src/common/helpers/rpc-exception.helper';

@Injectable()
export class ExtrasService {
  constructor(
    @InjectRepository(Extra)
    private readonly extraRepository: Repository<Extra>,
  ) {}
  async create(createExtraDto: CreateExtraDto) {

    // Verify if an extra with the same name exists for the same restaurant
    const { name, restaurantId } = createExtraDto;

    
    try {
      const existingExtra = await this.extraRepository.findOne({
        where: { name: ILike(name), restaurantId },
      });

      if (existingExtra) {
        RpcExceptionHelper.duplicate('Extra');
      }
      return await this.extraRepository.save(createExtraDto);
    } catch (error) {
      RpcExceptionHelper.handle(error);
    }
  }

  findAll() {
    return `This action returns all extras`;
  }

  findOne(id: number) {
    return `This action returns a #${id} extra`;
  }

  update(id: number, updateExtraDto: UpdateExtraDto) {
    return `This action updates a #${id} extra`;
  }

  remove(id: number) {
    return `This action removes a #${id} extra`;
  }
}
