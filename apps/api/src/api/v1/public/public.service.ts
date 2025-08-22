import { Injectable } from '@nestjs/common';
import { IPag } from '@packages/common';
import { ApiService } from '@/api/api.service';
import { SampleDataDto } from './public.dto';

@Injectable()
export class PublicService extends ApiService {
	async hello(): Promise<IPag<SampleDataDto>> {
		const [data, meta] = await this.db.user
			.paginate({
				where: {},
				orderBy: { createdAt: 'desc' },
				select: {
					id: true,
					name: true,
				},
			})
			.withPages({ page: 1, limit: 10 });
		return [data, meta];
	}
}
