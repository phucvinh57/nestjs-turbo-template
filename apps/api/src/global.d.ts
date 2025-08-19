// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { OAuth2Namespace } from '@fastify/oauth2';
import 'fastify';

declare module 'fastify' {
	interface FastifyInstance {
		googleOAuth2: OAuth2Namespace;
		appleOAuth2: OAuth2Namespace;
	}
}
