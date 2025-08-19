import type { IncomingMessage, ServerResponse } from 'node:http';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAPIAuthBasic } from './openapi.config';
import type { OpenApiAuthMode } from './openapi.interface';

@Injectable()
export class OpenApiMiddleware implements NestMiddleware {
	private readonly authMode: OpenApiAuthMode;
	private readonly authBasic: OpenAPIAuthBasic | undefined;

	constructor(private readonly config: ConfigService) {
		this.authMode = this.config.getOrThrow<OpenApiAuthMode>('openapi.auth.mode');
		this.authBasic = this.config.get<OpenAPIAuthBasic>('openapi.auth.basic');
	}

	async use(req: IncomingMessage, res: ServerResponse, next: () => void) {
		if (this.authMode === 'none' || !this.authBasic) return next();
		if (!req.headers.authorization) return this.unauthorized(res, next);

		if (this.authMode === 'basic') {
			const credentials = this.parseAuthBasic(req.headers.authorization as string);

			if (credentials.username !== this.authBasic.username || credentials.password !== this.authBasic.password) {
				return this.unauthorized(res, next);
			}
		}
		next();
	}

	private parseAuthBasic(context: string): Partial<OpenAPIAuthBasic> {
		const [, encodedPart] = context.split(' ');
		if (!encodedPart) return { username: undefined, password: undefined };

		const text = Buffer.from(encodedPart, 'base64').toString('ascii');
		const [username, password] = text.split(':');

		return { username, password };
	}

	private unauthorized(res: ServerResponse, next: () => void) {
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic');
		next();
	}
}
