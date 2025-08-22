import { Global, Module } from '@nestjs/common';
import { AWSConfig, ConfigModule } from '@packages/config';
import { S3Config } from './s3.config';
import { S3Service } from './s3.service';

@Module({
	imports: [ConfigModule('s3', S3Config), ConfigModule('aws', AWSConfig)],
	providers: [S3Service],
	exports: [S3Service],
})
@Global()
export class S3Module {}
