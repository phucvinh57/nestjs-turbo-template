import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OpenAPIConfig } from './openapi.config';

type Metadata = () => Promise<Record<string, unknown>>;
export const openApiSetup = async (app: INestApplication, config: ConfigService, metadata?: Metadata) => {
	const openapi = config.get<OpenAPIConfig>('openapi');
	if (!openapi || !openapi.enable) return;

	const { title, version, description, path } = openapi;
	const openApiDocument = new DocumentBuilder()
		.setTitle(title)
		.setVersion(version)
		.setDescription(description)
		.addCookieAuth('AccessToken', { type: 'apiKey', in: 'cookie' })
		.addBearerAuth({
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
			name: 'authorization',
			description: 'JWT Authorization header format: Bearer <token>',
			in: 'header',
		})
		.addSecurityRequirements('bearer')
		.build();

	//* When using SWC build with type checking, the metadata need to be add directly
	if (metadata) await SwaggerModule.loadPluginMetadata(metadata);
	const swaggerDocument = SwaggerModule.createDocument(app, openApiDocument);

	SwaggerModule.setup(path, app, swaggerDocument, {
		jsonDocumentUrl: '/api/openapi/json',
		yamlDocumentUrl: '/api/openapi/yaml',
		swaggerOptions: {
			withCredentials: true,
			displayOperationId: true,
			persistAuthorization: true,
			displayRequestDuration: true,
			defaultModelsExpandDepth: -1,
			defaultModelExpandDepth: -1,
		},
	});
};
