import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsObject, IsString, IsUrl, ValidateNested } from 'class-validator';

export class CloudfrontConfig {
	@IsUrl()
	url: string;

	@IsString()
	keyId: string;

	@IsString()
	privateKey: string;
}

export class S3Config {
	@IsString()
	privateBucket: string;

	@IsString()
	publicBucket: string;

	@IsString()
	@Optional()
	eventSqs?: string;

	@ValidateNested()
	@IsObject()
	@Type(() => CloudfrontConfig)
	cloudfront: CloudfrontConfig;
}
