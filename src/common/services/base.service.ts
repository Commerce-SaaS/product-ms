import { Repository, ObjectLiteral } from 'typeorm';
import { RpcExceptionHelper } from '../helpers/rpc-exception.helper';
import { PaginationDto } from '../dto/pagination.dto';
import { FindOneByOrgDto } from '../dto/find-one-by-org.dto';
import { Logger } from '@nestjs/common';

type WithOrg = {
  id: string;
  organizationId: string;
  name?: string;
  isActive?: boolean;
};

export abstract class BaseService<T extends ObjectLiteral & WithOrg> {
  logger = new Logger(BaseService.name);
  protected constructor(
    protected readonly repo: Repository<T>,
    protected readonly entityName: string,
  ) {}

  // -------------------------
  // CREATE with soft-delete
  // -------------------------
  async create(
    dto: Partial<T> & { name: string; organizationId: string },
  ): Promise<{ rest: Partial<T> }> {
    const { name } = dto;
    this.logger.log(
      `Creating ${this.entityName} with name="${name}" for org="${dto.organizationId}"`,
    );

    try {
      const existing = await this.repo.findOne({
        where: { name, organizationId: dto.organizationId } as any,
        withDeleted: true,
      });

      if (existing) {
        if ((existing as any).deletedAt) {
          this.logger.warn(
            `Restoring soft-deleted ${this.entityName} id=${existing.id}`,
          );
          (existing as any).deletedAt = null;
          (existing as any).isActive = true;

          const saved = await this.repo.save(existing);
          const { deletedAt, createdAt, updatedAt, organizationId, ...rest } =
            saved as any;
          this.logger.log(`Restored ${this.entityName} id=${existing.id}`);
          return { ...rest };
        } else {
          this.logger.warn(
            `${this.entityName} with name="${name}" already exists`,
          );
          RpcExceptionHelper.duplicate(this.entityName);
        }
      }

      const entity = this.repo.create(dto as any);
      const saved = await this.repo.save(entity);

      const { deletedAt, createdAt, updatedAt, organizationId, ...rest } =
        saved as any;
      this.logger.log(`${this.entityName} created`);
      return { ...rest };
    } catch (error) {
      this.logger.error(`Failed to create ${this.entityName}`, error.stack);
      RpcExceptionHelper.handle(error);
    }
  }

  // -------------------------
  // FIND ALL
  // -------------------------
  async findAllByOrg(paginationDto: PaginationDto) {
    const {
      limit = 10,
      offset = 0,
      organizationId,
      withDeleted = false,
      search,
    } = paginationDto;

    this.logger.log(
      `Fetching ${this.entityName} list for org="${organizationId}" (offset=${offset}, limit=${limit}, search="${search ?? ''}")`,
    );

    try {
      const query = this.repo
        .createQueryBuilder(this.entityName)
        .where(`${this.entityName}.organizationId = :organizationId`, {
          organizationId,
        });

      if (search) {
        query.andWhere(`${this.entityName}.name ILIKE :search`, {
          search: `%${search}%`,
        });
      }

      if (withDeleted) {
        query.withDeleted();
      }

      query
        .skip(offset)
        .take(limit)
        .orderBy(`${this.entityName}.createdAt`, 'DESC');

      const [items, totalItems] = await query.getManyAndCount();

      const processedItems = items.map((item: any) => {
        const { deletedAt, createdAt, updatedAt, organizationId, ...rest } =
          item;
        return { ...rest };
      });

      return {
        items: processedItems,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Math.floor(offset / limit) + 1,
        hasMore: offset + limit < totalItems,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch ${this.entityName} list`, error.stack);
      RpcExceptionHelper.handle(error);
    }
  }

  // -------------------------
  // FIND ONE
  // -------------------------
  async findOneByOrg(data: FindOneByOrgDto) {
    const { id, withDeleted = false } = data;
    this.logger.log(
      `Fetching ${this.entityName} id=${id} for org="${data.organizationId}"`,
    );

    const entity = await this.repo.findOne({
      where: { id, organizationId: data.organizationId } as any,
      withDeleted,
    });

    if (!entity) {
      this.logger.warn(
        `${this.entityName} id=${id} not found for org="${data.organizationId}"`,
      );
      RpcExceptionHelper.notFound(this.entityName);
    }

    const { deletedAt, createdAt, updatedAt, organizationId, ...rest } =
      entity as any;
    this.logger.log(`Fetched ${this.entityName} id=${id}`);
    return { ...rest };
  }

  // -------------------------
  // UPDATE
  // -------------------------
  async updateByOrg<U extends Partial<T>>(
    dto: U & { id: string; organizationId: string },
  ) {
    const { id, organizationId, ...rest } = dto;
    try {
      this.logger.log(
        `Updating ${this.entityName} id=${id} for org="${organizationId}"`,
      );

      const result = await this.repo.update(
        { id, organizationId } as any,
        { ...rest } as any,
      );

      if (!result.affected) {
        this.logger.warn(
          `Failed to update ${this.entityName} id=${id} (not found)`,
        );
        RpcExceptionHelper.notFound(this.entityName);
      }

      this.logger.log(`Updated ${this.entityName} id=${id}`);
      return this.findOneByOrg({ id, organizationId, withDeleted: true });
    } catch (error) {
      this.logger.error(`Error updating ${this.entityName} id=${id}: ${error.message}`);
      RpcExceptionHelper.handle(error);
    }
  }

  // -------------------------
  // SOFT DELETE
  // -------------------------
  async softDeleteByOrg(data: FindOneByOrgDto) {
    const { id, organizationId } = data;
    this.logger.log(
      `Soft deleting ${this.entityName} id=${id} for org="${organizationId}"`,
    );

    const result = await this.repo.update(
      { id, organizationId } as any,
      { isActive: false } as any,
    );

    if (!result.affected) {
      this.logger.warn(
        `Failed to soft delete ${this.entityName} id=${id} (not found)`,
      );
      RpcExceptionHelper.notFound(this.entityName);
    }

    await this.repo.softDelete({ id, organizationId } as any);
    this.logger.log(`Soft deleted ${this.entityName} id=${id}`);

    return { message: `${this.entityName} deleted successfully` };
  }

  // -------------------------
  // RESTORE
  // -------------------------
  async restoreByOrg(data: FindOneByOrgDto) {
    const { id, organizationId } = data;

    this.logger.log(
      `Restoring ${this.entityName} id=${id} for org="${organizationId}"`,
    );

    const result = await this.repo.restore({ id, organizationId } as any);

    if (!result.affected) {
      this.logger.warn(
        `Failed to restore ${this.entityName} id=${id} (not found)`,
      );
      RpcExceptionHelper.notFound(this.entityName);
    }

    await this.repo.update(
      { id, organizationId } as any,
      { isActive: true } as any,
    );

    this.logger.log(`Restored ${this.entityName} id=${id} and reactivated`);

    return this.findOneByOrg({ id, organizationId, withDeleted: true });
  }
}
