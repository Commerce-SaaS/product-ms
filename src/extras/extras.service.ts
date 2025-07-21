import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { Repository } from 'typeorm';
import { Extra } from './entities/extra.entity';

@Injectable()
export class ExtrasService {
  constructor(@InjectRepository(Extra) private readonly extraRepository: Repository<Extra>,) {}
  async create(createExtraDto: CreateExtraDto) {
    return await this.extraRepository.save(createExtraDto);
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
