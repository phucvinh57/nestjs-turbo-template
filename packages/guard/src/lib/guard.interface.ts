import type { JwtPayload } from 'jsonwebtoken';

export enum GuardType {
	ROLE = 'role',
	PERM = 'perm',
	ACCESS_JWT = 'access_jwt',
	REFRESH_JWT = 'refresh_jwt',
}

export enum GuardCookie {
	ACCESS_TOKEN = 'AccessToken',
	REFRESH_TOKEN = 'RefreshToken',
}

export type JwtInfo = Omit<JwtPayload, 'sub' | 'iat' | 'exp'> & {
	sub: string;
	type?: string;
	iat?: number;
	exp?: number;
};

export type JwtMerchant = JwtInfo & {
	merchant: string;
	perm: string;
};
