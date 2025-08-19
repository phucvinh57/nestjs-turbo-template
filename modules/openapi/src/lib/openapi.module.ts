import { ConfigModule } from '@fmv/config';
import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAPIConfig } from './openapi.config';
import { OpenApiMiddleware } from './openapi.middleware';

@Global()
@Module({
	imports: [ConfigModule('openapi', OpenAPIConfig, 'openapi-docs')],
})
export class OpenApiModule implements NestModule {
	constructor(private readonly config: ConfigService) {}

	configure(consumer: MiddlewareConsumer) {
		const docsPath = this.config.get<string>('openapi.path') || 'docs';
		consumer.apply(OpenApiMiddleware).forRoutes({
			method: RequestMethod.GET,
			path: `/${docsPath}/*path`,
		});
	}
}
