//! Sentry or OpenTelemetry should be initialized here

//! Packages, Libraries
import fastifyCompress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import fastifyOauth2 from '@fastify/oauth2';
// import oauth2 from '@fastify/oauth2'
//! Nest Configuration
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { CORS, CookieConfig, Env, helmetConfig, ServerConfig, uploadConfig } from '@sample/common';
import { Logger } from '@sample/logger';
import { OpenAPIConfig, openApiSetup } from '@sample/openapi';
import { FastifyInstance } from 'fastify';
//! App Configuration
import { AppModule } from '@/app/app.module';
import { appleConfig, googleConfig } from '@/auth/auth.config';
import { AuthConfig } from './app/app.config';

async function bootstrap() {
	const adapter = new FastifyAdapter({ disableRequestLogging: false });
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
		rawBody: true,
		bufferLogs: true,
		abortOnError: false,
	});
	const configSerice = app.get(ConfigService);
	const logger = app.get(Logger);
	app.useLogger(app.get(Logger));

	//* CONFIG
	const {
		name,
		port,
		version,
		corsWhitelists,
		corsWhitelistHeaders,
		domain: serverDomain,
	} = configSerice.getOrThrow<ServerConfig>('api.server');
	const { path, secret, secure, httpOnly, sameSite } = configSerice.getOrThrow<CookieConfig>('api.server.cookie');
	const openAPIConfig = configSerice.getOrThrow<OpenAPIConfig>('openapi');

	//* PLUGIN
	const fastify = app.getHttpAdapter().getInstance() as unknown as FastifyInstance;
	await fastify.register(fastifyCompress, { encodings: ['gzip', 'deflate'] });
	await fastify.register(fastifyCookie, { secret, parseOptions: { sameSite, path, secure, httpOnly, domain: serverDomain } });
	await fastify.register(fastifyHelmet, helmetConfig);
	await fastify.register(fastifyMultipart, uploadConfig);
	const authConfig = configSerice.get<AuthConfig>('api.auth');
	if (authConfig?.apple)
		await fastify.register(
			fastifyOauth2,
			appleConfig({
				serverDomain,
				clientId: authConfig.apple.clientId,
				keyId: authConfig.apple.keyId,
				teamId: authConfig.apple.teamId,
				privateKey: authConfig.apple.privateKey,
			}),
		);
	if (authConfig?.google)
		await fastify.register(
			fastifyOauth2,
			googleConfig({
				serverDomain,
				clientId: authConfig.google.clientId,
				clientSecret: authConfig.google.clientSecret,
			}),
		);

	app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
	//* PREFIX_API
	app.setGlobalPrefix('api');
	//* VERSIONING
	app.enableVersioning({ type: VersioningType.URI, defaultVersion: version, prefix: 'v' });
	//* CORS
	app.enableCors(CORS(corsWhitelists, corsWhitelistHeaders));
	//* EXIT
	app.enableShutdownHooks();
	//* SWAGGER
	if (configSerice.get<string>('env') !== Env.PRODUCTION) await openApiSetup(app, configSerice);

	//* INITIALIZE
	await app.listen(port, '0.0.0.0');
	logger.log(`Swagger document of ${name} is running on http://localhost:${port}/${openAPIConfig.path}`);
}

bootstrap();
