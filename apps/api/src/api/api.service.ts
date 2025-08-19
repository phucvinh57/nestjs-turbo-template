import { PaginatedPrismaClient, PrismaFMV } from '@fmv/db';
import { FmvControllerOptions } from '@fmv/guard';
import { PinoLogger } from '@fmv/logger';
import { S3Service } from '@fmv/s3';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export const ApiRoute = Object.freeze({
	PAYMENT: { path: 'payments', tag: 'Payment' },
	AUTH: { path: 'auth', tag: 'Auth', auth: false },
	STATION: { path: 'stations', tag: 'Station' },
	BOOKING: { path: 'bookings', tag: 'Booking' },
	STATION_BOOKING: { path: 'stations/:stationId/bookings', tag: 'Station Booking' },
	STATION_REVIEW: { path: 'stations/:id/reviews', tag: 'Station Review' },
	STATION_EARNING: { path: 'stations/:id/earnings', tag: 'Station Earnings' },
	ASSET: { path: 'assets', tag: 'Asset' },
	PUBLIC: { path: 'public', tag: 'Public', auth: false },
	MAP: { path: 'map', tag: 'Map' },
}) satisfies Record<string, FmvControllerOptions>;

export abstract class ApiService implements OnModuleInit {
	@Inject(ConfigService)
	protected readonly config: ConfigService<unknown, true>;

	@Inject(PinoLogger)
	protected readonly logger: PinoLogger;

	@Inject(PrismaFMV)
	protected readonly db: PaginatedPrismaClient;

	@Inject(S3Service)
	protected readonly s3: S3Service;

	protected stripe: Stripe;

	onModuleInit() {
		const stripeSecretKey = this.config.get<string>('api.stripe.secretKey');
		this.stripe = new Stripe(stripeSecretKey);
		this.logger.setContext(this.constructor.name);
	}
}
