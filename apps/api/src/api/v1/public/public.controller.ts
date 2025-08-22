import { Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PaginatedResponse } from '@sample/common';
import { AppController } from '@sample/guard';

import { ApiRoute } from '@/api/api.service';
import { SampleDataDto } from './public.dto';
import { PublicService } from './public.service';

@AppController(ApiRoute.PUBLIC)
@Throttle({
	second: { ttl: 1, limit: 5 }, // 5 requests per second
	hour: { ttl: 60 * 60, limit: 500 }, // 500 requests per hour
})
export class PublicController {
	constructor(private readonly publicService: PublicService) {}
	@Get('hello')
	@PaginatedResponse(SampleDataDto)
	hello() {
		return this.publicService.hello();
	}
}
