import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import { RequestMethod } from '@nestjs/common';
import type { LoggerModuleAsyncParams } from 'nestjs-pino';
import { prettyTransport } from './logger.transport';

/**
 *? Document Referer: https://github.com/pinojs/pino/blob/HEAD/docs/api.md
 */
export const loggerConfig: LoggerModuleAsyncParams = {
	useFactory: () => {
		const pathIgnore = new Set<string>(['/api/health', '/api/healthcheck']);
		return {
			pinoHttp: {
				useLevel: 'info',
				level: 'info',
				redact: ['req.headers.authorization', 'req.headers.cookie', 'body.password', 'pid', 'hostname'],
				autoLogging: {
					ignore: (req: IncomingMessage & { originalUrl?: string }) => (req.originalUrl ? pathIgnore.has(req.originalUrl) : false),
				},
				transport: prettyTransport,
				//! WARNING this configuration only working with express, fastify need config in fastify instance
				genReqId: (req: IncomingMessage) => req.headers['x-correlation-id'] || randomUUID(),
			},
			forRoutes: ['*path'],
			//! WARNING this configuration only working with express, fastify need use autoLogging.ignore
			exclude: [
				{ method: RequestMethod.ALL, path: '/api/health' },
				{ method: RequestMethod.ALL, path: '/api/healthcheck' },
			],
		};
	},
};
