import { ConfigModule } from '@fmv/config';
import { Global, Module } from '@nestjs/common';
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
