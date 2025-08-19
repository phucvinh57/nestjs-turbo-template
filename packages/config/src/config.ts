import { IsString } from 'class-validator';

export class AWSConfig {
	@IsString()
	region: string;

	@IsString()
	accessKeyId: string;

	@IsString()
	secretAccessKey: string;
}
