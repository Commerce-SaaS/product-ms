import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { PaginationDto } from 'src/common';
import { BaseService } from 'src/common/services/base.service';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';
import { CacheService } from 'src/common/cache/cache.service';
import { dbQueryDuration } from 'src/metrics/metrics';

const CATEGORY_TTL = 600;
const CATEGORIES_LIST_TTL = 600;

@Injectable()
export class CategoriesService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    repo: Repository<Category>,
    private readonly cache: CacheService,
  ) {
    super(repo, 'Category');
  }

  protected getFindAllRelations(): string[] {
    return ['tags'];
  }
  
  async create(createDto: CreateCategoryDto) {
    const result = await super.create(createDto);
    await this.invalidateCategory(createDto.organizationId, (result as any).id);
    return result;
  }

  async findAll(paginationDto: PaginationDto) {
    const { organizationId } = paginationDto;
    const ver = await this.cache.getVersion(this.versionKey(organizationId));
    const key = this.listKey(organizationId, ver, paginationDto);

    const cached = await this.cache.get(key);
    if (cached) return cached;

    const stopDbTimer = dbQueryDuration.startTimer({ entity: 'category', operation: 'findAll' });
    const result = await super.findAllByOrg(paginationDto);
    stopDbTimer();
    await this.cache.set(key, result, CATEGORIES_LIST_TTL);
    return result;
  }

  async findOne(data: FindOneByOrgDto) {
    if (data.withDeleted) {
      const stopDbTimer = dbQueryDuration.startTimer({ entity: 'category', operation: 'findOne' });
      const result = await super.findOneByOrg(data);
      stopDbTimer();
      return result;
    }

    const key = this.itemKey(data.organizationId, data.id);
    const cached = await this.cache.get(key);
    if (cached) return cached;

    const stopDbTimer = dbQueryDuration.startTimer({ entity: 'category', operation: 'findOne' });
    const result = await super.findOneByOrg(data);
    stopDbTimer();
    if (!result) return null;

    await this.cache.set(key, result, CATEGORY_TTL);
    return result;
  }

  async update(dto: UpdateCategoryDto) {
    const result = await super.updateByOrg(dto);
    await this.invalidateCategory(dto.organizationId, dto.id);
    return result;
  }

  async remove(data: FindOneByOrgDto) {
    const result = await super.softDeleteByOrg(data);
    await this.invalidateCategory(data.organizationId, data.id);
    return result;
  }

  async restore(data: FindOneByOrgDto) {
    const result = await super.restoreByOrg(data);
    await this.invalidateCategory(data.organizationId, data.id);
    return result;
  }

  private itemKey(org: string, id: string) {
    return `cache:category:${org}:${id}`;
  }

  private versionKey(org: string) {
    return `cache:categories:${org}:ver`;
  }

  private listKey(org: string, ver: number, dto: PaginationDto) {
    const filters = JSON.stringify({
      wd: dto.withDeleted ? 1 : 0,
      off: dto.offset ?? 0,
      lim: dto.limit ?? 10,
      q: dto.search ?? null,
    });
    return `cache:categories:${org}:list:v${ver}:${filters}`;
  }

  private async invalidateCategory(org: string, id: string) {
    await this.cache.del(this.itemKey(org, id));
    await this.cache.bumpVersion(this.versionKey(org));
  }
}
