import { FmvResponse } from '@fmv/common';
import { FmvController } from '@fmv/guard';
import { Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { ApiRoute } from '@/api/api.service';
import { PublicService } from './public.service';

@FmvController(ApiRoute.PUBLIC)
@Throttle({
	second: { ttl: 1, limit: 5 }, // 5 requests per second
	hour: { ttl: 60 * 60, limit: 500 }, // 500 requests per hour
})
export class PublicController {
	constructor(private readonly publicService: PublicService) {}
	@Get('hello')
	@FmvResponse(String)
	hello(): Promise<string> {
		return this.publicService.hello();
	}
}
