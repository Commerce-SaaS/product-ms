import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common';
import { BaseService } from 'src/common/services/base.service';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';
import { CacheService } from 'src/common/cache/cache.service';
import { dbQueryDuration } from 'src/metrics/metrics';

const INGREDIENT_TTL = 600;
const INGREDIENTS_LIST_TTL = 600;

@Injectable()
export class IngredientsService extends BaseService<Ingredient> {

  constructor(
    @InjectRepository(Ingredient)
    repo: Repository<Ingredient>,
    private readonly cache: CacheService,
  ) {
    super(repo, 'Ingredient');
  }

  async create(createDto: CreateIngredientDto) {
    const result = await super.create(createDto);
    await this.invalidateIngredient(createDto.organizationId, (result as any).id);
    return result;
  }

  async findAll(paginationDto: PaginationDto) {
    const { organizationId } = paginationDto;
    const ver = await this.cache.getVersion(this.versionKey(organizationId));
    const key = this.listKey(organizationId, ver, paginationDto);

    const cached = await this.cache.get(key);
    if (cached) return cached;

    const stopDbTimer = dbQueryDuration.startTimer({ entity: 'ingredient', operation: 'findAll' });
    const result = await super.findAllByOrg(paginationDto);
    stopDbTimer();
    await this.cache.set(key, result, INGREDIENTS_LIST_TTL);
    return result;
  }

  async findOne(data: FindOneByOrgDto) {
    if (data.withDeleted) {
      const stopDbTimer = dbQueryDuration.startTimer({ entity: 'ingredient', operation: 'findOne' });
      const result = await super.findOneByOrg(data);
      stopDbTimer();
      return result;
    }

    const key = this.itemKey(data.organizationId, data.id);
    const cached = await this.cache.get(key);
    if (cached) return cached;

    const stopDbTimer = dbQueryDuration.startTimer({ entity: 'ingredient', operation: 'findOne' });
    const result = await super.findOneByOrg(data);
    stopDbTimer();
    if (!result) return null;

    await this.cache.set(key, result, INGREDIENT_TTL);
    return result;
  }

  async update(dto: UpdateIngredientDto) {
    const result = await super.updateByOrg(dto);
    await this.invalidateIngredient(dto.organizationId, dto.id);
    return result;
  }

  async remove(data: FindOneByOrgDto) {
    const result = await super.softDeleteByOrg(data);
    await this.invalidateIngredient(data.organizationId, data.id);
    return result;
  }

  async restore(data: FindOneByOrgDto) {
    const result = await super.restoreByOrg(data);
    await this.invalidateIngredient(data.organizationId, data.id);
    return result;
  }

  private itemKey(org: string, id: string) {
    return `cache:ingredient:${org}:${id}`;
  }

  private versionKey(org: string) {
    return `cache:ingredients:${org}:ver`;
  }

  private listKey(org: string, ver: number, dto: PaginationDto) {
    const filters = JSON.stringify({
      wd: dto.withDeleted ? 1 : 0,
      off: dto.offset ?? 0,
      lim: dto.limit ?? 10,
      q: dto.search ?? null,
    });
    return `cache:ingredients:${org}:list:v${ver}:${filters}`;
  }

  private async invalidateIngredient(org: string, id: string) {
    await this.cache.del(this.itemKey(org, id));
    await this.cache.bumpVersion(this.versionKey(org));
  }
}
