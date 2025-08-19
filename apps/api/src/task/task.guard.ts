import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';

@Injectable()
export class TaskGuard implements CanActivate {
	constructor(private configService: ConfigService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<FastifyRequest>();
		const cronSecret = request.headers['x-cron-secret'];
		const expectedSecret = this.configService.get<string>('api.cronSecret');

		if (!cronSecret || cronSecret !== expectedSecret) {
			throw new UnauthorizedException('Invalid cron secret');
		}

		return true;
	}
}
