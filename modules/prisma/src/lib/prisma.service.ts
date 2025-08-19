import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { PrismaConstructor, PrismaQueryEvent } from './prisma.interface';

export const PrismaService = <T extends PrismaConstructor>(PrismaClient: T) => {
	return class extends PrismaClient implements OnModuleInit, OnModuleDestroy {
		public readonly logger = new Logger(PrismaService.name);

		// biome-ignore lint/suspicious/noExplicitAny: <ignore>
		constructor(..._args: any[]) {
			super({
				log: [
					{ emit: 'event', level: 'query' },
					{ emit: 'stdout', level: 'info' },
					{ emit: 'stdout', level: 'warn' },
					{ emit: 'stdout', level: 'error' },
				],
				errorFormat: 'colorless',
			});
			if (process.env.NODE_ENV === 'default' || process.env.NODE_ENV === 'development') {
				super.$on('query', (event: PrismaQueryEvent) => {
					this.logger.debug(`Query: ${event.query}`);
					this.logger.debug(`Duration: ${event.duration}ms`);
				});
			}
		}
		async onModuleInit() {
			await this.$connect();
		}
		async onModuleDestroy() {
			await this.$disconnect();
		}
	};
};
