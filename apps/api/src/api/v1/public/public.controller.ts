import { Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FmvPaginateResponse } from '@sample/common';
import { FmvController } from '@sample/guard';

import { ApiRoute } from '@/api/api.service';
import { SampleDataDto } from './public.dto';
import { PublicService } from './public.service';

@FmvController(ApiRoute.PUBLIC)
@Throttle({
	second: { ttl: 1, limit: 5 }, // 5 requests per second
	hour: { ttl: 60 * 60, limit: 500 }, // 500 requests per hour
})
export class PublicController {
	constructor(private readonly publicService: PublicService) {}
	@Get('hello')
	@FmvPaginateResponse(SampleDataDto)
	hello() {
		return this.publicService.hello();
	}
}
