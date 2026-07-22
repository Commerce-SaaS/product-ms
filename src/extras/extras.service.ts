import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { Repository } from 'typeorm';
import { Extra } from './entities/extra.entity';
import { PaginationDto } from 'src/common';
import { BaseService } from 'src/common/services/base.service';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';
import { CacheService } from 'src/common/cache/cache.service';
import { dbQueryDuration } from 'src/metrics/metrics';

const EXTRA_TTL = 600;
const EXTRAS_LIST_TTL = 600;

@Injectable()
export class ExtrasService extends BaseService<Extra> {
  constructor(
    @InjectRepository(Extra)
    repo: Repository<Extra>,
    private readonly cache: CacheService,
  ) {
    super(repo, 'Extra');
  }

  async create(createDto: CreateExtraDto) {
    const result = await super.create(createDto);
    await this.invalidateExtra(createDto.organizationId, (result as any).id);
    return result;
  }

  async findAll(paginationDto: PaginationDto) {
    const { organizationId } = paginationDto;
    const ver = await this.cache.getVersion(this.versionKey(organizationId));
    const key = this.listKey(organizationId, ver, paginationDto);

    const cached = await this.cache.get(key);
    if (cached) return cached;

    const stopDbTimer = dbQueryDuration.startTimer({ entity: 'extra', operation: 'findAll' });
    const result = await super.findAllByOrg(paginationDto);
    stopDbTimer();
    await this.cache.set(key, result, EXTRAS_LIST_TTL);
    return result;
  }

  async findOne(data: FindOneByOrgDto) {
    if (data.withDeleted) {
      const stopDbTimer = dbQueryDuration.startTimer({ entity: 'extra', operation: 'findOne' });
      const result = await super.findOneByOrg(data);
      stopDbTimer();
      return result;
    }

    const key = this.itemKey(data.organizationId, data.id);
    const cached = await this.cache.get(key);
    if (cached) return cached;

    const stopDbTimer = dbQueryDuration.startTimer({ entity: 'extra', operation: 'findOne' });
    const result = await super.findOneByOrg(data);
    stopDbTimer();
    if (!result) return null;

    await this.cache.set(key, result, EXTRA_TTL);
    return result;
  }

  async update(dto: UpdateExtraDto) {
    const result = await super.updateByOrg(dto);
    await this.invalidateExtra(dto.organizationId, dto.id);
    return result;
  }

  async softDelete(data: FindOneByOrgDto) {
    const result = await super.softDeleteByOrg(data);
    await this.invalidateExtra(data.organizationId, data.id);
    return result;
  }

  async restore(data: FindOneByOrgDto) {
    const result = await super.restoreByOrg(data);
    await this.invalidateExtra(data.organizationId, data.id);
    return result;
  }

  private itemKey(org: string, id: string) {
    return `cache:extra:${org}:${id}`;
  }

  private versionKey(org: string) {
    return `cache:extras:${org}:ver`;
  }

  private listKey(org: string, ver: number, dto: PaginationDto) {
    const filters = JSON.stringify({
      wd: dto.withDeleted ? 1 : 0,
      off: dto.offset ?? 0,
      lim: dto.limit ?? 10,
      q: dto.search ?? null,
    });
    return `cache:extras:${org}:list:v${ver}:${filters}`;
  }

  private async invalidateExtra(org: string, id: string) {
    await this.cache.del(this.itemKey(org, id));
    await this.cache.bumpVersion(this.versionKey(org));
  }
}
