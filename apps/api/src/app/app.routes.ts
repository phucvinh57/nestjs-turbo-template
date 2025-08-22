import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppFilter, AppInterceptor } from '@sample/common';
import { PrismaClientKnownRequestError } from '@sample/db';
import { RoleGuard } from '@sample/guard';
import { PrismaFilter } from '@sample/prisma';
import { ApiV1Module } from '@/api/v1/v1.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
	imports: [
		ThrottlerModule.forRoot([
			{ name: 'second', ttl: 1000, limit: 10 }, // 10 requests per second
			{ name: 'hour', ttl: 1000 * 60 * 60, limit: 1000 }, // 1000 requests per hour
		]),
		ApiV1Module,
		AuthModule,
	],
	providers: [
		{ provide: APP_PIPE, useValue: new ValidationPipe({ transform: true, whitelist: true }) },
		{ provide: APP_GUARD, useValue: ThrottlerGuard },
		{ provide: APP_GUARD, useClass: RoleGuard },
		{ provide: APP_FILTER, useValue: new AppFilter() },
		{ provide: APP_FILTER, useClass: PrismaFilter(PrismaClientKnownRequestError, 'GameDBExceptionFilter') },
		{ provide: APP_INTERCEPTOR, useValue: new AppInterceptor() },
	],
})
export class AppRoutes {}
