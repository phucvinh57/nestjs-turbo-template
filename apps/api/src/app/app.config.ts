import { BaseAppConfig } from '@sample/common';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class AppleConfig {
	@IsString()
	clientId: string;

	@IsString()
	keyId: string;

	@IsString()
	teamId: string;

	@IsString()
	privateKey: string;
}

export class GeneralOAuthConfig {
	@IsString()
	clientId: string;

	@IsString()
	clientSecret: string;
}

export class AuthConfig {
	@ValidateNested()
	@IsOptional()
	@Type(() => AppleConfig)
	apple?: AppleConfig;

	@ValidateNested()
	@IsOptional()
	@Type(() => GeneralOAuthConfig)
	google?: GeneralOAuthConfig;
}

export class GoogleConfig {
	@IsString()
	mapApiKey: string;
}

export class ApiConfig extends BaseAppConfig {
	@ValidateNested()
	@IsObject()
	@IsOptional()
	@Type(() => AuthConfig)
	auth?: AuthConfig;

	@IsString()
	cronSecret: string;
}
