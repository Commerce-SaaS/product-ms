import { Global, Module } from '@nestjs/common';
import { RedisProvider } from './providers/redis.provider';
import { CacheService } from 'src/common/cache/cache.service';

@Global()
@Module({
  providers: [RedisProvider, CacheService],
  exports: [RedisProvider, CacheService],
})
export class RedisModule {}
