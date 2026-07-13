import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { BaseService } from 'src/common/services/base.service';
import { FindOneByOrgDto } from 'src/common/dto/find-one-by-org.dto';
import { RpcExceptionHelper } from 'src/common/helpers/rpc-exception.helper';
import { Category } from 'src/categories/entities/category.entity';
import { ProductTag } from 'src/product-tags/entities/product-tag.entity';
import { ProductIngredient } from 'src/product-ingredients/entities/product-ingredient.entity';
import { ProductExtra } from 'src/product-extras/entities/product-extra.entity';
import { Extra } from 'src/extras/entities/extra.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginationProductDto } from './dto/paginationProduct.dto';
import { CacheService } from 'src/common/cache/cache.service';
import { dbQueryDuration } from 'src/metrics/metrics';

const PRODUCT_TTL = 60;
const PRODUCTS_LIST_TTL = 60;

@Injectable()
export class ProductsService extends BaseService<Product> {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
    private readonly cache: CacheService,
  ) {
    super(productRepository, 'Product');
  }

  // -------------------------
  // CREATE
  // -------------------------
  async createProduct(dto: CreateProductDto) {
    const { extras, ingredients, tags, ...rest } = dto;

    this.logger.log(`Creating product for org ${dto.organizationId}`);
    try {
      this.logger.log(
        `Attempting to create product ${dto.name} for org ${dto.organizationId}`,
      );

      const savedProduct = await this.dataSource.transaction(
        async (manager) => {
          // #1 Validate product uniqueness
          const existingProduct = await manager.findOne(Product, {
            where: { name: dto.name, organizationId: dto.organizationId },
            withDeleted: true,
          });

          if (existingProduct) {
            if (existingProduct.deletedAt) {
              existingProduct.deletedAt = null;
              existingProduct.isActive = true;
              return manager.save(existingProduct);
            }
            RpcExceptionHelper.duplicate('Product');
          }

          // #2 Validate category
          if (dto.category) {
            await this.validateIdsExist(
              manager,
              Category,
              [dto.category],
              dto.organizationId,
              'category',
            );
          }

          // #3 Create product
          const productCreateData = {
            ...rest,
            category: dto.category ? { id: dto.category } : undefined,
          };

          const product = manager.create(Product, productCreateData);
          const savedProduct = await manager.save(product);

          // #4 Tags
          if (tags?.length) {
            await this.validateIdsExist(
              manager,
              Tag,
              tags,
              dto.organizationId,
              'tags',
            );

            const productTags = tags.map((tagId) =>
              manager.create(ProductTag, {
                productId: savedProduct.id,
                tagId,
                organizationId: dto.organizationId,
              }),
            );

            await manager.save(productTags);
          }

          // #5 Ingredients
          if (ingredients?.length) {
            const ingredientIds = ingredients.map((i) => i.ingredientId);
            await this.validateIdsExist(
              manager,
              Ingredient,
              ingredientIds,
              dto.organizationId,
              'ingredients',
            );

            const productIngredients = ingredients.map(
              ({ ingredientId, quantity }) =>
                manager.create(ProductIngredient, {
                  productId: savedProduct.id,
                  ingredientId,
                  quantity,
                  organizationId: dto.organizationId,
                }),
            );

            await manager.save(productIngredients);
          }

          // #6 Extras
          if (extras?.length) {
            await this.validateIdsExist(
              manager,
              Extra,
              extras,
              dto.organizationId,
              'extras',
            );

            const productExtras = extras.map((extraId) =>
              manager.create(ProductExtra, {
                productId: savedProduct.id,
                extraId,
                organizationId: dto.organizationId,
              }),
            );

            await manager.save(productExtras);
          }

          this.logger.log(`Product: "${savedProduct.id}" created`);
          return savedProduct;
        },
      );


      await this.invalidateProduct(dto.organizationId, savedProduct.id); // 👈

      return await this.findOne({
        id: savedProduct.id,
        organizationId: dto.organizationId,
        withDeleted: true,
      });
    } catch (error) {
      this.logger.error('Error creating product:', error);
      RpcExceptionHelper.handle(error);
    }
  }

  // -------------------------
  // UPDATE
  // -------------------------
  async update(dto: UpdateProductDto) {
    try {
      this.logger.log(
        `Attempting to update product ${dto.name} for org ${dto.organizationId}`,
      );

      await this.dataSource.transaction(async (manager) => {
        const product = await manager.findOne(Product, {
          where: { id: dto.id, organizationId: dto.organizationId },
          withDeleted: true,
          relations: ['tags', 'ingredients', 'extras'],
        });

        if (!product) RpcExceptionHelper.notFound('Product');

        const { name, category, tags, ingredients, extras, ...rest } = dto;
        Object.assign(product, rest);
        if (name) product.name = name;

        if (category) {
          await this.validateIdsExist(
            manager,
            Category,
            [category],
            dto.organizationId,
            'category',
          );
          product.category = { id: category } as any;
        }
        const savedProduct = await manager.save(product);

        // #4 Tags
        if (tags !== undefined) {
          if (tags.length) {
            await this.validateIdsExist(
              manager,
              Tag,
              tags,
              dto.organizationId,
              'tags',
            );
          }

          await this.replaceRelations(manager, product.tags, () =>
            tags.map((tagId) =>
              manager.create(ProductTag, {
                productId: savedProduct.id,
                tagId,
                organizationId: dto.organizationId,
              }),
            ),
          );
        }

        // #5 Ingredients
        if (ingredients !== undefined) {
          if (ingredients.length) {
            const ingredientIds = ingredients.map((i) => i.ingredientId);

            await this.validateIdsExist(
              manager,
              Ingredient,
              ingredientIds,
              dto.organizationId,
              'ingredients',
            );
          }

          await this.replaceRelations(manager, product.ingredients, () =>
            ingredients.map(({ ingredientId, quantity }) =>
              manager.create(ProductIngredient, {
                productId: savedProduct.id,
                ingredientId,
                quantity,
                organizationId: dto.organizationId,
              }),
            ),
          );
        }

        // #6 Extras
        if (extras !== undefined) {
          if (extras.length) {
            await this.validateIdsExist(
              manager,
              Extra,
              extras,
              dto.organizationId,
              'extras',
            );
          }

          await this.replaceRelations(manager, product.extras, () =>
            extras.map((extraId) =>
              manager.create(ProductExtra, {
                productId: savedProduct.id,
                extraId,
                organizationId: dto.organizationId,
              }),
            ),
          );
        }

        // 7️ Return updated product
        this.logger.log(`Product: "${dto.name}" updated`);
      });

      await this.invalidateProduct(dto.organizationId, dto.id);

      return this.findOne({
        id: dto.id,
        organizationId: dto.organizationId,
        withDeleted: true,
      });
    } catch (error) {
      this.logger.error('Error updating product:', error);
      RpcExceptionHelper.handle(error);
    }
  }

  // -------------------------
  // FIND / DELETE
  // -------------------------
  async findAllProducts(paginationProductDto: PaginationProductDto) {
    try {
      const { organizationId } = paginationProductDto;
      if (!organizationId) {
        RpcExceptionHelper.badRequestException('organizationId is required');
      }

      const ver = await this.cache.getVersion(this.versionKey(organizationId));
      const key = this.listKey(organizationId, ver, paginationProductDto);

      const cached = await this.cache.get<{
        items: ProductResponseDto[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
        hasMore: boolean;
      }>(key);
      if (cached) return cached;

      const {
        withDeleted = false, limit = 10, offset = 0,
        ingredient, tag, search, category,
      } = paginationProductDto;

      const query = this.repo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.tags', 'productTag')
        .leftJoinAndSelect('productTag.tag', 'tag')
        .leftJoinAndSelect('product.ingredients', 'productIngredient')
        .leftJoinAndSelect('productIngredient.ingredient', 'ingredient')
        .leftJoinAndSelect('product.extras', 'productExtra')
        .leftJoinAndSelect('productExtra.extra', 'extra')
        .where('product.organizationId = :organizationId', { organizationId });

      if (ingredient) {
        query.andWhere('productIngredient.ingredientId = :ingredient', {
          ingredient,
        });
      }

      if (tag) {
        query.andWhere('productTag.tagId = :tag', { tag });
      }

      if (category) {
        query.andWhere('category.id = :category', { category });
      }

      if (search) {
        query.andWhere('product.name ILIKE :search', {
          search: `%${search}%`,
        });
      }

      if (withDeleted) query.withDeleted();

      query.skip(offset).take(limit).orderBy('product.createdAt', 'DESC');

      // Time only the DB round-trip; query building and result mapping are excluded.
      const stopDbTimer = dbQueryDuration.startTimer({ entity: 'product', operation: 'findAll' });
      const [items, totalItems] = await query.getManyAndCount();
      stopDbTimer();

      const mappedItems = items.map((p) => this.transformProductStructure(p));

      const result = {
        items: mappedItems,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Math.floor(offset / limit) + 1,
        hasMore: offset + limit < totalItems,
      };

      await this.cache.set(key, result, PRODUCTS_LIST_TTL);
      return result;
    } catch (error) {
      RpcExceptionHelper.handle(error);
    }
  }

  async findOne(data: FindOneByOrgDto): Promise<ProductResponseDto | null> {
    if (data.withDeleted) {
      // Admin / soft-deleted lookup — bypasses cache, time the DB call directly.
      const stopDbTimer = dbQueryDuration.startTimer({ entity: 'product', operation: 'findOne' });
      const product = await super.findOneByOrg(data);
      stopDbTimer();
      return product ? this.transformProductStructure(product) : null;
    }

    const key = this.itemKey(data.organizationId, data.id);
    const cached = await this.cache.get<ProductResponseDto>(key);
    if (cached) return cached;

    // Cache miss — time the DB round-trip.
    const stopDbTimer = dbQueryDuration.startTimer({ entity: 'product', operation: 'findOne' });
    const product = await super.findOneByOrg(data);
    stopDbTimer();
    if (!product) return null;

    const dto = this.transformProductStructure(product);
    await this.cache.set(key, dto, PRODUCT_TTL);
    return dto;
  }

  async remove(data: FindOneByOrgDto) {
    const result = await super.softDeleteByOrg(data);
    await this.invalidateProduct(data.organizationId, data.id);
    return result;
  }

  async restore(data: FindOneByOrgDto) {
    const product = await super.restoreByOrg(data);
    await this.invalidateProduct(data.organizationId, data.id);
    if (!product) return null;
    return this.transformProductStructure(product);
  }

  async validateIdsExist<T>(
    manager: EntityManager,
    entityClass: { new(): T },
    ids: string[],
    organizationId: string,
    entityName: string,
  ) {
    if (!ids?.length) return;

    const existing = await manager.find(entityClass, {
      where: { id: In(ids), organizationId },
    });

    if (existing.length !== ids.length) {
      RpcExceptionHelper.notFound(`One or more ${entityName}`);
    }
  }

  private async replaceRelations<T>(
    manager: EntityManager,
    existing: T[] | undefined,
    createData: () => T[],
  ) {
    if (existing?.length) {
      await manager.remove(existing);
    }

    const newRelations = createData();
    if (newRelations.length) {
      await manager.save(newRelations);
    }
  }

  private transformProductStructure(product: any): ProductResponseDto {
    const productResponse = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      stock: product.stock,
      reservedStock: product.reservedStock,
      lowStockThreshold: product.lowStockThreshold,
      trackStock: product.trackStock,
      description: product.description,
      availability: product.availability,
      isActive: product.isActive,
      deletedAt: product.deletedAt,
      ui: product.ui,
      image: {
        url: product.imageUrl || null,
        key: product.imageKey || null,
      },

      category: product.category
        ? {
          id: product.category.id,
          name: product.category.name,
          countsTowardKitchenCapacity: product.category.countsTowardKitchenCapacity,
        }
        : null,

      tags:
        product.tags?.map((pt) => ({
          id: pt.tag?.id ?? pt.id,
          name: pt.tag?.name ?? pt.name,
        })) ?? [],

      ingredients:
        product.ingredients?.map((pi) => ({
          id: pi.ingredient?.id ?? pi.id,
          name: pi.ingredient?.name ?? pi.name,
          quantity: pi.quantity,
        })) ?? [],

      extras:
        product.extras?.map((pe) => ({
          id: pe.extra?.id ?? pe.id,
          name: pe.extra?.name ?? pe.name,
          price: Number(pe.extra?.price ?? pe.price),
        })) ?? [],
    };

    return productResponse;
  }

  // CACHE

  private itemKey(org: string, id: string) {
    return `cache:product:${org}:${id}`;
  }

  private versionKey(org: string) {
    return `cache:products:${org}:ver`;
  }

  private listKey(org: string, ver: number, dto: PaginationProductDto) {
    const filters = JSON.stringify({
      wd: dto.withDeleted ? 1 : 0,
      off: dto.offset ?? 0,
      lim: dto.limit ?? 10,
      ing: dto.ingredient ?? null,
      tag: dto.tag ?? null,
      cat: dto.category ?? null,
      q: dto.search ?? null,
    });
    return `cache:products:${org}:list:v${ver}:${filters}`;
  }

  private async invalidateProduct(org: string, id: string) {
    await this.cache.del(this.itemKey(org, id));
    await this.cache.bumpVersion(this.versionKey(org));
  }

}
