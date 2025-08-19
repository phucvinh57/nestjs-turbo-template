import { createKeyv as createRedis } from '@keyv/redis';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheConfig } from 'cache.config';

export const CacheProviders: Provider[] = [
	{
		inject: [ConfigService],
		provide: 'CACHE_MANAGER',
		useFactory: (config: ConfigService<{ cache: CacheConfig }, true>) => {
			const cache = config.get('cache');
			switch (cache.vendor) {
				case 'redis':
					return createRedis(cache.redis);
			}
		},
	},
];
