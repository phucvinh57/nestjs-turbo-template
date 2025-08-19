import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheConfig } from 'cache.config';
import type { Cacheable } from 'cacheable';

@Injectable()
export class CacheService {
	private readonly TTL: number;

	constructor(
		private readonly config: ConfigService<{ cache: CacheConfig }, true>,
		@Inject('CACHE_MANAGER') private readonly cache: Cacheable,
	) {
		this.TTL = this.config.get('cache').ttl;
	}

	async get<T>(key: string, fnc?: () => Promise<T>, ttl: number = this.TTL): Promise<T | undefined> {
		const data = await this.cache.get<T>(key);
		if (data) return data;
		if (!fnc) return data;

		const newData = await fnc();
		await this.cache.set(key, newData, ttl);
		return newData;
	}

	async set<T>(key: string, data: T, ttl?: number): Promise<void> {
		await this.cache.set(key, data, ttl);
	}

	async del(key: string): Promise<boolean> {
		return this.cache.delete(key);
	}
}
