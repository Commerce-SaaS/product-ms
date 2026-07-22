import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { PaginationDto } from 'src/common';
import { BaseService } from 'src/common/services/base.service';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';
import { CacheService } from 'src/common/cache/cache.service';
import { dbQueryDuration } from 'src/metrics/metrics';

const TAG_TTL = 600;
const TAGS_LIST_TTL = 600;

@Injectable()
export class TagsService extends BaseService<Tag> {
  constructor(
    @InjectRepository(Tag)
    repo: Repository<Tag>,
    private readonly cache: CacheService,
  ) {
    super(repo, 'Tag');
  }

  protected getUniqueWhere(dto: any) {
    return {
      name: dto.name,
      organizationId: dto.organizationId,
      categoryId: dto.categoryId,
    };
  }

  async create(createDto: CreateTagDto) {
    const result = await super.create(createDto);
    await this.invalidateTag(createDto.organizationId, (result as any).id);
    return result;
  }

  async findAll(paginationDto: PaginationDto) {
    const { organizationId } = paginationDto;
    const ver = await this.cache.getVersion(this.versionKey(organizationId));
    const key = this.listKey(organizationId, ver, paginationDto);

    const cached = await this.cache.get(key);
    if (cached) return cached;

    const stopDbTimer = dbQueryDuration.startTimer({ entity: 'tag', operation: 'findAll' });
    const result = await super.findAllByOrg(paginationDto);
    stopDbTimer();
    await this.cache.set(key, result, TAGS_LIST_TTL);
    return result;
  }

  async findOne(data: FindOneByOrgDto) {
    if (data.withDeleted) {
      const stopDbTimer = dbQueryDuration.startTimer({ entity: 'tag', operation: 'findOne' });
      const result = await super.findOneByOrg(data);
      stopDbTimer();
      return result;
    }

    const key = this.itemKey(data.organizationId, data.id);
    const cached = await this.cache.get(key);
    if (cached) return cached;

    const stopDbTimer = dbQueryDuration.startTimer({ entity: 'tag', operation: 'findOne' });
    const result = await super.findOneByOrg(data);
    stopDbTimer();
    if (!result) return null;

    await this.cache.set(key, result, TAG_TTL);
    return result;
  }

  async update(dto: UpdateTagDto) {
    const result = await super.updateByOrg(dto);
    await this.invalidateTag(dto.organizationId, dto.id);
    return result;
  }

  async remove(data: FindOneByOrgDto) {
    const result = await super.softDeleteByOrg(data);
    await this.invalidateTag(data.organizationId, data.id);
    return result;
  }

  async restore(data: FindOneByOrgDto) {
    const result = await super.restoreByOrg(data);
    await this.invalidateTag(data.organizationId, data.id);
    return result;
  }

  private itemKey(org: string, id: string) {
    return `cache:tag:${org}:${id}`;
  }

  private versionKey(org: string) {
    return `cache:tags:${org}:ver`;
  }

  private listKey(org: string, ver: number, dto: PaginationDto) {
    const filters = JSON.stringify({
      wd: dto.withDeleted ? 1 : 0,
      off: dto.offset ?? 0,
      lim: dto.limit ?? 10,
      q: dto.search ?? null,
    });
    return `cache:tags:${org}:list:v${ver}:${filters}`;
  }

  private async invalidateTag(org: string, id: string) {
    await this.cache.del(this.itemKey(org, id));
    await this.cache.bumpVersion(this.versionKey(org));
  }
}
