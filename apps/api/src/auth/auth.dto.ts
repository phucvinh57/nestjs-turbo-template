import { ApiBoolean, ApiString } from '@fmv/common';

export class OAuthParams {
	@ApiString()
	redirect_uri: string;
}

class AuthMetadata {
	@ApiBoolean()
	isWeb: boolean;
}

export class LoginDto extends AuthMetadata {
	@ApiString()
	email: string;

	@ApiString()
	password: string;
}

export class RegisterDto extends AuthMetadata {
	@ApiString()
	email: string;

	@ApiString()
	password: string;

	@ApiString()
	firstName: string;

	@ApiString()
	lastName: string;

	@ApiString()
	phone: string;
}

export class LoginByOAuthTokenDto extends AuthMetadata {
	@ApiString({ required: false })
	refreshToken?: string;

	@ApiString()
	accessToken: string;
}

export class LoginResp {
	@ApiString()
	userId: string;

	@ApiString()
	accessToken: string;

	@ApiString()
	refreshToken: string;
}
