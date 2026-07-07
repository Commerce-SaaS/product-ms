import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { cacheHits, cacheMisses } from 'src/metrics/metrics';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly versionTtl = 60 * 60 * 24;

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.redis.get(key);

      // Derive labels from the Redis key structure:
      //   cache:<entity[s]>:<orgId>:<id | "list" | "ver">
      // parts[1] = entity segment (e.g. 'product', 'products', 'category', 'categories')
      //   singular  → findOne item key
      //   plural    → findAll list key (confirmed by parts[3] === 'list')
      // We do NOT normalise singular/plural — the raw segment is already descriptive.
      const parts = key.split(':');
      const entity = parts[1] ?? 'unknown';
      const operation = parts[3] === 'list' ? 'findAll' : 'findOne';

      if (raw) {
        cacheHits.inc({ entity, operation });
        return JSON.parse(raw) as T;
      }

      cacheMisses.inc({ entity, operation });
      return null;
    } catch (err) {
      this.logger.warn(`cache get failed ${key}: ${err}`);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      this.logger.warn(`cache set failed ${key}: ${err}`);
    }
  }

  async del(...keys: string[]): Promise<void> {
    if (!keys.length) return;
    try {
      await this.redis.del(...keys);
    } catch (err) {
      this.logger.error(`cache del failed ${keys.join(',')}: ${err}`);
    }
  }

  async getVersion(versionKey: string): Promise<number> {
    try {
      const raw = await this.redis.get(versionKey);
      return raw ? parseInt(raw, 10) || 0 : 0;
    } catch (err) {
      this.logger.warn(`cache getVersion failed ${versionKey}: ${err}`);
      return 0;
    }
  }

  async bumpVersion(versionKey: string): Promise<void> {
    try {
      const pipe = this.redis.pipeline();
      pipe.incr(versionKey);
      pipe.expire(versionKey, this.versionTtl);
      await pipe.exec();
    } catch (err) {
      this.logger.error(`cache bumpVersion failed ${versionKey}: ${err}`);
    }
  }
}