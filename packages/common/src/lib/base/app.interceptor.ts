import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { map, Observable } from 'rxjs';
import type { AppOut, AppPag, IPag } from './app.type';

@Injectable()
export class AppInterceptor<T> implements NestInterceptor<T, AppOut<T>> {
	constructor(
		private readonly customRes: (data: T | IPag<T>) => AppOut<T> = this.formatRes,
		private readonly customPag: (data: IPag<T>) => AppPag<T> = this.formatPag,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<AppOut<T>> {
		const ctx = context.switchToHttp();
		const req = ctx.getRequest<FastifyRequest>();
		const res = ctx.getResponse<FastifyReply>();

		if (res.statusCode >= 300 && res.statusCode < 400) {
			// If the response is a redirect, we don't want to modify it
			return next.handle();
		}

		if (req.id || req.headers['x-request-id']) res.header('x-request-id', req.id || req.headers['x-request-id']);
		return next.handle().pipe(map((data: T | IPag<T>) => this.customRes(data)));
	}

	private formatRes(data: T | IPag<T>): AppOut<T> {
		const isPaginated =
			!!data && Array.isArray(data) && !!data[1] && typeof data[1] === 'object' && 'isFirstPage' in data[1] && 'isLastPage' in data[1];
		return isPaginated ? this.customPag(data as IPag<T>) : { status: 1, data: data as T };
	}

	private formatPag(data: IPag<T>): AppPag<T> {
		return {
			status: 1,
			data: data[0],
			meta: {
				page: data[1].currentPage,
				prev: data[1].previousPage,
				next: data[1].nextPage,
				size: data[1].pageCount,
				total: data[1].totalCount,
				count: data[1].pageCount,
				isFirst: data[1].isFirstPage,
				isLast: data[1].isLastPage,
			},
		};
	}
}
