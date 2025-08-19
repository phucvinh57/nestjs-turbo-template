import fastifyOauth2, { FastifyOAuth2Options } from '@fastify/oauth2';
import jwt from 'jsonwebtoken';

type ConfigParams = {
	serverDomain: string;
	clientId: string;
	clientSecret: string;
};

type AppleConfigParams = Omit<ConfigParams, 'clientSecret'> & { keyId: string; teamId: string; privateKey: string };
type ConfigFn<T> = (p: T) => FastifyOAuth2Options;
type OAuthConfigFn = ConfigFn<ConfigParams>;
type OAuthAppleFn = ConfigFn<AppleConfigParams>;

export const appleConfig: OAuthAppleFn = ({ serverDomain, keyId, teamId, clientId, privateKey }) => {
	const now = Math.floor(Date.now() / 1000);
	const payload = {
		iss: teamId,
		iat: now,
		exp: now + 15777000, // 6 months
		aud: 'https://appleid.apple.com',
		sub: clientId,
	};

	const secret = jwt.sign(payload, privateKey, {
		algorithm: 'ES256',
		header: {
			alg: 'ES256',
			kid: keyId,
		},
	});

	return {
		name: 'appleOAuth2',
		scope: ['name', 'email'],
		credentials: {
			client: {
				id: clientId,
				secret,
			},
			auth: fastifyOauth2.APPLE_CONFIGURATION,
		},
		callbackUriParams: {
			response_type: 'code id_token',
			response_mode: 'query',
		},
		// ! WARNING
		// * Determine the callbackUri for Apple Sign-In
		// * When running locally, use HTTPS via ngrok to test Apple Sign-In
		// * Previously, localhost might have been used, but Apple Sign-In requires HTTPS, so HTTP won't work
		callbackUri: serverDomain.includes('localhost')
			? 'https://localhost:3333/api/v1/auth/apple/callback'
			: `https://${serverDomain}/api/v1/auth/apple/callback`,
	};
};

export const googleConfig: OAuthConfigFn = ({ serverDomain, clientId, clientSecret }) => ({
	name: 'googleOAuth2',
	scope: ['email', 'profile', 'openid'],
	credentials: {
		client: {
			id: clientId,
			secret: clientSecret,
		},
		auth: fastifyOauth2.GOOGLE_CONFIGURATION,
	},
	callbackUri: serverDomain.includes('localhost')
		? 'http://localhost:3333/api/v1/auth/google/callback'
		: `https://${serverDomain}/api/v1/auth/google/callback`,
	callbackUriParams: {
		// Tell Google to send a refreshToken
		access_type: 'offline',
	},
});
