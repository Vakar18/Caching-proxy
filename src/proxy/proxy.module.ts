import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { CacheService } from '../cache/cache.service';

@Module({
  controllers: [ProxyController],
  providers: [ProxyService, CacheService],
  exports: [ProxyService],
})
export class ProxyModule {}