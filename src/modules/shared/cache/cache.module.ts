import { Module } from '@nestjs/common';
import { CacheRedisService } from './services/cache-redis.service';

@Module({
  providers: [CacheRedisService],
  exports: [CacheRedisService],
})
export class CacheModule {}
