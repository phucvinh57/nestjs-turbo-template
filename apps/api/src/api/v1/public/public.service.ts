import { Injectable } from '@nestjs/common';
import { ApiService } from '@/api/api.service';

@Injectable()
export class PublicService extends ApiService {
	async hello() {
		return 'Hello World!';
	}
}
