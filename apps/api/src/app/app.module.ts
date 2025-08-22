import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { CacheModule } from '@sample/cache';
import { ConfigModule } from '@sample/config';
import { PrismaClient, PrismaFMV } from '@sample/db';
import { LoggerModule } from '@sample/logger';
import { OpenApiModule } from '@sample/openapi';
import { PrismaModule } from '@sample/prisma';
import { S3Module } from '@sample/s3';
import { SqsModule } from '@sample/sqs';
import { TaskModule } from '@/task/task.module';
import { ApiConfig } from './app.config';
import { AppRoutes } from './app.routes';

@Module({
	imports: [
		NestConfigModule.forRoot({ isGlobal: true }),
		ConfigModule('api', ApiConfig),
		CacheModule,
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
