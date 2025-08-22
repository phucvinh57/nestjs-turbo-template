import { Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { AWSConfig, ConfigModule } from '@sample/config';
import { SqsRegistry } from './sqs.registry';
import { SqsService } from './sqs.service';

@Module({
	imports: [DiscoveryModule, ConfigModule('aws', AWSConfig)],
	providers: [SqsService, SqsRegistry],
	exports: [SqsService, SqsRegistry],
})
@Global()
export class SqsModule {}
