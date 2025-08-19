import 'reflect-metadata';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export type UUID = string;
export type GUID = string;
export type CUID = string;
export type ISO_DATE = string; //YYYY-MM-DDTHH:mm:ss.sssZ
export type MIN_DATE = string; //YYYY-MM-DD
export type NUM_DATE = number; //Date.now()

export enum Env {
	DEFAULT = 'default',
	STAGING = 'staging',
	DEVELOPMENT = 'development',
	PRODUCTION = 'production',
}

export class CookieConfig {
	@IsEnum(['strict', 'lax', 'none'])
	sameSite: 'strict' | 'lax' | 'none';

	@IsString()
	path: string;

	@IsString()
	secret: string;

	@IsBoolean()
	secure: boolean;

	@IsBoolean()
	httpOnly: boolean;
}

export class ServerConfig {
	@IsString()
	name: string;

	@IsNumber()
	port = 3333;

	@IsString()
	version = '1';

	@IsString()
	domain: string;

	@IsString({ each: true })
	corsWhitelists: string[];

	@IsString({ each: true })
	@IsOptional()
	corsWhitelistHeaders?: string[];

	@ValidateNested()
	@IsObject()
	@Type(() => CookieConfig)
	cookie: CookieConfig;
}

export class BaseAppConfig {
	@IsEnum(Env)
	env: Env;

	@ValidateNested()
	@IsObject()
	@Type(() => ServerConfig)
	server: ServerConfig;
}
