import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsObject, IsString, ValidateIf, ValidateNested } from 'class-validator';
import type { OpenApiAuthMode } from './openapi.interface';

export class OpenAPIAuthBasic {
	@IsString()
	username: string;

	@IsString()
	password: string;
}

export class OpenAPIAuthConfig {
	@IsEnum(['none', 'basic'])
	mode: OpenApiAuthMode = 'none';

	@ValidateIf((o) => o.mode === 'basic')
	@ValidateNested()
	basic: OpenAPIAuthBasic;
}

export class OpenAPIConfig {
	@IsBoolean()
	enable = true;

	@IsString()
	path = 'docs';

	@IsString()
	title: string;

	@IsString()
	version: string;

	@IsString()
	description: string;

	@ValidateNested()
	@IsObject()
	@Type(() => OpenAPIAuthConfig)
	auth: OpenAPIAuthConfig;
}
