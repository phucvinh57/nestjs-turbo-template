export type AppleUser = {
	aud: string;
	exp: number;
	iat: number;
	sub: string;
	c_hash: string;
	email: string;
	email_verified?: string;
	auth_time?: number;
	nonce_supported?: boolean;
};

export type GoogleUser = {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
};
