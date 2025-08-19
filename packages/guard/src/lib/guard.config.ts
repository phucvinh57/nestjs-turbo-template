import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Algorithm } from 'jsonwebtoken';

export class JwtConfig {
	@IsEnum(['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'PS256', 'PS384', 'PS512', 'none'])
	algorithm: Algorithm;

	@IsNumber()
	maxAge: number;

	@IsString()
	public: string;

	@IsString()
	secret: string;
}

export class GuardConfig {
	@ValidateNested()
	@IsObject()
	@Type(() => JwtConfig)
	access: JwtConfig;

	@ValidateNested()
	@IsObject()
	@Type(() => JwtConfig)
	refresh: JwtConfig;
}
