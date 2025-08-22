import { LoggerModule } from '@modules/logger';
import { OpenApiModule } from '@modules/openapi';
import { PrismaModule } from '@modules/prisma';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { CacheModule } from '@packages/cache';
import { ConfigModule } from '@packages/config';
import { PrismaClient, PrismaFMV } from '@packages/db';
import { S3Module } from '@packages/s3';
import { SqsModule } from '@packages/sqs';
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
