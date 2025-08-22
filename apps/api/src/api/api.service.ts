import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginatedPrismaClient, PrismaFMV } from '@sample/db';
import { AppControllerOptions } from '@sample/guard';
import { PinoLogger } from '@sample/logger';
import { S3Service } from '@sample/s3';

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
}) satisfies Record<string, AppControllerOptions>;

export abstract class ApiService {
	@Inject(ConfigService)
	protected readonly config: ConfigService<unknown, true>;

	@Inject(PinoLogger)
	protected readonly logger: PinoLogger;

	@Inject(PrismaFMV)
	protected readonly db: PaginatedPrismaClient;

	@Inject(S3Service)
	protected readonly s3: S3Service;
}
