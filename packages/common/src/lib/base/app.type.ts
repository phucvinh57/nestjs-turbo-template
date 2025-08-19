import type { HttpStatus } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

export type IPag<T> = [
	(T | Partial<T>)[],
	{
		isFirstPage: boolean;
		isLastPage: boolean;
		currentPage: number;
		previousPage: number | null;
		nextPage: number | null;
		pageCount?: number;
		totalCount?: number;
	},
];

export type IReq<T = void, E = void> = FastifyRequest & { user: T; offchain: E extends void ? T : E };
export type IRes = FastifyReply;

//* ERROR
export type AppErr = {
	status: 0;
	type: 'REST';
	code: string;
	message: string;
};
export type AppError = Pick<AppErr, 'code' | 'message'> & { status: HttpStatus };

//* RESPONSE
export type AppMeta = {
	page: number;
	isFirst: boolean;
	isLast: boolean;
	size?: number;
	total?: number;
	next: number | null;
	prev: number | null;
	count?: number;
};
export type AppRes<T> = {
	status: 1;
	data: T;
};
export type AppPag<T> = {
	status: 1;
	data: (T | Partial<T>)[];
	meta: AppMeta;
};

export type AppOut<T> = T | AppRes<T> | AppPag<T>;
