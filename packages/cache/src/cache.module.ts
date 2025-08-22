import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@sample/config';
import { CacheConfig } from './cache.config';
import { CacheProviders } from './cache.provider';
import { CacheService } from './cache.service';

@Global()
@Module({
	imports: [ConfigModule('cache', CacheConfig)],
	exports: [CacheService],
	providers: [...CacheProviders, CacheService],
})
export class CacheModule {}
