import { AxiosModule } from '@fmv/axios';
import { CacheModule } from '@fmv/cache';
import { ConfigModule } from '@fmv/config';
import { PrismaClient, PrismaFMV } from '@fmv/db';
import { HealthModule } from '@fmv/health';
import { LoggerModule } from '@fmv/logger';
import { OpenApiModule } from '@fmv/openapi';
import { PrismaModule } from '@fmv/prisma';
import { S3Module } from '@fmv/s3';
import { SqsModule } from '@fmv/sqs';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TaskModule } from '@/task/task.module';
import { ApiConfig } from './app.config';
import { AppRoutes } from './app.routes';

@Module({
	imports: [
		NestConfigModule.forRoot({ isGlobal: true }),
		ConfigModule('api', ApiConfig),
		AxiosModule,
		CacheModule,
		HealthModule,
		LoggerModule,
		OpenApiModule,
		S3Module,
		PrismaModule.forRoot([{ provide: PrismaFMV, client: PrismaClient }]),
		SqsModule,
		AppRoutes,
		TaskModule,
	],
})
export class AppModule {}
