import type { RedisClientOptions } from '@keyv/redis';
import { IsEnum, IsNumber, IsObject } from 'class-validator';

export class CacheConfig {
	@IsEnum(['redis'])
	vendor: 'redis';

	@IsNumber()
	ttl: number;

	@IsObject()
	redis: RedisClientOptions;
}
