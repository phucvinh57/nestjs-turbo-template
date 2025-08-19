import { ConfigModule } from '@fmv/config';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthConfig } from './health.config';
import { HealthController } from './health.controller';

@Global()
@Module({
	imports: [ConfigModule('health', HealthConfig), TerminusModule.forRoot({ gracefulShutdownTimeoutMs: 1000 }), HttpModule],
	controllers: [HealthController],
})
export class HealthModule {}
