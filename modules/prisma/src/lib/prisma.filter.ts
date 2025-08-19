import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger, Type } from '@nestjs/common';
import type { FastifyReply } from 'fastify';

import { PRISMA_KNOW_ERROR, PrismaAppError, PrismaKnowCode } from './prisma.exception';

export function PrismaFilter<T extends Type<unknown>, E>(
	ErrClass: T,
	name: string,
	formatError?: (error?: PrismaAppError, stack?: string) => E,
) {
	@Catch(ErrClass)
	class PFilter implements ExceptionFilter {
		public readonly logger: Logger = new Logger(name);
		public readonly format = formatError || this.formatError;

		catch(exception: typeof ErrClass & { stack?: string }, host: ArgumentsHost) {
			const ctx = host.switchToHttp();
			const res = ctx.getResponse<FastifyReply>();

			const knownError = 'code' in exception && PRISMA_KNOW_ERROR[exception.code as PrismaKnowCode];

			knownError ? this.logger.error(exception) : this.logger.warn(exception);

			return knownError
				? res.code(knownError.http).send(this.format(knownError, exception.stack))
				: res.code(HttpStatus.INTERNAL_SERVER_ERROR).send(this.format(undefined, exception.stack));
		}

		formatError(error?: PrismaAppError, stack?: string) {
			return {
				status: 0,
				type: 'REST',
				time: new Date().toISOString(),
				code: error?.code ?? 'P0000',
				message: error?.message ?? 'Internal server error',
				stack: process.env.NODE_ENV !== 'production' && stack ? stack.split('\n').filter((line) => line) : undefined,
			};
		}
	}
	return PFilter;
}
