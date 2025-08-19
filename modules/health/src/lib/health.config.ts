import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

export class HealthContact {
	@IsString()
	name: string;

	@IsString()
	url: string;
}

export class HealthConfig {
	@IsString()
	ping = 'https://docs.nestjs.com';

	@IsInt()
	memory = 157_286_400;

	@ValidateNested()
	@IsOptional()
	@Type(() => HealthContact)
	contacts: HealthContact[] = [];
}
